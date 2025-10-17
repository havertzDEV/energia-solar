import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SolarSavings } from './solarCalculations';

interface BudgetPDFData {
  savings: SolarSavings;
  customSystemSize?: string;
  customInvestment?: string;
  customPayback?: string;
  state: string;
  utilityCompany: string;
  consumption: string;
  isManualTariff?: boolean;
  manualTariff?: string;
}

export const generateBudgetPDF = (data: BudgetPDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Cores da marca
  const primaryColor: [number, number, number] = [255, 184, 0]; // Dourado/Amarelo
  const secondaryColor: [number, number, number] = [0, 102, 204]; // Azul
  const textColor: [number, number, number] = [51, 51, 51];
  
  let yPosition = 20;

  // Cabeçalho com logo/nome da empresa
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ISOLLAR ENERGY', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Engenharia em Energia Solar', pageWidth / 2, 30, { align: 'center' });
  
  yPosition = 50;
  
  // Título do documento
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO PERSONALIZADO', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Data
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Data: ${currentDate}`, 20, yPosition);
  
  yPosition += 12;
  
  // Informações do Cliente
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('DADOS DO CLIENTE', 20, yPosition);
  
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  const clientData = [
    ['Estado:', data.state],
    ['Concessionária:', data.utilityCompany],
    ['Consumo Mensal:', `${data.consumption} kWh`],
  ];
  
  clientData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPosition);
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // Resumo Financeiro
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('RESUMO FINANCEIRO', 20, yPosition);
  
  yPosition += 8;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Descrição', 'Valor']],
    body: [
      ['Valor Atual da Conta', `R$ ${(data.savings.monthlyConsumption * data.savings.totalTariff).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Economia Mensal Estimada', `R$ ${data.savings.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Economia Anual Estimada', `R$ ${data.savings.yearly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Verificar se há espaço suficiente na página
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Especificações do Sistema
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('ESPECIFICAÇÕES DO SISTEMA', 20, yPosition);
  
  yPosition += 8;
  
  const systemSize = parseFloat(data.customSystemSize || String(data.savings.systemSize));
  const investment = parseFloat(data.customInvestment || String(data.savings.investment));
  const payback = parseFloat(data.customPayback || String(data.savings.payback));
  
  // Calcular área aproximada
  const approximateArea = (data.savings.moduleQuantity * 2.6).toFixed(0);
  
  // Adicionar informação de tarifa se for manual
  const systemSpecsBody = [
    ['Potência do Sistema', `${systemSize.toFixed(2)} kWp`],
    ['Módulos Solares', `${data.savings.moduleQuantity} unidades de ${(data.savings.moduleUnitPower * 1000).toFixed(0)}W`],
    ['Potência Total dos Módulos', `${(data.savings.moduleQuantity * data.savings.moduleUnitPower).toFixed(1)} kWp`],
    ['Inversor', `${data.savings.inverterPower.toFixed(2)} kW`],
    ['Área Aproximada Necessária', `${approximateArea} m²`],
    ['Investimento Estimado', `R$ ${investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
    ['Payback (Retorno)', `${payback.toFixed(1)} anos`],
  ];
  
  // Adicionar informação de tarifa se for customizada
  if (data.isManualTariff && data.manualTariff) {
    systemSpecsBody.push(['Tarifa Utilizada', `R$ ${parseFloat(data.manualTariff).toFixed(4)}/kWh (Manual)`]);
  } else {
    systemSpecsBody.push(['Tarifa Utilizada', `R$ ${data.savings.totalTariff.toFixed(4)}/kWh (Automática)`]);
  }
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Item', 'Especificação']],
    body: systemSpecsBody,
    theme: 'striped',
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Verificar se há espaço suficiente na página
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Projeção de 25 anos
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('PROJEÇÃO DE ECONOMIA (25 ANOS)', 20, yPosition);
  
  yPosition += 8;
  
  const total25Years = data.savings.yearly * 25;
  const netSavings25Years = total25Years - investment;
  const roi25Years = ((netSavings25Years / investment) * 100);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Descrição', 'Valor']],
    body: [
      ['Economia Total em 25 anos', `R$ ${total25Years.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Investimento', `R$ ${investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Economia Líquida', `R$ ${netSavings25Years.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['ROI (Retorno sobre Investimento)', `${roi25Years.toFixed(2)}%`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Verificar se há espaço para observações e rodapé
  if (yPosition > pageHeight - 70) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Observações
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('* Valores estimados baseados nas tarifas atuais e irradiação solar da região.', 20, yPosition);
  yPosition += 5;
  doc.text('* O payback pode variar conforme reajustes tarifários e condições climáticas.', 20, yPosition);
  
  // Rodapé com assinatura (sempre na parte inferior da última página)
  const currentPage = (doc as any).internal.getNumberOfPages();
  doc.setPage(currentPage);
  const footerY = pageHeight - 40;
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('ISOLLAR ENERGY ENGENHARIA', pageWidth / 2, footerY + 8, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Especialistas em Energia Solar Fotovoltaica', pageWidth / 2, footerY + 14, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('www.isollarenergy.com.br | contato@isollarenergy.com.br', pageWidth / 2, footerY + 20, { align: 'center' });
  
  // Assinatura
  doc.setDrawColor(...textColor);
  doc.line(pageWidth / 2 - 30, footerY + 28, pageWidth / 2 + 30, footerY + 28);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Assinatura Digital Isollar Energy', pageWidth / 2, footerY + 32, { align: 'center' });
  
  // Salvar o PDF
  const fileName = `Orcamento_Solar_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
