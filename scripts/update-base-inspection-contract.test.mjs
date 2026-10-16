import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const route=readFileSync(new URL('../src/routes/index.tsx',import.meta.url),'utf8');
const server=readFileSync(new URL('../src/lib/panel.server.ts',import.meta.url),'utf8');
const workspace=readFileSync(new URL('../src/components/release-workspace.tsx',import.meta.url),'utf8');

test('Update re-inspection preserves manually selected BASE while adding detected Engine targets',()=>{
 assert.match(route,/setComponents\(\(previous:string\[\]\)=>\[\.\.\.new Set\(\[\.\.\.detectedComponents,\.\.\.previous\]\)\]\)/);
 assert.doesNotMatch(route,/setComponents\(detectedComponents\)/);
 assert.match(route,/baseInspection:r\.baseInspection\|\|null/);
 assert.match(route,/components:type==="engine"\?\[\.\.\.new Set\(\[\.\.\.detectedComponents,\.\.\.components\]\)\]:components/);
});

test('server inspects Base release source independently and rejects stale selection at dispatch',()=>{
 assert.match(server,/if\(data\.type==="engine"\)\{\s*const inspectedRepo=BASE_REPO,inspectedRef=BASE_REF;/);
 assert.match(server,/await completeSourceDiff\(inspectedRepo,baselineSourceSha,head\)/);
 assert.match(server,/baseBaseline:baseBaselineInfo,baseInspection/);
 assert.match(server,/if\(inspectedBaseBaselineSha!==baselineSourceCommit\)throw/);
 assert.match(server,/if\(baseHead!==inspectedBaseSourceSha\)throw/);
 assert.match(route,/inspectedBaseSourceSha:type==="engine"\?/);
 assert.match(route,/inspectedBaseBaselineSha:type==="engine"\?/);
});

test('BASE cannot be packaged just because the button is selected without a verified delta',()=>{
 assert.match(workspace,/const baseInspectedReady=Boolean\(inspected&&baseInspection\?\.ready===true/);
 assert.match(workspace,/baseTargetSelected&&baseInspectedReady/);
 assert.match(workspace,/!baseTargetSelected\|\|baseInspectedReady/);
 assert.match(workspace,/title="Base source inspection"/);
 assert.match(workspace,/baseInspection\.changedFiles\.map/);
 assert.doesNotMatch(workspace,/\(baseTargetSelected&&inspected\)/);
});
