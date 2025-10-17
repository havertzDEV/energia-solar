import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, ArrowRight, Zap, TrendingUp, Wifi, WifiOff, Settings2, BarChart3, Download } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";
import { useSolarTariffs } from "@/hooks/useSolarTariffs";
import { useUtilityCompanies } from "@/hooks/useUtilityCompanies";
import { calculateSolarSavings, SolarSavings } from "@/utils/solarCalculations";
import { generateBudgetPDF } from "@/utils/generateBudgetPDF";
import { toast } from "sonner";


// Estados brasileiros com suas regiões
const ESTADOS = [
  { name: "Acre", code: "AC", region: "Norte" },
  { name: "Alagoas", code: "AL", region: "Nordeste" },
  { name: "Amapá", code: "AP", region: "Norte" },
  { name: "Amazonas", code: "AM", region: "Norte" },
  { name: "Bahia", code: "BA", region: "Nordeste" },
  { name: "Ceará", code: "CE", region: "Nordeste" },
  { name: "Distrito Federal", code: "DF", region: "Centro-Oeste" },
  { name: "Espírito Santo", code: "ES", region: "Sudeste" },
  { name: "Goiás", code: "GO", region: "Centro-Oeste" },
  { name: "Maranhão", code: "MA", region: "Nordeste" },
  { name: "Mato Grosso", code: "MT", region: "Centro-Oeste" },
  { name: "Mato Grosso do Sul", code: "MS", region: "Centro-Oeste" },
  { name: "Minas Gerais", code: "MG", region: "Sudeste" },
  { name: "Pará", code: "PA", region: "Norte" },
  { name: "Paraíba", code: "PB", region: "Nordeste" },
  { name: "Paraná", code: "PR", region: "Sul" },
  { name: "Pernambuco", code: "PE", region: "Nordeste" },
  { name: "Piauí", code: "PI", region: "Nordeste" },
  { name: "Rio de Janeiro", code: "RJ", region: "Sudeste" },
  { name: "Rio Grande do Norte", code: "RN", region: "Nordeste" },
  { name: "Rio Grande do Sul", code: "RS", region: "Sul" },
  { name: "Rondônia", code: "RO", region: "Norte" },
  { name: "Roraima", code: "RR", region: "Norte" },
  { name: "Santa Catarina", code: "SC", region: "Sul" },
  { name: "São Paulo", code: "SP", region: "Sudeste" },
  { name: "Sergipe", code: "SE", region: "Nordeste" },
  { name: "Tocantins", code: "TO", region: "Norte" },
];

export const Hero = () => {
  const [consumption, setConsumption] = useState("");
  const [selectedState, setSelectedState] = useState("SP"); // Começar com São Paulo como padrão
  const [selectedUtilityId, setSelectedUtilityId] = useState("");
  const [isManualTariff, setIsManualTariff] = useState(false);
  const [manualTariff, setManualTariff] = useState("");
  const [savings, setSavings] = useState<SolarSavings | null>(null);
  const [isCustomSystem, setIsCustomSystem] = useState(false);
  const [customModulePower, setCustomModulePower] = useState("550");
  const [customInverterPower, setCustomInverterPower] = useState("");
  const [customModuleQuantity, setCustomModuleQuantity] = useState("");
  const [inverterType, setInverterType] = useState("string");
  
  // Estados para ajuste de orçamento
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customSystemSize, setCustomSystemSize] = useState("");
  const [customInvestment, setCustomInvestment] = useState("");
  const [customPayback, setCustomPayback] = useState("");
  
  // Estados para tarifa detalhada manual
  const [isAdvancedTariff, setIsAdvancedTariff] = useState(false);
  const [manualEnergyTariff, setManualEnergyTariff] = useState("");
  const [manualDistributionTariff, setManualDistributionTariff] = useState("");
  const [manualIcmsRate, setManualIcmsRate] = useState("");
  const [manualPisCofinsRate, setManualPisCofinsRate] = useState("");
  
  const selectedStateData = ESTADOS.find(estado => estado.code === selectedState);
  
  // Import utility companies hook
  const { companies, loading: companiesLoading } = useUtilityCompanies(selectedState);
  
  // Real-time tariffs from Supabase - buscar por utility_id
  const { currentTariff, loading: tariffsLoading, error: tariffsError } = useSolarTariffs(
    selectedUtilityId
  );

  // Real-time status indicator
  const isConnected = !tariffsLoading && !tariffsError && currentTariff;

  // Calculate savings automatically when inputs or tariffs change
  useEffect(() => {
    if (consumption) {
      const kwh = parseFloat(consumption) || 0;
      
      if (isAdvancedTariff && manualEnergyTariff && manualDistributionTariff && manualIcmsRate && manualPisCofinsRate) {
        // Use advanced manual tariff with all components
        const energyTariff = parseFloat(manualEnergyTariff) || 0;
        const distributionTariff = parseFloat(manualDistributionTariff) || 0;
        const icmsRate = parseFloat(manualIcmsRate) / 100 || 0;
        const pisCofinsRate = parseFloat(manualPisCofinsRate) / 100 || 0;
        
        if (energyTariff > 0 && distributionTariff > 0 && kwh > 0) {
          const mockTariff = {
            energy_tariff: energyTariff,
            distribution_tariff: distributionTariff,
            icms_rate: icmsRate,
            pis_rate: pisCofinsRate / 2, // Divide PIS/COFINS igualmente
            cofins_rate: pisCofinsRate / 2,
            solar_irradiation: currentTariff?.solar_irradiation || 5.5,
            installation_cost_per_kwp: currentTariff?.installation_cost_per_kwp || 4500,
            utility_company: `Manual - ${selectedStateData?.name || "Estado Selecionado"}`
          };
          const result = calculateSolarSavings(0, kwh, mockTariff as any);
          setSavings(result);
        } else {
          setSavings(null);
        }
      } else if (isManualTariff && manualTariff) {
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
  }, [currentTariff, consumption, selectedUtilityId, isManualTariff, manualTariff, selectedStateData, isAdvancedTariff, manualEnergyTariff, manualDistributionTariff, manualIcmsRate, manualPisCofinsRate]);

  // Auto-select first utility company when state changes
  useEffect(() => {
    if (companies.length > 0) {
      // Always select the first company when companies list changes
      setSelectedUtilityId(companies[0].utility_id);
    }
  }, [companies, selectedState]);

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
        <div className={`${savings ? 'flex justify-center items-center' : 'grid lg:grid-cols-2 gap-12 items-center'}`}>
          {/* Left Column - Hero Content */}
          {!savings && (
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
          )}

          {/* Right Column - Calculator */}
          <div className={`${savings ? 'bg-white/20 max-w-3xl w-full' : 'bg-white/95'} backdrop-blur-sm rounded-2xl p-8 shadow-elegant slide-in-left`}>
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
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedUtilityId(""); // Reset utility selection when state changes
                }}>
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

              {/* Seleção da Concessionária */}
              {companies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Selecione sua concessionária
                  </label>
                  <Select 
                    value={selectedUtilityId} 
                    onValueChange={setSelectedUtilityId}
                    disabled={companiesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha sua concessionária" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company, index) => (
                        <SelectItem key={`${company.utility_id}-${index}`} value={company.utility_id}>
                          {company.utility_company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecione a concessionária que atende sua região
                  </p>
                </div>
              )}

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
                    {tariffsLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">Carregando tarifas...</span>
                      </div>
                    ) : isConnected ? (
                      <>
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {currentTariff?.utility_company || `Estado: ${selectedStateData?.name}`}
                        </span>
                        <div className="flex items-center gap-1 text-green-600 ml-2">
                          <Wifi className="h-4 w-4" />
                          <span className="text-xs">Conectado</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600">
                        <WifiOff className="h-4 w-4" />
                        <span className="text-sm">
                          {tariffsError ? "Erro ao carregar tarifas" : "Offline"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                </div>
              )}

              {savings && (
                <div className="space-y-6">
                  {/* Resumo Principal */}
                  <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-accent" />
                        <h3 className="text-lg font-semibold text-accent">
                          Seu Orçamento Personalizado
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const selectedStateData = ESTADOS.find(e => e.code === selectedState);
                            generateBudgetPDF({
                              savings,
                              customSystemSize,
                              customInvestment,
                              customPayback,
                              state: selectedStateData?.name || selectedState,
                              utilityCompany: currentTariff?.utility_company || "Não informado",
                              consumption,
                              isManualTariff,
                              manualTariff
                            });
                            toast.success("PDF gerado com sucesso!");
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Baixar PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCustomBudget(!isCustomBudget)}
                          className="gap-2"
                        >
                          <Settings2 className="h-4 w-4" />
                          Ajustar Orçamento
                        </Button>
                      </div>
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
                      {isCustomBudget ? (
                        <>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sistema recomendado:</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.01"
                                value={customSystemSize || savings.systemSize}
                                onChange={(e) => setCustomSystemSize(e.target.value)}
                                className="w-24 h-8 text-sm text-right"
                              />
                              <span className="text-sm font-semibold">kWp</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm text-muted-foreground">Investimento estimado:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">R$</span>
                              <Input
                                type="number"
                                step="0.01"
                                value={customInvestment || savings.investment}
                                onChange={(e) => setCustomInvestment(e.target.value)}
                                className="w-32 h-8 text-sm text-right"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm text-muted-foreground">Payback (retorno):</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.1"
                                value={customPayback || savings.payback}
                                onChange={(e) => setCustomPayback(e.target.value)}
                                className="w-20 h-8 text-sm text-right"
                              />
                              <span className="text-sm font-semibold text-green-600">anos</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Sistema recomendado:</span>
                            <span className="font-semibold">{customSystemSize || savings.systemSize} kWp</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Investimento estimado:</span>
                            <span className="font-semibold">R$ {(parseFloat(customInvestment) || savings.investment).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payback (retorno):</span>
                            <span className="font-semibold text-green-600">{customPayback || savings.payback} anos</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Especificações do Sistema */}
                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                          Especificações do Sistema
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="custom-system"
                          checked={isCustomSystem}
                          onCheckedChange={setIsCustomSystem}
                        />
                        <label htmlFor="custom-system" className="text-sm text-muted-foreground">
                          Sistema Personalizado
                        </label>
                      </div>
                    </div>
                    
                    {!isCustomSystem ? (
                      // Sistema Padrão (calculado automaticamente)
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Módulos Fotovoltaicos</p>
                          <p className="text-lg font-bold text-purple-600">
                            {savings.moduleQuantity}x {(savings.moduleUnitPower * 1000).toFixed(0)}W
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(savings.moduleQuantity * savings.moduleUnitPower).toFixed(1)} kWp total
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Inversor</p>
                          <p className="text-lg font-bold text-purple-600">
                            {savings.inverterPower.toFixed(1)} kW
                          </p>
                          <p className="text-xs text-muted-foreground">
                            String ou microinversor
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Área Aproximada</p>
                          <p className="text-lg font-bold text-purple-600">
                            {(savings.moduleQuantity * 2.6).toFixed(0)} m²
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Área de telhado necessária
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Sistema Personalizado
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Potência dos Módulos
                            </label>
                            <Select value={customModulePower} onValueChange={setCustomModulePower}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="400">400W - Padrão Residencial</SelectItem>
                                <SelectItem value="450">450W - Residencial Premium</SelectItem>
                                <SelectItem value="500">500W - Alto Desempenho</SelectItem>
                                <SelectItem value="550">550W - Ultra Eficiente</SelectItem>
                                <SelectItem value="600">600W - Premium Plus</SelectItem>
                                <SelectItem value="650">650W - Máxima Potência</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Quantidade de Módulos
                            </label>
                            <Select value={customModuleQuantity} onValueChange={setCustomModuleQuantity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="6">6 módulos - Sistema Pequeno</SelectItem>
                                <SelectItem value="8">8 módulos - Residencial Básico</SelectItem>
                                <SelectItem value="10">10 módulos - Residencial Médio</SelectItem>
                                <SelectItem value="12">12 módulos - Residencial Padrão</SelectItem>
                                <SelectItem value="15">15 módulos - Residencial Grande</SelectItem>
                                <SelectItem value="18">18 módulos - Casa Grande</SelectItem>
                                <SelectItem value="20">20 módulos - Comercial Pequeno</SelectItem>
                                <SelectItem value="25">25 módulos - Comercial Médio</SelectItem>
                                <SelectItem value="30">30 módulos - Comercial Grande</SelectItem>
                                <SelectItem value="40">40 módulos - Industrial Pequeno</SelectItem>
                                <SelectItem value="50">50 módulos - Industrial Médio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Tipo de Inversor
                            </label>
                            <Select value={inverterType} onValueChange={setInverterType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="micro">Microinversor</SelectItem>
                                <SelectItem value="string">Inversor String</SelectItem>
                                <SelectItem value="central">Inversor Central</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {inverterType && (
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Potência do Inversor (kW)
                            </label>
                            <Select value={customInverterPower} onValueChange={setCustomInverterPower}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a potência..." />
                              </SelectTrigger>
                              <SelectContent>
                                {inverterType === "micro" && (
                                  <>
                                    <SelectItem value="0.5">0.5kW - Microinversor Individual</SelectItem>
                                    <SelectItem value="1">1kW - Microinversor Duplo</SelectItem>
                                    <SelectItem value="1.5">1.5kW - Microinversor Triplo</SelectItem>
                                    <SelectItem value="2">2kW - Microinversor Quádruplo</SelectItem>
                                  </>
                                )}
                                {inverterType === "string" && (
                                  <>
                                    <SelectItem value="3">3kW - String Pequeno</SelectItem>
                                    <SelectItem value="5">5kW - String Residencial</SelectItem>
                                    <SelectItem value="8">8kW - String Médio</SelectItem>
                                    <SelectItem value="10">10kW - String Grande</SelectItem>
                                    <SelectItem value="15">15kW - String Comercial</SelectItem>
                                    <SelectItem value="20">20kW - String Industrial</SelectItem>
                                  </>
                                )}
                                {inverterType === "central" && (
                                  <>
                                    <SelectItem value="20">20kW - Central Pequeno</SelectItem>
                                    <SelectItem value="25">25kW - Central Médio</SelectItem>
                                    <SelectItem value="30">30kW - Central Grande</SelectItem>
                                    <SelectItem value="50">50kW - Central Industrial</SelectItem>
                                    <SelectItem value="75">75kW - Central Mega</SelectItem>
                                    <SelectItem value="100">100kW - Central Ultra</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {customModuleQuantity && customModulePower && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Sistema Selecionado</p>
                              <p className="text-lg font-bold text-purple-600">
                                {customModuleQuantity}x {customModulePower}W
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(parseInt(customModuleQuantity) * parseFloat(customModulePower) / 1000).toFixed(1)} kWp total
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Inversor</p>
                              <p className="text-lg font-bold text-purple-600">
                                {customInverterPower ? `${parseFloat(customInverterPower).toFixed(1)} kW` : "Não selecionado"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {inverterType === "micro" && "Microinversor"}
                                {inverterType === "string" && "Inversor String"}
                                {inverterType === "central" && "Inversor Central"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Área Aproximada</p>
                              <p className="text-lg font-bold text-purple-600">
                                {(parseInt(customModuleQuantity) * 2.6).toFixed(0)} m²
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Área de telhado necessária
                              </p>
                            </div>
                          </div>
                        )}

                        {customModuleQuantity && customInverterPower && (
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings2 className="h-4 w-4 text-purple-600" />
                              <h5 className="font-semibold text-purple-900 dark:text-purple-100">
                                Análise do Sistema Personalizado
                              </h5>
                            </div>
                            <div className="text-sm space-y-1">
                              <p className="text-muted-foreground">
                                <strong>Potência Total dos Módulos:</strong> {(parseInt(customModuleQuantity) * parseFloat(customModulePower) / 1000).toFixed(2)} kWp
                              </p>
                              <p className="text-muted-foreground">
                                <strong>Potência do Inversor:</strong> {parseFloat(customInverterPower).toFixed(1)} kW
                              </p>
                              <p className="text-muted-foreground">
                                <strong>Dimensionamento:</strong> {
                                  (parseInt(customModuleQuantity) * parseFloat(customModulePower) / 1000) > parseFloat(customInverterPower) * 1.2
                                    ? "⚠️ Sistema superdimensionado - considere inversor maior"
                                    : (parseInt(customModuleQuantity) * parseFloat(customModulePower) / 1000) < parseFloat(customInverterPower) * 0.8
                                    ? "⚠️ Sistema subdimensionado - considere mais módulos"
                                    : "✅ Sistema bem dimensionado"
                                }
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {customModuleQuantity && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              <strong>Sistema Personalizado:</strong> O investimento e payback são baseados no sistema recomendado ({savings.systemSize} kWp). 
                              Para um orçamento preciso do sistema personalizado, solicite uma consulta gratuita.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detalhamento de Impostos */}
                  {(currentTariff || isAdvancedTariff) && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            Composição da Tarifa
                          </h4>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!isAdvancedTariff && currentTariff) {
                              // Preencher com valores atuais ao ativar
                              setManualEnergyTariff(currentTariff.energy_tariff.toFixed(4));
                              setManualDistributionTariff(currentTariff.distribution_tariff.toFixed(4));
                              setManualIcmsRate((currentTariff.icms_rate * 100).toFixed(1));
                              setManualPisCofinsRate(((currentTariff.pis_rate + currentTariff.cofins_rate) * 100).toFixed(1));
                            }
                            setIsAdvancedTariff(!isAdvancedTariff);
                            setIsManualTariff(false);
                          }}
                          className="gap-2"
                        >
                          <Settings2 className="h-4 w-4" />
                          {isAdvancedTariff ? "Usar Tarifa Oficial" : "Ajustar Tarifa"}
                        </Button>
                      </div>
                      
                      {isAdvancedTariff ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-muted-foreground mb-1 block">
                                Tarifa de Energia (R$/kWh)
                              </label>
                              <Input
                                type="number"
                                step="0.0001"
                                placeholder="Ex: 0.4500"
                                value={manualEnergyTariff}
                                onChange={(e) => setManualEnergyTariff(e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground mb-1 block">
                                Tarifa de Distribuição (R$/kWh)
                              </label>
                              <Input
                                type="number"
                                step="0.0001"
                                placeholder="Ex: 0.3200"
                                value={manualDistributionTariff}
                                onChange={(e) => setManualDistributionTariff(e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground mb-1 block">
                                ICMS (%)
                              </label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 18.0"
                                value={manualIcmsRate}
                                onChange={(e) => setManualIcmsRate(e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground mb-1 block">
                                PIS/COFINS (%)
                              </label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 9.25"
                                value={manualPisCofinsRate}
                                onChange={(e) => setManualPisCofinsRate(e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          
                          {savings && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-900 dark:text-blue-100">Tarifa Final Calculada:</span>
                                <span className="text-lg font-bold text-blue-600">
                                  R$ {savings.totalTariff.toFixed(4)}/kWh
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Tarifa de Energia:</p>
                              <p className="font-medium">R$ {currentTariff?.energy_tariff.toFixed(4)}/kWh</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tarifa de Distribuição:</p>
                              <p className="font-medium">R$ {currentTariff?.distribution_tariff.toFixed(4)}/kWh</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">ICMS:</p>
                              <p className="font-medium">{(currentTariff?.icms_rate ? currentTariff.icms_rate * 100 : 0).toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">PIS/COFINS:</p>
                              <p className="font-medium">{(currentTariff ? (currentTariff.pis_rate + currentTariff.cofins_rate) * 100 : 0).toFixed(1)}%</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-blue-900 dark:text-blue-100">Tarifa Final:</span>
                              <span className="text-lg font-bold text-blue-600">
                                R$ {savings?.totalTariff.toFixed(4)}/kWh
                              </span>
                            </div>
                          </div>
                        </>
                      )}
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