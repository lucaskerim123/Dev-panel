export const DEV_PANEL_UI_URI="ui://dev-panel/v1.html";

export const DEV_PANEL_UI_HTML=String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Dev Panel</title>
<style>
:root{color-scheme:light dark;--bg:transparent;--surface:color-mix(in srgb,Canvas 94%,CanvasText 6%);--surface2:color-mix(in srgb,Canvas 88%,CanvasText 12%);--border:color-mix(in srgb,CanvasText 18%,transparent);--text:CanvasText;--muted:color-mix(in srgb,CanvasText 58%,transparent);--good:#22a06b;--info:#3b82f6;--ready:#f59e0b;--bad:#ef476f}
*{box-sizing:border-box}html{height:100%;overflow:hidden}body{height:100%;margin:0;background:var(--bg);color:var(--text);font:14px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:10px 10px calc(110px + env(safe-area-inset-bottom))}.shell{max-width:760px;margin:0 auto;min-height:100%}.card{border:1px solid var(--border);background:var(--surface);border-radius:18px;overflow:hidden}.head{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid var(--border)}.mark{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--surface2);font-weight:800}.grow{flex:1}.title{font-weight:800}.sub{font-size:11px;color:var(--muted)}.pill{font-size:10px;font-weight:800;border:1px solid var(--border);border-radius:999px;padding:5px 8px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px}.stat{border:1px solid var(--border);background:var(--surface2);border-radius:13px;padding:11px;min-height:82px;transition:border-color .18s,background .18s,box-shadow .18s}.stat b{display:block;margin-top:6px;font-size:13px}.stat.state-red{border-color:color-mix(in srgb,var(--bad) 58%,var(--border));background:color-mix(in srgb,var(--bad) 10%,var(--surface2));box-shadow:inset 3px 0 0 var(--bad)}.stat.state-blue{border-color:color-mix(in srgb,var(--info) 58%,var(--border));background:color-mix(in srgb,var(--info) 10%,var(--surface2));box-shadow:inset 3px 0 0 var(--info)}.stat.state-orange{border-color:color-mix(in srgb,var(--ready) 58%,var(--border));background:color-mix(in srgb,var(--ready) 10%,var(--surface2));box-shadow:inset 3px 0 0 var(--ready)}.stat.state-green{border-color:color-mix(in srgb,var(--good) 58%,var(--border));background:color-mix(in srgb,var(--good) 10%,var(--surface2));box-shadow:inset 3px 0 0 var(--good)}.miniState.state-red{color:var(--bad)}.miniState.state-blue{color:var(--info)}.miniState.state-orange{color:var(--ready)}.miniState.state-green{color:var(--good)}.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--good);margin-right:5px}.dot.warn{background:var(--warn)}.dot.bad{background:var(--bad)}
.legend{display:flex;gap:10px;flex-wrap:wrap;padding:0 12px 10px;font-size:9px;color:var(--muted);font-weight:700}.legend span{display:flex;align-items:center;gap:5px}.legend i{width:7px;height:7px;border-radius:50%;display:inline-block}.legend .red{background:var(--bad)}.legend .blue{background:var(--info)}.legend .orange{background:var(--ready)}.legend .green{background:var(--good)}.section{border-top:1px solid var(--border);padding:12px}.section h2{font-size:12px;margin:0 0 9px}.sectionLead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.sectionLead h2{margin:0}.miniState{font-size:9px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.08em}.row{display:flex;gap:7px;flex-wrap:wrap}.opsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.opsGrid .btn{width:100%;padding:10px 7px}.btn{appearance:none;border:1px solid var(--border);background:var(--surface2);color:var(--text);border-radius:10px;padding:9px 11px;font-weight:700;font-size:11px;cursor:pointer}.btn.primary{background:var(--text);color:Canvas;border-color:var(--text)}.btn.danger{border-color:color-mix(in srgb,var(--bad) 45%,var(--border));color:var(--bad)}.btn:disabled{opacity:.55;cursor:not-allowed}.field{display:flex;gap:7px}.field input{min-width:0;flex:1;border:1px solid var(--border);background:var(--surface2);color:var(--text);border-radius:10px;padding:9px 10px;outline:none}.result{margin-top:9px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface2) 75%,transparent);border-radius:11px;padding:10px;font-size:11px;white-space:pre-wrap;max-height:230px;overflow:auto}.hidden{display:none}.full-only{display:none}.fullscreen .full-only{display:block}.fullscreen .grid{grid-template-columns:repeat(4,1fr)}.fullscreen .shell{max-width:980px}.fullscreen{padding-bottom:calc(150px + env(safe-area-inset-bottom))}.customerActions{margin-top:8px}.busy{opacity:.7;pointer-events:none}.pip .grid,.pip .section{display:none}.pip #liveSection{display:block}.pip .card{border-radius:16px}.pip #liveResult{max-height:180px}.pageNav{display:flex;gap:6px;padding:9px 10px;border-bottom:1px solid var(--border);overflow-x:auto;scrollbar-width:none;position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--surface) 96%,transparent);backdrop-filter:blur(12px)}.pageNav::-webkit-scrollbar{display:none}.pageNav .btn{flex:0 0 auto;white-space:nowrap}.pageNav .btn.active{background:var(--text);color:Canvas;border-color:var(--text)}.pageHidden{display:none!important}.refreshMeta{padding:0 12px 10px;font-size:10px;color:var(--muted);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.statusPulse{display:inline-flex;align-items:center;gap:5px}.statusPulse i{width:7px;height:7px;border-radius:50%;background:var(--good);display:inline-block}.statusPulse.busy i{background:var(--ready)}
@media(max-width:520px){body{padding:0 0 calc(120px + env(safe-area-inset-bottom))}.card{border-radius:0;border-left:0;border-right:0}.grid{grid-template-columns:1fr 1fr}.fullscreen .grid{grid-template-columns:1fr 1fr}.opsGrid{grid-template-columns:repeat(3,minmax(0,1fr))}.opsGrid .btn{font-size:10px;padding:9px 5px}}
</style>
</head>
<body>
<div class="shell">
 <div class="card" id="card">
  <div class="head">
   <div class="mark">D</div>
   <div><div class="title">Dev Panel</div><div class="sub">Private developer controls</div></div>
   <div class="grow"></div>
   <span class="pill" id="overall">Loading</span>
   <button class="btn" id="closePanel" aria-label="Close Dev Panel">Close</button>
  </div>
  <nav class="pageNav" id="pageNav"><button class="btn active" data-page-btn="overview">Overview</button><button class="btn" data-page-btn="releases">Releases</button><button class="btn" data-page-btn="services">Services</button><button class="btn full-only" data-page-btn="customers">Customers</button><button class="btn full-only" data-page-btn="logs">Logs</button></nav>
  <div class="refreshMeta"><span class="statusPulse" id="statusPulse"><i></i><span id="refreshState">Live status</span></span><span id="lastChecked">Not refreshed yet</span></div>
  <div class="grid" data-page="overview">
   <div class="stat" id="baseCard"><span class="sub">Base release</span><b id="baseState">—</b><span class="sub" id="baseDetail"></span></div>
   <div class="stat" id="engineCard"><span class="sub">Engine update</span><b id="engineState">—</b><span class="sub" id="engineDetail"></span></div>
   <div class="stat" id="lmCard"><span class="sub">Licence Manager</span><b id="lmState">—</b><span class="sub" id="lmDetail"></span></div>
   <div class="stat" id="bsCard"><span class="sub">V2 Billing Store</span><b id="bsState">—</b><span class="sub" id="bsDetail"></span></div>
  </div>
  <div class="legend" data-page="overview"><span><i class="red"></i>Failed</span><span><i class="blue"></i>Action required</span><span><i class="orange"></i>Ready to package</span><span><i class="green"></i>Latest</span></div>
  <div class="section" data-page="releases">
   <div class="sectionLead"><h2>Prepare release branches</h2><span class="miniState" id="releaseFreshness">Checking releases</span></div>
   <div class="opsGrid">
    <button class="btn" data-call="prepare" data-target="base">Prepare Base</button>
    <button class="btn" data-call="prepare" data-target="engine">Prepare Engine</button>
    <button class="btn primary" data-call="prepare" data-target="both">Prepare Both</button>
   </div>
   <div class="result hidden" id="prepareResult"></div>
  </div>
  <div class="section" data-page="services">
   <div class="sectionLead"><h2>Licence Manager</h2><span class="miniState" id="lmDeployState">Checking</span></div>
   <div class="opsGrid">
    <button class="btn" data-deploy="license_manager:scan">Scan</button>
    <button class="btn primary" data-deploy="license_manager:deploy">Deploy</button>
    <button class="btn" data-deploy="license_manager:quick_deploy">Quick Deploy</button>
   </div>
   <div class="result hidden" id="lmServiceResult"></div>
  </div>
  <div class="section" data-page="services">
   <div class="sectionLead"><h2>Billing Store</h2><span class="miniState" id="bsDeployState">Checking</span></div>
   <div class="opsGrid">
    <button class="btn" data-deploy="billing_store:scan">Scan</button>
    <button class="btn primary" data-deploy="billing_store:deploy">Deploy</button>
    <button class="btn" data-deploy="billing_store:quick_deploy">Quick Deploy</button>
   </div>
   <div class="result hidden" id="bsServiceResult"></div>
  </div>
  <div class="section full-only" data-page="customers">
   <h2>Customer / licence</h2>
   <div class="field"><input id="identity" type="email" placeholder="Customer email or ID"><button class="btn primary" id="lookup">Check</button></div>
   <div class="result hidden" id="licenseResult"></div>
   <div class="row customerActions hidden" id="customerActions">
    <button class="btn danger" data-license-action="suspend">Suspend</button>
    <button class="btn" data-license-action="unsuspend">Unsuspend</button>
    <button class="btn danger" data-license-action="revoke">Revoke</button>
    <button class="btn" data-license-action="restore">Restore</button>
    <button class="btn" data-license-action="force_revalidation">Revalidate</button>
    <button class="btn" data-license-action="link">Auto-link</button>
   </div>
  </div>
  <div class="section full-only" data-page="customers">
   <h2>Customer update</h2>
   <div class="sub">Uses the customer identity above and resolves the linked installation through Billing Store.</div>
   <div class="row" style="margin-top:8px">
    <button class="btn" data-update-action="plan">Plan Update</button>
    <button class="btn primary" data-update-action="apply">Apply Update</button>
    <button class="btn danger" data-update-action="rollback">Rollback Update</button>
   </div>
   <div class="result hidden" id="updateResult"></div>
  </div>
  <div class="section full-only" data-page="releases">
   <h2>Release management</h2>
   <div class="field"><input id="releaseId" placeholder="Release ID"><button class="btn" data-release-action="get">Open</button></div>
   <div class="row" style="margin-top:8px">
    <button class="btn" data-release-action="validate">Validate</button>
    <button class="btn primary" data-release-action="publish">Publish</button>
    <button class="btn danger" data-release-action="unpublish">Unpublish</button>
   </div>
   <div class="result hidden" id="releaseResult"></div>
  </div>
  <div class="section hidden" id="liveSection" data-page="logs">
   <h2>Live job</h2>
   <div class="result" id="liveResult">Waiting for workflow state…</div>
  </div>
  <div class="section">
   <div class="row">
    <button class="btn" id="refresh">Refresh</button>
    <button class="btn primary" id="fullscreen">Open Full Dev Panel</button>
    <button class="btn hidden" id="pin">Pin Live Job</button>
   </div>
  </div>
 </div>
</div>
<script>
const $=id=>document.getElementById(id);
let current=window.openai?.toolOutput||{},lastRun=null,lastRunTarget=null,liveTimer=null,statusTimer=null,currentPage="overview",refreshingStatus=false;
function short(v){return v?String(v).slice(0,8):"—"}
function text(el,value){$(el).textContent=value==null?"—":String(value)}
function stateClass(el,state){const node=$(el);if(!node)return;node.classList.remove("state-red","state-blue","state-orange","state-green");if(state)node.classList.add("state-"+state)}
function newestRun(...runs){return runs.filter(Boolean).sort((a,b)=>new Date(b.created_at||0).getTime()-new Date(a.created_at||0).getTime())[0]||null}
function showResult(id,value){const el=$(id);el.classList.remove("hidden");el.textContent=typeof value==="string"?value:JSON.stringify(value,null,2)}
function setRefreshMeta(label="Live status",busy=false){const pulse=$("statusPulse");if(pulse)pulse.classList.toggle("busy",busy);text("refreshState",label);}
function markChecked(){text("lastChecked","Checked "+new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}));}
function showPage(page){currentPage=page||"overview";document.querySelectorAll("[data-page]").forEach(el=>el.classList.toggle("pageHidden",el.dataset.page!==currentPage));document.querySelectorAll("[data-page-btn]").forEach(btn=>btn.classList.toggle("active",btn.dataset.pageBtn===currentPage));try{window.openai?.setWidgetState?.({devPage:currentPage})}catch{}if(currentPage==="logs"&&lastRun)startLive();}
function unpack(result){return result?.structuredContent||result?.content?.find?.(x=>x.type==="text")?.text||result}
function render(data){
 current=data||{};
 const base=data?.base||{},engine=data?.engine||{},lm=data?.licenseManager||{},bs=data?.billingStore||{};
 const baseAhead=Number(base.commitsAhead||0),engineAhead=Number(engine.commitsAhead||0);
 const basePrepareFailed=!base.preparedCurrent&&base.latestPrepare?.status==="completed"&&base.latestPrepare?.conclusion==="failure";
 const enginePrepareFailed=!engine.preparedCurrent&&engine.latestPrepare?.status==="completed"&&engine.latestPrepare?.conclusion==="failure";
 const baseColor=base.disabled?null:base.preparedCurrent?"orange":basePrepareFailed?"red":"blue";
 const engineColor=engine.disabled?null:engine.preparedCurrent?"orange":enginePrepareFailed?"red":"blue";
 text("baseState",base.disabled?"Disabled":base.preparedCurrent?"Ready to package":basePrepareFailed?"Prepare failed":"Prepare required");
 text("baseDetail",base.disabled?"":(base.preparedCurrent?("release "+short(base.preparedSha)):basePrepareFailed?"Last prepare workflow failed":(baseAhead+" commit"+(baseAhead===1?"":"s")+" ahead")));
 text("engineState",engine.disabled?"Disabled":engine.preparedCurrent?"Ready to package":enginePrepareFailed?"Prepare failed":"Prepare required");
 text("engineDetail",engine.disabled?"":(engine.preparedCurrent?("release "+short(engine.preparedSha)):enginePrepareFailed?"Last prepare workflow failed":(engineAhead+" commit"+(engineAhead===1?"":"s")+" ahead")));
 stateClass("baseCard",baseColor);stateClass("engineCard",engineColor);

 const lmService=lm?.service||{},lmHealth=lm?.health,lmLocked=Boolean(lm?.lockdown?.locked),lmCurrent=Boolean(lmService.productionCurrent),bsCurrent=Boolean(bs?.productionCurrent);
 const lmAttempt=newestRun(lmService.latestDeploy,lmService.latestQuickDeploy),bsAttempt=newestRun(bs?.latestDeploy,bs?.latestQuickDeploy);
 const lmFailed=lmAttempt?.status==="completed"&&lmAttempt?.conclusion==="failure";
 const bsFailed=bsAttempt?.status==="completed"&&bsAttempt?.conclusion==="failure";
 const lmMain=lmService.currentSha,lmProd=lmService.lastSuccessful?.head_sha,bsMain=bs?.currentSha,bsProd=bs?.lastSuccessful?.head_sha;
 const lmColor=lm?.disabled?null:lmLocked?"red":lmFailed?"red":lmCurrent?"green":"blue";
 const bsColor=bs?.disabled?null:bsFailed?"red":bsCurrent?"green":"blue";
 text("lmState",lm?.disabled?"Disabled":lmLocked?"LOCKED DOWN":lmFailed?"Deploy failed":lmCurrent?"Latest deployed":"Update available");
 text("lmDetail",lm?.disabled?"":lmLocked?(lm?.lockdown?.message||"Emergency authority lockdown active"):(lmFailed?("failed "+short(lmAttempt?.head_sha)):("main "+short(lmMain)+" · prod "+short(lmProd))));
 text("bsState",bs?.disabled?"Disabled":bsFailed?"Deploy failed":bsCurrent?"Latest deployed":"Update available");
 text("bsDetail",bs?.disabled?"":(bsFailed?("failed "+short(bsAttempt?.head_sha)):("main "+short(bsMain)+" · prod "+short(bsProd))));
 stateClass("lmCard",lmColor);stateClass("bsCard",bsColor);

 const releasesReady=base.preparedCurrent&&engine.preparedCurrent;
 const releaseFailed=basePrepareFailed||enginePrepareFailed;
 text("releaseFreshness",releaseFailed?"Prepare failed":releasesReady?"Ready to package":(baseAhead+engineAhead)+" commits to prepare");
 stateClass("releaseFreshness",releaseFailed?"red":releasesReady?"orange":"blue");
 text("lmDeployState",lm?.disabled?"Disabled":lmLocked?"LOCKED":lmFailed?"Failed":lmCurrent?"Latest":"Update available");stateClass("lmDeployState",lmColor);
 text("bsDeployState",bs?.disabled?"Disabled":bsFailed?"Failed":bsCurrent?"Latest":"Update available");stateClass("bsDeployState",bsColor);
 const anyFailure=basePrepareFailed||enginePrepareFailed||lmLocked||lmFailed||bsFailed;
 const anyAction=!base.preparedCurrent||!engine.preparedCurrent||!lmCurrent||!bsCurrent;
 text("overall",anyFailure?"Failure":anyAction?"Action needed":"Latest");stateClass("overall",anyFailure?"red":anyAction?"blue":"green");
}
async function call(name,args={}){
 document.body.classList.add("busy");
 try{
  if(!window.openai?.callTool)throw new Error("ChatGPT tool bridge is unavailable.");
  const result=await window.openai.callTool(name,args);
  const value=unpack(result);
  if(value?.run){lastRun=value.run;lastRunTarget=args?.target||null}
  if(value?.results){
   const item=value.results.find?.(x=>x.run);
   if(item?.run){lastRun=item.run;lastRunTarget=item.target||args?.target||null}
  }
  if(lastRun&&lastRunTarget){$("pin").classList.remove("hidden");startLive();}
  return value;
 }finally{document.body.classList.remove("busy")}
}
async function refreshStatus(){if(refreshingStatus)return current;refreshingStatus=true;setRefreshMeta("Refreshing…",true);try{const r=await call("status",{scope:"all"});render(r);markChecked();setRefreshMeta("Live status",false);return r}catch(e){setRefreshMeta("Refresh failed",false);return null}finally{refreshingStatus=false}}
function startStatusPolling(){if(statusTimer)clearInterval(statusTimer);statusTimer=setInterval(()=>void refreshStatus(),15000)}
document.querySelectorAll("[data-call=prepare]").forEach(btn=>btn.addEventListener("click",async()=>{try{showResult("prepareResult",await call("prepare",{target:btn.dataset.target}));await refreshStatus()}catch(e){showResult("prepareResult",{error:e.message})}}));
$("lookup").addEventListener("click",async()=>{const identity=$("identity").value.trim();if(!identity)return;try{const r=await call("license",{identity,view:"summary"});showResult("licenseResult",r);$("customerActions").classList.remove("hidden")}catch(e){showResult("licenseResult",{error:e.message})}});
document.querySelectorAll("[data-license-action]").forEach(btn=>btn.addEventListener("click",async()=>{const identity=$("identity").value.trim();if(!identity)return;try{const r=await call("license_change",{identity,action:btn.dataset.licenseAction});showResult("licenseResult",r)}catch(e){showResult("licenseResult",{error:e.message})}}));
document.querySelectorAll("[data-deploy]").forEach(btn=>btn.addEventListener("click",async()=>{const [target,action]=btn.dataset.deploy.split(":"),resultId=target==="license_manager"?"lmServiceResult":"bsServiceResult";try{showResult(resultId,await call("deploy",{target,action}));await refreshStatus()}catch(e){showResult(resultId,{error:e.message})}}));
document.querySelectorAll("[data-update-action]").forEach(btn=>btn.addEventListener("click",async()=>{const identity=$("identity").value.trim();if(!identity)return showResult("updateResult",{error:"Enter a customer email or ID above first."});try{showResult("updateResult",await call("update",{identity,action:btn.dataset.updateAction}))}catch(e){showResult("updateResult",{error:e.message})}}));
document.querySelectorAll("[data-release-action]").forEach(btn=>btn.addEventListener("click",async()=>{const release_id=$("releaseId").value.trim();if(!release_id)return showResult("releaseResult",{error:"Enter a release ID first."});try{showResult("releaseResult",await call("release",{release_id,action:btn.dataset.releaseAction}))}catch(e){showResult("releaseResult",{error:e.message})}}));
$("refresh").addEventListener("click",async()=>{const r=await refreshStatus();if(!r)showResult("prepareResult",{error:"Status refresh failed"})});
document.querySelectorAll("[data-page-btn]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.pageBtn)));
$("fullscreen").addEventListener("click",async()=>{if(window.openai?.requestDisplayMode)await window.openai.requestDisplayMode({mode:"fullscreen"})});
$("closePanel").addEventListener("click",async()=>{try{if(window.openai?.requestClose){await window.openai.requestClose();return}if(window.openai?.requestDisplayMode&&window.openai?.displayMode!=="inline"){await window.openai.requestDisplayMode({mode:"inline"});return}}catch{}$("card").classList.add("hidden")});
async function refreshLive(){
 if(!lastRun?.id||!lastRunTarget||!window.openai?.callTool)return;
 try{
  const value=unpack(await window.openai.callTool("logs",{target:lastRunTarget,run_id:Number(lastRun.id)}));
  $("liveSection").classList.remove("hidden");
  const run=value?.run||{},jobs=value?.jobs||[];
  const lines=[lastRunTarget+" · run #"+(run.run_number||run.id||lastRun.id)+" · "+(run.status||"unknown")+(run.conclusion?" / "+run.conclusion:"")];
  for(const job of jobs)lines.push((job.conclusion==="success"?"✓":job.conclusion==="failure"?"✕":"…")+" "+job.name+" · "+job.status+(job.conclusion?" / "+job.conclusion:""));
  $("liveResult").textContent=lines.join("\n");
  if(run.status==="completed"&&liveTimer){clearInterval(liveTimer);liveTimer=null;void refreshStatus()}
 }catch(e){$("liveSection").classList.remove("hidden");$("liveResult").textContent="Live job read failed: "+e.message}
}
function startLive(){void refreshLive();if(liveTimer)clearInterval(liveTimer);liveTimer=setInterval(()=>void refreshLive(),4000)}
$("pin").addEventListener("click",async()=>{if(window.openai?.requestDisplayMode)await window.openai.requestDisplayMode({mode:"pip"});startLive()});
function applyMode(){const mode=window.openai?.displayMode;document.body.classList.toggle("fullscreen",mode==="fullscreen");document.body.classList.toggle("pip",mode==="pip");if(mode==="pip"&&lastRun&&!liveTimer)startLive()}
window.addEventListener("openai:set_globals",()=>{applyMode();if(window.openai?.toolOutput)render(window.openai.toolOutput)});
if(!MCP_UI_POLICY.fullscreen)$("fullscreen").classList.add("hidden");
if(!MCP_UI_POLICY.pip)$("pin").classList.add("hidden");
applyMode();render(current);showPage(window.openai?.widgetState?.devPage||"overview");markChecked();startStatusPolling();setTimeout(()=>void refreshStatus(),250);
</script>
</body>
</html>`;

export function devPanelUiResource(settings:any={}){
 const origin=String(process.env.DEV_MCP_PUBLIC_ORIGIN||process.env.APP_URL||"https://dev.incendiarynetworks.cc").replace(/\/+$/,"");
 const policy={fullscreen:settings.ui_fullscreen_enabled!==false,pip:settings.ui_pip_enabled!==false};
 const modes=["inline",...(policy.fullscreen?["fullscreen"]:[]),...(policy.pip?["pip"]:[])];
 const html=DEV_PANEL_UI_HTML.replace("<script>\nconst $=", "<script>\nconst MCP_UI_POLICY="+JSON.stringify(policy)+";\nconst $=");
 return {
  uri:DEV_PANEL_UI_URI,
  name:"Private Dev Panel",
  description:"Mobile-first private developer controls for Base, Engine, deployments and customer licensing.",
  mimeType:"text/html;profile=mcp-app",
  text:html,
  _meta:{
   ui:{prefersBorder:true,domain:origin,csp:{connectDomains:[origin],resourceDomains:[]}},
   "openai/ui":{availableDisplayModes:modes},
   "openai/widgetDescription":"Private Dev Panel controls for release preparation, deployments, updates and customer licence management."
  }
 };
}
