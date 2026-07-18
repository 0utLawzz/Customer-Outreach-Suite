const openings = [
  "Assalam-o-Alaikum,",
  "AoA,",
  "Assalam o Alaikum,",
  "Assalam Alaikum,",
  "السلام علیکم،",
  "Walaikum Assalam,",
  "Assalam-o-Alaikum wa Rahmatullahi wa Barakatuh,"
];

const salutations = [
  "Dear Client,",
  "Dear Valued Client,",
  "Dear Sir/Madam,",
  "Respected Client,",
  "Muhterem Client,",
  "Janab,",
  "Muhterem Sir/Madam,",
  "Aziz Client,"
];

const line1 = [
  "Tax Year 2026 ki Tax Return filing open ho gayi hai.",
  "Aapko ittila di jati hai ke Tax Year 2026 ki Tax Return filing ka aghaz ho chuka hai.",
  "Tax Year 2026 ki Returns file karne ka waqt aa gaya hai.",
  "FBR ne Tax Year 2026 ki filing officially open kar di hai.",
  "Aapke ilm mein lana chahte hain ke Tax Year 2026 ki Tax Return filing shuru ho gayi hai.",
  "Tax Year 2026 ki annual return filing ka process shuru ho chuka hai.",
  "Yeh jaankar khushi hogi ke Tax Year 2026 ki Return filing ab shuru ho gayi hai.",
  "FBR ki taraf se Tax Year 2026 ki Return filing ka aghaz ho gaya hai.",
  "Tax Year 2026 ki filing ka waqt agaya — ab der nahi karni chahiye."
];

const line2 = [
  "Hum chahte hain ke aap ki Tax Return starting mein hi file kar di jaye, taake tamam details ko properly check kiya ja sake.",
  "Hamari koshish hai ke aap ki return jald se jald submit ho, taake sab kuch theek tarah review ho sake.",
  "Aap ki return starting mein file karna is liye zaroori hai ke tamam details ko ache se verify kiya ja sake.",
  "Early filing se aap ke paas apni details properly check karne ka pura waqt milta hai.",
  "Jaldi file karne se sab kuch theek tarike se check hota hai aur baad mein koi preshani nahi hoti.",
  "Hum chahte hain ke process smoothly complete ho, is liye starting mein hi filing ki request kar rahe hain.",
  "Pehle file karne se na sirf details theek rehti hain balke unnecessary stress bhi nahi hota.",
  "Starting mein file karna is liye faydamand hai taake agar koi correction ho to waqt par ho sake."
];

const line3 = [
  "Tax policies mein bhi kaafi changes aa gaye hain, aur late filing par individual ke liye Rs. 25,000 tak ka penalty ho sakta hai.",
  "Is saal Tax policies mein significant tabdeeliyan aai hain — late filing par Rs. 25,000 tak ka jurmana lag sakta hai.",
  "Naye qawaneen ke mutabiq, late filers ko Rs. 25,000 tak ka penalty bharna par sakta hai.",
  "FBR ne is baar penalties sakht kar di hain — late return par individual ko Rs. 25,000 tak ka fine ho sakta hai.",
  "Tax laws mein nayi tabdeeliyan aai hain; late filing par penalty Rs. 25,000 tak ja sakti hai.",
  "Yaad rahe ke is saal late filing par heavy penalty hai — Rs. 25,000 tak individual ko dena par sakta hai.",
  "Policies mein changes ke sath late filing ki penalty bhi barh gayi hai — Rs. 25,000 tak ho sakti hai.",
  "Is saal naye rules ke tehat late filers par Rs. 25,000 tak ka penalty laga hai.",
  "Late filing avoid karna behtar hai kyunke is baar Rs. 25,000 tak ka fine lag sakta hai."
];

const cta = [
  "Is liye behtar hai ke hum aap ki Tax Return 2026 ki filing abhi kar dein.",
  "Aaj hi apni Tax Return 2026 file karwayein aur fikar se azad ho jayein.",
  "Isliye hum aap se guzarish karte hain ke filing mein der na karein.",
  "Hum aap ki madad ke liye tayar hain — abhi batayein aur return file kar dete hain.",
  "Behtar yahi hoga ke hum abhi filing complete kar lein, taake baad mein koi tension na ho.",
  "Apni Tax Return 2026 jaldi file karwa lein — hum poori madad karenge.",
  "Please jald se jald humse rabta karein taake aap ki return time par file ho sake.",
  "Hum aap ki service ke liye available hain — abhi contact karein aur filing complete karein.",
  "Der na karein, hum se rabta karein aur apni Tax Return 2026 abhi file karwa lein."
];

const closings = [
  "Regards,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk",
  "Shukriya,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk",
  "JazakAllah Khair,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk",
  "Shukriya aur Dua Guzar,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk",
  "Mumnan,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk",
  "Khuda Hafiz,\nSalah Ud Din Siddiqui\n📞 0317-5211546\nC/O Ehtasham Ud Din Siddiqui\n📞 0336-0015004\nbrandex.pk"
];

export const ALL_VARIATIONS: string[] = [];

for (const o of openings) {
  for (const s of salutations) {
    for (const l1 of line1) {
      for (const l2 of line2) {
        for (const l3 of line3) {
          for (const ct of cta) {
            for (const cl of closings) {
              if (ALL_VARIATIONS.length < 327) {
                ALL_VARIATIONS.push(`${o} ${s}\n\n${l1} ${l2}\n\n${l3}\n\n${ct}\n\n${cl}`);
              } else {
                break;
              }
            }
            if (ALL_VARIATIONS.length >= 327) break;
          }
          if (ALL_VARIATIONS.length >= 327) break;
        }
        if (ALL_VARIATIONS.length >= 327) break;
      }
      if (ALL_VARIATIONS.length >= 327) break;
    }
    if (ALL_VARIATIONS.length >= 327) break;
  }
  if (ALL_VARIATIONS.length >= 327) break;
}

export function getVariationMessage(index: number): string {
  return ALL_VARIATIONS[index % 327];
}

export function getWhatsAppUrl(phone: string, message: string): string {
  // Ensure the phone number removes non-digit characters except maybe leading +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
