import { User, Lead, LeadStatus, LeadSource } from '../types';
import { generateId } from '../utils/formatters';

// Usuários mockados para teste
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@minicrm.com',
    password: 'admin123',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456',
    createdAt: new Date('2024-01-15'),
  },
];

// Leads mockados para demonstração
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 98765-4321',
    company: 'Tech Solutions',
    position: 'Gerente de TI',
    status: 'novo' as LeadStatus,
    source: 'website' as LeadSource,
    value: 15000,
    observations: 'Interessada em soluções de CRM para equipe de vendas',
    tags: ['hot-lead', 'tech'],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    interactions: [
      {
        id: generateId(),
        leadId: '1',
        type: 'email',
        description: 'Enviado email de boas-vindas e apresentação da empresa',
        date: new Date('2024-11-01'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '1',
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos@empresa.com',
    phone: '(21) 91234-5678',
    company: 'Consultoria ABC',
    position: 'Diretor Comercial',
    status: 'contato' as LeadStatus,
    source: 'indicacao' as LeadSource,
    value: 25000,
    observations: 'Indicação do cliente anterior, muito interessado',
    tags: ['vip', 'urgente'],
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-11-02'),
    interactions: [
      {
        id: generateId(),
        leadId: '2',
        type: 'telefone',
        description: 'Primeira ligação realizada, muito receptivo',
        date: new Date('2024-10-26'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '2',
        type: 'reuniao',
        description: 'Reunião agendada para próxima semana',
        date: new Date('2024-11-02'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '1',
  },
  {
    id: '3',
    name: 'Ana Paula Costa',
    email: 'ana.costa@startup.com',
    phone: '(11) 99876-5432',
    company: 'Startup Digital',
    position: 'CEO',
    status: 'qualificado' as LeadStatus,
    source: 'evento' as LeadSource,
    value: 50000,
    observations: 'Conhecida em evento de tecnologia, startup em crescimento',
    tags: ['tech', 'startup', 'high-value'],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-11-05'),
    interactions: [
      {
        id: generateId(),
        leadId: '3',
        type: 'reuniao',
        description: 'Reunião presencial no evento Tech Summit',
        date: new Date('2024-10-15'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '3',
        type: 'email',
        description: 'Enviada proposta preliminar',
        date: new Date('2024-10-20'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '3',
        type: 'telefone',
        description: 'Follow-up da proposta, feedback positivo',
        date: new Date('2024-11-05'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '1',
  },
  {
    id: '4',
    name: 'Roberto Lima',
    email: 'roberto.lima@comercio.com',
    phone: '(31) 98888-7777',
    company: 'Comércio XYZ',
    position: 'Gerente de Vendas',
    status: 'proposta' as LeadStatus,
    source: 'telefone' as LeadSource,
    value: 30000,
    observations: 'Precisa de implementação urgente',
    tags: ['urgente', 'comercio'],
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-11-08'),
    interactions: [
      {
        id: generateId(),
        leadId: '4',
        type: 'telefone',
        description: 'Contato inicial via cold call',
        date: new Date('2024-10-10'),
        userId: '2',
        userName: 'João Silva',
      },
      {
        id: generateId(),
        leadId: '4',
        type: 'reuniao',
        description: 'Reunião de levantamento de requisitos',
        date: new Date('2024-10-18'),
        userId: '2',
        userName: 'João Silva',
      },
      {
        id: generateId(),
        leadId: '4',
        type: 'email',
        description: 'Proposta comercial enviada',
        date: new Date('2024-11-08'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '2',
  },
  {
    id: '5',
    name: 'Fernanda Souza',
    email: 'fernanda@servicos.com',
    phone: '(85) 97777-6666',
    company: 'Serviços Profissionais',
    status: 'negociacao' as LeadStatus,
    source: 'midia-social' as LeadSource,
    value: 40000,
    observations: 'Negociando valores e prazos de implementação',
    tags: ['negociacao', 'servicos'],
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-11-09'),
    interactions: [
      {
        id: generateId(),
        leadId: '5',
        type: 'email',
        description: 'Primeiro contato via LinkedIn',
        date: new Date('2024-09-20'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '5',
        type: 'reuniao',
        description: 'Apresentação da solução',
        date: new Date('2024-09-28'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '5',
        type: 'email',
        description: 'Ajuste de proposta conforme feedback',
        date: new Date('2024-10-15'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '5',
        type: 'telefone',
        description: 'Discussão sobre condições de pagamento',
        date: new Date('2024-11-09'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '1',
  },
  {
    id: '6',
    name: 'Pedro Almeida',
    email: 'pedro@industria.com',
    phone: '(48) 96666-5555',
    company: 'Indústria Brasil',
    status: 'ganho' as LeadStatus,
    source: 'indicacao' as LeadSource,
    value: 80000,
    observations: 'Cliente fechado! Início da implementação na próxima semana',
    tags: ['cliente', 'industria', 'high-value'],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-11-07'),
    interactions: [
      {
        id: generateId(),
        leadId: '6',
        type: 'reuniao',
        description: 'Primeira reunião de apresentação',
        date: new Date('2024-09-05'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '6',
        type: 'email',
        description: 'Envio de proposta técnica e comercial',
        date: new Date('2024-09-15'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '6',
        type: 'reuniao',
        description: 'Negociação final com diretoria',
        date: new Date('2024-10-20'),
        userId: '1',
        userName: 'Admin User',
      },
      {
        id: generateId(),
        leadId: '6',
        type: 'email',
        description: 'Contrato assinado!',
        date: new Date('2024-11-07'),
        userId: '1',
        userName: 'Admin User',
      },
    ],
    assignedTo: '1',
  },
];

// Função para simular delay de requisição
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simula autenticação
export const authenticateUser = async (email: string, password: string): Promise<User> => {
  await delay(800); // Simula latência de rede
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Credenciais inválidas');
  }
  
  // Remove a senha do retorno
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Simula registro de usuário
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await delay(800);
  
  const existingUser = mockUsers.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error('E-mail já cadastrado');
  }
  
  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
    createdAt: new Date(),
  };
  
  mockUsers.push(newUser);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
