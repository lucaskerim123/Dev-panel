import {useCallback,useEffect,useState} from "react";
import {
  Activity,AppWindow,Boxes,Copy,KeyRound,Link2,LockKeyhole,Power,RefreshCw,
  Server,ShieldCheck,SlidersHorizontal,Trash2,Unplug,Workflow
} from "lucide-react";
import {
  getMcpConnectionsForPanel,getMcpSettingsForPanel,manageMcpConnectionForPanel,updateMcpSettingsForPanel
} from "@/lib/dev-mcp.server";

type SettingItem=readonly [string,string,string];

const GENERAL:SettingItem[]=[
 ["enabled","MCP enabled","Master switch for the private /devmcp endpoint."],
 ["read_only_mode","Read-only mode","Keep lookups, status and diagnostics available while blocking all mutations."],
 ["allow_mutations","Allow write controls","Global write gate for prepare, deployment, update, release and licence changes."],
];
const SYSTEMS:SettingItem[]=[
 ["expose_base","V1 Base","Expose Base release status, preparation and workflow state."],
 ["expose_engine","V1 Engine","Expose Engine/update release status, preparation and workflow state."],
 ["expose_license_manager","Custom Licence Manager","Expose authoritative licence, release, runtime and updater data."],
 ["expose_billing_store","V2 Billing Store","Allow customer/email resolution, installation context and customer deployer execution."],
];
const TOOLS:SettingItem[]=[
 ["tool_show_dev","show_dev","Embedded ChatGPT Dev Panel interface."],
 ["tool_status","status","System, release branch, service and customer status."],
 ["tool_prepare","prepare","Prepare Base, Engine or both release branches."],
 ["tool_deploy","deploy","Service scan, deploy, Quick Deploy, redeploy and workflow controls."],
 ["tool_release","release","Authoritative release inspection and lifecycle actions."],
 ["tool_update","update","Customer update inspect/plan/apply/retry/rollback."],
 ["tool_license","license","Customer and licence lookup, runtime, components, pulse and history."],
 ["tool_license_change","license_change","Licence state, component access, linking and installation control."],
 ["tool_diagnose","diagnose","Combined Base/Engine/services/customer diagnostics."],
 ["tool_logs","logs","GitHub Actions run, job and step state."],
];
const MUTATIONS:SettingItem[]=[
 ["allow_prepare","Prepare release branches","Allow guarded Base/Engine release-branch preparation."],
 ["allow_service_scan","Service Full Scan","Allow controlled Full Scan workflow dispatch."],
 ["allow_service_deploy","Service deploy/redeploy","Allow normal production deploy and safe redeploy workflows."],
 ["allow_quick_deploy","Quick Deploy","Allow service Quick Deploy workflows, including Billing Store branch deploy."],
 ["allow_workflow_control","Cancel / retry workflows","Allow cancellation or rerun of explicit workflow run IDs."],
 ["allow_release_review","Approve / reject releases","Allow License Manager review decisions."],
 ["allow_release_publish","Release lifecycle","Allow publish, unpublish, archive, restore, promote and pause actions."],
 ["allow_release_rollback","Release rollback / revert","Allow release rollback or revert actions."],
 ["allow_update_apply","Apply customer updates","Allow update apply and retry through the customer deployer."],
 ["allow_update_rollback","Rollback customer updates","Allow update rollback where the existing customer deployer supports it."],
 ["allow_license_state_changes","Licence state/runtime","Allow suspend, restore, revoke, rotate and forced runtime revalidation."],
 ["allow_license_entitlement_changes","Licence components","Allow component/entitlement access changes."],
 ["allow_installation_unlock","Installation unlock","Allow unlocking a matching licence installation."],
 ["allow_license_linking","Customer licence linking","Allow email/customer records to be linked to an existing authoritative licence."],
];
const UI:SettingItem[]=[
 ["ui_enabled","Embedded ChatGPT UI","Expose the MCP App resource and show_dev tool."],
 ["ui_fullscreen_enabled","Fullscreen mode","Allow the embedded Dev Panel to expand into fullscreen."],
 ["ui_pip_enabled","Live PiP mode","Allow active workflow state to remain pinned while chatting."],
];
const OAUTH:SettingItem[]=[
 ["oauth_cimd_enabled","CIMD","Preferred Client ID Metadata Document flow for current ChatGPT connections."],
 ["oauth_dcr_enabled","DCR fallback","Keep Dynamic Client Registration available for compatibility."],
 ["oauth_refresh_tokens_enabled","Refresh tokens","Issue refresh tokens so linked ChatGPT/Codex sessions can stay connected."],
];

function ToggleRow({item,value,busy,onToggle}:{item:SettingItem;value:boolean;busy:boolean;onToggle:(key:string,value:boolean)=>void}){
 const [key,label,detail]=item;
 return <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3 last:border-b-0">
  <div className="min-w-0"><div className="text-xs font-semibold">{label}</div><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{detail}</p></div>
  <button disabled={busy} onClick={()=>onToggle(key,!value)} className={"min-w-[72px] rounded-full border px-3 py-1.5 text-[10px] font-bold transition "+(value?"border-emerald-400/40 bg-emerald-400/10 text-emerald-300":"border-border bg-muted text-muted-foreground")}>{value?"ON":"OFF"}</button>
 </div>;
}
function SettingsCard({title,description,icon:Icon,items,settings,busy,onToggle}:{title:string;description:string;icon:any;items:readonly SettingItem[];settings:any;busy:string;onToggle:(key:string,value:boolean)=>void}){
 return <section className="release-surface overflow-hidden">
  <div className="orbit-section-bar"><div className="orbit-section-head"><span className="orbit-section-icon"><Icon size={15}/></span><div><h2>{title}</h2><p>{description}</p></div></div></div>
  <div>{items.map(item=><ToggleRow key={item[0]} item={item} value={Boolean(settings?.[item[0]])} busy={busy===item[0]} onToggle={onToggle}/>)}</div>
 </section>;
}

export function McpControlsWorkspace({session}:{session:any}){
 const [settings,setSettings]=useState<any>(null);
 const [runtime,setRuntime]=useState<any>(null);
 const [connections,setConnections]=useState<any>({clients:[],activeTokens:0});
 const [busy,setBusy]=useState("");
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");

 const load=useCallback(async()=>{
  setError("");
  try{
   const [config,oauth]=await Promise.all([
    getMcpSettingsForPanel({data:{token:session.token}}),
    getMcpConnectionsForPanel({data:{token:session.token}})
   ]);
   setSettings(config.settings);setRuntime(config.runtime);setConnections(oauth);
  }catch(x:any){setError(x?.message||"Unable to load MCP controls")}
 },[session.token]);
 useEffect(()=>{void load()},[load]);

 async function toggle(key:string,value:boolean){
  setBusy(key);setError("");setNotice("");
  try{
   const r=await updateMcpSettingsForPanel({data:{token:session.token,patch:{[key]:value}}});
   setSettings(r.settings);setNotice("MCP setting saved.");
  }catch(x:any){setError(x?.message||"Unable to save MCP setting")}finally{setBusy("")}
 }
 async function copy(value:string,label:string){
  try{await navigator.clipboard.writeText(value);setNotice(label+" copied.")}catch{}
 }
 async function connectionAction(clientId:string,removeClient=false){
  setBusy("connection:"+clientId);setError("");setNotice("");
  try{
   await manageMcpConnectionForPanel({data:{token:session.token,clientId,removeClient}});
   setConnections(await getMcpConnectionsForPanel({data:{token:session.token}}));
   setNotice(removeClient?"Client removed.":"Client sessions revoked.");
  }catch(x:any){setError(x?.message||"Unable to update OAuth connection")}finally{setBusy("")}
 }
 async function revokeAll(){
  setBusy("revoke-all");setError("");setNotice("");
  try{
   await manageMcpConnectionForPanel({data:{token:session.token,all:true}});
   setConnections(await getMcpConnectionsForPanel({data:{token:session.token}}));
   setNotice("All MCP OAuth sessions revoked.");
  }catch(x:any){setError(x?.message||"Unable to revoke sessions")}finally{setBusy("")}
 }

 const endpoint=runtime?.endpoint||"https://dev.incendiarynetworks.cc/devmcp";
 const clients=connections?.clients||[];
 return <section className="space-y-4">
  <div className="orbit-page-hero">
   <div><p className="orbit-eyebrow">NETWORKING / MCP</p><h1>MCP Controls</h1><p>Private ChatGPT/Codex control of the existing Dev Panel, Base/Engine workflows and authoritative service APIs.</p></div>
   <button className="button-secondary" onClick={()=>void load()}><RefreshCw size={14}/>Refresh</button>
  </div>

  {error&&<div className="rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2.5 text-xs text-red-100">{error}</div>}
  {notice&&<div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2.5 text-xs text-emerald-100">{notice}</div>}

  <section className="release-surface p-4">
   <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
    <div>
     <div className="flex items-center gap-2"><Server size={15}/><strong className="text-sm">Private Developer MCP</strong></div>
     <div className="mt-2 flex min-w-0 items-center gap-2"><code className="truncate text-xs text-muted-foreground">{endpoint}</code><button className="button-secondary !px-2 !py-1" onClick={()=>void copy(endpoint,"MCP endpoint")}><Copy size={12}/></button></div>
     <p className="mt-2 text-[11px] text-muted-foreground">One control path. Chat commands and embedded UI invoke the same tools.</p>
    </div>
    <div className="flex flex-wrap gap-2">
     <span className={"orbit-status-pill "+(settings?.enabled?"orbit-status-tone-success":"orbit-status-tone-warning")}>{settings?.enabled?"ONLINE":"DISABLED"}</span>
     <span className="orbit-status-pill">{clients.length} CLIENT{clients.length===1?"":"S"}</span>
     <span className="orbit-status-pill">{Number(connections?.activeTokens||0)} ACTIVE TOKENS</span>
    </div>
   </div>
  </section>

  <div className="grid gap-4 xl:grid-cols-2">
   <SettingsCard title="General" description="Master availability and write posture." icon={Power} items={GENERAL} settings={settings} busy={busy} onToggle={toggle}/>
   <SettingsCard title="Systems" description="Which existing systems the MCP is allowed to reach." icon={Boxes} items={SYSTEMS} settings={settings} busy={busy} onToggle={toggle}/>
  </div>

  <SettingsCard title="Tool Access" description="Control exactly which top-level tools ChatGPT/Codex can discover and invoke." icon={SlidersHorizontal} items={TOOLS} settings={settings} busy={busy} onToggle={toggle}/>

  <SettingsCard title="Mutation Permissions" description="Fine-grained server-side gates beneath the write tools. Turning one off blocks that operation even if the tool remains visible." icon={Workflow} items={MUTATIONS} settings={settings} busy={busy} onToggle={toggle}/>

  <div className="grid gap-4 xl:grid-cols-2">
   <SettingsCard title="ChatGPT UI" description="Control the embedded MCP App surface without affecting normal chat commands." icon={AppWindow} items={UI} settings={settings} busy={busy} onToggle={toggle}/>
   <SettingsCard title="OAuth Client Registration" description="CIMD is preferred; DCR remains available as a compatibility fallback." icon={KeyRound} items={OAUTH} settings={settings} busy={busy} onToggle={toggle}/>
  </div>

  <section className="release-surface overflow-hidden">
   <div className="orbit-section-bar"><div className="orbit-section-head"><span className="orbit-section-icon"><LockKeyhole size={15}/></span><div><h2>OAuth Security</h2><p>Core security requirements stay fixed rather than becoming bypass switches.</p></div></div></div>
   <div className="grid gap-px bg-border/50 sm:grid-cols-2 xl:grid-cols-4">
    {[
     ["Owner only","Dev Panel owner account"],
     ["PKCE","S256 required"],
     ["Resource binding","/devmcp required"],
     ["Token auth","Public client / none"],
    ].map(([a,b])=><div key={a} className="bg-background/80 p-4"><div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck size={13}/>{a}</div><p className="mt-1 text-[11px] text-muted-foreground">{b}</p></div>)}
   </div>
   <div className="grid gap-2 border-t border-border/60 p-4 text-[11px] md:grid-cols-2">
    <button className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left" onClick={()=>void copy(runtime?.protectedResourceMetadata||"","Protected resource metadata URL")}><span className="truncate">{runtime?.protectedResourceMetadata}</span><Copy size={12}/></button>
    <button className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left" onClick={()=>void copy(runtime?.authorizationMetadata||"","Authorization metadata URL")}><span className="truncate">{runtime?.authorizationMetadata}</span><Copy size={12}/></button>
   </div>
  </section>

  <section className="release-surface overflow-hidden">
   <div className="orbit-section-bar"><div className="orbit-section-head"><span className="orbit-section-icon"><Link2 size={15}/></span><div><h2>Connected OAuth Clients</h2><p>Registered DCR clients and cached CIMD identities. Tokens are stored hashed; this view shows connection state only.</p></div></div><button disabled={busy==="revoke-all"} className="button-secondary" onClick={()=>void revokeAll()}><Unplug size={13}/>Revoke all sessions</button></div>
   {clients.length===0?<div className="p-6 text-center text-xs text-muted-foreground">No OAuth clients have connected yet.</div>:
    <div>{clients.map((client:any)=>{
     const id=String(client.client_id||"");
     const active=Number(client.activeAccess||0)+Number(client.activeRefresh||0);
     return <div key={id} className="border-b border-border/60 p-4 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
       <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><strong className="text-xs">{client.client_name||"OAuth client"}</strong><span className="orbit-status-pill">{String(client.registration_method||"dcr").toUpperCase()}</span><span className={"orbit-status-pill "+(active?"orbit-status-tone-success":"")}>{active} ACTIVE</span></div>
        <code className="mt-2 block truncate text-[10px] text-muted-foreground">{id}</code>
        <p className="mt-1 text-[10px] text-muted-foreground">Access {Number(client.activeAccess||0)} · Refresh {Number(client.activeRefresh||0)} · Last issued {client.lastIssuedAt?new Date(client.lastIssuedAt).toLocaleString():"—"}</p>
       </div>
       <div className="flex flex-wrap gap-2">
        <button disabled={busy==="connection:"+id} className="button-secondary" onClick={()=>void connectionAction(id,false)}><Unplug size={13}/>Revoke sessions</button>
        <button disabled={busy==="connection:"+id} className="button-secondary" onClick={()=>void connectionAction(id,true)}><Trash2 size={13}/>Remove client</button>
       </div>
      </div>
     </div>
    })}</div>}
  </section>

  <section className="release-surface p-4">
   <div className="flex items-start gap-3"><Activity size={16}/><div><strong className="text-sm">Single control path retained</strong><p className="mt-1 text-[11px] leading-5 text-muted-foreground">These settings gate the private MCP only. Licence/release authority remains in Custom Licence Manager; Billing Store remains customer/commerce/deployer context where needed; Base and Engine source workflows remain in their repositories.</p></div></div>
  </section>
 </section>;
}
