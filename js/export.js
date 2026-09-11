function findQuizTable(){
  const tables=[...document.querySelectorAll('table')];
  return tables.find(t=>{
    const text=(t.innerText||'').toLowerCase();
    const rows=[...t.querySelectorAll('tr')];
    const first=(rows[0]?.innerText||'').toLowerCase();
    const score=(text.includes('bab 1')?2:0)+(text.includes('bab 2')?2:0)+(text.includes('rata-rata')?2:0)+(first.includes('nama')?1:0)+(first.includes('nis')?1:0)+(first.includes('kelas')?1:0);
    return score>=5;
  })||null;
}
function addExcelExportButton(){
  if(document.getElementById('exportExcelBtn'))return;
  const t=findQuizTable();
  if(!t)return;
  const btn=document.createElement('button');
  btn.id='exportExcelBtn';
  btn.className='btn';
  btn.textContent='📥 Download Rekap Nilai Kuis Siswa';
  btn.onclick=exportNilaiKuis;
  t.parentElement.insertBefore(btn,t);
}
function exportNilaiKuis(){
  const t=findQuizTable();
  if(!t)return alert('Rekap nilai kuis siswa belum tersedia.');
  if(!window.XLSX)return alert('Fitur Excel belum siap. Silakan muat ulang LMS.');
  const rows=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
  if(rows.length<2)return alert('Belum ada data nilai kuis siswa untuk diunduh.');
  const ws=XLSX.utils.aoa_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Rekap Nilai Kuis');
  XLSX.writeFile(wb,'Rekap_Nilai_Kuis_Siswa_Quran_Hadis.xlsx');
}
function watchQuizTable(){
  addExcelExportButton();
}
const excelObserver=new MutationObserver(()=>watchQuizTable());
window.addEventListener('DOMContentLoaded',()=>{
  watchQuizTable();
  excelObserver.observe(document.body,{childList:true,subtree:true});
});
