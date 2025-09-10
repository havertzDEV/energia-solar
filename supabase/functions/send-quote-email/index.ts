import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: QuoteEmailRequest = await req.json();

    console.log("Sending quote email for:", { name, email, phone, service });

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
            </div>
            
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