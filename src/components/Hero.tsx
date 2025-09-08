import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, ArrowRight, Zap, TrendingUp, Wifi, WifiOff } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";
import { useSolarTariffs } from "@/hooks/useSolarTariffs";
import { calculateSolarSavings, SolarSavings } from "@/utils/solarCalculations";

export const Hero = () => {
  const [monthlyBill, setMonthlyBill] = useState("");
  const [consumption, setConsumption] = useState("");
  const [savings, setSavings] = useState<SolarSavings | null>(null);
  
  // Real-time tariffs from Supabase
  const { currentTariff, loading: tariffsLoading, error: tariffsError } = useSolarTariffs("Maranhão", "MA");

  // Real-time status indicator
  const isConnected = !tariffsLoading && !tariffsError && currentTariff;

  // Calculate savings automatically when inputs or tariffs change
  useEffect(() => {
    if (currentTariff && (monthlyBill || consumption)) {
      const bill = parseFloat(monthlyBill) || 0;
      const kwh = parseFloat(consumption) || 0;
      const result = calculateSolarSavings(bill, kwh, currentTariff);
      setSavings(result);
    } else {
      setSavings(null);
    }
  }, [currentTariff, monthlyBill, consumption]);

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


            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <div className="text-sm text-white/80">Ano de garantia de Instalação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-white/80">Economia Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-white/80">Anos de Garantia do fabricante</div>
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
              <div className="flex items-center gap-2 ml-auto">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="h-4 w-4" />
                    <span className="text-xs font-medium">Tarifas Atualizadas</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-xs">
                      {tariffsLoading ? "Carregando..." : "Offline"}
                    </span>
                  </div>
                )}
              </div>
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
                  Informe seu consumo mensal (kWh)
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

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                   <span className="text-sm font-medium text-foreground">
                     Cálculo Automático - {currentTariff?.utility_company || "Equatorial Maranhão"}
                   </span>
                </div>
                 <p className="text-xs text-muted-foreground">
                   Tarifas atualizadas em tempo real • Última atualização: {" "}
                   {currentTariff?.updated_at 
                     ? new Date(currentTariff.updated_at).toLocaleDateString('pt-BR')
                     : "Carregando..."
                   }
                 </p>
              </div>

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
                       * Cálculo baseado nas tarifas da {currentTariff?.utility_company || "Equatorial Maranhão"} 
                       atualizadas em tempo real • Irradiação: {currentTariff?.solar_irradiation || 5.5} kWh/m²/dia
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