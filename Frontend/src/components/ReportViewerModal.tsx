import React from 'react';
import type { MaintenanceReport } from '../types';
import { X, Download, Share2, Mail, CheckCircle2, AlertTriangle, Calendar, Zap } from 'lucide-react';
import { downloadPDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';

interface ReportViewerModalProps {
  report: MaintenanceReport | null;
  onClose: () => void;
  onEdit?: (report: MaintenanceReport) => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  onClose,
  onEdit,
}) => {
  if (!report) return null;

  const client = report.client;
  const engineer = report.engineer;

  const renderBadge = (val: string) => {
    const isGood = val === 'GOOD' || val === 'YES';
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
          isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}
      >
        {isGood ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
        {val}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">{report.reportRef}</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    report.status === 'submitted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {client?.clientName} • {new Date(report.visitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-medium text-slate-600">
            Inspector: <span className="font-bold text-slate-900">{engineer?.name || 'Assigned'}</span> ({report.noOfTechnicians} Techs)
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(report);
                  onClose();
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Edit Report
              </button>
            )}
            <button
              onClick={() => downloadPDF(report)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={() => shareViaWhatsApp(report)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={() => shareViaEmail(report)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
          </div>
        </div>

        {/* Scrollable Inspection Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-800">
          {/* Site & System Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Site Information</p>
              <p className="font-bold text-slate-900 mt-0.5">{client?.siteName}</p>
              <p className="text-xs text-slate-600">{client?.siteAddress}</p>
              <p className="text-xs text-slate-600 mt-1">
                Contact: <span className="font-medium">{client?.contactName}</span> ({client?.contactPhone})
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Specifications</p>
              <p className="font-bold text-amber-600 mt-0.5">{client?.plantCapacityKw} kW Rooftop Solar</p>
              <p className="text-xs text-slate-600">
                Panels: {client?.modulesMake} {client?.modulesWp}Wp ({client?.totalModules} Modules)
              </p>
              <p className="text-xs text-slate-600">
                Inverters: {client?.inverterMake} {client?.inverterCapacity} ({client?.totalInverters} Units)
              </p>
              <p className="text-xs text-slate-600 mt-1">
                AMC Category: <span className="font-bold">{client?.amcStatus === 'FREE_YEAR1' ? 'Free 1st Year' : 'Paid AMC'}</span>
              </p>
            </div>
          </div>

          {/* Section 1: Modules */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
              Section 1: Solar Module Inspection
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Solar module cleaning</span>
                {renderBadge(report.modCleaning)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Broken modules</span>
                {renderBadge(report.modBroken)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Mounting structure condition</span>
                {renderBadge(report.modMountingStructure)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Nut & bolt tightness</span>
                {renderBadge(report.modNutBoltTightness)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Photos taken (before/after)</span>
                {renderBadge(report.modPhotosTaken)}
              </div>
              {report.modRemarks && (
                <div className="px-4 py-2 bg-amber-50/50 text-xs text-amber-900">
                  <span className="font-bold">Remarks:</span> {report.modRemarks}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: DC System */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
              Section 2: DC System Inspection
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>DC cables condition</span>
                {renderBadge(report.dcCables)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>MC4 connectors condition</span>
                {renderBadge(report.dcMc4Connectors)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>DC junction box condition</span>
                {renderBadge(report.dcJunctionBox)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>String voltage measurement</span>
                {renderBadge(report.dcStringVoltage)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Cable insulation condition</span>
                {renderBadge(report.dcCableInsulation)}
              </div>
              {report.dcRemarks && (
                <div className="px-4 py-2 bg-amber-50/50 text-xs text-amber-900">
                  <span className="font-bold">Remarks:</span> {report.dcRemarks}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Inverter */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
              Section 3: Inverter Inspection
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Inverter working condition</span>
                {renderBadge(report.invWorking)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Cooling fans working</span>
                {renderBadge(report.invCoolingFans)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Inverter AC output voltage</span>
                {renderBadge(report.invAcOutput)}
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span>Other inverter issues</span>
                {renderBadge(report.invOtherIssues)}
              </div>
              {report.invRemarks && (
                <div className="px-4 py-2 bg-amber-50/50 text-xs text-amber-900">
                  <span className="font-bold">Remarks:</span> {report.invRemarks}
                </div>
              )}
            </div>
          </div>

          {/* Section 4 & 5: AC System & Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
                Section 4: AC System
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>AC cables / loose connections</span>
                  {renderBadge(report.acCables)}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>AC distribution board (ACDB)</span>
                  {renderBadge(report.acDistributionBoard)}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>MCB / MCCB condition</span>
                  {renderBadge(report.acMcbMccb)}
                </div>
                {report.acRemarks && (
                  <div className="px-4 py-2 bg-amber-50/50 text-xs text-amber-900">
                    <span className="font-bold">Remarks:</span> {report.acRemarks}
                  </div>
                )}
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
                Section 5: Earthing & Safety
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>Equipment earthing</span>
                  {renderBadge(report.earthEquipment)}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>Lightning arrester</span>
                  {renderBadge(report.earthLightningArrester)}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>Surge Protection (SPD)</span>
                  {renderBadge(report.earthSpd)}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span>Earthing pit condition</span>
                  {renderBadge(report.earthPit)}
                </div>
                {report.earthRemarks && (
                  <div className="px-4 py-2 bg-amber-50/50 text-xs text-amber-900">
                    <span className="font-bold">Remarks:</span> {report.earthRemarks}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 6 & 7: Generation & Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Section 6: Generation Numbers</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Generation this Month:</span>
                  <span className="font-bold text-slate-900">{report.genTotalThisMonth ?? '-'} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Daily Generation:</span>
                  <span className="font-bold text-slate-900">{report.genAvgDaily ?? '-'} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Expected Generation:</span>
                  <span className="font-bold text-slate-900">{report.genExpected ?? '-'} kWh</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Performance Status:</span>
                  {renderBadge(report.genPerformance)}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Section 7: Net Meter / EB</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">EB Import Units:</span>
                  <span className="font-bold text-slate-900">{report.meterImportUnits ?? '-'} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EB Export Units:</span>
                  <span className="font-bold text-slate-900">{report.meterExportUnits ?? '-'} kWh</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Net Meter Condition:</span>
                  {renderBadge(report.meterCondition)}
                </div>
                {report.meterRemarks && (
                  <p className="text-xs text-slate-500 pt-1">
                    <span className="font-semibold">Note:</span> {report.meterRemarks}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 8: Observations */}
          <div className="border border-slate-200 rounded-xl p-4 bg-amber-50/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Section 8: Observations & Follow-up</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700">General Observations:</span>
                <p className="text-slate-600 mt-0.5">{report.observations || 'None specified'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700">Action Required:</span>
                <p className="text-slate-600 mt-0.5">{report.actionRequired || 'Routine preventive maintenance complete'}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-slate-600">Next Scheduled Visit:</span>
                <span className="font-bold text-slate-900">
                  {report.nextVisitDate ? new Date(report.nextVisitDate).toLocaleDateString('en-IN') : 'In 90 Days'}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-slate-200 rounded-xl p-3 bg-white text-center">
              <p className="text-xs font-bold text-slate-700 mb-1">Supervisor / Technician Signature</p>
              {report.sigEngineer && report.sigEngineer.startsWith('data:image') ? (
                <img src={report.sigEngineer} alt="Engineer Signature" className="h-16 mx-auto object-contain" />
              ) : (
                <div className="h-16 flex items-center justify-center text-xs text-slate-400 italic">
                  Digital confirmation on file
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">{engineer?.name}</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white text-center">
              <p className="text-xs font-bold text-slate-700 mb-1">Client Representative Signature</p>
              {report.sigClient && report.sigClient.startsWith('data:image') ? (
                <img src={report.sigClient} alt="Client Signature" className="h-16 mx-auto object-contain" />
              ) : (
                <div className="h-16 flex items-center justify-center text-xs text-slate-400 italic">
                  Representative acknowledged
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">{client?.contactName}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Shree Abhi Electricals &amp; Engineering Pvt. Ltd.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
