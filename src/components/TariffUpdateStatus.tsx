import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TariffUpdateStatus = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        // Buscar a última atualização na tabela solar_tariffs
        const { data, error } = await supabase
          .from('solar_tariffs')
          .select('updated_at')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao buscar última atualização:', error);
        } else if (data) {
          setLastUpdate(new Date(data.updated_at));
        }
      } catch (error) {
        console.error('Erro ao buscar última atualização:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastUpdate();
  }, []);

  if (loading) {
    return null;
  }

  const now = new Date();
  const isRecent = lastUpdate && (now.getTime() - lastUpdate.getTime()) < 24 * 60 * 60 * 1000; // 24 horas
  const isStale = lastUpdate && (now.getTime() - lastUpdate.getTime()) > 48 * 60 * 60 * 1000; // 48 horas

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isStale ? (
        <AlertCircle className="h-4 w-4 text-yellow-500" />
      ) : isRecent ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      
      <span>
        Tarifas atualizadas:{' '}
        {lastUpdate ? (
          <>
            {lastUpdate.toLocaleDateString('pt-BR')} às {lastUpdate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </>
        ) : (
          'Dados não disponíveis'
        )}
      </span>

      <Badge variant={isStale ? "destructive" : isRecent ? "default" : "secondary"} className="text-xs">
        {isStale ? "Desatualizado" : isRecent ? "Atualizado" : "OK"}
      </Badge>
    </div>
  );
};