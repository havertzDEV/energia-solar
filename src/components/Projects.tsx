import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink,
  MapPin,
  Zap,
  Calendar,
  TrendingUp
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Residência Familiar - Alto Padrão",
    location: "São Paulo, SP",
    power: "15 kWp",
    savings: "R$ 18.000/ano",
    date: "2024",
    image: "/placeholder.svg",
    category: "Residencial",
    description: "Sistema completo com 45 painéis solares de alta eficiência"
  },
  {
    id: 2,
    title: "Empresa de Tecnologia",
    location: "Campinas, SP",
    power: "85 kWp",
    savings: "R$ 95.000/ano",
    date: "2024",
    image: "/placeholder.svg",
    category: "Comercial",
    description: "Instalação industrial com sistema de monitoramento avançado"
  },
  {
    id: 3,
    title: "Indústria Alimentícia",
    location: "Ribeirão Preto, SP",
    power: "200 kWp",
    savings: "R$ 240.000/ano",
    date: "2023",
    image: "/placeholder.svg",
    category: "Industrial",
    description: "Projeto de grande porte com 600 painéis fotovoltaicos"
  },
  {
    id: 4,
    title: "Condomínio Residencial",
    location: "Santos, SP",
    power: "45 kWp",
    savings: "R$ 54.000/ano",
    date: "2023",
    image: "/placeholder.svg",
    category: "Residencial",
    description: "Sistema compartilhado para 20 unidades residenciais"
  },
  {
    id: 5,
    title: "Shopping Center",
    location: "Sorocaba, SP",
    power: "350 kWp",
    savings: "R$ 420.000/ano",
    date: "2024",
    image: "/placeholder.svg",
    category: "Comercial",
    description: "Cobertura completa do estacionamento com painéis solares"
  },
  {
    id: 6,
    title: "Hospital Regional",
    location: "Bauru, SP",
    power: "120 kWp",
    savings: "R$ 144.000/ano",
    date: "2023",
    image: "/placeholder.svg",
    category: "Institucional",
    description: "Sistema crítico com backup e monitoramento 24h"
  }
];

const categories = ["Todos", "Residencial", "Comercial", "Industrial", "Institucional"];

export const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const filteredProjects = selectedCategory === "Todos" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Residencial": "bg-primary/10 text-primary",
      "Comercial": "bg-secondary/10 text-secondary",
      "Industrial": "bg-accent/10 text-accent",
      "Institucional": "bg-muted-foreground/10 text-muted-foreground"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos Projetos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Conheça alguns dos projetos que transformaram a vida dos nossos clientes, 
            gerando economia e sustentabilidade.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="border-0 shadow-elegant hover:shadow-solar transition-all duration-300 group overflow-hidden"
            >
              <div className="relative">
                <div className="h-48 bg-gradient-solar rounded-t-lg" />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(project.category)}>
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {project.date}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">{project.power}</span>
                    <span className="text-muted-foreground">instalados</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="font-medium text-accent">{project.savings}</span>
                    <span className="text-muted-foreground">economia anual</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full group">
                  Ver Detalhes
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Impacto dos Nossos Projetos
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">815 kWp</div>
              <div className="text-muted-foreground">Potência Total Instalada</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">R$ 971k</div>
              <div className="text-muted-foreground">Economia Anual Gerada</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">650t</div>
              <div className="text-muted-foreground">CO₂ Evitado/Ano</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};