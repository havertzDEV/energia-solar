-- Fix the old Maranhão record that has incorrect region
UPDATE solar_tariffs 
SET region = 'Nordeste' 
WHERE state = 'MA' AND region = 'Maranhão';