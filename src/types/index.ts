// Tipos principais do sistema

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export type LeadStatus = 'novo' | 'contato' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido';

export type LeadSource = 'website' | 'indicacao' | 'telefone' | 'email' | 'evento' | 'midia-social' | 'outro';

export interface Interaction {
  id: string;
  leadId: string;
  type: 'email' | 'telefone' | 'reuniao' | 'nota' | 'whatsapp' | 'outro';
  description: string;
  date: Date;
  userId: string;
  userName: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  source: LeadSource;
  value?: number;
  observations?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  interactions: Interaction[];
  assignedTo?: string;
  createdBy: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus[];
  source?: LeadSource[];
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'interactions' | 'createdBy'>) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addInteraction: (leadId: string, interaction: Omit<Interaction, 'id' | 'leadId'>) => Promise<void>;
  getLead: (id: string) => Lead | undefined;
  filteredLeads: Lead[];
  filters: LeadFilters;
  setFilters: (filters: LeadFilters) => void;
  importLeads: (file: File) => Promise<void>;
  exportLeads: () => void;
}
