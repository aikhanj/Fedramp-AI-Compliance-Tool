-- Kamstif Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Systems table
create table if not exists public.systems (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  impact_level text not null check (impact_level in ('low', 'moderate', 'high')),
  owner uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Intake table
create table if not exists public.intake (
  id uuid primary key default uuid_generate_v4(),
  system_id uuid unique references public.systems(id) on delete cascade,
  json jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Runs table
create table if not exists public.runs (
  id uuid primary key default uuid_generate_v4(),
  system_id uuid references public.systems(id) on delete cascade,
  status text not null check (status in ('running', 'completed', 'failed')),
  error text,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Sections table
create table if not exists public.sections (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references public.runs(id) on delete cascade,
  system_id uuid references public.systems(id) on delete cascade,
  control_id text not null,
  narrative text,
  evidence text[],
  citations text[],
  created_at timestamp with time zone default now()
);

-- Indexes for better query performance
create index if not exists idx_systems_owner on public.systems(owner);
create index if not exists idx_intake_system_id on public.intake(system_id);
create index if not exists idx_runs_system_id on public.runs(system_id);
create index if not exists idx_sections_run_id on public.sections(run_id);
create index if not exists idx_sections_system_id on public.sections(system_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.systems enable row level security;
alter table public.intake enable row level security;
alter table public.runs enable row level security;
alter table public.sections enable row level security;

-- Systems policies
create policy "Users can view their own systems"
  on public.systems for select
  using (auth.uid() = owner);

create policy "Users can create their own systems"
  on public.systems for insert
  with check (auth.uid() = owner);

create policy "Users can update their own systems"
  on public.systems for update
  using (auth.uid() = owner);

create policy "Users can delete their own systems"
  on public.systems for delete
  using (auth.uid() = owner);

-- Intake policies
create policy "Users can view intake data for their systems"
  on public.intake for select
  using (
    exists (
      select 1 from public.systems
      where systems.id = intake.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can create intake data for their systems"
  on public.intake for insert
  with check (
    exists (
      select 1 from public.systems
      where systems.id = intake.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can update intake data for their systems"
  on public.intake for update
  using (
    exists (
      select 1 from public.systems
      where systems.id = intake.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can delete intake data for their systems"
  on public.intake for delete
  using (
    exists (
      select 1 from public.systems
      where systems.id = intake.system_id
      and systems.owner = auth.uid()
    )
  );

-- Runs policies
create policy "Users can view runs for their systems"
  on public.runs for select
  using (
    exists (
      select 1 from public.systems
      where systems.id = runs.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can create runs for their systems"
  on public.runs for insert
  with check (
    exists (
      select 1 from public.systems
      where systems.id = runs.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can update runs for their systems"
  on public.runs for update
  using (
    exists (
      select 1 from public.systems
      where systems.id = runs.system_id
      and systems.owner = auth.uid()
    )
  );

-- Sections policies
create policy "Users can view sections for their systems"
  on public.sections for select
  using (
    exists (
      select 1 from public.systems
      where systems.id = sections.system_id
      and systems.owner = auth.uid()
    )
  );

create policy "Users can create sections for their systems"
  on public.sections for insert
  with check (
    exists (
      select 1 from public.systems
      where systems.id = sections.system_id
      and systems.owner = auth.uid()
    )
  );

-- Functions for automatic timestamp updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.systems
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.intake
  for each row
  execute function public.handle_updated_at();

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.systems to authenticated;
grant all on public.intake to authenticated;
grant all on public.runs to authenticated;
grant all on public.sections to authenticated;

