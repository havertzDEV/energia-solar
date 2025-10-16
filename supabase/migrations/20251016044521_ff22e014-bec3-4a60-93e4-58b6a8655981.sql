-- Remove duplicate entries with NULL utility_id
-- Keep only the records with valid utility_id values
DELETE FROM public.solar_tariffs
WHERE utility_id IS NULL
AND is_active = true;