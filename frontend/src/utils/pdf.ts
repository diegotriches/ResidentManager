import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "./format";

interface VoucherData {
  apartment: number;
  fixedRate: number;
  waterTotalValue: number;
  gasValue: number;
  total: number;
}

export const exportVoucherToPDF = (v: VoucherData, month: string, year: number) => {
  // 1. Cria uma instância do documento PDF (formato A4, unidade em milímetros)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // --- CONFIGURAÇÕES DE LAYOUT e CORES ---
  const primaryColor = [41, 128, 185]; // Azul #2980b9
  const textColor = [44, 62, 80];     // Grafite escuro #2c3e50

  // 2. TÍTULO / CABEÇALHO DO COMPROVANTE
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, "F"); // Faixa azul no topo

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("COMPROVANTE DE DESPESAS MENSAIS", 15, 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Referência: ${month}/${year}`, 15, 26);

  // 3. INFORMAÇÕES DO APARTAMENTO
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Apartamento: ${v.apartment}`, 15, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(127, 140, 141); // Cinza para data de emissão
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 15, 56);

  // 4. TABELA DE DETALHAMENTO DE VALORES
  // Usamos o autoTable para desenhar uma tabela bonita e alinhada com os valores
  autoTable(doc, {
    startY: 65,
    head: [["Descrição da Despesa", "Valor Unitário (R$)"]],
    body: [
      ["Taxas de Condomínio / Taxas Fixas", formatCurrency(v.fixedRate)],
      ["Consumo de Água + Taxas", formatCurrency(v.waterTotalValue)],
      ["Consumo de Gás Individual", formatCurrency(v.gasValue)],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: "right" }, // Alinha valores numéricos à direita
    },
    styles: {
      font: "helvetica",
      fontSize: 11,
    },
  });

  // 5. BLOCO DE VALOR TOTAL (Posicionado logo após o fim da tabela)
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFillColor(245, 247, 250); // Fundo cinza claro para o total
  doc.rect(120, finalY - 8, 75, 14, "F");

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total a Pagar:", 125, finalY);
  
  doc.setTextColor(39, 174, 96); // Verde para o valor total
  doc.setFontSize(14);
  doc.text(formatCurrency(v.total), 190, finalY, { align: "right" });

  // 6. MENSAGEM / OBSERVAÇÃO NO RODAPÉ
  doc.setTextColor(127, 140, 141);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text(
    "Por favor, realize o pagamento conforme as instruções enviadas pela administração.",
    15,
    finalY + 25
  );

  // 7. EXECUTA O DOWNLOAD AUTOMÁTICO DO PDF
  doc.save(`Voucher_Apto_${v.apartment}_${month}_${year}.pdf`);
};