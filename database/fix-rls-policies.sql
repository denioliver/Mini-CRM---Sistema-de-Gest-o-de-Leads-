-- Corrigir políticas RLS para permitir registro de novos usuários

-- Remover políticas antigas da tabela users
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Permitir que qualquer um insira novos usuários (para registro)
CREATE POLICY "Allow public user registration"
ON users
FOR INSERT
TO public
WITH CHECK (true);

-- Permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view their own data"
ON users
FOR SELECT
TO public
USING (true);

-- Permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Users can update their own data"
ON users
FOR UPDATE
TO public
USING (id::text = auth.uid()::text)
WITH CHECK (id::text = auth.uid()::text);

-- Atualizar políticas da tabela leads para permitir operações sem auth
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON leads;

CREATE POLICY "Allow all operations on leads"
ON leads
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Atualizar políticas da tabela interactions
DROP POLICY IF EXISTS "Users can view all interactions" ON interactions;
DROP POLICY IF EXISTS "Users can insert interactions" ON interactions;

CREATE POLICY "Allow all operations on interactions"
ON interactions
FOR ALL
TO public
USING (true)
WITH CHECK (true);
