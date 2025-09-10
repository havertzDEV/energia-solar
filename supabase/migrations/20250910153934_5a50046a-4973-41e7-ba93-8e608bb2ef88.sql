-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar cron job para atualizar tarifas solares diariamente às 6:00 AM
SELECT cron.schedule(
  'update-solar-tariffs-daily',
  '0 6 * * *', -- Todo dia às 6:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://xbzxoaaexgyzunhkboqc.supabase.co/functions/v1/update-solar-tariffs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhienhvYWFleGd5enVuaGtib3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzQ0NDUsImV4cCI6MjA3Mjg1MDQ0NX0.pc_4yEAo-9TeG4dCO8zsMNbSqUBGWnd5QhJQB04NfzM"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);

-- Criar tabela de logs para auditoria das atualizações
CREATE TABLE IF NOT EXISTS public.tariff_update_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_count INTEGER NOT NULL DEFAULT 0,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  source TEXT DEFAULT 'automated'
);

-- Enable RLS na tabela de logs
ALTER TABLE public.tariff_update_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção automática
CREATE POLICY "Allow automated inserts on tariff_update_logs" 
ON public.tariff_update_logs 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir visualização por admins
CREATE POLICY "Admins can view tariff update logs" 
ON public.tariff_update_logs 
FOR SELECT 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Trigger para limpeza automática de logs antigos (manter apenas 90 dias)
CREATE OR REPLACE FUNCTION public.cleanup_old_tariff_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.tariff_update_logs 
  WHERE update_timestamp < (now() - interval '90 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agendar limpeza mensal dos logs
SELECT cron.schedule(
  'cleanup-tariff-logs-monthly',
  '0 2 1 * *', -- Todo dia 1 do mês às 2:00 AM
  'SELECT public.cleanup_old_tariff_logs();'
);