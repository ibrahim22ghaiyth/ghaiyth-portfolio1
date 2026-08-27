const state={token:localStorage.getItem("sentineldesk_token")||"",user:null,company:null,modules:{},current:"dashboard",rows:[]};
const $=s=>document.querySelector(s);
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
async function api(path,opt={}){const r=await fetch(path,{headers:{"Content-Type":"application/json",...(state.token?{Authorization:"Bearer "+state.token}:{}),...(opt.headers||{})},...opt});const j=await r.json();if(!j.success)throw new Error(j.detail||j.error||"Request failed");return j.data;}
function showPortal(on){$("#loginView").classList.toggle("hidden",on);$("#portalView").classList.toggle("hidden",!on);}
const navOrder=[
 ["dashboard","Command"],
 ["services","Services"],
 ["assets","Assets"],
 ["events","Events"],
 ["incidents","Incidents"],
 ["advisories","Advisories"],
 ["zerotrust","Zero Trust"],
 ["apis","APIs"],
 ["cases","Cases"],
 ["compliance","Compliance"],
 ["reports","Reports"]
];
async function login(e){e.preventDefault();try{const data=Object.fromEntries(new FormData(e.target).entries());const res=await api("/api/auth/login",{method:"POST",body:JSON.stringify(data)});state.token=res.token;state.user=res.user;localStorage.setItem("sentineldesk_token",state.token);showPortal(true);await init();toast("Case room opened");}catch(err){toast(err.message);}}
async function init(){const me=await api("/api/me");state.user=me.user;state.company=me.company;state.modules=me.modules;$("#companyLine").textContent=`${me.company.legal_name} · ${me.company.portal_year}`;renderNav();await switchView(state.current||"dashboard");}
function renderNav(){const nav=$("#nav");nav.innerHTML=navOrder.map(([key,label])=>`<button data-view="${key}" class="${state.current===key?"active":""}">${label}</button>`).join("");}
async function switchView(key){state.current=key;renderNav();$("#dashboardView").classList.toggle("active",key==="dashboard");$("#moduleView").classList.toggle("active",key!=="dashboard");$("#viewTitle").textContent=key==="dashboard"?"Security Command Center":state.modules[key]?.title||key;$("#newBtn").style.display=key==="dashboard"?"none":"inline-flex";$("#searchBox").style.display=key==="dashboard"?"none":"inline-block";if(key==="dashboard")await loadDashboard();else await loadModule(key);}
function severityClass(s){return `severity-${String(s||"").toLowerCase()}`;}
function row(a,b,c){return `<div class="stack-row"><div><b>${a}</b><p>${b||""}</p></div><em>${c||""}</em></div>`;}
async function loadDashboard(){
  const d=await api("/api/dashboard");
  const k=d.kpis;
  $("#kpis").innerHTML=[
    ["Total events",k.total_events],
    ["Open incidents",k.open_incidents],
    ["Critical / High",k.critical_events],
    ["Average risk",k.avg_risk],
    ["Open cases",k.open_cases],
    ["Policy reviews",k.policy_reviews],
    ["High-risk APIs",k.high_risk_apis],
    ["Ready reports",k.ready_reports]
  ].map(([a,b])=>`<article class="kpi"><small>${a}</small><b>${b}</b></article>`).join("");

  const max=Math.max(1,...d.event_by_severity.map(x=>x.count));
  $("#severityBars").innerHTML=d.event_by_severity.map(x=>`<div class="bar"><span class="${severityClass(x.severity)}">${x.severity}</span><i style="width:${(x.count/max)*100}%"></i><b>${x.count}</b></div>`).join("");

  $("#assetRisk").innerHTML=d.risk_by_asset.map(x=>row(x.asset_id,x.asset_name,`${x.risk_score}/100`)).join("");
  $("#incidentStack").innerHTML=d.incidents.map(x=>row(x.incident_no,x.title,x.status)).join("");
  $("#recentEvents").innerHTML=d.recent_events.map(x=>`<div class="event-row"><div><b class="${severityClass(x.severity)}">${x.title}</b><p>${x.event_type} · ${x.event_date}</p></div><em>${x.status}</em></div>`).join("");
  $("#serviceCoverage").innerHTML=d.service_coverage.map(x=>row(x.category,"Active service category",x.count)).join("");
  $("#activityLog").innerHTML=d.recent_activity.map(x=>`<p><b>${x.actor}</b> — ${x.action} <small>${x.record_ref||""}</small></p>`).join("");
}
async function loadModule(key,q=""){
  const data=await api(`/api/modules/${key}${q?`?q=${encodeURIComponent(q)}`:""}`);
  state.rows=data;
  const meta=state.modules[key];
  $("#moduleTitle").textContent=meta.title;
  $("#moduleDesc").textContent=`${data.length} records · SQLite-backed client security workspace`;
  renderTable(key,data);
}
function renderTable(key,rows){
  const fields=state.modules[key].fields;
  const cols=fields.slice(0,6);
  $("#tableCard").innerHTML=`<table><thead><tr>${cols.map(c=>`<th>${c.replaceAll("_"," ")}</th>`).join("")}<th>Actions</th></tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c==="status"||c==="severity"||c==="priority"||c==="risk_level"?`<span class="badge ${c==="severity"?severityClass(r[c]):""}">${r[c]??""}</span>`:(r[c]??"")}</td>`).join("")}<td><div class="row-actions"><button data-edit="${r.id}">Edit</button><button class="danger" data-del="${r.id}">Delete</button></div></td></tr>`).join("")}</tbody></table>`;
  document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEditor(key,Number(b.dataset.edit)));
  document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>deleteRecord(key,Number(b.dataset.del)));
}
function openEditor(key,id=null){
  const meta=state.modules[key];
  const data=id?state.rows.find(x=>x.id===id):{};
  $("#editorTitle").textContent=id?`Edit ${meta.title}`:`New ${meta.title}`;
  $("#editorFields").innerHTML=meta.fields.map(f=>{
    const value=data?.[f]??"";
    if(/summary|description|mitigation|resolution|notes|portal_usage/.test(f))return `<textarea name="${f}" placeholder="${f.replaceAll("_"," ")}">${value}</textarea>`;
    return `<input name="${f}" placeholder="${f.replaceAll("_"," ")}" value="${value}">`;
  }).join("");
  $("#editor").showModal();
  state.saveEditor=async()=>{
    const payload=Object.fromEntries(new FormData($("#editorForm")).entries());
    for(const k of Object.keys(payload)){if(/score|count|risk|traffic/.test(k))payload[k]=Number(payload[k]||0);}
    await api(`/api/modules/${key}${id?`/${id}`:""}`,{method:id?"PUT":"POST",body:JSON.stringify(payload)});
    await loadModule(key);
    toast("Dossier saved");
  };
}
async function deleteRecord(key,id){if(!confirm("Delete record?"))return;try{await api(`/api/modules/${key}/${id}`,{method:"DELETE"});await loadModule(key);toast("Deleted");}catch(err){toast(err.message);}}
$("#loginForm").onsubmit=login;
$("#nav").onclick=e=>{const b=e.target.closest("[data-view]");if(b)switchView(b.dataset.view);};
$("#refreshBtn").onclick=()=>switchView(state.current);
$("#newBtn").onclick=()=>openEditor(state.current);
$("#addBtn").onclick=()=>openEditor(state.current);
$("#searchBox").oninput=e=>{if(state.current!=="dashboard")loadModule(state.current,e.target.value);};
$("#logoutBtn").onclick=()=>{localStorage.removeItem("sentineldesk_token");state.token="";showPortal(false);};
$("#editorForm").onsubmit=async e=>{e.preventDefault();if(e.submitter?.value==="cancel")return;try{await state.saveEditor();$("#editor").close();}catch(err){toast(err.message);}};
$("#exportBtn").onclick=async()=>{const d=await api("/api/export");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:"application/json"}));a.download="sentineldesk-export.json";a.click();URL.revokeObjectURL(a.href);};
if(state.token){showPortal(true);init().catch(()=>{localStorage.removeItem("sentineldesk_token");showPortal(false);});}else showPortal(false);
