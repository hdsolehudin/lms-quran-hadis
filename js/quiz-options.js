/* Menjadikan setiap soal kuis memiliki 5 opsi jawaban. */
(function(){
  if(!window.LMS_DATA || !LMS_DATA.quiz) return;
  const banks={
    1:[
      "menggunakan harta tanpa perhitungan","menyamakan semua kebutuhan dan keinginan","menghindari semua bentuk kenikmatan","mengutamakan gengsi dalam pengeluaran","menggunakan harta hanya untuk kepentingan pribadi","mengabaikan kebutuhan orang lain","membelanjakan harta tanpa prioritas","menganggap semua diskon wajib dimanfaatkan"
    ],
    2:[
      "menyerah sebelum berusaha","menyalahkan keadaan atas semua masalah","menghindari semua tantangan kehidupan","berusaha tanpa berdoa","berdoa tanpa melakukan ikhtiar","membalas masalah dengan kemarahan","menganggap setiap musibah sebagai hukuman","berhenti berusaha setelah mengalami kegagalan"
    ],
    3:[
      "mengeksploitasi sumber daya tanpa batas","mengabaikan dampak pencemaran","menggunakan sumber daya secara boros","membiarkan sampah menumpuk","mengutamakan keuntungan tanpa memikirkan lingkungan","menganggap kerusakan alam tidak berkaitan dengan manusia","menggunakan air dan energi tanpa batas","menghindari tanggung jawab sebagai khalifah"
    ],
    4:[
      "berdakwah dengan cara memaksa","menyampaikan nasihat dengan kasar","mengabaikan kondisi mad'u","mengedepankan perdebatan daripada hikmah","menyebarkan pesan tanpa memeriksa kebenarannya","menggunakan celaan agar orang berubah","memaksakan pendapat kepada semua orang","meninggalkan keteladanan dalam berdakwah"
    ]
  };
  Object.keys(LMS_DATA.quiz).forEach(no=>{
    const qs=LMS_DATA.quiz[no]||[];
    const bank=banks[no]||[];
    qs.forEach(q=>{
      if(!Array.isArray(q[1])) return;
      const used=new Set(q[1].map(String));
      for(const option of bank){
        if(q[1].length>=5) break;
        if(!used.has(option)){
          q[1].push(option);
          used.add(option);
        }
      }
    });
  });
})();
