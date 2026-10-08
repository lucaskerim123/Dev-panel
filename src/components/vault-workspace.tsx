import { useEffect, useMemo, useState } from "react";
import { KeyRound, Lock, Plus, Search, ShieldCheck, Trash2, Copy, Pencil, X, Eye, EyeOff, Upload, Download } from "lucide-react";
import { getVaultEnvelope, saveVaultEnvelope } from "@/lib/vault.server";
import { VaultVercelSync } from "@/components/vault-vercel-sync";
import { VaultGithubSync } from "@/components/vault-github-sync";
import { VaultInventorySection } from "@/components/vault-inventory-section";
import { VAULT_SYSTEMS, VAULT_SERVICES, normalizeVaultRecord, recordIdentity, type VaultMode } from "@/lib/vault-schema";
import { createEnvelope, decryptEnvelope, type VaultEnvelope, type VaultRecord } from "@/lib/vault-crypto";

const SYSTEMS=[...VAULT_SYSTEMS];
const IMPORT_TEMPLATE={format:"orbitfs-vault-import-v2",entries:[{service:"Vercel",system:"Billing",keyName:"BILLING_API_TOKEN",keyValue:"change-me",usedIn:["main"],destinationSystem:"v2-billing-store"},{service:"GitHub",system:"Billing",keyName:"VERCEL_TOKEN",keyValue:"change-me",usedIn:["fallback"],destinationSystem:"remipetrovich-design/OrbitFS-Billing-Shopfront"}]};
const SERVICES=[...VAULT_SERVICES];

export function VaultWorkspace({session}:{session:any}){
  const [phase,setPhase]=useState<"loading"|"setup"|"locked"|"open">("loading");
  const [envelope,setEnvelope]=useState<VaultEnvelope|null>(null);
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [activePassword,setActivePassword]=useState("");
  const [records,setRecords]=useState<VaultRecord[]>([]);
  const [query,setQuery]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [visible,setVisible]=useState<string[]>([]);
  const [draftVisible,setDraftVisible]=useState(false);
  const [importRows,setImportRows]=useState<VaultRecord[]>([]);
  const [importMode,setImportMode]=useState<"skip"|"override">("skip");
  const [editing,setEditing]=useState<VaultRecord|null>(null);
  const [pendingMigration,setPendingMigration]=useState<VaultRecord[]|null>(null);
  const [draft,setDraft]=useState({system:"Billing",otherSystem:"",service:"Vercel",customService:"",keyName:"",secret:"",usedIn:["main"] as VaultMode[],destinationSystem:""});
  const blankDraft=()=>({system:"Billing",otherSystem:"",service:"Vercel",customService:"",keyName:"",secret:"",usedIn:["main"] as VaultMode[],destinationSystem:""});

  useEffect(()=>{void loadEnvelope()},[session?.token]);

  async function loadEnvelope(){
    setPhase("loading");setError("");
    try{
      const result=await getVaultEnvelope({data:{token:session.token}});
      if(result.exists&&result.envelope){setEnvelope(result.envelope as VaultEnvelope);setPhase("locked")}
      else {setEnvelope(null);setPhase("setup")}
    }catch(x:any){setError(x.message||"Unable to load Vault.");setPhase("locked")}
  }

  async function persist(next:VaultRecord[],passwordOverride=activePassword){
    const nextEnvelope=await createEnvelope(passwordOverride,next);
    const saved=await saveVaultEnvelope({data:{token:session.token,envelope:nextEnvelope}});
    setEnvelope({...nextEnvelope,updatedAt:saved.updatedAt});
    setRecords(next);
  }

  async function unlock(event:React.FormEvent){
    event.preventDefault();setError("");setBusy(true);
    try{
      if(phase==="setup"){
        if(!/^[0-9]{6,}$/.test(password))throw new Error("Vault PIN must contain at least 6 digits (numbers only).");
        if(password!==confirm)throw new Error("Vault PINs do not match.");
        await persist([],password);setActivePassword(password);setRecords([]);setPhase("open");
      }else{
        if(!envelope)throw new Error("Encrypted Vault is unavailable.");
        const original=await decryptEnvelope(password,envelope);
        const normalized=original.map(normalizeVaultRecord);
        setPendingMigration(JSON.stringify(original)===JSON.stringify(normalized)?null:normalized);
        setRecords(normalized);setActivePassword(password);setPhase("open");
      }
      setPassword("");setConfirm("");
    }catch(x:any){setError(phase==="setup"?(x.message||"Unable to create Vault."):"Wrong Vault PIN/password or unreadable Vault.")}
    finally{setBusy(false)}
  }

  function lock(){setVisible([]);setDraftVisible(false);setImportRows([]);setRecords([]);setActivePassword("");setPassword("");setConfirm("");setEditing(null);setPendingMigration(null);setPhase("locked");setNotice("")}

  async function save(event:React.FormEvent){
    event.preventDefault();setError("");setBusy(true);
    try{
      const system=draft.system.trim(),service=draft.service.trim(),keyName=draft.keyName.trim();
      if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(keyName))throw new Error("Use the exact environment key name (letters, numbers and underscores). No guessed prefixes.");
      if(!draft.destinationSystem.trim())throw new Error("Choose the exact destination project or repository before saving.");
      if(!draft.usedIn.length)throw new Error("Select Main and/or Fallback.");
      if(!system||!service||!keyName)throw new Error("System, service and key name are required.");
      const record:VaultRecord={id:editing?.id||crypto.randomUUID(),systems:[system],otherSystem:system==="Other"?draft.otherSystem.trim():"",service,customService:service==="Other"?draft.customService.trim():"",keyName,secret:draft.secret,usedIn:draft.usedIn,destinationSystem:draft.destinationSystem.trim(),needsReview:false,legacyKeyName:editing?.legacyKeyName,vercelTargets:editing?.vercelTargets,githubTargets:editing?.githubTargets};
      const next=editing?records.map(row=>row.id===editing.id?record:row):[record,...records];
      await persist(next);setPendingMigration(null);setEditing(null);setDraft(blankDraft());setNotice(editing?"Vault entry updated.":"Vault entry saved.");
    }catch(x:any){setError(x.message||"Unable to save Vault entry.")}
    finally{setBusy(false)}
  }

  function downloadTemplate(){
    const blob=new Blob([JSON.stringify(IMPORT_TEMPLATE,null,2)+"\\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="orbitfs-vault-import-template.json";link.click();URL.revokeObjectURL(url);
  }

  async function prepareImport(event:React.ChangeEvent<HTMLInputElement>){
    setError("");setNotice("");setImportRows([]);
    const file=event.target.files?.[0];event.target.value="";if(!file)return;
    try{
      if(file.size>1024*1024)throw new Error("Import file must be 1 MB or smaller.");
      const data=JSON.parse(await file.text());
      if(!["orbitfs-vault-import-v1","orbitfs-vault-import-v2"].includes(data?.format)||!Array.isArray(data.entries))
        throw new Error("Use OrbitFS Vault JSON v1 or v2.");
      if(!data.entries.length||data.entries.length>500)throw new Error("Import must have 1–500 entries.");
      const rows:VaultRecord[]=data.entries.map((item:any,index:number)=>{
        if(!item||typeof item!=="object")throw new Error("Invalid entry at row "+(index+1));
        const rawName=String(item.keyName||"").trim();
        const rawSecret=item.keyValue??item.secret;
        if(!rawName||typeof rawSecret!=="string"||rawName.length>256||rawSecret.length>10000)
          throw new Error("Invalid key name or value at row "+(index+1));
        const modern=data.format==="orbitfs-vault-import-v2";
        const record:VaultRecord={
          id:crypto.randomUUID(),systems:[String(item.system||"Other")],
          otherSystem:"",service:String(item.service||"Other"),customService:"",
          keyName:rawName,secret:rawSecret,
          usedIn:modern?(Array.isArray(item.usedIn)?item.usedIn:[]):undefined,
          destinationSystem:modern?String(item.destinationSystem||""):""
        };
        return normalizeVaultRecord(record);
      });
      const seen=new Set<string>();
      for(const row of rows){
        const id=recordIdentity(row);
        if(seen.has(id))throw new Error("Duplicate same-system destination in import: "+row.keyName);
        seen.add(id);
      }
      setImportRows(rows);
    }catch(x:any){setError(x.message||"Unable to read import file.")}
  }

  async function confirmImport(){
    setBusy(true);setError("");
    try{
      const existing=new Map(records.map(row=>[recordIdentity(row),row]));
      const additions=importRows.filter(row=>!existing.has(recordIdentity(row)));
      const overrides=importMode==="override"?importRows.filter(row=>existing.has(recordIdentity(row))):[];
      const replacements=new Map(overrides.map(row=>[recordIdentity(row),row]));
      if(!additions.length&&!overrides.length)throw new Error("Nothing new to import.");
      const next=records.map(row=>{
        const replacement=replacements.get(recordIdentity(row));
        return replacement?{...replacement,id:row.id,vercelTargets:row.vercelTargets,githubTargets:row.githubTargets}:row;
      });
      await persist([...additions,...next]);setPendingMigration(null);setImportRows([]);
      setNotice("Added "+additions.length+", replaced "+overrides.length+", skipped "+(importRows.length-additions.length-overrides.length)+".");
    }catch(x:any){setError(x.message||"Import failed.")}finally{setBusy(false)}
  }

  async function remove(id:string){
    if(!window.confirm("Remove this Vault entry?"))return;
    setBusy(true);setError("");
    try{await persist(records.filter(row=>row.id!==id));setNotice("Vault entry removed.")}
    catch(x:any){setError(x.message||"Unable to remove Vault entry.")}
    finally{setBusy(false)}
  }

  function edit(row:VaultRecord){
    const normalized=normalizeVaultRecord(row);
    setEditing(row);setDraft({
      system:normalized.systems[0]||"Other",otherSystem:normalized.otherSystem||"",
      service:normalized.service,customService:normalized.customService||"",
      keyName:normalized.keyName,secret:normalized.secret,
      usedIn:normalized.usedIn||[],destinationSystem:normalized.destinationSystem||""
    });
    requestAnimationFrame(()=>document.getElementById("vault-entry-editor")?.scrollIntoView({behavior:"smooth",block:"start"}));
  }

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return records.filter(row=>!q||[row.systems[0],row.service,row.keyName,row.destinationSystem,...(row.usedIn||[])].some(v=>String(v||"").toLowerCase().includes(q)));
  },[records,query]);
  const needingReview=records.filter(row=>row.needsReview||!row.destinationSystem||!row.usedIn?.length);

  if(phase!=="open")return <section className="space-y-4">
    <div className="orbit-reference-page-head"><p>SECURE OPERATIONS</p><h1>Vault</h1><span>Persistent encrypted credentials with a separate Vault unlock.</span></div>
    <div className="orbit-panel p-4"><div className="orbit-section-head"><span className="orbit-section-icon"><ShieldCheck size={15}/></span><div><h2>Vercel Production connections</h2><p>Main and Fallback account sync is available after you unlock the Vault. No Vercel variables change until you review and approve them.</p></div></div></div>
    <div className="mx-auto max-w-lg orbit-panel p-5">
      <div className="orbit-section-head"><span className="orbit-section-icon"><Lock size={15}/></span><div><h2>{phase==="setup"?"Create Vault":"Unlock Vault"}</h2><p>{phase==="setup"?"Create a numeric PIN of at least 6 digits to encrypt this Vault.":"Your Dev Panel session is active. Unlock the encrypted Vault separately."}</p></div></div>
      {error&&<div className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-100">{error}</div>}
      {phase==="loading"?<p className="mt-5 text-xs text-muted-foreground">Loading encrypted Vault…</p>:<form className="mt-5 space-y-4" onSubmit={unlock}>
        <label className="block text-xs font-medium">Vault PIN<input className="control mt-1" type="password" inputMode="numeric" pattern={phase==="setup"?"[0-9]{6,}":undefined} minLength={phase==="setup"?6:undefined} autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        {phase==="setup"&&<label className="block text-xs font-medium">Confirm Vault PIN<input className="control mt-1" type="password" inputMode="numeric" pattern="[0-9]{6,}" minLength={6} autoComplete="off" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></label>}
        <button className="button-primary w-full" disabled={busy}>{busy?"Working…":phase==="setup"?"Create encrypted Vault":"Unlock Vault"}</button>
      </form>}
      <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-muted-foreground"><ShieldCheck size={14} className="mt-0.5 shrink-0"/><span>The server stores encrypted ciphertext only. The Vault PIN is not saved and cannot be recovered.</span></div>
    </div>
  </section>;

  return <section className="space-y-4">
    <div className="orbit-reference-head"><div><p className="orbit-reference-kicker">SECURE OPERATIONS</p><h1>Vault</h1><span>Central encrypted credentials · {records.length} {records.length===1?"entry":"entries"}</span></div><div className="orbit-reference-actions"><button className="button-secondary" onClick={lock}><Lock size={14}/> Lock Vault</button></div></div>
    {error&&<div className="rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-100">{error}</div>}
    {notice&&<div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-100">{notice}</div>}
    <div className="orbit-panel p-4 space-y-2">
      <h2 className="text-base font-semibold">Vault · exact-name inventory</h2>
      <p className="text-xs text-muted-foreground">Service is the provider. System is the OrbitFS product. Every key is tied to an explicit account mode and exact destination; prefixes are never guessed during sync.</p>
      <p className="text-xs text-muted-foreground">{records.length} saved entries · {needingReview.length} need destination review. Verified Production names below come from real Main Vercel settings, not invented runtime requirements.</p>
      {pendingMigration&&<div className="rounded border p-3 space-y-2">
        <strong className="text-sm">Review legacy Vault conversion</strong>
        <p className="text-xs">The existing Vault was decrypted in your browser. Only key names verified against the actual Main Production inventory were normalised. Other names and all values were retained. Your previous encrypted Vault is unchanged until you save.</p>
        <p className="text-xs text-muted-foreground">{records.filter(r=>r.legacyKeyName).length} old prefixed names were mapped to exact verified names. {needingReview.length} entries still need explicit destinations.</p>
        <button type="button" className="button-secondary" disabled={busy} onClick={()=>void (async()=>{setBusy(true);setError("");try{await persist(records);setPendingMigration(null);setNotice("Corrected Vault names saved in encrypted storage. No Vercel or GitHub variables changed.");}catch(e:any){setError(e?.message||"Could not save migration")}finally{setBusy(false)}})()}>Save reviewed Vault migration</button>
      </div>}
    </div>
    <VaultInventorySection records={records} onPersist={persist}/>
    <form id="vault-entry-editor" onSubmit={save} className="orbit-panel p-4">
      <div className="orbit-section-head"><span className="orbit-section-icon"><Plus size={15}/></span><div><h2>{editing?"Edit saved key":"Add a missing key"}</h2><p>Values are encrypted before saving. A blank value is allowed as an inventory reminder and cannot be pushed to Production.</p></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block text-xs font-medium">Service<select className="control mt-1" value={draft.service} onChange={e=>setDraft({...draft,service:e.target.value})}>{SERVICES.map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="block text-xs font-medium">System<select className="control mt-1" value={draft.system} onChange={e=>setDraft({...draft,system:e.target.value})}>{SYSTEMS.map(x=><option key={x}>{x}</option>)}</select></label>
        {draft.service==="Other"&&<label className="block text-xs font-medium">Other service<input className="control mt-1" value={draft.customService} onChange={e=>setDraft({...draft,customService:e.target.value})}/></label>}
        {draft.system==="Other"&&<label className="block text-xs font-medium">Other system<input className="control mt-1" value={draft.otherSystem} onChange={e=>setDraft({...draft,otherSystem:e.target.value})}/></label>}
        <label className="block text-xs font-medium">Key name · exact<input className="control mt-1 font-mono" autoComplete="off" value={draft.keyName} onChange={e=>setDraft({...draft,keyName:e.target.value})} placeholder="e.g. BILLING_API_TOKEN"/></label>
        <label className="block text-xs font-medium">Key value<input className="control mt-1 font-mono" type={draftVisible?"text":"password"} autoComplete="off" value={draft.secret} onChange={e=>setDraft({...draft,secret:e.target.value})}/><button type="button" className="button-secondary mt-1" onClick={()=>setDraftVisible(v=>!v)}>{draftVisible?"Hide value":"Show value"}</button></label>
        <fieldset className="text-xs font-medium"><legend>Used in</legend><div className="flex gap-4 mt-2">{(["main","fallback"] as VaultMode[]).map(mode=><label className="flex gap-2 items-center" key={mode}><input type="checkbox" checked={draft.usedIn.includes(mode)} onChange={e=>setDraft({...draft,usedIn:e.target.checked?[...draft.usedIn,mode]:draft.usedIn.filter(x=>x!==mode)})}/>{mode==="main"?"Main":"Fallback"}</label>)}</div></fieldset>
        <label className="block text-xs font-medium">Destination system · exact Vercel project or GitHub repository
          <input className="control mt-1 font-mono" list="vault-destination-suggestions" autoComplete="off" value={draft.destinationSystem} onChange={e=>setDraft({...draft,destinationSystem:e.target.value})} placeholder="e.g. v2-billing-store"/>
          <datalist id="vault-destination-suggestions">
            {["custom-licence-manager","v2-billing-store","base-deploy-panel","orbitfs-license-fallback","orbitfs-billing-fallback","orbitfs-dev-panel-fallback",
              "lucaskerim123/V2_Billing_Store","remipetrovich-design/OrbitFS-Billing-Shopfront","lucaskerim123/V1-vercel-base","lucaskerim123/V1-vercel-engine",
              "remipetrovich-design/OrbitFS-Base-System","remipetrovich-design/OrbitFS_Engine"].map(x=><option key={x} value={x}/>)}
          </datalist>
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Key name is the actual environment variable name, not a Vault label. A key may exist more than once if its System, mode or destination differs. Sync never automatically adds/removes a prefix.</p>
      <div className="mt-4 flex gap-2"><button className="button-primary" disabled={busy}>{busy?"Saving…":editing?"Save changes":"Add to Vault"}</button>{editing&&<button type="button" className="button-secondary" onClick={()=>{setEditing(null);setDraft(blankDraft())}}><X size={14}/> Cancel</button>}</div>
    </form>
    <section className="orbit-panel p-4 space-y-3">
      <div className="orbit-section-head"><span className="orbit-section-icon"><Upload size={15}/></span><div><h2>Import your JSON file</h2><p>Import a JSON template. Choose whether matching system, service and key names are skipped or replaced. Empty and placeholder values are permitted and encrypted before saving.</p></div></div>
      <div className="flex flex-wrap gap-2"><button type="button" className="button-secondary" onClick={downloadTemplate}><Download size={14}/> Download JSON template</button><label className="button-secondary cursor-pointer"><Upload size={14}/> Choose JSON file<input className="sr-only" type="file" accept=".json,application/json" onChange={e=>void prepareImport(e)}/></label></div>
      {importRows.length>0&&<div className="space-y-2"><p className="text-xs">{importRows.length} entries ready to import. Review names below; secret values stay hidden.</p><div className="max-h-40 overflow-auto text-xs">{importRows.map(row=><p key={row.id} className="border-b py-1 font-mono">{row.systems[0]} / {row.service} / {row.keyName}</p>)}</div><fieldset className="space-y-2 text-xs"><legend className="font-semibold">When an entry already exists</legend><label className="flex items-center gap-2"><input type="radio" name="vault-import-mode" checked={importMode==="skip"} onChange={()=>setImportMode("skip")}/> Skip existing (keep saved secrets)</label><label className="flex items-center gap-2"><input type="radio" name="vault-import-mode" checked={importMode==="override"} onChange={()=>setImportMode("override")}/> Override existing (replace saved secrets)</label></fieldset><p className="text-xs text-muted-foreground">{importRows.filter(row=>records.some(saved=>saved.systems[0].toLowerCase()===row.systems[0].toLowerCase()&&saved.service.toLowerCase()===row.service.toLowerCase()&&saved.keyName.toLowerCase()===row.keyName.toLowerCase())).length} matching entries will be {importMode==="skip"?"skipped":"overwritten"}.</p><div className="flex gap-2"><button type="button" className="button-primary" disabled={busy} onClick={()=>void confirmImport()}>Import entries</button><button type="button" className="button-secondary" onClick={()=>setImportRows([])}>Cancel</button></div></div>}
    </section>
    <details className="orbit-panel p-4" aria-label="Vercel Production sync">
      <summary className="cursor-pointer font-semibold">2 · Vercel — send keys to Production projects (open only when needed)</summary>
      <p className="mt-2 text-xs text-muted-foreground">Use one Vercel account at a time. Main and Fallback have separate projects. Select the relevant service, compare before writing, and skip unrelated keys.</p>
      <div className="mt-3"><VaultVercelSync session={session} records={records} onPersist={persist}/></div>
    </details>
    <details className="orbit-panel p-4" aria-label="GitHub Actions sync">
      <summary className="cursor-pointer font-semibold">3 · GitHub — send release/deployment settings to repositories (open only when needed)</summary>
      <p className="mt-2 text-xs text-muted-foreground">One GitHub token per account. Select repository secrets for release workflows or Production environment secrets for service deployment workflows. Do not copy the GitHub account connection token into a workflow.</p>
      <div className="mt-3"><VaultGithubSync session={session} records={records} onPersist={persist}/></div>
    </details>
    <section className="orbit-panel overflow-hidden">
      <div className="border-b p-4"><h2 className="text-sm font-semibold mb-2">Other saved keys (not in the important list)</h2><div className="relative"><Search size={14} className="absolute left-3 top-3 text-muted-foreground"/><input className="control pl-9" placeholder="Search system, service or key name…" value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
      <div>{filtered.map(row=><div key={row.id} className="border-b p-4 last:border-b-0"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-semibold break-all">{row.keyName}</p><p className="mt-1 text-[10px] text-muted-foreground">From: {row.systems.join(" / ")} · {row.service}{row.vercelTargets?.length?` · Linked to: ${row.vercelTargets.map(target=>target.connection+" / "+target.projectName).join(", ")}`:""}</p><p className="mt-1 text-xs"><strong>Goes to: </strong>{whereDoesThisGo(row).destination}</p><p className="mt-2 font-mono text-xs break-all text-muted-foreground">{visible.includes(row.id)?(row.secret||"(blank)"):(row.secret?"••••••••••••":"(blank)")}</p></div><div className="flex gap-1"><button type="button" className="icon-button" title={visible.includes(row.id)?"Hide secret":"Show secret"} aria-label={visible.includes(row.id)?"Hide secret":"Show secret"} onClick={()=>setVisible(current=>current.includes(row.id)?current.filter(id=>id!==row.id):[...current,row.id])}>{visible.includes(row.id)?<EyeOff size={14}/>:<Eye size={14}/>}</button><button type="button" className="icon-button" title="Copy secret" onClick={()=>void navigator.clipboard.writeText(row.secret)}><Copy size={14}/></button><button className="icon-button" title="Edit" onClick={()=>edit(row)}><Pencil size={14}/></button><button className="icon-button" title="Remove" onClick={()=>void remove(row.id)}><Trash2 size={14}/></button></div></div></div>)}{!filtered.length&&<div className="p-8 text-center text-xs text-muted-foreground">{records.length?"No ordinary Vault keys match. Core credentials are listed above.":"No Vault entries yet."}</div>}</div>
    </section>
  </section>;
}
