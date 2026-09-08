/* LKPD Word upload flow: download -> work in Word -> upload -> teacher review */
(function(){
  const OLD_CHAPTER = window.chapter;
  if(!OLD_CHAPTER) return;

  window.chapter = async function(no){
    await OLD_CHAPTER(no);
    const section = Array.from(document.querySelectorAll('.card')).find(x => x.querySelector('#lkpd'));
    if(!section) return;

    const old = document.getElementById('lkpd');
    const oldBtn = Array.from(section.querySelectorAll('button')).find(b => b.textContent.includes('Kirim LKPD'));
    if(old) old.remove();
    if(oldBtn) oldBtn.remove();

    const area = document.createElement('div');
    area.innerHTML = `
      <div class="notice" style="margin:10px 0;line-height:1.7">
        <b>Alur LKPD:</b> Download LKPD Word → kerjakan di Microsoft Word → simpan file → pilih file di bawah → Upload & Kirim.
      </div>
      <label><b>File LKPD yang sudah dikerjakan</b></label>
      <input id="lkpdFile" class="input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="margin:8px 0">
      <button id="lkpdSubmitBtn" class="btn">📤 Upload & Kirim LKPD</button>
      <span id="lkmsg" style="margin-left:8px"></span>
    `;
    section.appendChild(area);

    const r = await db.from('lks_submissions').select('file_name,status,updated_at').eq('student_id',session.user.id).eq('chapter',no).maybeSingle();
    if(r.data?.file_name){
      document.getElementById('lkmsg').textContent = ` File sebelumnya: ${r.data.file_name}`;
    }
    document.getElementById('lkpdSubmitBtn').onclick = function(){ submitLK(no); };
  };

  window.submitLK = async function(no){
    const input = document.getElementById('lkpdFile');
    const msg = document.getElementById('lkmsg');
    const btn = document.getElementById('lkpdSubmitBtn');
    const file = input?.files?.[0];
    if(!file) return alert('Silakan pilih file LKPD Word yang sudah dikerjakan.');
    if(!file.name.toLowerCase().endsWith('.docx')) return alert('File harus berformat Word .docx.');
    if(file.size > 10 * 1024 * 1024) return alert('Ukuran file maksimal 10 MB.');

    btn.disabled = true;
    msg.textContent = ' Mengunggah...';
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path = `${session.user.id}/bab-${no}/${Date.now()}-${safe}`;
    const up = await db.storage.from('lkpd').upload(path,file,{contentType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',upsert:false});
    if(up.error){ btn.disabled=false; msg.textContent=''; return alert('Upload gagal: '+up.error.message); }

    const row = {
      student_id: session.user.id,
      chapter: no,
      answer: `[LKPD Word] ${file.name}`,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const r = await db.from('lks_submissions').upsert(row,{onConflict:'student_id,chapter'});
    if(r.error){ btn.disabled=false; msg.textContent=''; return alert('Data pengumpulan gagal disimpan: '+r.error.message); }
    await mark(no,'lkpd_done');
    btn.disabled=false;
    msg.textContent=' ✓ LKPD berhasil dikumpulkan';
  };

  const OLD_VIEW = window.viewLKPD;
  window.viewLKPD = async function(i){
    const x = window.LKPD_DATA?.[i];
    if(!x) return OLD_VIEW ? OLD_VIEW(i) : alert('Data LKPD tidak ditemukan.');
    const p = await db.from('profiles').select('id').eq('nis',x.nis).maybeSingle();
    let sub = null;
    if(p.data?.id){
      const r = await db.from('lks_submissions').select('*').eq('student_id',p.data.id).eq('chapter',Number(x.chapter)).maybeSingle();
      sub = r.data;
    }
    let link='';
    if(sub?.file_path){
      const s = await db.storage.from('lkpd').createSignedUrl(sub.file_path,3600);
      if(!s.error) link = `<p><a class="btn" href="${s.data.signedUrl}" target="_blank" rel="noopener">📥 Buka/Unduh LKPD Siswa</a></p>`;
    }
    shell(`<section class="card"><button class="btn alt" onclick="teacher()">← Kembali ke Pengumpulan LKPD</button><h2>📄 Hasil LKPD Siswa</h2><p><b>Siswa:</b> ${esc(x.name||'Siswa')}</p><p><b>NIS:</b> ${esc(x.nis||'-')}</p><p><b>Bab:</b> ${esc(x.chapter||'-')}</p><p><b>Status:</b> ${esc(sub?.status||x.status||'submitted')}</p><p><b>File:</b> ${esc(sub?.file_name||'Belum ada file')}</p>${link}<h3>Catatan pengumpulan</h3><div class="notice" style="white-space:pre-wrap;line-height:1.7">File LKPD dikumpulkan dalam format Word (.docx). Guru dapat membuka/menyimpan file melalui tombol di atas.</div></section>`);
  };
})();
