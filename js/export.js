async function exportNilaiKuis(){
  if(!window.XLSX)return alert('Fitur Excel belum siap. Silakan muat ulang LMS.');
  const C=window.LMS_CONFIG;
  if(!window.supabase||!C?.SUPABASE_URL||!C?.SUPABASE_ANON_KEY)return alert('Koneksi database belum siap. Silakan muat ulang LMS.');
  const client=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY);
  const [studentsRes,scoresRes]=await Promise.all([
    client.from('profiles').select('id,name,nis,class_name').eq('role','student').order('class_name').order('name'),
    client.from('quiz_scores').select('student_id,chapter,score,total,submitted_at')
  ]);
  if(studentsRes.error)return alert('Gagal memuat data siswa: '+studentsRes.error.message);
  if(scoresRes.error)return alert('Gagal memuat nilai kuis: '+scoresRes.error.message);
  const students=studentsRes.data||[],scores=scoresRes.data||[];
  if(!students.length)return alert('Belum ada data siswa untuk direkap.');
  const rows=[['No','Nama Siswa','NIS','Kelas','Bab 1','Bab 2','Bab 3','Bab 4','Rata-rata']];
  students.forEach((u,i)=>{
    const vals=[1,2,3,4].map(ch=>{
      const s=scores.find(x=>x.student_id===u.id&&Number(x.chapter)===ch);
      return s&&Number(s.total)>0?Math.round(Number(s.score)/Number(s.total)*100):'';
    });
    const nums=vals.filter(v=>v!=='');
    const avg=nums.length?Math.round(nums.reduce((a,b)=>a+b,0)/nums.length):'';
    rows.push([i+1,u.name||'',u.nis||'',u.class_name||'',...vals,avg]);
  });
  const ws=XLSX.utils.aoa_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Rekap Nilai Kuis');
  XLSX.writeFile(wb,'Rekap_Nilai_Kuis_Siswa_Quran_Hadis.xlsx');
}

function addExcelExportButton(){
  if(document.getElementById('exportExcelBtn'))return;
  const btn=document.createElement('button');
  btn.id='exportExcelBtn';
  btn.className='btn';
  btn.textContent='📥 Download Rekap Nilai Kuis Siswa';
  btn.onclick=exportNilaiKuis;
  const headings=[...document.querySelectorAll('h2,h3,h4,p')];
  const heading=headings.find(el=>/rekap nilai kuis|nilai kuis/i.test(el.innerText||''));
  if(heading)heading.parentElement.insertBefore(btn,heading.nextSibling);
}

const excelObserver=new MutationObserver(()=>addExcelExportButton());
window.addEventListener('DOMContentLoaded',()=>{
  addExcelExportButton();
  excelObserver.observe(document.body,{childList:true,subtree:true});
});
