async function teacher(){
  if(profile?.role!=="teacher") return;
  const a=await db.from("profiles").select("*").eq("role","student").order("class_name").order("name");
  const b=await db.from("quiz_scores").select("*");
  if(a.error) return alert("Gagal mengambil data siswa: "+a.error.message);
  if(b.error) return alert("Gagal mengambil nilai kuis: "+b.error.message);
  const students=a.data||[], scores=b.data||[];
  const rows=students.map(u=>{
    const vals=[1,2,3,4].map(n=>{
      const s=scores.find(x=>x.student_id===u.id&&Number(x.chapter)===n);
      return s ? Math.round(Number(s.score)/Number(s.total)*100) : "-";
    });
    const nums=vals.filter(x=>x!=="-");
    const avg=nums.length ? Math.round(nums.reduce((p,x)=>p+x,0)/nums.length) : "-";
    return `<tr><td>${esc(u.name)}</td><td>${esc(u.nis||"-")}</td><td>${esc(u.class_name||"-")}</td>${vals.map(x=>`<td>${x}</td>`).join("")}<td><b>${avg}</b></td></tr>`;
  }).join("");
  shell(`<section class="card"><h2>📊 Rekap Nilai Kuis Siswa</h2><p>Rekap nilai otomatis dari hasil kuis yang sudah disimpan. Tanda <b>-</b> berarti siswa belum mengerjakan kuis bab tersebut.</p><div style="overflow-x:auto"><table id="quizScoreTable" class="table"><thead><tr><th>Nama Siswa</th><th>NIS</th><th>Kelas</th><th>Bab 1</th><th>Bab 2</th><th>Bab 3</th><th>Bab 4</th><th>Rata-rata</th></tr></thead><tbody>${rows||'<tr><td colspan="8">Belum ada data siswa.</td></tr>'}</tbody></table></div><button class="btn" onclick="exportQuizScores()">📥 Download Rekap Nilai Kuis Siswa</button></section>`);
}
function exportQuizScores(){
  const t=document.getElementById("quizScoreTable");
  if(!t) return alert("Rekap nilai kuis belum tersedia.");
  if(!window.XLSX) return alert("Fitur Excel belum siap. Silakan muat ulang LMS.");
  const rows=[...t.querySelectorAll("tr")].map(tr=>[...tr.querySelectorAll("th,td")].map(td=>td.innerText.trim()));
  const ws=XLSX.utils.aoa_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Rekap Nilai Kuis");
  XLSX.writeFile(wb,"Rekap_Nilai_Kuis_Siswa_Quran_Hadis.xlsx");
}
