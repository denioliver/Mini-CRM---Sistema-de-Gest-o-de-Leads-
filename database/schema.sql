-- =============================================
-- MINI CRM - ESTRUTURA DO BANCO DE DADOS
-- Supabase PostgreSQL
-- =============================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users
-- Gerenciamento de usuários do sistema
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: leads
-- Armazena informações dos leads
-- =============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'novo',
  source VARCHAR(50) NOT NULL DEFAULT 'outro',
  value DECIMAL(10, 2),
  observations TEXT,
  tags TEXT[], -- Array de tags
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido')),
  CONSTRAINT valid_source CHECK (source IN ('website', 'indicacao', 'telefone', 'email', 'evento', 'midia-social', 'outro'))
);

-- =============================================
-- TABELA: interactions
-- Histórico de interações com leads
-- =============================================
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint
  CONSTRAINT valid_interaction_type CHECK (type IN ('email', 'telefone', 'reuniao', 'nota', 'whatsapp', 'outro'))
);

-- =============================================
-- ÍNDICES para melhor performance
-- =============================================

-- Índices para users
CREATE INDEX idx_users_email ON users(email);

-- Índices para leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_email ON leads(email);

-- Índices para interactions
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- =============================================
-- FUNÇÕES para atualizar updated_at automaticamente
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Habilitando segurança a nível de linha
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Políticas para users (por enquanto, acesso total autenticado)
CREATE POLICY "Usuários podem ver todos os usuários"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas para leads (acesso total para usuários autenticados)
CREATE POLICY "Usuários podem ver todos os leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem deletar leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para interactions
CREATE POLICY "Usuários podem ver todas as interações"
  ON interactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar interações"
  ON interactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas interações"
  ON interactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar suas interações"
  ON interactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- DADOS DE EXEMPLO (opcional - comentar se não quiser)
-- =============================================

-- Inserir usuário de teste
INSERT INTO users (id, name, email, password_hash) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@minicrm.com', '$2a$10$XQKbZw0YTjGxE9YhQxP6Ue8vM5qN7L8WxKxBzHqN9tP5L6M4E2Q3S'),
  ('22222222-2222-2222-2222-222222222222', 'João Silva', 'joao@email.com', '$2a$10$XQKbZw0YTjGxE9YhQxP6Ue8vM5qN7L8WxKxBzHqN9tP5L6M4E2Q3S');

-- Inserir leads de exemplo
INSERT INTO leads (name, email, phone, company, position, status, source, value, observations, tags, assigned_to, created_at) VALUES
  ('Maria Santos', 'maria.santos@email.com', '(11) 98765-4321', 'Tech Solutions', 'Gerente de TI', 'novo', 'website', 15000.00, 'Interessada em soluções de CRM para equipe de vendas', ARRAY['hot-lead', 'tech'], '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days'),
  ('Carlos Oliveira', 'carlos@empresa.com', '(21) 91234-5678', 'Consultoria ABC', 'Diretor Comercial', 'contato', 'indicacao', 25000.00, 'Indicação do cliente anterior, muito interessado', ARRAY['vip', 'urgente'], '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '16 days'),
  ('Ana Paula Costa', 'ana.costa@startup.com', '(11) 99876-5432', 'Startup Digital', 'CEO', 'qualificado', 'evento', 50000.00, 'Conhecida em evento de tecnologia, startup em crescimento', ARRAY['tech', 'startup', 'high-value'], '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '26 days'),
  ('Roberto Lima', 'roberto.lima@comercio.com', '(31) 98888-7777', 'Comércio XYZ', 'Gerente de Vendas', 'proposta', 'telefone', 30000.00, 'Precisa de implementação urgente', ARRAY['urgente', 'comercio'], '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '31 days'),
  ('Fernanda Souza', 'fernanda@servicos.com', '(85) 97777-6666', 'Serviços Profissionais', 'Diretora', 'negociacao', 'midia-social', 40000.00, 'Negociando valores e prazos de implementação', ARRAY['negociacao', 'servicos'], '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '51 days'),
  ('Pedro Almeida', 'pedro@industria.com', '(48) 96666-5555', 'Indústria Brasil', 'Proprietário', 'ganho', 'indicacao', 80000.00, 'Cliente fechado! Início da implementação na próxima semana', ARRAY['cliente', 'industria', 'high-value'], '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '70 days');

-- =============================================
-- VIEWS úteis
-- =============================================

-- View para leads com informações do usuário responsável
CREATE OR REPLACE VIEW leads_with_user AS
SELECT 
  l.*,
  u.name as assigned_to_name,
  u.email as assigned_to_email,
  (SELECT COUNT(*) FROM interactions WHERE lead_id = l.id) as interactions_count
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id;

-- View para resumo do pipeline
CREATE OR REPLACE VIEW pipeline_summary AS
SELECT 
  status,
  COUNT(*) as count,
  SUM(value) as total_value,
  AVG(value) as avg_value
FROM leads
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'novo' THEN 1
    WHEN 'contato' THEN 2
    WHEN 'qualificado' THEN 3
    WHEN 'proposta' THEN 4
    WHEN 'negociacao' THEN 5
    WHEN 'ganho' THEN 6
    WHEN 'perdido' THEN 7
  END;

-- =============================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================

COMMENT ON TABLE users IS 'Usuários do sistema CRM';
COMMENT ON TABLE leads IS 'Leads e prospects do pipeline de vendas';
COMMENT ON TABLE interactions IS 'Histórico de interações com os leads';

COMMENT ON COLUMN leads.status IS 'Status do lead no pipeline: novo, contato, qualificado, proposta, negociacao, ganho, perdido';
COMMENT ON COLUMN leads.source IS 'Origem do lead: website, indicacao, telefone, email, evento, midia-social, outro';
COMMENT ON COLUMN leads.tags IS 'Array de tags para categorização do lead';
COMMENT ON COLUMN interactions.type IS 'Tipo de interação: email, telefone, reuniao, nota, whatsapp, outro';
