# Homem Abusado

Portal de acolhimento, informação e apoio voltado a homens que vivem ou viveram relacionamentos abusivos.

## Tecnologias

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Supabase (PostgreSQL e Row Level Security)
- Google Gemini API (`@google/genai`) para o assistente H.Aroldo e triagem de segurança
- Resend para notificações de moderação e newsletter
- MDX local (`gray-matter` e `next-mdx-remote`) para artigos editoriais

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha as chaves desejadas em `.env.local`. Quando as variáveis do Supabase ou do Resend estiverem vazias, o portal funciona em modo de visualização com dados locais de exemplo.

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo ficará disponível em `http://localhost:3000`.

## Configuração do Supabase

1. Crie um projeto no painel do Supabase.
2. Abra o **SQL Editor** e execute o arquivo `supabase/schema.sql`.
3. O script cria as tabelas `subscribers`, `testimonials`, `testimonial_replies` e `professionals`, com políticas de RLS para leitura pública apenas de registros aprovados e envio anônimo com status `pending`, além da função RPC `increment_testimonial_support`.
4. Copie `Project URL`, `anon public key` e `service_role key` em **Project Settings > API** para `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador.

## Painel de Moderação (`/admin`)

O portal inclui um painel restrito em `/admin` (com `robots: noindex, nofollow`) para revisar relatos pendentes, respostas de apoio no mural e cadastros de profissionais.

- Defina uma senha forte em `ADMIN_PASSWORD` no arquivo `.env.local` (e nas variáveis de ambiente da Vercel).
- O login cria um cookie HTTP-only assinado com HMAC-SHA256 (`ha_admin_session`), válido por 12 horas.
- Em produção, o acesso ao `/admin` fica bloqueado se `ADMIN_PASSWORD` não estiver definida.
- Em ambiente local de desenvolvimento (`NODE_ENV !== "production"`), se `ADMIN_PASSWORD` estiver vazia, é possível testar o painel usando a senha temporária `admin-dev`.
- Sem `SUPABASE_SERVICE_ROLE_KEY`, o painel abre em modo de visualização local com itens de exemplo pendentes e aprovados.

## Publicação Semanal Automática (Terças às 10h, horário de Brasília)

O arquivo `vercel.json` configura uma tarefa recorrente da Vercel Cron (`0 13 * * 2`, equivalente a 10h00 no horário de Brasília, UTC-3, todas as terças-feiras) que aciona `GET /api/cron/publish-weekly`:

- Defina `CRON_SECRET` nas variáveis de ambiente da Vercel para autenticar a chamada com `Authorization: Bearer <CRON_SECRET>`.
- Ao rodar, o endpoint publica automaticamente artigos com `status = "scheduled"` e `published_at <= now()` no Supabase.
- Se não houver artigos agendados vencidos no banco e `GEMINI_API_KEY` estiver configurada, o cron pode gerar e publicar o próximo tema pendente da fila editorial (`src/data/editorial-schedule.ts`) seguindo as 21 regras do Guia Anti-IA.
- Por fim, o cron revalida `/` e `/artigos` para que artigos `.mdx` agendados com `publishedAt` futuro entrem no ar pontualmente na terça-feira às 10h.

## Importação de artigos do Substack para MDX

Os artigos ficam em `content/articles/` no formato `.mdx`. Para migrar textos publicados no Substack:

1. No painel do Substack, acesse **Settings > Exports** e exporte o arquivo compactado de posts.
2. Converta o HTML desejado para Markdown e salve como `content/articles/nome-do-artigo.mdx`.
3. Adicione o bloco de metadados (frontmatter) no topo do arquivo:

```yaml
---
title: "Título do artigo"
slug: "nome-do-artigo"
excerpt: "Resumo breve exibido nos cartões e na meta descrição."
category: "Sinais de Abuso"
publishedAt: "2025-05-10"
readTime: "6 min de leitura"
coverImage: "/images/article-gaslighting.png"
tags: ["limites", "saúde emocional"]
author: "Equipe Homem Abusado"
---
```

As categorias aceitas são: `Sinais de Abuso`, `Reconstrução`, `Paternidade e Família` e `Saúde Mental`.

## Deploy na Vercel

1. Conecte este repositório na Vercel.
2. Cadastre as variáveis de ambiente de `.env.example` nas configurações do projeto na Vercel (incluindo `SUPABASE_SERVICE_ROLE_KEY` e `ADMIN_PASSWORD` para usar `/admin` em produção).
3. Deixe o comando de build padrão (`npm run build`) e publique.
