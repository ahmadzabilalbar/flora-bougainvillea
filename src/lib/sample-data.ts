// Seed data offered from the admin "Setup" panel.
export const SAMPLE_TYPES = [
  { id: "glabra", name: "Glabra", description: "Vigorous climbers with smooth leaves and abundant bracts.", sort: "1" },
  { id: "buttiana", name: "Buttiana Hybrid", description: "Large, showy bract clusters in warm tones.", sort: "2" },
  { id: "dwarf", name: "Dwarf", description: "Compact growth — perfect for pots, hedges and bonsai.", sort: "3" },
  { id: "variegated", name: "Variegated", description: "Cream or gold-edged foliage that sparkles even off-season.", sort: "4" },
  { id: "double", name: "Double Bract", description: "Ruffled, layered bracts that last for weeks.", sort: "5" },
];

export const SAMPLE_VARIETIES = [
  { id: "barbara-karst", name: "Barbara Karst", typeId: "buttiana", color: "Crimson", description: "A reliable classic with brilliant crimson bracts and a long flowering season. Thrives in full sun and heat.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "california-gold", name: "California Gold", typeId: "buttiana", color: "Gold", description: "Golden-apricot bracts that glow at sunset. A vigorous grower ideal for fences and pergolas.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "purple-queen", name: "Purple Queen", typeId: "glabra", color: "Purple", description: "Deep royal purple bracts held in generous clusters on a sturdy, easy-going plant.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "bambino-pink", name: "Bambino Pink", typeId: "dwarf", color: "Pink", description: "A compact, near-thornless dwarf with candy-pink bracts — a balcony favourite.", imageUrl: "", featured: "TRUE", published: "TRUE" },
  { id: "thai-delight", name: "Thai Delight", typeId: "variegated", color: "Pink", description: "Soft pink bracts over cream-variegated leaves for year-round interest.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "singapore-white", name: "Singapore White", typeId: "glabra", color: "White", description: "Pure white bracts with a gentle blush as they age. Elegant against dark walls.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "double-pink", name: "Double Pink", typeId: "double", color: "Pink", description: "Lush, ruffled double bracts that cling to the stems for weeks.", imageUrl: "", featured: "FALSE", published: "TRUE" },
  { id: "sundown-orange", name: "Sundown Orange", typeId: "buttiana", color: "Orange", description: "Tangerine bracts that mature to coral-pink, giving a two-tone effect on one plant.", imageUrl: "", featured: "FALSE", published: "TRUE" },
];

export const SAMPLE_PAGES = [
  {
    id: "care-guide",
    slug: "care-guide",
    title: "Care Guide",
    published: "TRUE",
    sort: "1",
    body: `Bougainvillea is happiest when it is treated a little tough.

## Sun
Give at least 6 hours of direct sun a day. More sun means more colour.

## Water
- Water deeply, then let the soil dry out between waterings.
- Slight drought stress encourages flowering.
- Never let pots sit in water.

## Feeding
Use a low-nitrogen, high-potassium fertiliser every 3–4 weeks during the growing season.

## Pruning
Prune lightly after each flush of flowers. Bracts form on new growth, so a trim keeps the show going.`,
  },
  {
    id: "ordering",
    slug: "ordering",
    title: "Ordering & Delivery",
    published: "TRUE",
    sort: "2",
    body: `We grow every plant on-site and prepare each order by hand.

## How to order
Message us on WhatsApp or email with the varieties and sizes you'd like. We'll reply with availability and a quote.

## Delivery
Local delivery is available most days. Plants are watered and wrapped before they leave the nursery.`,
  },
];
