-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remover cron job existente se houver
SELECT cron.unschedule('update-solar-tariffs-daily');

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