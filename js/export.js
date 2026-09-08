function addExcelExportButton(){
  if(document.getElementById('exportExcelBtn'))return;
  const tables=document.querySelectorAll('table');
  const t=[...tables].find(x=>x.innerText.includes('Bab 1')&&x.innerText.includes('Bab 2')&&x.innerText.includes('Rata-rata'));
  if(!t)return;
  const btn=document.createElement('button');
  btn.id='exportExcelBtn';
  btn.className='btn';
  btn.textContent='📥 Download Rekap Nilai Kuis Siswa';
  btn.onclick=exportNilaiKuis;
  t.parentElement.insertBefore(btn,t);
}
function exportNilaiKuis(){
  const tables=document.querySelectorAll('table');
  const t=[...tables].find(x=>x.innerText.includes('Bab 1')&&x.innerText.includes('Bab 2')&&x.innerText.includes('Rata-rata'));
  if(!t)return alert('Rekap nilai kuis siswa belum tersedia.');
  if(!window.XLSX)return alert('Fitur Excel belum siap. Silakan muat ulang LMS.');
  const rows=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
  if(rows.length<2)return alert('Belum ada data nilai kuis siswa untuk diunduh.');
  const ws=XLSX.utils.aoa_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Rekap Nilai Kuis');
  XLSX.writeFile(wb,'Rekap_Nilai_Kuis_Siswa_Quran_Hadis.xlsx');
}
const excelObserver=new MutationObserver(()=>addExcelExportButton());
window.addEventListener('DOMContentLoaded',()=>{addExcelExportButton();excelObserver.observe(document.body,{childList:true,subtree:true});});
