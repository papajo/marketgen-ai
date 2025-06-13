
export enum Page {
  ContentGeneration = 'content-generation',
  ABTesting = 'ab-testing',
  Projects = 'projects',
  Profile = 'profile',
}

export enum ContentCreationType {
  Copy = 'copy',
  Image = 'image',
  Video = 'video', // Placeholder
  GIF = 'gif',     // Placeholder
}

export enum MarketingCopyType {
  AdCopy = 'Ad Copy',
  Email = 'Email',
  SocialPost = 'Social Post',
  Website = 'Website Content',
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
  feedback?: 'liked' | 'disliked';
}

export interface GeneratedImageItem {
  id: string;
  type: 'Generated Image';
  imageUrl: string;
  prompt: string;
  timestamp: string;
  feedback?: 'liked' | 'disliked';
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
  status: 'Active' | 'Completed' | 'Paused';
  performance?: string; // e.g., "+28%"
  winner?: string; // e.g., "Version B"
}
