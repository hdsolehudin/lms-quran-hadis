function addExcelExportButton(){
  if(document.getElementById('exportExcelBtn'))return;
  const tables=document.querySelectorAll('table');
  if(!tables.length)return;
  const t=[...tables].find(x=>x.innerText.includes('Bab 1')&&x.innerText.includes('Bab 2'))||tables[0];
  if(!t)return;
  const btn=document.createElement('button');
  btn.id='exportExcelBtn';
  btn.className='btn';
  btn.textContent='📥 Download Nilai Excel';
  btn.onclick=exportNilaiExcel;
  t.parentElement.insertBefore(btn,t);
}
function exportNilaiExcel(){
  const tables=document.querySelectorAll('table');
  const t=[...tables].find(x=>x.innerText.includes('Bab 1')&&x.innerText.includes('Bab 2'))||tables[0];
  if(!t)return alert('Tabel nilai belum tersedia.');
  if(!window.XLSX)return alert('Fitur Excel belum siap. Silakan muat ulang LMS.');
  const rows=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
  const ws=XLSX.utils.aoa_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Nilai Siswa');
  XLSX.writeFile(wb,'Rekap_Nilai_Siswa_Quran_Hadis.xlsx');
}
const excelObserver=new MutationObserver(()=>addExcelExportButton());
window.addEventListener('DOMContentLoaded',()=>{addExcelExportButton();excelObserver.observe(document.body,{childList:true,subtree:true});});