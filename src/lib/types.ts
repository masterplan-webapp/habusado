export type ArticleCategory =
  | "Sinais de Abuso"
  | "Reconstrução"
  | "Paternidade e Família"
  | "Saúde Mental";

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  author: string;
  authorCredentials?: string;
  authorBio?: string;
}

export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "scheduled"
  | "published"
  | "rejected";

export type ArticleSource = "admin" | "contributor";

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  content: string;
  cover_image: string;
  tags: string[];
  read_time: string;
  author_name: string;
  author_credentials?: string | null;
  author_bio?: string | null;
  author_email?: string | null;
  source: ArticleSource;
  status: ArticleStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface TestimonialReply {
  id: string;
  testimonial_id: string;
  pseudonym: string;
  content: string;
  status: TestimonialStatus;
  created_at: string;
}

export interface Testimonial {
  id: string;
  pseudonym: string;
  title: string;
  content: string;
  status: TestimonialStatus;
  created_at: string;
  support_count?: number;
  replies?: TestimonialReply[];
}

export interface ModerationResult {
  allowed: boolean;
  isCrisis: boolean;
  flag?: string;
  userMessage?: string;
}

export type ProfessionalSpecialty =
  | "Psicologia"
  | "Direito"
  | "Psiquiatria"
  | "Terapia";

export type ProfessionalStatus = "pending" | "approved";

export interface Professional {
  id: string;
  name: string;
  specialty: ProfessionalSpecialty;
  license_number: string;
  bio: string;
  city: string;
  state: string;
  is_online: boolean;
  contact_url: string;
  photo_url?: string | null;
  status: ProfessionalStatus;
  created_at: string;
}

export interface ThermometerOption {
  label: string;
  score: number;
}

export interface ThermometerQuestion {
  id: string;
  question: string;
  category: string;
  options: ThermometerOption[];
}
