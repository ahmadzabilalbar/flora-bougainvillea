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
  { key: "tagline", label: "Tagline", type: "text", default: "Bunga kertas, hobi yang tak pernah jemu." },
  { key: "heroTitle", label: "Hero title", type: "text", default: "Warna-warni bougainvillea, dari laman sendiri" },
  {
    key: "heroSubtitle",
    label: "Hero subtitle",
    type: "textarea",
    default:
      "Koleksi peribadi seorang peminat bougainvillea. Jom tengok varieti yang ada — dari yang memanjat tinggi sampailah yang comel kerdil dalam pasu.",
  },
  { key: "heroImage", label: "Hero image URL", type: "image", default: "" },
  { key: "aboutTitle", label: "About title", type: "text", default: "Bukan nurseri, cuma minat" },
  {
    key: "aboutBody",
    label: "About text",
    type: "textarea",
    default:
      "Semuanya bermula dengan satu pasu kecil. Lama-lama, laman pun dah penuh dengan warna! Laman web ni sekadar tempat simpan dan kongsi koleksi. Kalau anda pun minat bougainvillea, jom sembang dan tukar-tukar tips.",
  },
  { key: "contactEmail", label: "Contact email", type: "text", default: "hello@example.com" },
  { key: "contactPhone", label: "Contact phone", type: "text", default: "" },
  { key: "whatsapp", label: "WhatsApp number (digits only, with country code)", type: "text", default: "" },
  { key: "address", label: "Address", type: "textarea", default: "" },
  { key: "footerText", label: "Footer text", type: "text", default: "Ditanam sebab minat, dikongsi sebab seronok." },
  { key: "showTypes", label: "Show types strip", type: "toggle", default: "true" },
  { key: "showFeatured", label: "Show featured varieties", type: "toggle", default: "true" },
  { key: "showAbout", label: "Show about section", type: "toggle", default: "true" },
  { key: "showContact", label: "Show contact section", type: "toggle", default: "true" },
] as const;

export const isOn = (v: string) => v !== "false";

export type ContentKey = (typeof CONTENT_FIELDS)[number]["key"];
export type SiteContent = Record<ContentKey, string>;
