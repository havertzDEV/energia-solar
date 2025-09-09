import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, ArrowRight, Zap, TrendingUp, Wifi, WifiOff, Settings2, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";
import { useSolarTariffs } from "@/hooks/useSolarTariffs";
import { calculateSolarSavings, SolarSavings } from "@/utils/solarCalculations";

// Estados brasileiros com suas regiões
const ESTADOS = [
  { name: "Maranhão", code: "MA", region: "Nordeste" },
  { name: "São Paulo", code: "SP", region: "Sudeste" },
  { name: "Rio de Janeiro", code: "RJ", region: "Sudeste" },
  { name: "Minas Gerais", code: "MG", region: "Sudeste" },
  { name: "Bahia", code: "BA", region: "Nordeste" },
  { name: "Paraná", code: "PR", region: "Sul" },
  { name: "Rio Grande do Sul", code: "RS", region: "Sul" },
  { name: "Santa Catarina", code: "SC", region: "Sul" },
  { name: "Goiás", code: "GO", region: "Centro-Oeste" },
  { name: "Ceará", code: "CE", region: "Nordeste" },
];

export const Hero = () => {
  const [consumption, setConsumption] = useState("");
  const [selectedState, setSelectedState] = useState("MA");
  const [isManualTariff, setIsManualTariff] = useState(false);
  const [manualTariff, setManualTariff] = useState("");
  const [savings, setSavings] = useState<SolarSavings | null>(null);
  
  const selectedStateData = ESTADOS.find(estado => estado.code === selectedState);
  
  // Real-time tariffs from Supabase
  const { currentTariff, loading: tariffsLoading, error: tariffsError } = useSolarTariffs(
    selectedStateData?.region, 
    selectedState
  );

  // Real-time status indicator
  const isConnected = !tariffsLoading && !tariffsError && currentTariff;

  // Calculate savings automatically when inputs or tariffs change
  useEffect(() => {
    if (consumption) {
      const kwh = parseFloat(consumption) || 0;
      
      if (isManualTariff && manualTariff) {
        // Use manual tariff
        const manualTariffValue = parseFloat(manualTariff) || 0;
        if (manualTariffValue > 0 && kwh > 0) {
          // Create a mock tariff object for calculations
          const mockTariff = {
            energy_tariff: manualTariffValue * 0.5,
            distribution_tariff: manualTariffValue * 0.3,
            icms_rate: 0.18,
            pis_rate: 0.0165,
            cofins_rate: 0.076,
            solar_irradiation: 5.5,
            installation_cost_per_kwp: 4500,
            utility_company: `Manual - ${selectedStateData?.name || "Estado Selecionado"}`
          };
          const result = calculateSolarSavings(0, kwh, mockTariff as any);
          setSavings(result);
        } else {
          setSavings(null);
        }
      } else if (currentTariff && kwh > 0) {
        // Use API tariff
        const result = calculateSolarSavings(0, kwh, currentTariff);
        setSavings(result);
      } else {
        setSavings(null);
      }
    } else {
      setSavings(null);
    }
  }, [currentTariff, consumption, selectedState, isManualTariff, manualTariff, selectedStateData]);

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
              {/* Seleção do Estado */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Selecione seu estado
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha seu estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.code} value={estado.code}>
                        {estado.name} ({estado.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de Consumo */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Consumo médio mensal (kWh)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 300 kWh"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Encontre este valor na sua conta de luz
                </p>
              </div>

              {/* Configuração Manual de Tarifa */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium text-foreground">
                      Ajustar tarifa manualmente
                    </label>
                  </div>
                  <Switch
                    checked={isManualTariff}
                    onCheckedChange={setIsManualTariff}
                  />
                </div>
                
                {isManualTariff && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tarifa personalizada (R$/kWh)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 0.85"
                      value={manualTariff}
                      onChange={(e) => setManualTariff(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Inclua todos os impostos e taxas
                    </p>
                  </div>
                )}
              </div>

              {/* Status da Conexão */}
              {!isManualTariff && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-primary" />
                     <span className="text-sm font-medium text-foreground">
                       Tarifa Oficial - {currentTariff?.utility_company || `Estado: ${selectedStateData?.name}`}
                     </span>
                  </div>
                   <p className="text-xs text-muted-foreground">
                     Dados atualizados em tempo real • Última atualização: {" "}
                     {currentTariff?.updated_at 
                       ? new Date(currentTariff.updated_at).toLocaleDateString('pt-BR')
                       : "Carregando..."
                     }
                   </p>
                </div>
              )}

              {savings && (
                <div className="space-y-6">
                  {/* Resumo Principal */}
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
                        <p className="text-sm text-muted-foreground">Valor Atual da Conta</p>
                        <p className="text-xl font-bold text-destructive">
                          R$ {(savings.monthlyConsumption * savings.totalTariff).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                        <span className="text-sm text-muted-foreground">Payback (retorno):</span>
                        <span className="font-semibold text-green-600">{savings.payback} anos</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhamento de Impostos */}
                  {currentTariff && !isManualTariff && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          Composição da Tarifa
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Tarifa de Energia:</p>
                          <p className="font-medium">R$ {currentTariff.energy_tariff.toFixed(4)}/kWh</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tarifa de Distribuição:</p>
                          <p className="font-medium">R$ {currentTariff.distribution_tariff.toFixed(4)}/kWh</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ICMS:</p>
                          <p className="font-medium">{(currentTariff.icms_rate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">PIS/COFINS:</p>
                          <p className="font-medium">{((currentTariff.pis_rate + currentTariff.cofins_rate) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900 dark:text-blue-100">Tarifa Final:</span>
                          <span className="text-lg font-bold text-blue-600">
                            R$ {savings.totalTariff.toFixed(4)}/kWh
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Projeção de 25 Anos */}
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Projeção em 25 Anos
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Economia Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {(savings.yearly * 25).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Economia Líquida*</p>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {((savings.yearly * 25) - savings.investment).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ROI Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          {(((savings.yearly * 25) / savings.investment - 1) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      * Economia total menos investimento inicial. Não considera inflação ou reajustes tarifários.
                    </p>
                  </div>
                     
                  <p className="text-xs text-muted-foreground text-center">
                    Cálculos baseados em {isManualTariff ? 'tarifa personalizada' : `tarifas oficiais da ${currentTariff?.utility_company || selectedStateData?.name}`} 
                    • Irradiação solar: {currentTariff?.solar_irradiation || 5.5} kWh/m²/dia
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