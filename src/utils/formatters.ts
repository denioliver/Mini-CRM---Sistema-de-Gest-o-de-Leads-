// Utilitários para formatação e máscaras

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return '-';
  }
};

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch {
    return '-';
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'novo': '#3b82f6',
    'contato': '#8b5cf6',
    'qualificado': '#f59e0b',
    'proposta': '#10b981',
    'negociacao': '#14b8a6',
    'ganho': '#22c55e',
    'perdido': '#ef4444',
  };
  return colors[status] || '#6b7280';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'novo': 'Novo',
    'contato': 'Contato Inicial',
    'qualificado': 'Qualificado',
    'proposta': 'Proposta Enviada',
    'negociacao': 'Em Negociação',
    'ganho': 'Ganho',
    'perdido': 'Perdido',
  };
  return labels[status] || status;
};

export const getSourceLabel = (source: string): string => {
  const labels: Record<string, string> = {
    'website': 'Website',
    'indicacao': 'Indicação',
    'telefone': 'Telefone',
    'email': 'E-mail',
    'evento': 'Evento',
    'midia-social': 'Mídia Social',
    'outro': 'Outro',
  };
  return labels[source] || source;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
