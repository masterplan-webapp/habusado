/*
  Homem Abusado: Schema inicial do Supabase (PostgreSQL)
  Inclui tabelas de assinantes, relatos anonimos, respostas moderadas,
  profissionais e artigos (admin e colaboradores),
  politicas de Row Level Security (RLS), indices e funcao RPC de apoio.
*/

create extension if not exists pgcrypto;

/* ========================================================================== */
/* 1. Assinantes da newsletter                                                */
/* ========================================================================== */

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now(),
  active boolean not null default true
);

create index if not exists idx_subscribers_created_at
  on public.subscribers (created_at desc);

create index if not exists idx_subscribers_active
  on public.subscribers (active)
  where active = true;

alter table public.subscribers enable row level security;

create policy "subscribers_anon_insert"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

create policy "subscribers_service_role_all"
  on public.subscribers
  for all
  to service_role
  using (true)
  with check (true);

/* ========================================================================== */
/* 2. Relatos anonimos                                                        */
/* ========================================================================== */

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  pseudonym text not null,
  title text not null,
  content text not null,
  support_count integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonials_status
  on public.testimonials (status);

create index if not exists idx_testimonials_created_at
  on public.testimonials (created_at desc);

create index if not exists idx_testimonials_status_created_at
  on public.testimonials (status, created_at desc);

alter table public.testimonials enable row level security;

create policy "testimonials_public_read_approved"
  on public.testimonials
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "testimonials_public_insert_pending"
  on public.testimonials
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "testimonials_service_role_all"
  on public.testimonials
  for all
  to service_role
  using (true)
  with check (true);

/* ========================================================================== */
/* 2b. Respostas moderadas de apoio aos relatos                               */
/* ========================================================================== */

create table if not exists public.testimonial_replies (
  id uuid primary key default gen_random_uuid(),
  testimonial_id uuid not null references public.testimonials(id) on delete cascade,
  pseudonym text not null,
  content text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderation_flag text,
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonial_replies_testimonial_id
  on public.testimonial_replies (testimonial_id);

create index if not exists idx_testimonial_replies_status
  on public.testimonial_replies (status);

create index if not exists idx_testimonial_replies_testimonial_status_created
  on public.testimonial_replies (testimonial_id, status, created_at asc);

alter table public.testimonial_replies enable row level security;

create policy "testimonial_replies_public_read_approved"
  on public.testimonial_replies
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "testimonial_replies_public_insert_pending"
  on public.testimonial_replies
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "testimonial_replies_service_role_all"
  on public.testimonial_replies
  for all
  to service_role
  using (true)
  with check (true);

/* ========================================================================== */
/* 2c. RPC segura para incrementar apoio em relatos aprovados                 */
/* ========================================================================== */

create or replace function public.increment_testimonial_support(target_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.testimonials
     set support_count = support_count + 1
   where id = target_id
     and status = 'approved'
  returning support_count into new_count;

  return coalesce(new_count, 0);
end;
$$;

revoke all on function public.increment_testimonial_support(uuid) from public;
grant execute on function public.increment_testimonial_support(uuid) to anon, authenticated;

/* ========================================================================== */
/* 3. Diretorio de profissionais                                              */
/* ========================================================================== */

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null
    check (specialty in ('Psicologia', 'Direito', 'Psiquiatria', 'Terapia')),
  license_number text not null,
  bio text not null,
  city text not null,
  state text not null,
  is_online boolean not null default true,
  contact_url text not null,
  photo_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_professionals_status
  on public.professionals (status);

create index if not exists idx_professionals_created_at
  on public.professionals (created_at desc);

create index if not exists idx_professionals_status_created_at
  on public.professionals (status, created_at desc);

create index if not exists idx_professionals_specialty
  on public.professionals (specialty);

alter table public.professionals enable row level security;

create policy "professionals_public_read_approved"
  on public.professionals
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "professionals_public_insert_pending"
  on public.professionals
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "professionals_service_role_all"
  on public.professionals
  for all
  to service_role
  using (true)
  with check (true);

/* ========================================================================== */
/* 4. Artigos (admin e colaboradores)                                         */
/* ========================================================================== */

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null
    check (category in ('Sinais de Abuso', 'Reconstrução', 'Paternidade e Família', 'Saúde Mental')),
  content text not null,
  cover_image text not null default '/images/pillar-info.png',
  tags text[] not null default '{}',
  read_time text not null default '5 min de leitura',
  author_name text not null default 'Equipe Homem Abusado',
  author_credentials text,
  author_bio text,
  author_email text,
  source text not null default 'admin'
    check (source in ('admin', 'contributor')),
  status text not null default 'pending_review'
    check (status in ('draft', 'pending_review', 'scheduled', 'published', 'rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_status
  on public.articles (status);

create index if not exists idx_articles_slug
  on public.articles (slug);

create index if not exists idx_articles_published_at
  on public.articles (published_at desc);

create index if not exists idx_articles_status_published_at
  on public.articles (status, published_at desc);

alter table public.articles enable row level security;

create policy "articles_public_read_published"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

create policy "articles_public_insert_contributor_pending"
  on public.articles
  for insert
  to anon, authenticated
  with check (status = 'pending_review' and source = 'contributor');

create policy "articles_service_role_all"
  on public.articles
  for all
  to service_role
  using (true)
  with check (true);
