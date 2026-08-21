-- TCS Finance — FASE 1 / CONTAS
-- Execute este script no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null default 'Conta corrente',
  saldo_inicial numeric(14,2) not null default 0,
  cor text not null default 'blue',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.lancamentos
  add column if not exists account_id uuid references public.contas(id) on delete set null;

create index if not exists contas_user_id_idx on public.contas(user_id);
create index if not exists lancamentos_account_id_idx on public.lancamentos(account_id);

alter table public.contas enable row level security;

create policy "contas_select_own"
on public.contas for select
using (auth.uid() = user_id);

create policy "contas_insert_own"
on public.contas for insert
with check (auth.uid() = user_id);

create policy "contas_update_own"
on public.contas for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "contas_delete_own"
on public.contas for delete
using (auth.uid() = user_id);
