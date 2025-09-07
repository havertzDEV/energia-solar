import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, ArrowRight, Zap, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";

export const Hero = () => {
  const [monthlyBill, setMonthlyBill] = useState("");
  const [consumption, setConsumption] = useState("");
  const [savings, setSavings] = useState<{
    monthly: number;
    yearly: number;
    systemSize: number;
    investment: number;
    payback: number;
  } | null>(null);

  const calculateSavings = () => {
    const bill = parseFloat(monthlyBill);
    const kwh = parseFloat(consumption);
    
    if (bill > 0 || kwh > 0) {
      // Tarifas específicas do Maranhão (Equatorial) - 2024/2025
      const tarifaEnergia = 0.52840; // R$/kWh - TE (Tarifa de Energia)
      const tarifaDistribuicao = 0.31450; // R$/kWh - TUSD (Tarifa de Uso do Sistema de Distribuição)
      const tarifaTotal = tarifaEnergia + tarifaDistribuicao; // R$ 0,8429/kWh
      
      // Impostos: ICMS (27% no MA), PIS (1,65%), COFINS (7,6%)
      const impostos = 1 + 0.27 + 0.0165 + 0.076; // 36,35% total
      const tarifaComImpostos = tarifaTotal * impostos; // ~R$ 1,15/kWh
      
      let monthlyConsumption: number;
      
      if (kwh > 0) {
        monthlyConsumption = kwh;
      } else {
        // Estimar consumo baseado na conta
        monthlyConsumption = bill / tarifaComImpostos;
      }
      
      // Economia com energia solar (95% da conta - taxa mínima permanece)
      const monthlyEconomy = bill * 0.95;
      const yearlyEconomy = monthlyEconomy * 12;
      
      // Dimensionamento do sistema (considerando irradiação do Maranhão: 5,5 kWh/m²/dia)
      const dailyGeneration = monthlyConsumption / 30;
      const systemSize = dailyGeneration / 5.5; // kWp necessário
      
      // Investimento estimado (R$ 4.500 por kWp instalado no Maranhão)
      const investmentCost = systemSize * 4500;
      
      // Payback (tempo de retorno do investimento)
      const paybackYears = investmentCost / yearlyEconomy;
      
      setSavings({
        monthly: monthlyEconomy,
        yearly: yearlyEconomy,
        systemSize: Math.round(systemSize * 100) / 100,
        investment: investmentCost,
        payback: Math.round(paybackYears * 10) / 10
      });
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ou informe seu consumo mensal (kWh) - Opcional
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 300 kWh"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Encontre este valor na sua conta de luz da Equatorial
                </p>
              </div>

              <Button 
                onClick={calculateSavings}
                className="w-full bg-gradient-solar text-white font-semibold"
                size="lg"
              >
                <Zap className="mr-2 h-5 w-5" />
                Calcular Economia - Maranhão
              </Button>

              {savings && (
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-6 w-6 text-accent" />
                      <h3 className="text-lg font-semibold text-accent">
                        Seu Orçamento Personalizado
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Economia Mensal</p>
                        <p className="text-xl font-bold text-accent">
                          R$ {savings.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Economia Anual</p>
                        <p className="text-xl font-bold text-accent">
                          R$ {savings.yearly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sistema recomendado:</span>
                        <span className="font-semibold">{savings.systemSize} kWp</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Investimento estimado:</span>
                        <span className="font-semibold">R$ {savings.investment.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Retorno do investimento:</span>
                        <span className="font-semibold text-green-600">{savings.payback} anos</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      * Cálculo baseado nas tarifas da Equatorial Maranhão (2024/2025) 
                      e irradiação solar média do estado.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};