-- Atualizar todas as tarifas existentes como inativas para permitir nova atualização
UPDATE solar_tariffs SET is_active = false WHERE is_active = true;