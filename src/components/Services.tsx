import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building2, 
  Factory, 
  Settings, 
  Wrench, 
  Shield,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residencial",
    description: "Sistemas de energia solar para casas e apartamentos, com projetos personalizados para cada necessidade.",
    features: ["Instalação profissional", "Monitoramento 24h", "Garantia de 25 anos"]
  },
  {
    icon: Building2,
    title: "Comercial",
    description: "Soluções para empresas e comércios, reduzindo significativamente os custos operacionais.",
    features: ["ROI garantido", "Suporte técnico", "Financiamento facilitado"]
  },
  {
    icon: Factory,
    title: "Industrial",
    description: "Sistemas de grande porte para indústrias, com alta eficiência energética.",
    features: ["Projetos sob medida", "Instalação rápida", "Manutenção inclusa"]
  },
  {
    icon: Settings,
    title: "Projeto & Instalação",
    description: "Desenvolvimento completo do projeto e instalação por equipe técnica especializada.",
    features: ["Equipe certificada", "Equipamentos premium", "Pós-venda garantido"]
  },
  {
    icon: Wrench,
    title: "Manutenção",
    description: "Serviços de manutenção preventiva e corretiva para máxima eficiência do sistema.",
    features: ["Limpeza dos painéis", "Inspeções regulares", "Suporte remoto"]
  },
  {
    icon: Shield,
    title: "Monitoramento",
    description: "Sistema de monitoramento inteligente para acompanhar a performance em tempo real.",
    features: ["App móvel", "Relatórios detalhados", "Alertas automáticos"]
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos soluções completas em energia solar, desde o projeto até a manutenção, 
            garantindo a melhor experiência para nossos clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-elegant hover:shadow-solar transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-solar rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {service.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full group">
                  Saiba Mais
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="solar" size="lg">
            Ver Todos os Serviços
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};