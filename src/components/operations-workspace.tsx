import {useCallback,useEffect,useMemo,useState} from "react";
import {Activity,CheckCircle2,ExternalLink,RefreshCw,Server,XCircle} from "lucide-react";
import {getOperationsState} from "@/lib/panel.server";

const SYSTEMS=[
 {key:"baseSource",label:"V1 Vercel Base"},
 {key:"engineSource",label:"V1 Vercel Engine"},
 {key:"licenseManager",label:"Custom License Manager"},
 {key:"billingStore",label:"V2 Billing Store"},
] as const;

function time(v?:string|null){return v?new Date(v).toLocaleString():"—"}
function state(run:any){if(!run)return "NO RUN";if(run.status!=="completed")return "RUNNING";return String(run.conclusion||"UNKNOWN").toUpperCase()}
function tone(value:any){const s=String(value||"").toLowerCase();if(["failure","failed","error"].some(x=>s.includes(x)))return "danger";if(["running","queued","in_progress","pending"].some(x=>s.includes(x)))return "warning";if(["success","passed","ready"].some(x=>s.includes(x)))return "success";return "neutral"}
function Pill({text}:{text:string}){return <span className={`orbit-status-pill orbit-status-tone-${tone(text)}`}>{text}</span>}

export function OperationsWorkspace({session}:{session:any}){
 const [data,setData]=useState<any>({systems:{}});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");

 const load=useCallback(async(silent=false)=>{
  if(!silent)setLoading(true);
  try{setData(await getOperationsState({data:{token:session.token}}));setError("")}
  catch(x:any){setError(x.message||"Unable to load system status.")}
  finally{if(!silent)setLoading(false)}
 },[session.token]);

 useEffect(()=>{void load();const timer=setInterval(()=>void load(true),15000);return()=>clearInterval(timer)},[load]);

 const running=useMemo(()=>SYSTEMS.some(x=>{const r=data.systems?.[x.key]?.run;return r&&r.status!=="completed"}),[data]);

 return <section className="space-y-4">
  <div className="orbit-page-hero">
   <div>
    <p className="orbit-eyebrow">ORBITFS / STATUS</p>
    <h1>System Status</h1>
    <p>Read-only GitHub and release-system status for the two source repositories, License Manager and Billing Store. Release control stays in Billing Store; Dev Panel only exposes Unpublish from the registry.</p>
   </div>
   <div className="flex items-center gap-2">
    <span className="orbit-status-chip"><span className={`orbit-dot ${running?"orbit-dot-good":""}`}/>{running?"LIVE RUNS":"STATUS MONITOR"}</span>
    <button className="button-secondary" onClick={()=>load()} disabled={loading}><RefreshCw size={14} className={loading?"animate-spin":""}/>Refresh</button>
   </div>
  </div>

  {error&&<div className="rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2.5 text-xs text-red-100">{error}</div>}

  <div className="grid gap-3 xl:grid-cols-2">
   {SYSTEMS.map(system=>{
    const s=data.systems?.[system.key]||{};
    const run=s.run;
    return <article key={system.key} className="release-surface overflow-hidden">
     <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex min-w-0 items-center gap-3"><span className="orbit-section-icon"><Server size={15}/></span><div className="min-w-0"><p className="text-sm font-semibold">{system.label}</p><code className="block truncate text-[10px] text-muted-foreground">{s.repo||"—"}</code></div></div>
      <Pill text={state(run)}/>
     </div>
     <div className="grid gap-px bg-border sm:grid-cols-2">
      <div className="orbit-tech-stat"><span>Main commit</span><strong className="font-mono">{s.currentSha?.slice(0,12)||"—"}</strong></div>
      <div className="orbit-tech-stat"><span>Latest workflow</span><strong>{run?run.name||("#"+run.run_number):"No run"}</strong></div>
      <div className="orbit-tech-stat"><span>Updated</span><strong>{time(run?.updated_at)}</strong></div>
      <div className="orbit-tech-stat"><span>Last published/deployed SHA</span><strong className="font-mono">{s.deployedSha?.slice(0,12)||"—"}</strong></div>
     </div>
     <div className="p-4">
      {run?<div className="space-y-2">
       <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2">{run.conclusion==="success"?<CheckCircle2 size={14} className="text-emerald-400"/>:run.conclusion==="failure"?<XCircle size={14} className="text-red-400"/>:<Activity size={14} className="text-primary"/>}<span className="text-xs">{run.status}{run.conclusion?" · "+run.conclusion:""}</span></div>{run.html_url&&<a className="button-secondary" href={run.html_url} target="_blank" rel="noreferrer"><ExternalLink size={13}/>GitHub</a>}</div>
       {(s.jobs||[]).slice(0,5).map((job:any)=><div key={job.id} className="flex items-center justify-between gap-3 rounded-lg border bg-background/30 px-3 py-2"><div className="min-w-0"><p className="truncate text-[10px] font-medium">{job.name}</p><p className="text-[9px] text-muted-foreground">{job.status}</p></div><Pill text={job.conclusion||job.status||"pending"}/></div>)}
      </div>:<div className="py-5 text-center text-xs text-muted-foreground">No workflow status is available.</div>}
     </div>
    </article>
   })}
  </div>
 </section>;
}
