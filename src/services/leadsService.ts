import { supabase } from '../lib/supabase';
import { Lead, LeadStatus, LeadSource } from '../types';

export interface LeadResponse {
  lead: Lead | null;
  error: string | null;
}

export interface LeadsResponse {
  leads: Lead[];
  error: string | null;
}

/**
 * Converte dados do banco para o tipo Lead
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDatabaseToLead(data: any): Lead {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company || undefined,
    position: data.position || undefined,
    status: data.status as LeadStatus,
    source: data.source as LeadSource,
    value: data.value || undefined,
    observations: data.observations || undefined,
    tags: data.tags || [],
    assignedTo: data.assigned_to || undefined,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    interactions: data.interactions || [],
  };
}

/**
 * Busca todos os leads
 */
export async function getLeads(): Promise<LeadsResponse> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        interactions (
          id,
          type,
          description,
          created_at,
          user:user_id (
            id,
            name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return { leads: [], error: error.message };
    }

    const leads = (data || []).map(mapDatabaseToLead);
    return { leads, error: null };
  } catch {
    return { leads: [], error: 'Erro ao buscar leads' };
  }
}

/**
 * Busca um lead específico por ID
 */
export async function getLeadById(id: string): Promise<LeadResponse> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        interactions (
          id,
          type,
          description,
          created_at,
          user:user_id (
            id,
            name,
            email
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      return { lead: null, error: error.message };
    }

    if (!data) {
      return { lead: null, error: 'Lead não encontrado' };
    }

    const lead = mapDatabaseToLead(data);
    return { lead, error: null };
  } catch {
    return { lead: null, error: 'Erro ao buscar lead' };
  }
}

/**
 * Cria um novo lead
 */
export async function createLead(
  lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>
): Promise<LeadResponse> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company || null,
          position: lead.position || null,
          status: lead.status,
          source: lead.source,
          value: lead.value || null,
          observations: lead.observations || null,
          tags: lead.tags || [],
          assigned_to: lead.assignedTo || null,
          created_by: lead.createdBy,
        },
      ])
      .select(`
        *,
        interactions (
          id,
          type,
          description,
          created_at,
          user:user_id (
            id,
            name,
            email
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return { lead: null, error: error.message };
    }

    if (!data) {
      return { lead: null, error: 'Erro ao criar lead' };
    }

    const newLead = mapDatabaseToLead(data);
    return { lead: newLead, error: null };
  } catch {
    return { lead: null, error: 'Erro ao criar lead' };
  }
}

/**
 * Atualiza um lead existente
 */
export async function updateLead(
  id: string,
  updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>>
): Promise<LeadResponse> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.company !== undefined) updateData.company = updates.company || null;
    if (updates.position !== undefined) updateData.position = updates.position || null;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.source !== undefined) updateData.source = updates.source;
    if (updates.value !== undefined) updateData.value = updates.value || null;
    if (updates.observations !== undefined) updateData.observations = updates.observations || null;
    if (updates.tags !== undefined) updateData.tags = updates.tags || [];
    if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo || null;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        interactions (
          id,
          type,
          description,
          created_at,
          user:user_id (
            id,
            name,
            email
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return { lead: null, error: error.message };
    }

    if (!data) {
      return { lead: null, error: 'Lead não encontrado' };
    }

    const updatedLead = mapDatabaseToLead(data);
    return { lead: updatedLead, error: null };
  } catch {
    return { lead: null, error: 'Erro ao atualizar lead' };
  }
}

/**
 * Deleta um lead
 */
export async function deleteLead(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch {
    return { error: 'Erro ao deletar lead' };
  }
}

/**
 * Adiciona uma interação a um lead
 */
export async function addInteraction(
  leadId: string,
  userId: string,
  type: string,
  description: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('interactions')
      .insert([
        {
          lead_id: leadId,
          user_id: userId,
          type,
          description,
        },
      ]);

    if (error) {
      console.error('Error adding interaction:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch {
    return { error: 'Erro ao adicionar interação' };
  }
}

/**
 * Atualiza o status de um lead e registra uma interação
 */
export async function updateLeadStatus(
  leadId: string,
  userId: string,
  newStatus: LeadStatus
): Promise<{ error: string | null }> {
  try {
    // Atualiza o status
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (updateError) {
      console.error('Error updating status:', updateError);
      return { error: updateError.message };
    }

    // Registra a interação
    await addInteraction(
      leadId,
      userId,
      'status',
      `Status alterado para: ${newStatus}`
    );

    return { error: null };
  } catch {
    return { error: 'Erro ao atualizar status' };
  }
}
