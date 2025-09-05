import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Proprietária Residencial",
    company: "Casa própria - Alphaville",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Excelente atendimento desde o primeiro contato! A equipe foi muito profissional e o sistema está funcionando perfeitamente. Minha conta de luz reduziu 90%. Recomendo para todos!",
    savings: "90% de economia",
    system: "12 kWp - Residencial"
  },
  {
    id: 2,
    name: "João Carlos",
    role: "Diretor Comercial",
    company: "Tech Solutions Ltda",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "O retorno do investimento foi muito rápido. Em apenas 4 anos já recuperamos todo o valor investido e agora temos energia praticamente gratuita. A produtividade da empresa aumentou!",
    savings: "R$ 8.500/mês",
    system: "45 kWp - Comercial"
  },
  {
    id: 3,
    name: "Ana Beatriz",
    role: "Gerente Industrial",
    company: "Indústria Alimentar SA",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Projeto impecável! A SolarTech cuidou de tudo, desde o licenciamento até a instalação. O monitoramento em tempo real nos permite otimizar ainda mais o consumo. Parceria de confiança!",
    savings: "R$ 25.000/mês",
    system: "120 kWp - Industrial"
  },
  {
    id: 4,
    name: "Roberto Lima",
    role: "Síndico",
    company: "Condomínio Jardim das Flores",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "O condomínio economiza muito na conta de luz das áreas comuns. Os moradores adoraram a iniciativa sustentável e o valor do condomínio diminuiu significativamente.",
    savings: "65% de economia",
    system: "30 kWp - Condomínio"
  },
  {
    id: 5,
    name: "Carla Mendes",
    role: "Empresária",
    company: "Clínica Mendes",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Além da economia na conta de luz, ganhamos muito em sustentabilidade. Nossos pacientes elogiam nossa preocupação com o meio ambiente. Foi um excelente investimento!",
    savings: "R$ 4.200/mês",
    system: "25 kWp - Comercial"
  },
  {
    id: 6,
    name: "Fernando Costa",
    role: "Proprietário Rural",
    company: "Fazenda Santa Clara",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "A energia solar revolutionou nossa propriedade rural. Conseguimos alimentar todos os equipamentos da ordenha e irrigação. A economia anual é fantástica!",
    savings: "85% de economia",
    system: "80 kWp - Rural"
  }
];

export const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            O Que Nossos
            <span className="block text-primary">Clientes Dizem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais de 500 clientes satisfeitos comprovam a qualidade dos nossos serviços 
            e o impacto positivo da energia solar em suas vidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="border-0 shadow-elegant hover:shadow-solar transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>
              
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Stats */}
                <div className="flex gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {testimonial.savings}
                  </Badge>
                  <Badge variant="outline">
                    {testimonial.system}
                  </Badge>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-solar text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Confiança e Credibilidade
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">5.0</div>
              <div className="flex gap-1 mb-2">
                {renderStars(5)}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Projetos Concluídos</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Taxa de Satisfação</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">5 Anos</div>
              <div className="text-sm text-muted-foreground">No Mercado</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};