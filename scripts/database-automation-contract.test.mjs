import {readFileSync} from "node:fs";

const server=readFileSync("src/lib/panel.server.ts","utf8");
const page=readFileSync("src/components/database-system-workspace.tsx","utf8");
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

assert(
  server.includes("ensureAutomaticReleaseDatabasePackages") &&
  server.includes("requiredDatabaseComponentsForRelease"),
  "Database automation contract failed: normal releases must automatically ensure the central package set."
);
assert(
  server.includes("databasePackages=await ensureAutomaticReleaseDatabasePackages") &&
  server.indexOf("databasePackages=await ensureAutomaticReleaseDatabasePackages") < server.indexOf("actions/workflows"),
  "Database automation contract failed: database package readiness must be checked before release worker dispatch."
);
assert(
  server.includes("orbitfs_deployment_events") &&
  server.includes("update.engine.preflight") &&
  server.includes("database.migration"),
  "Database operations contract failed: Dev Panel must surface Inner Deployer / database execution activity."
);
assert(
  page.includes("Automatic release integration") &&
  page.includes("Verify & sync product databases") &&
  page.includes("Inner Deployer → Shared Engine Host"),
  "Database page contract failed: automatic flow and recovery controls must be visible."
);
assert(
  !page.includes("Register built product package(s) as License Manager candidate(s)"),
  "Database page contract failed: candidate registration must not be the primary operator workflow."
);

console.log("Dev Panel database automation contract checks passed.");
