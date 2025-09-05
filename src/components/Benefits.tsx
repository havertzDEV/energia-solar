import { 
  DollarSign, 
  Leaf, 
  Zap, 
  TrendingUp,
  Shield,
  Award,
  CheckCircle
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Economia Garantida",
    description: "Reduza em até 95% sua conta de energia elétrica",
    stats: "85% economia média"
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Contribua para um planeta mais limpo e sustentável",
    stats: "Zero emissões de CO₂"
  },
  {
    icon: Zap,
    title: "Energia Confiável",
    description: "Sistema com alta durabilidade e eficiência",
    stats: "25 anos de garantia"
  },
  {
    icon: TrendingUp,
    title: "Valorização do Imóvel",
    description: "Aumente o valor de mercado da sua propriedade",
    stats: "Até 20% de valorização"
  },
  {
    icon: Shield,
    title: "Proteção contra Inflação",
    description: "Proteja-se dos aumentos constantes da energia elétrica",
    stats: "Investimento seguro"
  },
  {
    icon: Award,
    title: "Tecnologia Premium",
    description: "Equipamentos de última geração com máxima eficiência",
    stats: "Eficiência > 20%"
  }
];

const certifications = [
  "ANEEL Homologado",
  "INMETRO Certificado", 
  "ISO 9001",
  "Garantia Fabricante"
];

export const Benefits = () => {
  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Por que Escolher
              <span className="block text-primary">Energia Solar?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12">
              A energia solar é mais que uma economia na conta de luz. É um investimento 
              inteligente no seu futuro e no planeta.
            </p>

            <div className="grid gap-6 mb-12">
              {benefits.slice(0, 3).map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {benefit.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      {benefit.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Certificações e Garantias
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Benefits Grid */}
          <div className="slide-in-left">
            <div className="grid grid-cols-2 gap-6">
              {benefits.slice(3).map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-elegant transition-shadow"
                >
                  <div className="inline-flex p-4 bg-gradient-solar rounded-2xl mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {benefit.description}
                  </p>
                  
                  <div className="text-lg font-bold text-primary">
                    {benefit.stats}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Stats */}
            <div className="mt-8 bg-gradient-hero rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Resultados Comprovados
              </h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">15MW</div>
                  <div className="text-sm text-muted-foreground">Potência Instalada</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};