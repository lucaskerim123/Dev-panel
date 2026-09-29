begin;

alter table if exists public.panel_api_connections
  add column if not exists fallback_url text,
  add column if not exists failover_enabled boolean not null default true,
  add column if not exists last_primary_failure_at timestamptz,
  add column if not exists last_fallback_at timestamptz;

alter table if exists public.panel_api_connections
  drop constraint if exists panel_api_connections_fallback_url_check;
alter table if exists public.panel_api_connections
  add constraint panel_api_connections_fallback_url_check check (
    fallback_url is null
    or fallback_url = 'https://orbitfs-fallback.stubengine.com/api/v1'
  );

update public.panel_api_connections
set fallback_url=coalesce(fallback_url,'https://orbitfs-fallback.stubengine.com/api/v1'),
    failover_enabled=coalesce(failover_enabled,true)
where service_key='license_manager';

comment on column public.panel_api_connections.fallback_url is
  'Availability-only StubEngine limp-mode fallback. Never authoritative.';
comment on column public.panel_api_connections.failover_enabled is
  'Allows read-only Dev Panel requests to use fallback after primary transport failure.';

commit;
