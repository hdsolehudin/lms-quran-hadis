async function exportNilaiKuis(){
  if(!window.XLSX)return alert('Fitur Excel belum siap. Silakan muat ulang LMS.');
  if(!window.db)return alert('Koneksi database belum siap.');
  const [studentsRes,scoresRes]=await Promise.all([
    db.from('profiles').select('*').eq('role','student').order('class_name').order('name'),
    db.from('quiz_scores').select('*')
  ]);
  if(studentsRes.error)return alert('Gagal memuat data siswa: '+studentsRes.error.message);
  if(scoresRes.error)return alert('Gagal memuat nilai kuis: '+scoresRes.error.message);
  const students=studentsRes.data||[],scores=scoresRes.data||[];
  if(!students.length)return alert('Belum ada data siswa untuk direkap.');
  const rows=[['Nama','NIS','Kelas','Bab 1','Bab 2','Bab 3','Bab 4','Rata-rata']];
  students.forEach(u=>{
    const vals=[1,2,3,4].map(ch=>{
      const s=scores.find(x=>x.student_id===u.id&&x.chapter===ch);
      return s&&s.total?Math.round(s.score/s.total*100):'';
    });
    const nums=vals.filter(v=>v!=='');
    const avg=nums.length?Math.round(nums.reduce((a,b)=>a+b,0)/nums.length):'';
    rows.push([u.name||'',u.nis||'',u.class_name||'',...vals,avg]);
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
