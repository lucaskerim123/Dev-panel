-- Add the Engine authority tool switch to the private MCP settings.
alter table if exists public.dev_mcp_settings
  add column if not exists tool_engine boolean not null default true;
