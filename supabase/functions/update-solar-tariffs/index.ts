import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Fontes oficiais por estado
const OFFICIAL_SOURCES = {
  'SP': {
    utility: 'CPFL/Elektro/EDP',
    aneel_code: '63',
    region: 'Sudeste'
  },
  'RJ': {
    utility: 'Light/Enel',
    aneel_code: '88', 
    region: 'Sudeste'
  },
  'MG': {
    utility: 'CEMIG',
    aneel_code: '17',
    region: 'Sudeste'
  },
  'RS': {
    utility: 'CEEE/RGE',
    aneel_code: '75',
    region: 'Sul'
  },
  'PR': {
    utility: 'COPEL',
    aneel_code: '26',
    region: 'Sul'
  },
  'SC': {
    utility: 'CELESC',
    aneel_code: '20',
    region: 'Sul'
  },
  'BA': {
    utility: 'Coelba',
    aneel_code: '23',
    region: 'Nordeste'
  },
  'CE': {
    utility: 'Enel Ceará',
    aneel_code: '25',
    region: 'Nordeste'
  },
  'PE': {
    utility: 'Neoenergia',
    aneel_code: '79',
    region: 'Nordeste'
  },
  'GO': {
    utility: 'Enel Goiás',
    aneel_code: '32',
    region: 'Centro-Oeste'
  },
  'DF': {
    utility: 'CEB',
    aneel_code: '21',
    region: 'Centro-Oeste'
  },
  'MT': {
    utility: 'Energisa',
    aneel_code: '30',
    region: 'Centro-Oeste'
  },
  'AM': {
    utility: 'Amazonas Energia',
    aneel_code: '4',
    region: 'Norte'
  },
  'PA': {
    utility: 'Equatorial Pará',
    aneel_code: '39',
    region: 'Norte'
  }
}

// Dados de irradiação solar média por estado (kWh/m²/dia)
const SOLAR_IRRADIATION_DATA = {
  'SP': 4.8, 'RJ': 5.2, 'MG': 5.1, 'RS': 4.2, 'PR': 4.6, 'SC': 4.4,
  'BA': 5.8, 'CE': 5.9, 'PE': 5.7, 'GO': 5.3, 'DF': 5.3, 'MT': 5.5,
  'AM': 4.3, 'PA': 4.8, 'ES': 5.4, 'PB': 5.6, 'RN': 5.8, 'AL': 5.5,
  'SE': 5.7, 'PI': 5.8, 'MA': 5.2, 'TO': 5.4, 'RO': 4.9, 'AC': 4.5,
  'RR': 4.7, 'AP': 4.6, 'MS': 5.2
}

// Custos médios de instalação por kWp por região (R$)
const INSTALLATION_COSTS = {
  'Sudeste': 4500,
  'Sul': 4300,
  'Nordeste': 4200,
  'Centro-Oeste': 4400,
  'Norte': 4800
}

async function fetchAneelTariffs() {
  try {
    console.log('Buscando tarifas da ANEEL...')
    
    // Simulação de dados da ANEEL - em produção, isso faria scraping real
    // URL real seria: https://www.aneel.gov.br/ranking-das-tarifas
    const mockAneelData = {
      'SP': { energy: 0.52147, distribution: 0.28953, icms: 0.18, pis: 0.0165, cofins: 0.0760 },
      'RJ': { energy: 0.58234, distribution: 0.31246, icms: 0.18, pis: 0.0165, cofins: 0.0760 },
      'MG': { energy: 0.49876, distribution: 0.27321, icms: 0.18, pis: 0.0165, cofins: 0.0760 },
      'RS': { energy: 0.46234, distribution: 0.25789, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'PR': { energy: 0.45123, distribution: 0.24567, icms: 0.18, pis: 0.0165, cofins: 0.0760 },
      'SC': { energy: 0.47891, distribution: 0.26345, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'BA': { energy: 0.44567, distribution: 0.23891, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'CE': { energy: 0.43234, distribution: 0.22987, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'PE': { energy: 0.45789, distribution: 0.24123, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'GO': { energy: 0.46789, distribution: 0.25234, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'DF': { energy: 0.48234, distribution: 0.26789, icms: 0.18, pis: 0.0165, cofins: 0.0760 },
      'MT': { energy: 0.45678, distribution: 0.24891, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'AM': { energy: 0.52345, distribution: 0.28675, icms: 0.17, pis: 0.0165, cofins: 0.0760 },
      'PA': { energy: 0.48765, distribution: 0.26234, icms: 0.17, pis: 0.0165, cofins: 0.0760 }
    }

    return mockAneelData
  } catch (error) {
    console.error('Erro ao buscar dados da ANEEL:', error)
    throw error
  }
}

async function logUpdate(success: boolean, updatedCount: number, insertedCount: number, errorMessage?: string, source = 'automated') {
  try {
    await supabase
      .from('tariff_update_logs')
      .insert({
        success,
        updated_count: updatedCount,
        inserted_count: insertedCount,
        error_message: errorMessage,
        source
      });
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}

async function updateTariffData() {
  try {
    const aneelData = await fetchAneelTariffs()
    let updatedCount = 0
    let insertedCount = 0

    for (const [state, stateInfo] of Object.entries(OFFICIAL_SOURCES)) {
      const tariffData = aneelData[state as keyof typeof aneelData]
      if (!tariffData) continue

      const newTariffData = {
        state,
        region: stateInfo.region,
        utility_company: stateInfo.utility,
        energy_tariff: tariffData.energy,
        distribution_tariff: tariffData.distribution,
        icms_rate: tariffData.icms,
        pis_rate: tariffData.pis,
        cofins_rate: tariffData.cofins,
        solar_irradiation: SOLAR_IRRADIATION_DATA[state as keyof typeof SOLAR_IRRADIATION_DATA] || 5.0,
        installation_cost_per_kwp: INSTALLATION_COSTS[stateInfo.region as keyof typeof INSTALLATION_COSTS] || 4500,
        is_active: true
      }

      // Verificar se já existe uma tarifa ativa para este estado
      const { data: existingTariff } = await supabase
        .from('solar_tariffs')
        .select('*')
        .eq('state', state)
        .eq('is_active', true)
        .single()

      if (existingTariff) {
        // Verificar se houve mudanças significativas (mais de 1% de diferença)
        const energyDiff = Math.abs(existingTariff.energy_tariff - newTariffData.energy_tariff) / existingTariff.energy_tariff
        const distributionDiff = Math.abs(existingTariff.distribution_tariff - newTariffData.distribution_tariff) / existingTariff.distribution_tariff
        
        if (energyDiff > 0.01 || distributionDiff > 0.01) {
          // Desativar tarifa antiga
          await supabase
            .from('solar_tariffs')
            .update({ is_active: false })
            .eq('id', existingTariff.id)

          // Inserir nova tarifa
          const { error: insertError } = await supabase
            .from('solar_tariffs')
            .insert(newTariffData)

          if (insertError) {
            console.error(`Erro ao inserir nova tarifa para ${state}:`, insertError)
          } else {
            updatedCount++
            console.log(`Tarifa atualizada para ${state} - Mudança significativa detectada`)
          }
        } else {
          console.log(`Nenhuma mudança significativa detectada para ${state}`)
        }
      } else {
        // Inserir nova tarifa se não existir
        const { error: insertError } = await supabase
          .from('solar_tariffs')
          .insert(newTariffData)

        if (insertError) {
          console.error(`Erro ao inserir tarifa para ${state}:`, insertError)
        } else {
          insertedCount++
          console.log(`Nova tarifa inserida para ${state}`)
        }
      }
    }

    return { updatedCount, insertedCount }
  } catch (error) {
    console.error('Erro ao atualizar dados de tarifas:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Iniciando atualização diária de tarifas solares...')
    
    const { body } = await req.json().catch(() => ({}));
    const source = body?.manual ? 'manual' : 'automated';
    
    const result = await updateTariffData()
    
    // Log da atualização bem-sucedida
    await logUpdate(true, result.updatedCount, result.insertedCount, undefined, source);
    
    const response = {
      success: true,
      message: `Atualização concluída: ${result.updatedCount} tarifas atualizadas, ${result.insertedCount} novas tarifas inseridas`,
      timestamp: new Date().toISOString(),
      ...result
    }

    console.log('Atualização concluída:', response)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Erro na atualização de tarifas:', error)
    
    // Log do erro
    await logUpdate(false, 0, 0, error.message, 'automated');
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})