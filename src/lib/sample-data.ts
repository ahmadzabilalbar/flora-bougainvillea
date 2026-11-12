// Seed data offered from the admin "Setup" panel (public-facing text in Bahasa Melayu).
export const SAMPLE_TYPES = [
  { id: "glabra", name: "Glabra", description: "Pokok memanjat yang subur dengan daun licin dan brakta yang lebat.", sort: "1" },
  { id: "buttiana", name: "Hibrid Buttiana", description: "Gugusan brakta besar dan menawan dalam tona warna hangat.", sort: "2" },
  { id: "dwarf", name: "Kerdil", description: "Pertumbuhan padat — sesuai untuk pasu, pagar hidup dan bonsai.", sort: "3" },
  { id: "variegated", name: "Varigata", description: "Daun bertepi krim atau keemasan yang tetap menyerlah walaupun tidak berbunga.", sort: "4" },
  { id: "double", name: "Brakta Berganda", description: "Brakta berlapis dan beralun yang tahan berminggu-minggu.", sort: "5" },
];

export const SAMPLE_VARIETIES = [
  { id: "barbara-karst", name: "Barbara Karst", typeId: "buttiana", color: "Merah tua", description: "Varieti klasik yang boleh diharap dengan brakta merah tua yang terang dan musim berbunga yang panjang. Subur di bawah cahaya matahari penuh dan cuaca panas.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "california-gold", name: "California Gold", typeId: "buttiana", color: "Emas", description: "Brakta keemasan-aprikot yang bersinar ketika senja. Tumbuh dengan cepat, sesuai untuk pagar dan pergola.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "purple-queen", name: "Purple Queen", typeId: "glabra", color: "Ungu", description: "Brakta ungu diraja yang pekat dalam gugusan yang lebat pada pokok yang kukuh dan mudah dijaga.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "bambino-pink", name: "Bambino Pink", typeId: "dwarf", color: "Merah jambu", description: "Varieti kerdil yang padat dan hampir tiada duri dengan brakta merah jambu — kegemaran untuk balkoni.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "thai-delight", name: "Thai Delight", typeId: "variegated", color: "Merah jambu", description: "Brakta merah jambu lembut di atas daun varigata krim, cantik sepanjang tahun.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "singapore-white", name: "Singapore White", typeId: "glabra", color: "Putih", description: "Brakta putih bersih yang bertukar kemerahan lembut apabila matang. Anggun berlatarkan dinding gelap.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "double-pink", name: "Double Pink", typeId: "double", color: "Merah jambu", description: "Brakta berganda yang lebat dan beralun, kekal pada dahan selama berminggu-minggu.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "sundown-orange", name: "Sundown Orange", typeId: "buttiana", color: "Jingga", description: "Brakta jingga yang bertukar menjadi merah jambu koral, memberikan kesan dua warna pada satu pokok.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "vera-deep-purple", name: "Vera Deep Purple", typeId: "glabra", color: "Ungu", description: "Brakta ungu gelap yang berkilat dan berbunga hampir sepanjang tahun. Sangat sesuai untuk pagar hidup yang padat.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "rosenka", name: "Rosenka", typeId: "buttiana", color: "Emas", description: "Brakta keemasan yang perlahan-lahan bertukar menjadi merah jambu lembut. Satu pokok, pelbagai warna.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "raspberry-ice", name: "Raspberry Ice", typeId: "variegated", color: "Merah", description: "Daun varigata bertepi krim dengan brakta merah raspberi yang terang. Sesuai untuk bakul gantung.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "pixie-pink", name: "Pixie Pink", typeId: "dwarf", color: "Merah jambu", description: "Varieti kerdil berdaun kecil dengan dahan yang rapat, kegemaran peminat bonsai.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "mahara-orange", name: "Mahara Orange", typeId: "double", color: "Jingga", description: "Brakta berganda berwarna jingga tembaga yang lebat seperti jambak bunga kertas.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "mahara-white", name: "Mahara White", typeId: "double", color: "Putih", description: "Gugusan brakta berganda putih bersih yang tampak mewah di taman moden.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "elizabeth-angus", name: "Elizabeth Angus", typeId: "glabra", color: "Magenta", description: "Brakta magenta besar yang menyala dan sangat tahan panas. Pilihan utama untuk pergola.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "helen-johnson", name: "Helen Johnson", typeId: "dwarf", color: "Magenta", description: "Varieti kerdil yang rendang dengan brakta magenta-merah jambu, sesuai ditanam dalam pasu di beranda.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "golden-glow", name: "Golden Glow", typeId: "buttiana", color: "Kuning", description: "Brakta kuning keemasan yang ceria dan jarang ditemui. Mencerahkan sudut taman yang suram.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "lavender-queen", name: "Lavender Queen", typeId: "variegated", color: "Lavender", description: "Brakta ungu lavender yang lembut di atas daun varigata hijau-krim. Tenang dan anggun.", imageUrl: "", featured: "FALSE", published: "TRUE" },
];

export const SAMPLE_PAGES = [
  {
    id: "panduan-penjagaan",
    slug: "panduan-penjagaan",
    title: "Panduan Penjagaan",
    published: "TRUE",
    sort: "1",
    body: `Bougainvillea paling gembira apabila dijaga dengan sedikit "keras".

## Cahaya matahari
Berikan sekurang-kurangnya 6 jam cahaya matahari terus setiap hari. Lebih banyak cahaya, lebih banyak warna.

## Penyiraman
- Siram dengan banyak, kemudian biarkan tanah kering sebelum disiram semula.
- Sedikit tekanan kemarau menggalakkan pembungaan.
- Jangan biarkan pasu bertakung air.

## Pembajaan
Gunakan baja rendah nitrogen dan tinggi kalium setiap 3–4 minggu semasa musim pertumbuhan.

## Pemangkasan
Pangkas sedikit selepas setiap kali berbunga. Brakta tumbuh pada dahan baharu, jadi pemangkasan membantu pokok terus berbunga.`,
  },
  {
    id: "tempahan",
    slug: "tempahan",
    title: "Tempahan & Penghantaran",
    published: "TRUE",
    sort: "2",
    body: `Setiap pokok ditanam di tapak semaian kami dan setiap tempahan disediakan dengan tangan.

## Cara menempah
Hubungi kami melalui WhatsApp atau e-mel dengan varieti dan saiz yang anda mahu. Kami akan membalas dengan maklumat stok dan sebut harga.

## Penghantaran
Penghantaran tempatan tersedia hampir setiap hari. Pokok disiram dan dibalut sebelum meninggalkan tapak semaian.`,
  },
];
