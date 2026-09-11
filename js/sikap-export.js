(function(){
  async function loadSikap(){
    if(!window.db || !window.profile || window.profile.role!=="teacher") return;
    const box=document.getElementById("sikapExportBox");
    if(!box) return;
    const r=await db.from("sikap_submissions").select("*").order("updated_at",{ascending:false});
    if(r.error){box.innerHTML='<p class="notice">Gagal memuat Skala Sikap: '+esc(r.error.message)+'</p>';return;}
    const subs=r.data||[];
    const p=await db.from("profiles").select("id,name,nis,class_name").eq("role","student");
    const students=p.data||[];
    window.SIKAP_DATA=subs.map(x=>{const s=students.find(v=>v.id===x.student_id);const raw=Array.isArray(x.scored)?x.scored:[];const total=x.total??raw.reduce((a,b)=>a+Number(b||0),0);return {name:s?.name||x.student_id,nis:s?.nis||"-",class_name:s?.class_name||"-",chapter:x.chapter||"-",scores:raw,total,time:new Date(x.updated_at||Date.now()).toLocaleString("id-ID")};});
    const rows=window.SIKAP_DATA.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.nis)+'</td><td>'+esc(x.class_name)+'</td><td>Bab '+esc(x.chapter)+'</td><td>'+x.total+'</td><td>'+esc(x.time)+'</td></tr>').join("");
    box.innerHTML='<h3>🧭 Rekap Skala Sikap</h3><p>'+subs.length+' pengisian tersimpan.</p><div style="overflow-x:auto"><table class="table" id="sikapTable"><thead><tr><th>Nama</th><th>NIS</th><th>Kelas</th><th>Bab</th><th>Total Skor</th><th>Waktu</th></tr></thead><tbody>'+rows+'</tbody></table></div><button class="btn" onclick="exportSikap()">📥 Download Rekap Skala Sikap</button>';
  }
  window.exportSikap=function(){
    const t=document.getElementById("sikapTable");
    if(!t)return alert("Rekap Skala Sikap belum tersedia.");
    if(!window.XLSX)return alert("Fitur Excel belum siap. Silakan muat ulang LMS.");
    const rows=[...t.querySelectorAll("tr")].map(tr=>[...tr.querySelectorAll("th,td")].map(td=>td.innerText.trim()));
    const ws=XLSX.utils.aoa_to_sheet(rows),wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Rekap Skala Sikap");
    XLSX.writeFile(wb,"Rekap_Skala_Sikap_Quran_Hadis.xlsx");
  };
  const obs=new MutationObserver(()=>{const h=[...document.querySelectorAll("h2")].find(x=>x.textContent.includes("Dashboard Guru"));if(h&&!document.getElementById("sikapExportBox")){const sec=document.createElement("section");sec.className="card";sec.id="sikapExportBox";sec.innerHTML="Memuat Rekap Skala Sikap...";h.closest("section")?.parentElement?.appendChild(sec);loadSikap();}});
  window.addEventListener("DOMContentLoaded",()=>obs.observe(document.body,{childList:true,subtree:true}));
})();
