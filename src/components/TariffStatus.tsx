import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TariffUpdateLog {
  id: string;
  update_timestamp: string;
  updated_count: number;
  inserted_count: number;
  success: boolean;
  error_message?: string;
  source: string;
}

export const TariffStatus = () => {
  const [lastUpdate, setLastUpdate] = useState<TariffUpdateLog | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLastUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('tariff_update_logs')
        .select('*')
        .order('update_timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar logs de atualização:', error);
        return;
      }

      setLastUpdate(data);
    } catch (error) {
      console.error('Erro ao buscar última atualização:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualUpdate = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-solar-tariffs', {
        body: { manual: true }
      });

      if (error) {
        toast.error('Erro ao atualizar tarifas: ' + error.message);
        return;
      }

      if (data.success) {
        toast.success(`Tarifas atualizadas: ${data.updatedCount} atualizadas, ${data.insertedCount} novas`);
        fetchLastUpdate(); // Atualizar o status
      } else {
        toast.error('Erro na atualização: ' + data.error);
      }
    } catch (error) {
      toast.error('Erro ao comunicar com o servidor');
      console.error('Erro na atualização manual:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchLastUpdate();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = () => {
    if (!lastUpdate) {
      return {
        icon: AlertCircle,
        color: 'destructive' as const,
        text: 'Nenhuma atualização encontrada',
        description: 'Sistema ainda não executou atualizações automáticas'
      };
    }

    const updateTime = new Date(lastUpdate.update_timestamp);
    const now = new Date();
    const hoursDiff = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60 * 60));

    if (lastUpdate.success) {
      if (hoursDiff < 24) {
        return {
          icon: CheckCircle,
          color: 'default' as const,
          text: 'Tarifas atualizadas',
          description: `Última atualização: ${hoursDiff}h atrás`
        };
      } else {
        return {
          icon: Clock,
          color: 'secondary' as const,
          text: 'Atualização antiga',
          description: `Última atualização: ${Math.floor(hoursDiff / 24)} dias atrás`
        };
      }
    } else {
      return {
        icon: AlertCircle,
        color: 'destructive' as const,
        text: 'Erro na última atualização',
        description: lastUpdate.error_message || 'Erro desconhecido'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StatusIcon className="h-5 w-5" />
          Status das Tarifas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={statusInfo.color} className="flex items-center gap-1">
            {statusInfo.text}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={triggerManualUpdate}
            disabled={isUpdating}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {statusInfo.description}
        </div>

        {lastUpdate && lastUpdate.success && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <div>Tarifas atualizadas: {lastUpdate.updated_count}</div>
            <div>Novas tarifas: {lastUpdate.inserted_count}</div>
            <div>Fonte: {lastUpdate.source === 'automated' ? 'Automática' : 'Manual'}</div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">Atualização automática:</div>
          <div>Todos os dias às 6:00 AM</div>
          <div>Fontes: ANEEL e órgãos oficiais</div>
        </div>
      </CardContent>
    </Card>
  );
};