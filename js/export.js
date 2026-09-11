function findQuizTable(){
  const tables=[...document.querySelectorAll('table')];
  return tables.find(t=>{
    const rows=[...t.querySelectorAll('tr')];
    const first=(rows[0]?.innerText||'').toLowerCase();
    const text=(t.innerText||'').toLowerCase();
    return first.includes('nama') && (first.includes('bab 1') || first.includes('bab')) &&
      (text.includes('nilai') || text.includes('rata-rata') || text.includes('kuis'));
  })||tables.find(t=>{
    const text=(t.innerText||'').toLowerCase();
    return text.includes('bab 1')&&text.includes('bab 2')&&text.includes('nama');
  })||null;
}
function findQuizHeading(){
  return [...document.querySelectorAll('h2,h3,h4,p')].find(el=>{
    const text=(el.innerText||'').toLowerCase();
    return text.includes('rekap nilai kuis') || text.includes('nilai kuis');
  })||null;
}
function addExcelExportButton(){
  if(document.getElementById('exportExcelBtn'))return;
  const t=findQuizTable();
  const heading=findQuizHeading();
  if(!t && !heading)return;
  const btn=document.createElement('button');
  btn.id='exportExcelBtn';
  btn.className='btn';
  btn.textContent='📥 Download Rekap Nilai Kuis Siswa';
  btn.onclick=exportNilaiKuis;
  if(t)t.parentElement.insertBefore(btn,t);
  else heading.parentElement.insertBefore(btn,heading.nextSibling);
}
function exportNilaiKuis(){
  const t=findQuizTable();
  if(!t)return alert('Rekap nilai kuis siswa belum tersedia. Silakan buka Rekap Nilai Kuis terlebih dahulu.');
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
