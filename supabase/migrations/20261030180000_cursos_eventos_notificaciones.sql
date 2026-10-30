-- Base para cursos, eventos y notificaciones.
-- Las administradoras cargan y editan todo (is_admin()); cada usuaria ve lo publicado,
-- sus propias inscripciones y sus notificaciones. Las inscripciones las da por ahora una
-- administradora: cuando haya pagos (etapa 2), se suma la política o función de alta.

create type public.content_status as enum ('draft', 'published', 'archived');

comment on type public.content_status is 'draft: borrador (solo admin) · published: visible · archived: oculto.';

-- ─── Cursos ──────────────────────────────────────────────────────────────────────────────

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  summary text check (char_length(summary) <= 600),
  cover_path text,
  status public.content_status not null default 'draft',
  starts_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.courses is 'Cursos de la comunidad.';

create index courses_status_idx on public.courses (status);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

alter table public.courses enable row level security;

create policy "Cursos publicados visibles para todo el mundo"
  on public.courses for select
  to anon, authenticated
  using (status = 'published');

create policy "Administradoras gestionan cursos"
  on public.courses for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table public.course_enrollments (
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (course_id, user_id)
);

comment on table public.course_enrollments is 'Usuarias inscriptas en cada curso.';

create index course_enrollments_user_id_idx on public.course_enrollments (user_id);

alter table public.course_enrollments enable row level security;

create policy "Cada usuaria ve sus cursos"
  on public.course_enrollments for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Administradoras gestionan inscripciones a cursos"
  on public.course_enrollments for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ─── Eventos ─────────────────────────────────────────────────────────────────────────────

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  summary text check (char_length(summary) <= 600),
  cover_path text,
  location text check (char_length(location) <= 160),
  online_url text check (online_url ~ '^https://'),
  status public.content_status not null default 'draft',
  starts_at timestamptz not null,
  ends_at timestamptz check (ends_at is null or ends_at > starts_at),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.events is 'Eventos de la comunidad (presenciales u online).';

create index events_status_starts_at_idx on public.events (status, starts_at);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "Eventos publicados visibles para todo el mundo"
  on public.events for select
  to anon, authenticated
  using (status = 'published');

create policy "Administradoras gestionan eventos"
  on public.events for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table public.event_registrations (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

comment on table public.event_registrations is 'Usuarias anotadas en cada evento.';

create index event_registrations_user_id_idx on public.event_registrations (user_id);

alter table public.event_registrations enable row level security;

create policy "Cada usuaria ve sus eventos"
  on public.event_registrations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Administradoras gestionan anotadas a eventos"
  on public.event_registrations for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ─── Notificaciones ──────────────────────────────────────────────────────────────────────

-- user_id null = para todas las usuarias. Con user_id = solo para esa usuaria.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text check (char_length(body) <= 600),
  link text check (link is null or link ~ '^(/|https://)'),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'Avisos para las usuarias (a todas si user_id es null).';

create index notifications_user_id_created_at_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Cada usuaria ve sus notificaciones y las generales"
  on public.notifications for select
  to authenticated
  using (user_id is null or (select auth.uid()) = user_id);

create policy "Administradoras gestionan notificaciones"
  on public.notifications for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Qué notificación leyó cada usuaria
create table public.notification_reads (
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

comment on table public.notification_reads is 'Notificaciones leídas por cada usuaria.';

create index notification_reads_user_id_idx on public.notification_reads (user_id);

alter table public.notification_reads enable row level security;

create policy "Cada usuaria ve lo que leyó"
  on public.notification_reads for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Solo puede marcar como leídas notificaciones que puede ver (la política de select de
-- notifications se aplica dentro del exists)
create policy "Cada usuaria marca sus notificaciones como leídas"
  on public.notification_reads for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.notifications n where n.id = notification_id)
  );

create policy "Administradoras ven todas las lecturas"
  on public.notification_reads for select
  to authenticated
  using ((select public.is_admin()));
