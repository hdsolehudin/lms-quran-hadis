const {createClient}=supabase;
const db=createClient(LMS_CONFIG.SUPABASE_URL,LMS_CONFIG.SUPABASE_ANON_KEY);
const app=document.getElementById('app');
let exams=[];
let rows=[];

async function load(){
  const {data,error}=await db.from('cbt_exams')
    .select('id,title,subject,class_name,created_at')
    .order('created_at',{ascending:false});
  if(error){
    app.innerHTML='<p>Gagal memuat rekap: '+esc(error.message)+'</p>';
    return;
  }
  exams=data||[];
  if(!exams.length){
    app.innerHTML='<p>Belum ada Penilaian Harian.</p>';
    return;
  }
  app.innerHTML='<label><b>Pilih Penilaian Harian</b><select id="exam" style="width:100%;margin-top:8px;padding:10px">'+
    exams.map(e=>`<option value="${e.id}">${esc(e.title)}</option>`).join('')+
    '</select></label><div id="table" style="margin-top:20px"></div>';

  const bab2=exams.find(e=>/bab\s*ii|bab\s*2/i.test(e.title||''));
  if(bab2) document.getElementById('exam').value=bab2.id;
  document.getElementById('exam').onchange=show;
  show();
}

async function show(){
  const id=document.getElementById('exam').value;
  const box=document.getElementById('table');
  box.innerHTML='<p>Memuat nilai siswa...</p>';

  const {data,error}=await db.from('cbt_attempts')
    .select('student_name,student_class,participant_number,score,correct_count,total_questions,status,started_at,submitted_at')
    .eq('exam_id',id)
    .eq('status','submitted')
    .order('student_name',{ascending:true});

  if(error){
    box.innerHTML='<p style="color:#b00020">Gagal memuat nilai: '+esc(error.message)+'</p>';
    return;
  }

  rows=data||[];
  const exam=exams.find(e=>String(e.id)===String(id));
  box.innerHTML=`
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <p style="margin:0"><b>${rows.length}</b> peserta sudah selesai.</p>
      <button id="downloadBtn" type="button">📥 Download Nilai</button>
    </div>
    <div style="overflow:auto;margin-top:15px">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="padding:8px;border-bottom:1px solid #ddd">No</th>
          <th style="padding:8px;border-bottom:1px solid #ddd;text-align:left">Nama</th>
          <th style="padding:8px;border-bottom:1px solid #ddd">Kelas</th>
          <th style="padding:8px;border-bottom:1px solid #ddd">No. Peserta</th>
          <th style="padding:8px;border-bottom:1px solid #ddd">Benar</th>
          <th style="padding:8px;border-bottom:1px solid #ddd">Nilai</th>
        </tr></thead>
        <tbody>${rows.map((r,i)=>`<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i+1}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${esc(r.student_name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${esc(r.student_class)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${esc(r.participant_number)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${r.correct_count}/${r.total_questions}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center"><b>${r.score ?? 0}</b></td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;

  document.getElementById('downloadBtn').onclick=()=>downloadScores(exam);
}

function esc(s){
  return String(s??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

function csvCell(v){
  return '"'+String(v??'').replace(/"/g,'""')+'"';
}

function downloadScores(exam){
  if(!rows.length){
    alert('Belum ada nilai siswa yang dapat didownload.');
    return;
  }
  const head=['No','Nama','Kelas','No. Peserta','Benar','Total Soal','Nilai'];
  const csv=[head,...rows.map((r,i)=>[
    i+1,r.student_name,r.student_class,r.participant_number,
    r.correct_count,r.total_questions,r.score
  ])].map(row=>row.map(csvCell).join(';')).join('\r\n');

  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='Rekap_Nilai_'+(exam?.title||'CBT').replace(/[^a-z0-9_-]+/gi,'_')+'.csv';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);
}

load();