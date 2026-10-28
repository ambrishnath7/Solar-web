import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MaintenanceReport } from '../types';

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | null> => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generatePMCReportPDF = async (report: MaintenanceReport): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header Background Banner
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, 32, pageWidth, 32);

  // Logo / Company Header
  const logoData = await getBase64ImageFromUrl('/logo.jpeg');
  let headerTextX = margin;
  if (logoData) {
    try {
      doc.addImage(logoData, 'JPEG', margin, 5, 58, 14);
      headerTextX = margin + 63;
    } catch {
      // fallback
    }
  }

  if (!logoData) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('SHREE ABHI ELECTRICALS & ENGINEERING PVT. LTD.', headerTextX, 11.5);
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6); // amber-600
  doc.text('MNRE REGISTERED SOLAR EPC & RESCO COMPANY — CHENNAI', headerTextX, logoData ? 12.5 : 16.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Web: shreeabhisolar.com | Contact: bnsimhan@gmail.com | Mobile: +91 98401 23456', headerTextX, logoData ? 18.5 : 21.5);

  // Title Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, 25, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('MONTHLY PREVENTIVE MAINTENANCE REPORT (PMC)', margin + 3, 29.8);

  const refText = `REF: ${report.reportRef || 'PMC-DRAFT'}`;
  doc.text(refText, pageWidth - margin - doc.getTextWidth(refText) - 3, 29.8);

  let currentY = 36;

  // Client & Visit Info Card
  const client = report.client;
  const engineer = report.engineer;

  const infoRows = [
    [
      { content: 'Client Name:', styles: { fontStyle: 'bold' as const } },
      client?.clientName || 'N/A',
      { content: 'Site Name / Address:', styles: { fontStyle: 'bold' as const } },
      `${client?.siteName || ''} - ${client?.siteAddress || ''}`,
    ],
    [
      { content: 'Plant Capacity:', styles: { fontStyle: 'bold' as const } },
      `${client?.plantCapacityKw || 0} kW`,
      { content: 'Solar Modules:', styles: { fontStyle: 'bold' as const } },
      `${client?.modulesMake || 'Standard'} ${client?.modulesWp || 0}Wp (${client?.totalModules || 0} Nos)`,
    ],
    [
      { content: 'Inverter Specs:', styles: { fontStyle: 'bold' as const } },
      `${client?.inverterMake || 'Standard'} - ${client?.inverterCapacity || 'N/A'} (${client?.totalInverters || 0} Nos)`,
      { content: 'AMC Status:', styles: { fontStyle: 'bold' as const } },
      client?.amcStatus === 'FREE_YEAR1' ? 'Free Year 1 Warranty' : 'Active Paid AMC',
    ],
    [
      { content: 'Visit Date:', styles: { fontStyle: 'bold' as const } },
      new Date(report.visitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      { content: 'Assigned Engineer:', styles: { fontStyle: 'bold' as const } },
      `${engineer?.name || 'Assigned Engineer'} (${report.noOfTechnicians || 1} Techs)`,
    ],
    [
      { content: 'Previous Visit:', styles: { fontStyle: 'bold' as const } },
      report.prevMaintenanceDate
        ? new Date(report.prevMaintenanceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'First Recorded PMC',
      { content: 'Next Scheduled Visit:', styles: { fontStyle: 'bold' as const } },
      report.nextVisitDate
        ? new Date(report.nextVisitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'After 90 Days',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: infoRows as any,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.6, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 26, fillColor: [241, 245, 249] },
      1: { cellWidth: 54 },
      2: { cellWidth: 32, fillColor: [241, 245, 249] },
      3: { cellWidth: 'auto' },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Sections 1 to 5: Inspection Tables
  const inspectionSections = [
    {
      title: 'Section 1: Solar Module Inspection',
      items: [
        { name: 'Solar module cleaning', val: report.modCleaning, rem: report.modRemarks || '-' },
        { name: 'Broken module inspection', val: report.modBroken === 'NO' ? 'GOOD' : 'DEFECT', rem: `Broken: ${report.modBroken}` },
        { name: 'Module mounting structure condition', val: report.modMountingStructure, rem: '-' },
        { name: 'Module nut & bolt tightness', val: report.modNutBoltTightness, rem: '-' },
        { name: 'Module photos taken (before & after)', val: report.modPhotosTaken === 'YES' ? 'GOOD' : 'DEFECT', rem: `Photos: ${report.modPhotosTaken}` },
      ],
    },
    {
      title: 'Section 2: DC System Inspection',
      items: [
        { name: 'DC cables condition', val: report.dcCables, rem: report.dcRemarks || '-' },
        { name: 'MC4 connectors condition', val: report.dcMc4Connectors, rem: '-' },
        { name: 'DC junction box (AJB / DCDB) condition', val: report.dcJunctionBox, rem: '-' },
        { name: 'String voltage measurement', val: report.dcStringVoltage, rem: '-' },
        { name: 'Cable insulation condition', val: report.dcCableInsulation, rem: '-' },
      ],
    },
    {
      title: 'Section 3: Inverter Inspection',
      items: [
        { name: 'Inverter working condition', val: report.invWorking, rem: report.invRemarks || '-' },
        { name: 'Cooling fans working condition', val: report.invCoolingFans, rem: '-' },
        { name: 'Inverter AC output voltage & frequency', val: report.invAcOutput, rem: '-' },
        { name: 'Other issues / error codes in inverter', val: report.invOtherIssues, rem: '-' },
      ],
    },
    {
      title: 'Section 4: AC System Inspection',
      items: [
        { name: 'AC cables / loose electrical connections', val: report.acCables, rem: report.acRemarks || '-' },
        { name: 'AC distribution board (ACDB) condition', val: report.acDistributionBoard, rem: '-' },
        { name: 'MCB / MCCB operating condition', val: report.acMcbMccb, rem: '-' },
      ],
    },
    {
      title: 'Section 5: Earthing & Safety Check',
      items: [
        { name: 'Equipment earthing condition', val: report.earthEquipment, rem: report.earthRemarks || '-' },
        { name: 'Lightning arrester condition', val: report.earthLightningArrester, rem: '-' },
        { name: 'Surge protection device (SPD) condition', val: report.earthSpd, rem: '-' },
        { name: 'Earthing pit condition & resistance check', val: report.earthPit, rem: '-' },
      ],
    },
  ];

  for (const sec of inspectionSections) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin, currentY);
    currentY += 1.5;

    const tableBody = sec.items.map((it) => {
      const isDefect = it.val === 'DEFECT' || it.val === 'NO';
      return [
        it.name,
        {
          content: it.val === 'GOOD' || it.val === 'YES' ? 'GOOD [OK]' : 'DEFECT [ATTN]',
          styles: {
            textColor: isDefect ? [220, 38, 38] : [16, 185, 129],
            fontStyle: 'bold' as const,
          },
        },
        it.rem,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Check Item', 'Status', 'Remarks']],
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: 255,
        fontSize: 7.5,
        cellPadding: 1.2,
      },
      body: tableBody as any,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 1.2 },
      columnStyles: {
        0: { cellWidth: 95 },
        1: { cellWidth: 32, halign: 'center' },
        2: { cellWidth: 'auto' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 3.5;
  }

  // Check page overflow for generation & net meter
  if (currentY > 215) {
    doc.addPage();
    currentY = 16;
  }

  // Section 6 & 7: Generation and Net Meter
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Section 6: Generation Performance & Section 7: Net Meter / EB Check', margin, currentY);
  currentY += 1.5;

  const genMeterBody = [
    [
      'Total Generation this Month:',
      `${report.genTotalThisMonth ?? 0} kWh`,
      'EB Import Units:',
      `${report.meterImportUnits ?? 0} kWh`,
    ],
    [
      'Average Daily Generation:',
      `${report.genAvgDaily ?? 0} kWh`,
      'EB Export Units:',
      `${report.meterExportUnits ?? 0} kWh`,
    ],
    [
      'Expected Generation:',
      `${report.genExpected ?? 0} kWh`,
      'Net Meter Condition:',
      report.meterCondition === 'GOOD' ? 'GOOD [OK]' : 'DEFECT [ATTN]',
    ],
    [
      'Performance Status:',
      report.genPerformance === 'GOOD' ? 'GOOD (Normal)' : 'DEFECT (Underperforming)',
      'Meter Remarks:',
      report.meterRemarks || report.genRemarks || 'Normal operation',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: genMeterBody,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 1.4 },
    columnStyles: {
      0: { cellWidth: 42, fillColor: [248, 250, 252], fontStyle: 'bold' },
      1: { cellWidth: 48 },
      2: { cellWidth: 42, fillColor: [248, 250, 252], fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3.5;

  // Section 8: Observations
  if (currentY > 235) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Section 8: Observations & Action Required', margin, currentY);
  currentY += 1.5;

  const obsBody = [
    [
      { content: 'General Observations:', styles: { fontStyle: 'bold' as const, cellWidth: 38 } },
      report.observations || 'All system parameters verified and found within normal operating limits.',
    ],
    [
      { content: 'Action Required:', styles: { fontStyle: 'bold' as const, cellWidth: 38 } },
      report.actionRequired || 'No immediate corrective action required. Routine quarterly PMC recommended.',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: obsBody as any,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 1.5 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // Signatures Block
  if (currentY > 240) {
    doc.addPage();
    currentY = 16;
  }

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 2, 2, 'FD');

  const sigColWidth = (pageWidth - margin * 2) / 2;

  // Engineer Sig
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Supervisor / Technician Signature:', margin + 4, currentY + 5);

  if (report.sigEngineer && report.sigEngineer.startsWith('data:image')) {
    try {
      doc.addImage(report.sigEngineer, 'PNG', margin + 4, currentY + 6.5, 45, 14);
    } catch {
      doc.text('[Signed Digitally]', margin + 4, currentY + 14);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('(Digitally Verified on Submission)', margin + 4, currentY + 14);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${engineer?.name || 'Engineer'}`, margin + 4, currentY + 24);

  // Client Representative Sig
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Client Representative Signature:', margin + sigColWidth + 4, currentY + 5);

  if (report.sigClient && report.sigClient.startsWith('data:image')) {
    try {
      doc.addImage(report.sigClient, 'PNG', margin + sigColWidth + 4, currentY + 6.5, 45, 14);
    } catch {
      doc.text('[Signed Digitally]', margin + sigColWidth + 4, currentY + 14);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('(Representative Acknowledged)', margin + sigColWidth + 4, currentY + 14);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Client Rep: ${client?.contactName || 'Client Officer'}`, margin + sigColWidth + 4, currentY + 24);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Shree Abhi Electricals & Engineering Pvt. Ltd. • Solar Preventive Maintenance (PMC)',
      margin,
      pageHeight - 6
    );

    const pageStr = `Page ${i} of ${totalPages}  |  ${report.reportRef}`;
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 6);
  }

  return doc;
};

export const downloadPDF = async (report: MaintenanceReport) => {
  const doc = await generatePMCReportPDF(report);
  const filename = `${report.reportRef || 'PMC-Report'}_${report.client?.clientName?.replace(/\s+/g, '_') || 'Client'}.pdf`;
  doc.save(filename);
};

export const shareViaWhatsApp = async (report: MaintenanceReport) => {
  await downloadPDF(report);

  let rawPhone = report.client?.contactPhone || '';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  const clientName = report.client?.clientName || 'Valued Client';
  const siteName = report.client?.siteName || '';
  const ref = report.reportRef || 'PMC Report';
  const dateStr = new Date(report.visitDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const engineerName = report.engineer?.name || 'Field Engineer';
  const nextVisit = report.nextVisitDate
    ? new Date(report.nextVisitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'in 90 days';

  const message = `Hello *${clientName}*,

Here is your Solar Preventive Maintenance Report (*${ref}*) for *${siteName}*.

*Inspection Date:* ${dateStr}
*Engineer:* ${engineerName}
*Generation This Month:* ${report.genTotalThisMonth || 0} kWh
*Status:* ${report.status === 'submitted' ? '✅ Completed & Verified' : '📝 Draft'}
*Next Scheduled Visit:* ${nextVisit}

Your PDF report has been generated. Please find it attached above.

Thank you,
*Shree Abhi Electricals & Engineering Pvt. Ltd.*
Chennai | shreeabhisolar.com`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const shareViaEmail = async (report: MaintenanceReport) => {
  await downloadPDF(report);

  const clientEmail = report.client?.contactEmail || '';
  const clientName = report.client?.clientName || 'Valued Client';
  const ref = report.reportRef || 'PMC Report';
  const dateStr = new Date(report.visitDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const subject = `Solar Maintenance Report (${ref}) — ${clientName}`;
  const body = `Dear ${clientName},

Greetings from Shree Abhi Electricals & Engineering Pvt. Ltd.

Please find the Monthly Preventive Maintenance (PMC) report conducted on ${dateStr}.

Summary:
- Report Reference: ${ref}
- Site: ${report.client?.siteName || ''}
- Plant Capacity: ${report.client?.plantCapacityKw || 0} kW
- Inverter Condition: ${report.invWorking}
- Total Generation: ${report.genTotalThisMonth || 0} kWh
- Next Scheduled Visit: ${report.nextVisitDate ? new Date(report.nextVisitDate).toLocaleDateString('en-IN') : 'in 90 days'}

The complete report PDF is being downloaded to your device for reference.

Warm regards,
Shree Abhi Electricals & Engineering Pvt. Ltd.
Chennai | bnsimhan@gmail.com | +91 98401 23456`;

  const mailto = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
};
