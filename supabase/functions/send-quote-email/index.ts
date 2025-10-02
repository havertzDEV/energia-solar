import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  state?: string;
  monthlyBill?: number;
  consumption?: number;
}

// Função para verificar e atualizar tarifas automaticamente
async function ensureTariffsAreUpdated(): Promise<boolean> {
  try {
    console.log("🔍 Verificando status das tarifas...");
    
    // Verificar última atualização
    const { data: lastLog } = await supabase
      .from('tariff_update_logs')
      .select('update_timestamp, success, updated_count, inserted_count')
      .order('update_timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date().getTime();
    const lastUpdate = lastLog ? new Date(lastLog.update_timestamp).getTime() : 0;
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

    // Verificar se todas as tarifas dos 27 estados estão ativas
    const { data: activeTariffs, count } = await supabase
      .from('solar_tariffs')
      .select('state', { count: 'exact' })
      .eq('is_active', true);

    const hasAllStates = count === 27;
    const needsUpdate = !lastLog || 
                       !lastLog.success || 
                       daysSinceUpdate > 30 ||
                       !hasAllStates;

    if (needsUpdate) {
      console.log(`⚠️ Atualização necessária - Dias desde última: ${daysSinceUpdate.toFixed(1)}, Estados ativos: ${count}/27`);
      console.log("🔄 Iniciando atualização automática de tarifas...");
      
      const { data, error } = await supabase.functions.invoke('update-solar-tariffs', {
        body: { trigger: 'quote-request', auto: true }
      });
      
      if (error) {
        console.error("❌ Erro ao atualizar tarifas:", error);
        return false;
      }
      
      console.log("✅ Tarifas atualizadas com sucesso:", data);
      return true;
    } else {
      console.log(`✅ Tarifas já atualizadas - Última atualização: ${daysSinceUpdate.toFixed(1)} dias atrás`);
      return true;
    }
  } catch (error) {
    console.error("❌ Erro ao verificar/atualizar tarifas:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message, state, monthlyBill, consumption }: QuoteEmailRequest = await req.json();

    console.log("📧 Processando solicitação de orçamento:", { name, email, phone, service, state });

    // SEMPRE verificar e atualizar tarifas antes de processar orçamento
    const tariffsUpdated = await ensureTariffsAreUpdated();
    
    if (!tariffsUpdated) {
      console.warn("⚠️ Tarifas podem estar desatualizadas, mas continuando com o orçamento...");
    }

    // Buscar informações da tarifa do estado se fornecido
    let tariffInfo = "";
    if (state) {
      const { data: tariff } = await supabase
        .from('solar_tariffs')
        .select('*')
        .eq('state', state)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (tariff) {
        const totalTaxRate = 1 + tariff.icms_rate + tariff.pis_rate + tariff.cofins_rate;
        const totalTariff = (tariff.energy_tariff + tariff.distribution_tariff) * totalTaxRate;
        
        tariffInfo = `
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">💡 Informações da Tarifa - ${state}</h3>
            <p style="margin: 5px 0; color: #0f172a;"><strong>Distribuidora:</strong> ${tariff.utility_company}</p>
            <p style="margin: 5px 0; color: #0f172a;"><strong>Tarifa de Energia:</strong> R$ ${tariff.energy_tariff.toFixed(4)}/kWh</p>
            <p style="margin: 5px 0; color: #0f172a;"><strong>Tarifa de Distribuição:</strong> R$ ${tariff.distribution_tariff.toFixed(4)}/kWh</p>
            <p style="margin: 5px 0; color: #0f172a;"><strong>ICMS:</strong> ${(tariff.icms_rate * 100).toFixed(2)}%</p>
            <p style="margin: 5px 0; color: #0f172a;"><strong>PIS:</strong> ${(tariff.pis_rate * 100).toFixed(2)}%</p>
            <p style="margin: 5px 0; color: #0f172a;"><strong>COFINS:</strong> ${(tariff.cofins_rate * 100).toFixed(2)}%</p>
            <p style="margin: 10px 0 0 0; color: #0f172a; font-weight: bold; font-size: 16px;">
              <strong>Tarifa Total:</strong> R$ ${totalTariff.toFixed(4)}/kWh
            </p>
            <p style="margin: 5px 0; color: #64748b; font-size: 12px;">
              ⚡ Irradiação Solar: ${tariff.solar_irradiation} kWh/m²/dia | 
              💰 Custo de Instalação: R$ ${tariff.installation_cost_per_kwp.toLocaleString('pt-BR')}/kWp
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 11px; font-style: italic;">
              📅 Dados atualizados em: ${new Date(tariff.updated_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        `;
      }
    }

    // Email para a empresa
    const companyEmailResponse = await resend.emails.send({
      from: "Isollar Energy <noreply@resend.dev>",
      to: ["isollarenergyengenharia@gmail.com"],
      subject: `Nova Solicitação de Orçamento - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Nova Solicitação de Orçamento</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Informações do Cliente:</h2>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong>Nome:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Telefone:</strong> ${phone}</p>
              <p style="margin: 10px 0;"><strong>Tipo de Serviço:</strong> ${service || 'Não especificado'}</p>
              ${state ? `<p style="margin: 10px 0;"><strong>Estado:</strong> ${state}</p>` : ''}
              ${monthlyBill ? `<p style="margin: 10px 0;"><strong>Conta Mensal:</strong> R$ ${monthlyBill.toFixed(2)}</p>` : ''}
              ${consumption ? `<p style="margin: 10px 0;"><strong>Consumo:</strong> ${consumption} kWh/mês</p>` : ''}
            </div>
            
            ${tariffInfo}
            
            ${message ? `
              <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Mensagem do Cliente:</h3>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; line-height: 1.6;">${message}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">
                📞 Entre em contato o mais rápido possível para garantir a melhor experiência do cliente!
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Email de confirmação para o cliente
    const clientEmailResponse = await resend.emails.send({
      from: "Isollar Energy <noreply@resend.dev>",
      to: [email],
      subject: "Recebemos sua solicitação de orçamento! - Isollar Energy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Isollar Energy Engenharia</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Energia Solar Inteligente</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Olá, ${name}!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Recebemos sua solicitação de orçamento e ficamos muito felizes com seu interesse em energia solar!
            </p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">📋 Resumo da sua solicitação:</h3>
              <p style="margin: 5px 0; color: #0f172a;"><strong>Serviço:</strong> ${service || 'Não especificado'}</p>
              <p style="margin: 5px 0; color: #0f172a;"><strong>Telefone:</strong> ${phone}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">⏰ Próximos Passos:</h3>
              <ul style="color: #92400e; margin: 5px 0; padding-left: 20px;">
                <li>Nossa equipe técnica irá analisar sua solicitação</li>
                <li>Entraremos em contato em até <strong>2 horas úteis</strong></li>
                <li>Agendaremos uma visita técnica gratuita</li>
                <li>Você receberá um orçamento personalizado em até 24h</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #065f46; margin: 0 0 10px 0;">💡 Benefícios da Energia Solar:</h3>
              <ul style="color: #065f46; margin: 5px 0; padding-left: 20px;">
                <li>Economia de até 95% na conta de luz</li>
                <li>Sistema com garantia de 25 anos</li>
                <li>Valorização do seu imóvel</li>
                <li>Contribuição com o meio ambiente</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin-bottom: 15px;">Tem alguma dúvida? Entre em contato conosco:</p>
              <p style="color: #1f2937; font-weight: bold; margin: 5px 0;">📱 WhatsApp: (98) 99161-6381</p>
              <p style="color: #1f2937; font-weight: bold; margin: 5px 0;">📧 Email: isollarenergyengenharia@gmail.com</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                Isollar Energy Engenharia - Especialistas em Energia Solar<br>
                São Luís - MA | (98) 99161-6381
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);
    console.log("Client email sent:", clientEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      companyEmailId: companyEmailResponse.data?.id,
      clientEmailId: clientEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);