// Each "table" is one tab in the Google Spreadsheet. Row 1 holds the headers below.
export const TABLES = {
  Types: ["id", "name", "description", "sort"],
  Varieties: [
    "id",
    "name",
    "typeId",
    "color",
    "description",
    "imageUrl",
    "featured",
    "published",
    "createdAt",
    "updatedAt",
  ],
  Pages: ["id", "slug", "title", "body", "published", "sort", "updatedAt"],
  Content: ["key", "value"],
} as const;

export type TableName = keyof typeof TABLES;
export type Row = Record<string, string>;

export type BougainvilleaType = {
  id: string;
  name: string;
  description: string;
  sort: number;
};

export type Variety = {
  id: string;
  name: string;
  typeId: string;
  color: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
  sort: number;
  updatedAt: string;
};

// Editable site content (the "CMS" key/value store).
export const CONTENT_FIELDS = [
  { key: "siteName", label: "Site name", type: "text", default: "Flora Bougainvillea" },
  { key: "tagline", label: "Tagline", type: "text", default: "Bunga kertas, jiwa tropika." },
  { key: "heroTitle", label: "Hero title", type: "text", default: "Palet warna bougainvillea yang hidup" },
  {
    key: "heroSubtitle",
    label: "Hero subtitle",
    type: "textarea",
    default:
      "Terokai koleksi varieti bougainvillea pilihan kami — daripada pokok memanjat magenta yang menyala hingga varieti kerdil dwiwarna yang halus, ditanam dengan teliti di bumi tropika.",
  },
  { key: "heroImage", label: "Hero image URL", type: "image", default: "" },
  { key: "aboutTitle", label: "About title", type: "text", default: "Ditanam dengan penuh kesabaran" },
  {
    key: "aboutBody",
    label: "About text",
    type: "textarea",
    default:
      "Kami ialah tapak semaian kecil yang khusus untuk bougainvillea. Setiap pokok dibiak, dibentuk dan dikeraskan di bawah cahaya matahari penuh supaya ia subur di taman, balkoni atau pasu bonsai anda.",
  },
  { key: "contactEmail", label: "Contact email", type: "text", default: "hello@example.com" },
  { key: "contactPhone", label: "Contact phone", type: "text", default: "" },
  { key: "whatsapp", label: "WhatsApp number (digits only, with country code)", type: "text", default: "" },
  { key: "address", label: "Address", type: "textarea", default: "" },
  { key: "footerText", label: "Footer text", type: "text", default: "Tumbuh di bawah mentari, dikongsi dengan kasih." },
] as const;

export type ContentKey = (typeof CONTENT_FIELDS)[number]["key"];
export type SiteContent = Record<ContentKey, string>;
