export interface Client {
  id: string;
  clientName: string;
  siteName: string;
  siteAddress: string;
  plantCapacityKw: number;
  modulesMake: string;
  modulesWp: number;
  totalModules: number;
  inverterMake: string;
  inverterCapacity: string;
  totalInverters: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  installationDate?: string;
  amcStatus: 'FREE_YEAR1' | 'AMC' | string;
  amcStartDate?: string;
  amcEndDate?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Engineer {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface MaintenanceReport {
  id: string;
  reportRef: string;
  clientId: string;
  client?: Client;
  engineerId: string;
  engineer?: Engineer;
  visitDate: string;
  prevMaintenanceDate?: string;
  noOfTechnicians: number;
  status: 'draft' | 'submitted';

  // Section 1: Solar Modules
  modCleaning: 'YES' | 'NO';
  modBroken: 'YES' | 'NO';
  modMountingStructure: 'GOOD' | 'DEFECT';
  modNutBoltTightness: 'GOOD' | 'DEFECT';
  modPhotosTaken: 'YES' | 'NO';
  modRemarks?: string;

  // Section 2: DC System
  dcCables: 'GOOD' | 'DEFECT';
  dcMc4Connectors: 'GOOD' | 'DEFECT';
  dcJunctionBox: 'GOOD' | 'DEFECT';
  dcStringVoltage: 'GOOD' | 'DEFECT';
  dcCableInsulation: 'GOOD' | 'DEFECT';
  dcRemarks?: string;

  // Section 3: Inverter
  invWorking: 'GOOD' | 'DEFECT';
  invCoolingFans: 'GOOD' | 'DEFECT';
  invAcOutput: 'GOOD' | 'DEFECT';
  invOtherIssues: 'GOOD' | 'DEFECT';
  invRemarks?: string;

  // Section 4: AC System
  acCables: 'GOOD' | 'DEFECT';
  acDistributionBoard: 'GOOD' | 'DEFECT';
  acMcbMccb: 'GOOD' | 'DEFECT';
  acRemarks?: string;

  // Section 5: Earthing & Safety
  earthEquipment: 'GOOD' | 'DEFECT';
  earthLightningArrester: 'GOOD' | 'DEFECT';
  earthSpd: 'GOOD' | 'DEFECT';
  earthPit: 'GOOD' | 'DEFECT';
  earthRemarks?: string;

  // Section 6: Generation
  genTotalThisMonth?: number;
  genAvgDaily?: number;
  genExpected?: number;
  genPerformance: 'GOOD' | 'DEFECT';
  genRemarks?: string;

  // Section 7: Net Meter
  meterImportUnits?: number;
  meterExportUnits?: number;
  meterCondition: 'GOOD' | 'DEFECT';
  meterRemarks?: string;

  // Section 8: Observations
  observations?: string;
  actionRequired?: string;
  nextVisitDate?: string;

  // Signatures
  sigEngineer?: string;
  sigClient?: string;
  submittedAt?: string;
  createdAt?: string;
}

export interface Alert {
  id: string;
  clientId: string;
  client?: Client;
  reportId?: string;
  report?: MaintenanceReport;
  dueDate: string;
  alertSentAt?: string;
  alertType: 'email' | 'whatsapp';
  status: 'pending' | 'sent' | 'acknowledged';
  createdAt: string;
}

export interface DashboardStats {
  totalVisitsThisMonth: number;
  defectsFoundThisMonth: number;
  pendingDrafts: number;
  upcomingVisitsNext30Days: number;
  freeYear1ClientsCount: number;
  amcClientsCount: number;
}
