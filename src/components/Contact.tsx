import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Calculator,
  Loader2
} from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    state: "",
    monthlyBill: 0,
    consumption: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          ...formData,
          state: formData.state || undefined,
          monthlyBill: formData.monthlyBill > 0 ? formData.monthlyBill : undefined,
          consumption: formData.consumption > 0 ? formData.consumption : undefined
        }
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada com sucesso! ✅",
        description: "Entraremos em contato em até 2 horas úteis. Verifique também seu email!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        state: "",
        monthlyBill: 0,
        consumption: 0
      });
    } catch (error) {
      console.error('Error sending quote:', error);
      toast({
        title: "Erro ao enviar solicitação ❌",
        description: "Tente novamente ou entre em contato via WhatsApp: (98) 99161-6381",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em Contato
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pronto para começar sua jornada rumo à independência energética? 
            Fale conosco e receba um orçamento personalizado gratuito.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MessageSquare className="h-5 w-5" />
                  Fale Conosco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">(98) 99161-6381</div>
                    <div className="text-sm text-muted-foreground">WhatsApp</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">isollarenergyengenharia@gmail.com</div>
                    <div className="text-sm text-muted-foreground">Email comercial</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">Rua Principal, 12</div>
                    <div className="text-sm text-muted-foreground">
                      São Luís - MA<br />
                      CEP: 65095-000
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Seg - Sex: 8h às 18h</div>
                    <div className="text-sm text-muted-foreground">Sáb: 8h às 14h</div>
                  </div>
                </div>
              </CardContent>
            </Card>

           {/*} <Card className="border-0 shadow-elegant bg-gradient-hero">
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Orçamento Gratuito
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receba uma proposta personalizada em até 24 horas
                </p>
                <Button variant="solar" className="w-full">
                  Solicitar Orçamento
                </Button>
              </CardContent>
            </Card> */}
          </div> 

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Solicite Seu Orçamento
                </CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo e nossa equipe entrará em contato
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Telefone/WhatsApp *
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(98) 99999-9999"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Estado
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Selecione seu estado</option>
                        <option value="AC">Acre (AC)</option>
                        <option value="AL">Alagoas (AL)</option>
                        <option value="AP">Amapá (AP)</option>
                        <option value="AM">Amazonas (AM)</option>
                        <option value="BA">Bahia (BA)</option>
                        <option value="CE">Ceará (CE)</option>
                        <option value="DF">Distrito Federal (DF)</option>
                        <option value="ES">Espírito Santo (ES)</option>
                        <option value="GO">Goiás (GO)</option>
                        <option value="MA">Maranhão (MA)</option>
                        <option value="MT">Mato Grosso (MT)</option>
                        <option value="MS">Mato Grosso do Sul (MS)</option>
                        <option value="MG">Minas Gerais (MG)</option>
                        <option value="PA">Pará (PA)</option>
                        <option value="PB">Paraíba (PB)</option>
                        <option value="PR">Paraná (PR)</option>
                        <option value="PE">Pernambuco (PE)</option>
                        <option value="PI">Piauí (PI)</option>
                        <option value="RJ">Rio de Janeiro (RJ)</option>
                        <option value="RN">Rio Grande do Norte (RN)</option>
                        <option value="RS">Rio Grande do Sul (RS)</option>
                        <option value="RO">Rondônia (RO)</option>
                        <option value="RR">Roraima (RR)</option>
                        <option value="SC">Santa Catarina (SC)</option>
                        <option value="SP">São Paulo (SP)</option>
                        <option value="SE">Sergipe (SE)</option>
                        <option value="TO">Tocantins (TO)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Consumo Mensal (kWh)
                      </label>
                      <Input
                        name="consumption"
                        type="number"
                        value={formData.consumption || ""}
                        onChange={handleInputChange}
                        placeholder="Ex: 450"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Valor da Conta (R$)
                      </label>
                      <Input
                        name="monthlyBill"
                        type="number"
                        step="0.01"
                        value={formData.monthlyBill || ""}
                        onChange={handleInputChange}
                        placeholder="Ex: 350.00"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de Serviço
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Selecione o serviço</option>
                        <option value="residencial">Sistema Residencial</option>
                        <option value="comercial">Sistema Comercial</option>
                        <option value="industrial">Sistema Industrial</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="consulta">Consultoria</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Conte-nos mais sobre seu projeto, consumo atual de energia, características do imóvel, etc."
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      variant="solar" 
                      size="lg" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar Solicitação
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg"
                      onClick={() => window.open('https://wa.me/5598991616381', '_blank')}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Ao enviar este formulário, você concorda com nossa política de privacidade.
                    Seus dados são seguros e não serão compartilhados com terceiros.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};