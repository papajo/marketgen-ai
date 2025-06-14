export enum Page {
  ContentGeneration = "content-generation",
  ABTesting = "ab-testing",
  Projects = "projects",
  Profile = "profile",
}

export enum ContentCreationType {
  Copy = "copy",
  Image = "image",
  Video = "video", // Placeholder
  GIF = "gif", // Placeholder
}

export enum MarketingCopyType {
  AdCopy = "Ad Copy",
  Email = "Email",
  SocialPost = "Social Post",
  Website = "Website Content",
  BlogPost = "Blog Post",
  ProductDescription = "Product Description",
  Headlines = "Headlines",
  PressRelease = "Press Release",
  LandingPage = "Landing Page",
  Newsletter = "Newsletter",
  VideoScript = "Video Script",
  PodcastScript = "Podcast Script",
}

export interface NavigationItem {
  id: Page;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

export interface GeneratedTextItem {
  id: string;
  type: MarketingCopyType | string; // To accommodate various text types
  content: string;
  timestamp: string;
  feedback?: "liked" | "disliked";
  tags?: string[];
  projectId?: string;
  isFavorite?: boolean;
  editHistory?: {
    timestamp: string;
    content: string;
  }[];
}

export interface GeneratedImageItem {
  id: string;
  type: "Generated Image";
  imageUrl: string;
  prompt: string;
  timestamp: string;
  feedback?: "liked" | "disliked";
  tags?: string[];
  projectId?: string;
  isFavorite?: boolean;
  editHistory?: {
    timestamp: string;
    prompt: string;
  }[];
}

export enum ToneStyle {
  Professional = "Professional",
  Casual = "Casual",
  Urgent = "Urgent",
  Friendly = "Friendly",
  Formal = "Formal",
  Conversational = "Conversational",
  Persuasive = "Persuasive",
  Informative = "Informative",
  Playful = "Playful",
  Authoritative = "Authoritative",
}

export enum TargetAudience {
  B2B = "B2B",
  B2C = "B2C",
  Millennials = "Millennials",
  GenZ = "Gen Z",
  GenX = "Gen X",
  Boomers = "Baby Boomers",
  Professionals = "Professionals",
  Students = "Students",
  Parents = "Parents",
  Entrepreneurs = "Entrepreneurs",
}

export enum ContentLength {
  Short = "Short",
  Medium = "Medium",
  Long = "Long",
  VeryLong = "Very Long",
}

export enum Industry {
  Technology = "Technology",
  Healthcare = "Healthcare",
  Finance = "Finance",
  Education = "Education",
  Retail = "Retail",
  RealEstate = "Real Estate",
  Food = "Food & Beverage",
  Travel = "Travel & Tourism",
  Fashion = "Fashion",
  Automotive = "Automotive",
  Sports = "Sports & Fitness",
  Entertainment = "Entertainment",
}

export interface ContentGenerationOptions {
  marketingType: MarketingCopyType;
  tone: ToneStyle;
  audience: TargetAudience;
  length: ContentLength;
  industry?: Industry;
  keywords?: string[];
  callToAction?: string;
}

export type GeneratedItem = GeneratedTextItem | GeneratedImageItem;

export interface Project {
  id: string;
  name: string;
  lastUpdated: string;
}

export interface ABTest {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Completed" | "Paused";
  performance?: string; // e.g., "+28%"
  winner?: string; // e.g., "Version B"
}

export interface ContentFilter {
  type?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  feedback?: "liked" | "disliked";
  searchQuery?: string;
  projectId?: string;
}

export interface ContentSort {
  field: "timestamp" | "type" | "feedback";
  order: "asc" | "desc";
}

export interface ExportOptions {
  format: "json" | "txt" | "csv";
  includeImages: boolean;
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
