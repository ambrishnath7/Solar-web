import React, { useState, useEffect } from 'react';
import type { Client, Engineer, MaintenanceReport } from '../types';
import { api } from '../services/api';
import { ToggleButton } from './ToggleButton';
import { SignaturePad } from './SignaturePad';
import {
  Sun,
  Zap,
  Cpu,
  ShieldCheck,
  Activity,
  Gauge,
  FileText,
  Save,
  CheckCircle,
  Share2,
  Download,
  AlertCircle,
  RefreshCw,
  Search,
  Building,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { downloadPDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';

interface MaintenanceFormProps {
  initialReport?: MaintenanceReport | null;
  onSubmitted?: (report: MaintenanceReport) => void;
  onCancelEdit?: () => void;
}

interface SectionNavButtonsProps {
  prevLabel?: string;
  nextLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

const SectionNavButtons: React.FC<SectionNavButtonsProps> = ({
  prevLabel = 'Previous Section',
  nextLabel = 'Next Section',
  onPrev,
  onNext,
}) => {
  return (
    <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between gap-3">
      {onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black border-2 border-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 active:text-white focus:bg-blue-600 focus:text-white focus:border-blue-600 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{prevLabel}</span>
        </button>
      ) : (
        <div />
      )}

      {onNext ? (
        <button
          type="button"
          onClick={onNext}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black border-2 border-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 active:text-white focus:bg-blue-600 focus:text-white focus:border-blue-600 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all duration-150 cursor-pointer active:scale-95 ml-auto"
        >
          <span>{nextLabel}</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  initialReport,
  onSubmitted,
  onCancelEdit,
}) => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>(
    localStorage.getItem('shreeabhi_last_engineer') || ''
  );
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form State
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportRef, setReportRef] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [prevMaintenanceDate, setPrevMaintenanceDate] = useState<string>('');
  const [noOfTechnicians, setNoOfTechnicians] = useState<number>(2);

  // Section 1: Modules
  const [modCleaning, setModCleaning] = useState<'YES' | 'NO'>('YES');
  const [modBroken, setModBroken] = useState<'YES' | 'NO'>('NO');
  const [modMountingStructure, setModMountingStructure] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [modNutBoltTightness, setModNutBoltTightness] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [modPhotosTaken, setModPhotosTaken] = useState<'YES' | 'NO'>('YES');
  const [modRemarks, setModRemarks] = useState<string>('');

  // Section 2: DC System
  const [dcCables, setDcCables] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [dcMc4Connectors, setDcMc4Connectors] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [dcJunctionBox, setDcJunctionBox] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [dcStringVoltage, setDcStringVoltage] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [dcCableInsulation, setDcCableInsulation] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [dcRemarks, setDcRemarks] = useState<string>('');

  // Section 3: Inverter
  const [invWorking, setInvWorking] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [invCoolingFans, setInvCoolingFans] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [invAcOutput, setInvAcOutput] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [invOtherIssues, setInvOtherIssues] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [invRemarks, setInvRemarks] = useState<string>('');

  // Section 4: AC System
  const [acCables, setAcCables] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [acDistributionBoard, setAcDistributionBoard] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [acMcbMccb, setAcMcbMccb] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [acRemarks, setAcRemarks] = useState<string>('');

  // Section 5: Earthing & Safety
  const [earthEquipment, setEarthEquipment] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [earthLightningArrester, setEarthLightningArrester] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [earthSpd, setEarthSpd] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [earthPit, setEarthPit] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [earthRemarks, setEarthRemarks] = useState<string>('');

  // Section 6: Generation
  const [genTotalThisMonth, setGenTotalThisMonth] = useState<string>('');
  const [genAvgDaily, setGenAvgDaily] = useState<string>('');
  const [genExpected, setGenExpected] = useState<string>('');
  const [genPerformance, setGenPerformance] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [genRemarks, setGenRemarks] = useState<string>('');

  // Section 7: Net Meter
  const [meterImportUnits, setMeterImportUnits] = useState<string>('');
  const [meterExportUnits, setMeterExportUnits] = useState<string>('');
  const [meterCondition, setMeterCondition] = useState<'GOOD' | 'DEFECT'>('GOOD');
  const [meterRemarks, setMeterRemarks] = useState<string>('');

  // Section 8: Observations
  const [observations, setObservations] = useState<string>('');
  const [actionRequired, setActionRequired] = useState<string>('');
  const [nextVisitDate, setNextVisitDate] = useState<string>('');

  // Signatures
  const [sigEngineer, setSigEngineer] = useState<string>('');
  const [sigClient, setSigClient] = useState<string>('');

  // UI state
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Info, 1..8 = Sections, 9 = Signatures
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submittedReport, setSubmittedReport] = useState<MaintenanceReport | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');

  const handleNav = (targetTab: number) => {
    setActiveTab(targetTab);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Calculate default next visit date (visitDate + 90 days)
  useEffect(() => {
    if (visitDate && !nextVisitDate) {
      const v = new Date(visitDate);
      v.setDate(v.getDate() + 90);
      setNextVisitDate(v.toISOString().split('T')[0]);
    }
  }, [visitDate]);

  // Load Engineers and Clients
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [engs, cls] = await Promise.all([
          api.getEngineers(true),
          api.getClients(true),
        ]);
        setEngineers(engs);
        setClients(cls);

        if (!selectedEngineerId && engs.length > 0) {
          setSelectedEngineerId(engs[0].id);
        }
      } catch (err) {
        console.error('Error loading engineers or clients', err);
      }
    };
    loadInitialData();
  }, []);

  // Hydrate form if editing an existing report
  useEffect(() => {
    if (initialReport) {
      setReportId(initialReport.id);
      setReportRef(initialReport.reportRef);
      setSelectedClientId(initialReport.clientId);
      setSelectedEngineerId(initialReport.engineerId);
      setVisitDate(initialReport.visitDate.split('T')[0]);
      if (initialReport.prevMaintenanceDate) {
        setPrevMaintenanceDate(initialReport.prevMaintenanceDate.split('T')[0]);
      }
      setNoOfTechnicians(initialReport.noOfTechnicians || 2);

      // Section 1
      setModCleaning(initialReport.modCleaning || 'YES');
      setModBroken(initialReport.modBroken || 'NO');
      setModMountingStructure(initialReport.modMountingStructure || 'GOOD');
      setModNutBoltTightness(initialReport.modNutBoltTightness || 'GOOD');
      setModPhotosTaken(initialReport.modPhotosTaken || 'YES');
      setModRemarks(initialReport.modRemarks || '');

      // Section 2
      setDcCables(initialReport.dcCables || 'GOOD');
      setDcMc4Connectors(initialReport.dcMc4Connectors || 'GOOD');
      setDcJunctionBox(initialReport.dcJunctionBox || 'GOOD');
      setDcStringVoltage(initialReport.dcStringVoltage || 'GOOD');
      setDcCableInsulation(initialReport.dcCableInsulation || 'GOOD');
      setDcRemarks(initialReport.dcRemarks || '');

      // Section 3
      setInvWorking(initialReport.invWorking || 'GOOD');
      setInvCoolingFans(initialReport.invCoolingFans || 'GOOD');
      setInvAcOutput(initialReport.invAcOutput || 'GOOD');
      setInvOtherIssues(initialReport.invOtherIssues || 'GOOD');
      setInvRemarks(initialReport.invRemarks || '');

      // Section 4
      setAcCables(initialReport.acCables || 'GOOD');
      setAcDistributionBoard(initialReport.acDistributionBoard || 'GOOD');
      setAcMcbMccb(initialReport.acMcbMccb || 'GOOD');
      setAcRemarks(initialReport.acRemarks || '');

      // Section 5
      setEarthEquipment(initialReport.earthEquipment || 'GOOD');
      setEarthLightningArrester(initialReport.earthLightningArrester || 'GOOD');
      setEarthSpd(initialReport.earthSpd || 'GOOD');
      setEarthPit(initialReport.earthPit || 'GOOD');
      setEarthRemarks(initialReport.earthRemarks || '');

      // Section 6
      setGenTotalThisMonth(initialReport.genTotalThisMonth?.toString() || '');
      setGenAvgDaily(initialReport.genAvgDaily?.toString() || '');
      setGenExpected(initialReport.genExpected?.toString() || '');
      setGenPerformance(initialReport.genPerformance || 'GOOD');
      setGenRemarks(initialReport.genRemarks || '');

      // Section 7
      setMeterImportUnits(initialReport.meterImportUnits?.toString() || '');
      setMeterExportUnits(initialReport.meterExportUnits?.toString() || '');
      setMeterCondition(initialReport.meterCondition || 'GOOD');
      setMeterRemarks(initialReport.meterRemarks || '');

      // Section 8
      setObservations(initialReport.observations || '');
      setActionRequired(initialReport.actionRequired || '');
      if (initialReport.nextVisitDate) {
        setNextVisitDate(initialReport.nextVisitDate.split('T')[0]);
      }

      // Signatures
      setSigEngineer(initialReport.sigEngineer || '');
      setSigClient(initialReport.sigClient || '');

      if (initialReport.client) {
        setSelectedClient(initialReport.client);
      }
    }
  }, [initialReport]);

  // Handle Client Selection & Auto-fill
  const handleClientSelect = async (clientId: string) => {
    setSelectedClientId(clientId);
    const found = clients.find((c) => c.id === clientId) || null;
    setSelectedClient(found);

    if (clientId) {
      try {
        const latest = await api.getLatestClientReport(clientId);
        if (latest.prevVisitDate) {
          setPrevMaintenanceDate(latest.prevVisitDate.split('T')[0]);
        } else {
          setPrevMaintenanceDate('');
        }
      } catch (err) {
        console.error('Failed to get client latest report', err);
      }
    }
  };

  const handleEngineerChange = (engId: string) => {
    setSelectedEngineerId(engId);
    localStorage.setItem('shreeabhi_last_engineer', engId);
  };

  // Build Payload
  const buildPayload = (status: 'draft' | 'submitted'): Partial<MaintenanceReport> => {
    return {
      id: reportId || undefined,
      clientId: selectedClientId,
      engineerId: selectedEngineerId,
      visitDate,
      prevMaintenanceDate: prevMaintenanceDate || undefined,
      noOfTechnicians,
      status,

      modCleaning,
      modBroken,
      modMountingStructure,
      modNutBoltTightness,
      modPhotosTaken,
      modRemarks,

      dcCables,
      dcMc4Connectors,
      dcJunctionBox,
      dcStringVoltage,
      dcCableInsulation,
      dcRemarks,

      invWorking,
      invCoolingFans,
      invAcOutput,
      invOtherIssues,
      invRemarks,

      acCables,
      acDistributionBoard,
      acMcbMccb,
      acRemarks,

      earthEquipment,
      earthLightningArrester,
      earthSpd,
      earthPit,
      earthRemarks,

      genTotalThisMonth: genTotalThisMonth ? parseFloat(genTotalThisMonth) : undefined,
      genAvgDaily: genAvgDaily ? parseFloat(genAvgDaily) : undefined,
      genExpected: genExpected ? parseFloat(genExpected) : undefined,
      genPerformance,
      genRemarks,

      meterImportUnits: meterImportUnits ? parseFloat(meterImportUnits) : undefined,
      meterExportUnits: meterExportUnits ? parseFloat(meterExportUnits) : undefined,
      meterCondition,
      meterRemarks,

      observations,
      actionRequired,
      nextVisitDate: nextVisitDate || undefined,

      sigEngineer,
      sigClient,
    };
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!selectedClientId) {
      setStatusMessage({ text: 'Please select a Client before saving draft.', type: 'error' });
      setActiveTab(0);
      return;
    }
    if (!selectedEngineerId) {
      setStatusMessage({ text: 'Please select an Engineer before saving draft.', type: 'error' });
      setActiveTab(0);
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    try {
      const payload = buildPayload('draft');
      const saved = await api.saveDraft(payload);
      setReportId(saved.id);
      setReportRef(saved.reportRef);
      setStatusMessage({
        text: `Draft saved successfully! Reference: ${saved.reportRef}`,
        type: 'success',
      });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to save draft.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Submit Final
  const handleSubmitFinal = async () => {
    if (!selectedClientId) {
      setStatusMessage({ text: 'Please select a Client.', type: 'error' });
      setActiveTab(0);
      return;
    }
    if (!selectedEngineerId) {
      setStatusMessage({ text: 'Please select an Engineer.', type: 'error' });
      setActiveTab(0);
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    try {
      const payload = buildPayload('submitted');
      const finalized = await api.submitFinal(payload);
      setReportId(finalized.id);
      setReportRef(finalized.reportRef);
      setSubmittedReport(finalized);
      setStatusMessage({
        text: `Report finalized and submitted! Ref: ${finalized.reportRef}`,
        type: 'success',
      });
      if (onSubmitted) {
        onSubmitted(finalized);
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to submit report.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.clientName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    c.siteName.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const sectionsList = [
    { title: 'Site Info & Team', icon: Building },
    { title: '1. Modules', icon: Sun },
    { title: '2. DC System', icon: Zap },
    { title: '3. Inverter', icon: Cpu },
    { title: '4. AC System', icon: Activity },
    { title: '5. Earthing', icon: ShieldCheck },
    { title: '6. Generation', icon: Gauge },
    { title: '7. Net Meter', icon: Gauge },
    { title: '8. Observations', icon: FileText },
    { title: 'Signatures', icon: UserCheck },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto pb-28">
      {/* Top Banner / Progress Indicator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                PMC Form
              </span>
              {reportRef && (
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {reportRef}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              Preventive Maintenance Checklist
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Back to Dashboard
              </button>
            )}
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Progress</span>
              <p className="text-xs font-bold text-amber-600">
                {activeTab === 0 ? 'Site Setup' : activeTab === 9 ? 'Final Signatures' : `Section ${activeTab} of 8`}
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs (Horizontally scrollable for mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {sectionsList.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleNav(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border-2 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-black border-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.title}
              </button>
            );
          })}
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main Card Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
        {/* ========================================================= */}
        {/* TAB 0: Setup, Engineer & Client Selection */}
        {/* ========================================================= */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Engineer &amp; Site Details
            </h2>

            {/* Engineer Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Field Engineer (Quick Login) *
              </label>
              <select
                value={selectedEngineerId}
                onChange={(e) => handleEngineerChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                <option value="">-- Select Named Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Client Search and Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Registered Client / Site *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter client or site name..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 mb-1"
                />
              </div>

              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                <option value="">-- Choose Client --</option>
                {filteredClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientName} — {c.siteName} ({c.plantCapacityKw} kW)
                  </option>
                ))}
              </select>
            </div>

            {/* Pre-filled Client Specs Card */}
            {selectedClient && (
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Auto-Loaded Site Specs
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedClient.amcStatus === 'FREE_YEAR1'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedClient.amcStatus === 'FREE_YEAR1' ? 'Free Year 1' : 'Active AMC'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-500">Address:</span>
                    <p className="font-medium text-slate-900">{selectedClient.siteAddress}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Plant Capacity:</span>
                    <p className="font-bold text-amber-600 text-sm">{selectedClient.plantCapacityKw} kW</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Modules:</span>
                    <p className="font-medium text-slate-900">
                      {selectedClient.modulesMake} {selectedClient.modulesWp}Wp ({selectedClient.totalModules} Panels)
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Inverter:</span>
                    <p className="font-medium text-slate-900">
                      {selectedClient.inverterMake} {selectedClient.inverterCapacity} ({selectedClient.totalInverters} Units)
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Client Contact:</span>
                    <p className="font-medium text-slate-900">
                      {selectedClient.contactName} ({selectedClient.contactPhone})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Visit Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Visit Date *
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Previous Visit Date
                </label>
                <input
                  type="date"
                  value={prevMaintenanceDate}
                  onChange={(e) => setPrevMaintenanceDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  No. of Technicians
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={noOfTechnicians}
                  onChange={(e) => setNoOfTechnicians(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              nextLabel="Move to 1. Modules"
              onNext={() => handleNav(1)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: Solar Module Inspection */}
        {/* ========================================================= */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Section 1: Solar Module Inspection
            </h2>

            <div className="space-y-4">
              <ToggleButton
                label="1. Solar module cleaning done?"
                type="YES_NO"
                value={modCleaning}
                onChange={setModCleaning}
              />

              <ToggleButton
                label="2. Any broken modules detected?"
                type="YES_NO"
                value={modBroken}
                onChange={setModBroken}
              />

              <ToggleButton
                label="3. Module mounting structure condition"
                type="GOOD_DEFECT"
                value={modMountingStructure}
                onChange={setModMountingStructure}
              />

              <ToggleButton
                label="4. Module nut & bolt tightness"
                type="GOOD_DEFECT"
                value={modNutBoltTightness}
                onChange={setModNutBoltTightness}
              />

              <ToggleButton
                label="5. Photos taken (before & after cleaning)?"
                type="YES_NO"
                value={modPhotosTaken}
                onChange={setModPhotosTaken}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Section 1 Remarks (Free text)
                </label>
                <textarea
                  rows={2}
                  value={modRemarks}
                  onChange={(e) => setModRemarks(e.target.value)}
                  placeholder="Notes on panel soiling, bird droppings, hotspot checks..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (Site Info)"
              nextLabel="Next (2. DC System)"
              onPrev={() => handleNav(0)}
              onNext={() => handleNav(2)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DC System Inspection */}
        {/* ========================================================= */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Section 2: DC System Inspection
            </h2>

            <div className="space-y-4">
              <ToggleButton
                label="1. DC cables condition (UV degradation / loose)"
                type="GOOD_DEFECT"
                value={dcCables}
                onChange={setDcCables}
              />

              <ToggleButton
                label="2. MC4 connectors condition (crimp / seal)"
                type="GOOD_DEFECT"
                value={dcMc4Connectors}
                onChange={setDcMc4Connectors}
              />

              <ToggleButton
                label="3. DC junction box / AJB condition"
                type="GOOD_DEFECT"
                value={dcJunctionBox}
                onChange={setDcJunctionBox}
              />

              <ToggleButton
                label="4. String voltage measurement check"
                type="GOOD_DEFECT"
                value={dcStringVoltage}
                onChange={setDcStringVoltage}
              />

              <ToggleButton
                label="5. Cable insulation condition"
                type="GOOD_DEFECT"
                value={dcCableInsulation}
                onChange={setDcCableInsulation}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Section 2 Remarks (Free text)
                </label>
                <textarea
                  rows={2}
                  value={dcRemarks}
                  onChange={(e) => setDcRemarks(e.target.value)}
                  placeholder="String voltages (e.g., 680V, 690V), conduit clipping notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (1. Modules)"
              nextLabel="Next (3. Inverter)"
              onPrev={() => handleNav(1)}
              onNext={() => handleNav(3)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: Inverter Inspection */}
        {/* ========================================================= */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              Section 3: Inverter Inspection
            </h2>

            <div className="space-y-4">
              <ToggleButton
                label="1. Inverter working condition"
                type="GOOD_DEFECT"
                value={invWorking}
                onChange={setInvWorking}
              />

              <ToggleButton
                label="2. Cooling fans working condition"
                type="GOOD_DEFECT"
                value={invCoolingFans}
                onChange={setInvCoolingFans}
              />

              <ToggleButton
                label="3. Inverter AC output voltage"
                type="GOOD_DEFECT"
                value={invAcOutput}
                onChange={setInvAcOutput}
              />

              <ToggleButton
                label="4. Other issues / fault codes"
                type="GOOD_DEFECT"
                value={invOtherIssues}
                onChange={setInvOtherIssues}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Section 3 Remarks (Free text)
                </label>
                <textarea
                  rows={2}
                  value={invRemarks}
                  onChange={(e) => setInvRemarks(e.target.value)}
                  placeholder="Inverter firmware / heat sink cleaning / fault code log..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (2. DC System)"
              nextLabel="Next (4. AC System)"
              onPrev={() => handleNav(2)}
              onNext={() => handleNav(4)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AC System Inspection */}
        {/* ========================================================= */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Section 4: AC System Inspection
            </h2>

            <div className="space-y-4">
              <ToggleButton
                label="1. AC cables / loose electrical connections"
                type="GOOD_DEFECT"
                value={acCables}
                onChange={setAcCables}
              />

              <ToggleButton
                label="2. AC distribution board (ACDB) condition"
                type="GOOD_DEFECT"
                value={acDistributionBoard}
                onChange={setAcDistributionBoard}
              />

              <ToggleButton
                label="3. MCB / MCCB condition"
                type="GOOD_DEFECT"
                value={acMcbMccb}
                onChange={setAcMcbMccb}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Section 4 Remarks (Free text)
                </label>
                <textarea
                  rows={2}
                  value={acRemarks}
                  onChange={(e) => setAcRemarks(e.target.value)}
                  placeholder="Terminal torque, AC cable gland sealing, breaker test..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (3. Inverter)"
              nextLabel="Next (5. Earthing)"
              onPrev={() => handleNav(3)}
              onNext={() => handleNav(5)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: Earthing & Safety Check */}
        {/* ========================================================= */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Section 5: Earthing &amp; Safety Check
            </h2>

            <div className="space-y-4">
              <ToggleButton
                label="1. Equipment earthing condition"
                type="GOOD_DEFECT"
                value={earthEquipment}
                onChange={setEarthEquipment}
              />

              <ToggleButton
                label="2. Lightning arrester (LA) condition"
                type="GOOD_DEFECT"
                value={earthLightningArrester}
                onChange={setEarthLightningArrester}
              />

              <ToggleButton
                label="3. Surge Protection Device (SPD)"
                type="GOOD_DEFECT"
                value={earthSpd}
                onChange={setEarthSpd}
              />

              <ToggleButton
                label="4. Earthing pit condition & resistance"
                type="GOOD_DEFECT"
                value={earthPit}
                onChange={setEarthPit}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Section 5 Remarks (Free text)
                </label>
                <textarea
                  rows={2}
                  value={earthRemarks}
                  onChange={(e) => setEarthRemarks(e.target.value)}
                  placeholder="Earth resistance in Ohms, water watering in pit, copper strip status..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (4. AC System)"
              nextLabel="Next (6. Generation)"
              onPrev={() => handleNav(4)}
              onNext={() => handleNav(6)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: Generation Performance */}
        {/* ========================================================= */}
        {activeTab === 6 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-500" />
              Section 6: Generation Performance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Generation this Month (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 6250"
                  value={genTotalThisMonth}
                  onChange={(e) => setGenTotalThisMonth(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Average Daily Generation (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 208"
                  value={genAvgDaily}
                  onChange={(e) => setGenAvgDaily(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Generation (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 6000"
                  value={genExpected}
                  onChange={(e) => setGenExpected(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            <ToggleButton
              label="Performance Status"
              type="GOOD_DEFECT"
              value={genPerformance}
              onChange={setGenPerformance}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Remarks / Reasons if any
              </label>
              <textarea
                rows={2}
                value={genRemarks}
                onChange={(e) => setGenRemarks(e.target.value)}
                placeholder="Cloudy weather, grid outage duration, shading factors..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <SectionNavButtons
              prevLabel="Previous (5. Earthing)"
              nextLabel="Next (7. Net Meter)"
              onPrev={() => handleNav(5)}
              onNext={() => handleNav(7)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: Net Meter / EB Check */}
        {/* ========================================================= */}
        {activeTab === 7 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-500" />
              Section 7: Net Meter / EB Check
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Import Units (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1420"
                  value={meterImportUnits}
                  onChange={(e) => setMeterImportUnits(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Export Units (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5890"
                  value={meterExportUnits}
                  onChange={(e) => setMeterExportUnits(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            <ToggleButton
              label="Net Meter Condition"
              type="GOOD_DEFECT"
              value={meterCondition}
              onChange={setMeterCondition}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Net Meter Remarks
              </label>
              <textarea
                rows={2}
                value={meterRemarks}
                onChange={(e) => setMeterRemarks(e.target.value)}
                placeholder="Meter display status, CT/PT connection check..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <SectionNavButtons
              prevLabel="Previous (6. Generation)"
              nextLabel="Next (8. Observations)"
              onPrev={() => handleNav(6)}
              onNext={() => handleNav(8)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: Observations / Issues Found */}
        {/* ========================================================= */}
        {activeTab === 8 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Section 8: Observations / Issues Found
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                General Observations
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Overall plant condition, shadow observations, rooftop safety walkway..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Action Required
              </label>
              <textarea
                rows={3}
                value={actionRequired}
                onChange={(e) => setActionRequired(e.target.value)}
                placeholder="Any spare parts required, cable re-routing, warranty replacement claim..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Next Scheduled Maintenance Visit Date (Auto = Visit + 90 Days)
              </label>
              <input
                type="date"
                value={nextVisitDate}
                onChange={(e) => setNextVisitDate(e.target.value)}
                className="w-full sm:w-64 p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                System will schedule an automatic reminder 7 days before this date.
              </p>
            </div>

            <SectionNavButtons
              prevLabel="Previous (7. Net Meter)"
              nextLabel="Next (Signatures)"
              onPrev={() => handleNav(7)}
              onNext={() => handleNav(9)}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: Touchscreen Signatures */}
        {/* ========================================================= */}
        {activeTab === 9 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              Final Signatures
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SignaturePad
                label="Supervisor / Technician Signature"
                value={sigEngineer}
                onChange={setSigEngineer}
              />

              <SignaturePad
                label="Client Representative Signature"
                value={sigClient}
                onChange={setSigClient}
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs text-emerald-900">
                <p className="font-bold">Ready to finalize PMC Report?</p>
                <p className="mt-0.5 text-emerald-800">
                  Clicking <strong>Submit Final</strong> will lock this report, create the alert reminder for the next quarterly visit, and allow instantaneous PDF generation and WhatsApp/Email sharing with the client.
                </p>
              </div>
            </div>

            <SectionNavButtons
              prevLabel="Previous (8. Observations)"
              onPrev={() => handleNav(8)}
            />
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* Sticky Bottom Action Bar for Mobile & Field Operation */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Previous / Next Tab Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => handleNav(Math.max(0, activeTab - 1))}
              className="px-3 py-2 rounded-xl border-2 border-slate-300 bg-white text-black font-black text-xs sm:text-sm flex items-center gap-1 shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 active:text-white"
              title="Previous Section"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              disabled={activeTab === sectionsList.length - 1}
              onClick={() => handleNav(Math.min(sectionsList.length - 1, activeTab + 1))}
              className="px-3 py-2 rounded-xl border-2 border-slate-300 bg-white text-black font-black text-xs sm:text-sm flex items-center gap-1 shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 active:text-white"
              title="Next Section"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-slate-700 hidden sm:inline ml-1">
              Tab {activeTab + 1}/{sectionsList.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleSaveDraft}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-600" />
              Save Draft
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitFinal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm active:scale-95"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Submit Final
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Submission Success Dialog (One-tap PDF, WhatsApp, Email) */}
      {/* ========================================================= */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                Submission Successful
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Report {submittedReport.reportRef}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Maintenance report has been recorded and locked. Next maintenance alert scheduled for {submittedReport.nextVisitDate ? new Date(submittedReport.nextVisitDate).toLocaleDateString('en-IN') : 'in 90 days'}.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => downloadPDF(submittedReport)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>

              <button
                type="button"
                onClick={() => shareViaWhatsApp(submittedReport)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share PDF via WhatsApp
              </button>

              <button
                type="button"
                onClick={() => shareViaEmail(submittedReport)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                Share via Email
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedReport(null);
                setReportId(null);
                setReportRef('');
                setActiveTab(0);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer pt-2 inline-block"
            >
              Start New PMC Visit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
