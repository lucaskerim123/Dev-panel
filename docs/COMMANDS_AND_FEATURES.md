# OrbitFS Dev Control — Commands & Features

This document is the working command/feature list for the future OrbitFS Dev Control API, ChatGPT MCP, and Dev Panel control surface.

The goal is to keep the first version small and operationally useful. GitHub and Vercel already handle normal repository and platform actions, so Dev Control should focus on OrbitFS-specific operations, orchestration, and protected internal controls.

---

## 1. Core deployment controls

These are the minimum deployment actions worth building first.

### Commands

- `prepare_latest_source`
  - Resolve the latest approved source for a selected service.
  - Run the required preparation checks.
  - Return the exact commit/ref that is ready to deploy.
  - Does **not** deploy by itself.

- `quick_deploy`
  - Deploy the latest prepared/current source using the shortest approved path.
  - Intended for trusted owner use.
  - Must still report the exact source commit and deployment result.

- `redeploy`
  - Redeploy the currently selected/running source without changing the source version.

- `restart_service`
  - Restart a supported runtime/service without rebuilding source where the platform supports it.

- `rollback`
  - Roll back to the previous known-good supported deployment.
  - Must show the current and target deployment before execution.

- `deployment_status`
  - Show current deployment, source commit, state, health, and most recent job.

### Features

- Service selector.
- Current production commit/version.
- Prepared source commit/version.
- Deployment state.
- Last successful deployment.
- Last failed deployment.
- Confirmation gate for production-changing actions.
- Post-deployment verification.
- Mini live console for active deployment jobs.

---

## 2. Updater controls

The updater must remain a first-class part of Dev Control rather than being buried inside generic deployment tooling.

### Commands

- `updater_status`
  - Show updater availability, current state, protocol/version, and whether updates are paused.

- `prepare_update`
  - Inspect and validate an update before execution.
  - Resolve release, components, compatibility, migrations, and checkpoint requirements.

- `apply_update`
  - Execute a prepared update through the normal OrbitFS update path.

- `retry_update`
  - Retry a failed update only where the previous state is safe to retry.

- `cancel_update`
  - Cancel an update that has not passed the point where cancellation is unsafe.

- `rollback_update`
  - Roll back only where the release/update contract explicitly supports rollback.

### Features

- Update target/install selector.
- Release/version selector.
- Component list.
- Compatibility result.
- Migration summary.
- Checkpoint status.
- Live update console.
- Clear partial/failure state.
- Never report a partial update as successful.

---

## 3. Health, diagnostics, and logs

These should make ChatGPT genuinely useful when something breaks.

### Commands

- `health_check`
  - Fast health check for one selected service.

- `full_diagnostics`
  - Run the important service, API, database, dependency, and runtime checks for the selected target.

- `get_recent_errors`
  - Return recent meaningful errors without dumping an entire log stream.

- `get_job_logs`
  - Return logs for a specific Dev Control job.

- `get_job_status`
  - Return structured job state and current step.

### Features

- Health summary.
- Failed check highlighting.
- Structured error details.
- Secret redaction.
- Copyable diagnostic summary for ChatGPT/Codex.
- Mini live console.
- Expandable full job console.

---

## 4. Job control and live console

Every state-changing Dev Control action should run as a tracked job.

### Commands

- `get_job`
- `get_job_status`
- `get_job_logs`
- `cancel_job`
- `retry_job`
- `list_recent_jobs`

### Features

Every job should record:

- Job ID.
- Action.
- Target service/install.
- Requested source/release.
- Exact commit/version.
- Requested by.
- Start/end time.
- Current step.
- Status.
- Warnings.
- Errors.
- Final result.
- Related GitHub/Vercel/deployment IDs where relevant.

ChatGPT UI should support:

- Compact running-job card.
- Mini live console.
- Expanded/fullscreen console.
- Cancel button only when cancellation is safe.
- Retry button only when retry is safe.

---

## 5. Licence Manager access

Dev Control may access protected Licence Manager operations, but **Custom License Manager remains authoritative**.

Dev Control must call Licence Manager APIs rather than creating its own licensing state.

### Essential commands

- `lookup_license`
- `lookup_installation`
- `license_status`
- `check_entitlements`
- `check_installation_lock`
- `check_update_eligibility`
- `force_license_revalidation`

### Essential controlled actions

- `suspend_license`
- `restore_license`
- `lock_installation`
- `unlock_installation`

These actions should require stronger confirmation than read-only commands.

### Features

- Licence summary.
- Installation summary.
- Runtime/authority state.
- Entitlements/components.
- Update eligibility.
- Installation lock state.
- Recent authority events.
- Exact reason when an operation is denied.

---

## 6. Billing Store support

Only include Billing Store commands that help operate or diagnose the OrbitFS system.

### Essential commands

- `billing_status`
- `lookup_customer`
- `check_subscription`
- `check_billing_license_sync`
- `retry_failed_webhook`
- `reconcile_customer`

### Features

- Billing/customer state summary.
- Licence link/status.
- Subscription state.
- Last relevant webhook.
- Sync mismatch warning.
- Reconciliation result.

---

## 7. Core settings

Keep settings small and security-focused.

### Required settings

- Dev Control enabled/disabled.
- Owner-only access.
- Allowed services.
- Quick Deploy enabled/disabled.
- Production actions enabled/disabled.
- Updater actions enabled/disabled.
- Licence mutation actions enabled/disabled.
- Rollback enabled/disabled.
- Require confirmation for critical actions.
- Secret redaction enabled.
- Audit logging enabled.
- Automatic post-deploy health check.
- Automatic rollback on failed verification: **off by default**.
- Emergency Dev Control kill switch.

---

# Suggested later additions

These are useful but should come after the core control plane is stable.

## Deployment improvements

- `deploy_commit`
  - Deploy an explicitly selected commit after validation.

- `compare_production_to_main`
  - Show source drift without changing anything.

- `deploy_and_verify`
  - Explicit full workflow combining deploy + health verification.

- `restart_and_verify`
  - Restart followed by automatic health verification.

## Update improvements

- `plan_update`
  - Return the exact intended changes without executing them.

- `update_history`
  - Show recent updates and results for an installation.

- `inspect_failed_update`
  - Structured failed-update diagnosis.

## Licence diagnostics

- `license_events`
  - Recent authoritative Licence Manager events for a licence/install.

- `runtime_status`
  - Runtime pulse/authority state for an installation.

## Operations

- `maintenance_on`
- `maintenance_off`
- `clear_service_cache`
- `check_pending_migrations`
- `database_health`

Only add these where the target service actually supports them cleanly.

## Notifications

Later, Dev Control may surface:

- Deployment completed.
- Deployment failed.
- Update completed.
- Update failed.
- Service health changed after an operation.

Notifications should relate to jobs the owner started or explicitly asked to monitor. Dev Control should not become a generic alerting platform.

---

# Explicit non-goals

Do **not** add generic high-risk tools just because MCP can expose them.

Avoid:

- `execute_shell`
- `run_any_command`
- `execute_sql`
- `call_any_url`
- `write_any_file`
- `set_any_environment_variable`
- Generic secret readers.
- Generic infrastructure admin access.
- Duplicating normal GitHub features.
- Duplicating normal Vercel features.
- Local licensing authority.
- Hidden bypasses around Licence Manager policy.

If a future command cannot be described as a narrow, auditable OrbitFS operation, it probably does not belong in Dev Control.

---

# Initial implementation order

1. Dev Control authentication and owner gate.
2. Job model + live console.
3. `deployment_status`.
4. `prepare_latest_source`.
5. `quick_deploy`.
6. `redeploy`.
7. `restart_service`.
8. `rollback`.
9. `health_check` and `full_diagnostics`.
10. Updater status/preparation/execution.
11. Licence Manager read-only commands.
12. Guarded Licence Manager mutation commands.
13. Billing Store diagnostic commands.
14. Additional commands only when a real operational need appears.

The rule for V1 is simple: **build the commands that replace real manual work first, and leave everything else out until it proves useful.**
