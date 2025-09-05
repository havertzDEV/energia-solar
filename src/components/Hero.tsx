import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, ArrowRight, Zap, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";

export const Hero = () => {
  const [monthlyBill, setMonthlyBill] = useState("");
  const [savings, setSavings] = useState<number | null>(null);

  const calculateSavings = () => {
    const bill = parseFloat(monthlyBill);
    if (bill > 0) {
      const yearlyBill = bill * 12;
      const yearlySavings = yearlyBill * 0.85; // 85% de economia
      setSavings(yearlySavings);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Energia Solar
              <span className="block bg-gradient-solar bg-clip-text text-transparent">
                Para Sua Casa
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Economize até <strong>85% na sua conta de luz</strong> com sistemas 
              de energia solar de alta qualidade. Invista no futuro sustentável da sua família.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="default" size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="secondary" size="lg">
                Calcular Economia
                <Calculator className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-white/80">Projetos Instalados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-white/80">Economia Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-white/80">Anos Garantia</div>
              </div>
            </div>
          </div>

          {/* Right Column - Calculator */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-elegant slide-in-left">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Calcule Sua Economia
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor da sua conta de luz mensal (R$)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 350"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Button 
                onClick={calculateSavings}
                className="w-full bg-gradient-solar text-white font-semibold"
                size="lg"
              >
                <Zap className="mr-2 h-5 w-5" />
                Calcular Economia
              </Button>

              {savings && (
                <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-6 w-6 text-accent" />
                    <h3 className="text-lg font-semibold text-accent">
                      Sua Economia Anual
                    </h3>
                  </div>
                  
                  <div className="text-3xl font-bold text-accent mb-2">
                    R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Com energia solar, você pode economizar esse valor todos os anos!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};