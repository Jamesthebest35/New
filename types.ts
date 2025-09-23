
export type View = 'dashboard' | 'scheduler' | 'issue-tracker' | 'resource-manager';

export interface ScheduleTask {
  id: string;
  taskName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  dependencies: string[];
}

export interface ScheduleRisk {
  taskName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface ScheduleAnalysis {
  optimizedSchedule: ScheduleTask[];
  riskAnalysis: ScheduleRisk[];
}

export interface IssueAnalysis {
    category: 'Safety' | 'Material' | 'Quality' | 'Equipment' | 'Documentation' | 'Other';
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    suggestedSteps: string[];
}

export interface Issue {
  id: number;
  description: string;
  image?: string;
  analysis?: IssueAnalysis;
}

export interface ResourceAllocation {
    resourceName: string;
    resourceType: 'Labor' | 'Equipment';
    assignedTask: string;
    shift: string;
}

export interface AllocationPlan {
    allocations: ResourceAllocation[];
    summary: string;
}
