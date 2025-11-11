-- SOLUÇÃO TEMPORÁRIA: Desabilitar RLS para testes
-- ⚠️ Em produção, você deve configurar políticas adequadas

-- Desabilitar RLS nas tabelas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE interactions DISABLE ROW LEVEL SECURITY;

-- Ou se preferir manter RLS ativo, use políticas permissivas:
-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON leads;
DROP POLICY IF EXISTS "Users can view all interactions" ON interactions;
DROP POLICY IF EXISTS "Users can insert interactions" ON interactions;

-- Criar políticas permissivas (apenas para desenvolvimento)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados e anônimos
CREATE POLICY "Allow all operations for development - users"
ON users FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for development - leads"
ON leads FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for development - interactions"
ON interactions FOR ALL
TO public
USING (true)
WITH CHECK (true);
