// localStorage.ts - Content persistence service for MarketGen AI

import { GeneratedItem, GeneratedTextItem, GeneratedImageItem } from '../types';

const STORAGE_KEYS = {
  GENERATED_CONTENT: 'marketgen_generated_content',
  USER_PREFERENCES: 'marketgen_user_preferences',
  CONTENT_STATS: 'marketgen_content_stats',
} as const;

export interface ContentStats {
  totalGenerated: number;
  textContent: number;
  imageContent: number;
  favoriteCount: number;
  lastGenerated: string | null;
  mostUsedType: string | null;
}

export interface UserPreferences {
  defaultContentType: string;
  preferredMarketingType: string;
  autoSave: boolean;
  exportFormat: 'json' | 'txt' | 'csv';
  theme: 'light' | 'dark';
}

class ContentStorageService {
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  private setToStorage<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  // Content Management
  saveContent(content: GeneratedItem): boolean {
    const existingContent = this.getAllContent();
    const updatedContent = [content, ...existingContent];

    // Keep only the last 100 items to prevent storage overflow
    if (updatedContent.length > 100) {
      updatedContent.splice(100);
    }

    const success = this.setToStorage(STORAGE_KEYS.GENERATED_CONTENT, updatedContent);

    if (success) {
      this.updateStats(content);
    }

    return success;
  }

  getAllContent(): GeneratedItem[] {
    return this.getFromStorage<GeneratedItem[]>(STORAGE_KEYS.GENERATED_CONTENT, []);
  }

  getContentById(id: string): GeneratedItem | null {
    const allContent = this.getAllContent();
    return allContent.find(item => item.id === id) || null;
  }

  updateContent(id: string, updates: Partial<GeneratedItem>): boolean {
    const allContent = this.getAllContent();
    const index = allContent.findIndex(item => item.id === id);

    if (index === -1) {
      return false;
    }

    allContent[index] = { ...allContent[index], ...updates };
    return this.setToStorage(STORAGE_KEYS.GENERATED_CONTENT, allContent);
  }

  deleteContent(id: string): boolean {
    const allContent = this.getAllContent();
    const filteredContent = allContent.filter(item => item.id !== id);
    return this.setToStorage(STORAGE_KEYS.GENERATED_CONTENT, filteredContent);
  }

  favoriteContent(id: string): boolean {
    const content = this.getContentById(id);
    if (!content) return false;

    const updatedContent = {
      ...content,
      feedback: content.feedback === 'liked' ? undefined : 'liked' as const
    };

    return this.updateContent(id, updatedContent);
  }

  // Search and Filter
  searchContent(query: string): GeneratedItem[] {
    const allContent = this.getAllContent();
    const lowercaseQuery = query.toLowerCase();

    return allContent.filter(item => {
      const textContent = (item as GeneratedTextItem).content;
      const imagePrompt = (item as GeneratedImageItem).prompt;

      return (
        item.type.toLowerCase().includes(lowercaseQuery) ||
        (textContent && textContent.toLowerCase().includes(lowercaseQuery)) ||
        (imagePrompt && imagePrompt.toLowerCase().includes(lowercaseQuery))
      );
    });
  }

  filterContentByType(type: string): GeneratedItem[] {
    const allContent = this.getAllContent();
    return allContent.filter(item => item.type === type);
  }

  filterContentByDate(startDate: Date, endDate?: Date): GeneratedItem[] {
    const allContent = this.getAllContent();
    const start = startDate.getTime();
    const end = endDate ? endDate.getTime() : Date.now();

    return allContent.filter(item => {
      // Extract timestamp from the item
      const [time] = item.timestamp.split(' ');
      const today = new Date();
      const [hours, minutes] = time.split(':').map(Number);

      const itemDate = new Date(today);
      itemDate.setHours(hours, minutes, 0, 0);

      const itemTime = itemDate.getTime();
      return itemTime >= start && itemTime <= end;
    });
  }

  getFavoriteContent(): GeneratedItem[] {
    const allContent = this.getAllContent();
    return allContent.filter(item => item.feedback === 'liked');
  }

  // Statistics
  private updateStats(newContent: GeneratedItem): void {
    const stats = this.getStats();
    const isTextContent = 'content' in newContent;

    const updatedStats: ContentStats = {
      totalGenerated: stats.totalGenerated + 1,
      textContent: stats.textContent + (isTextContent ? 1 : 0),
      imageContent: stats.imageContent + (isTextContent ? 0 : 1),
      favoriteCount: stats.favoriteCount,
      lastGenerated: new Date().toISOString(),
      mostUsedType: this.calculateMostUsedType(newContent.type),
    };

    this.setToStorage(STORAGE_KEYS.CONTENT_STATS, updatedStats);
  }

  private calculateMostUsedType(newType: string): string {
    const allContent = this.getAllContent();
    const typeCounts: Record<string, number> = {};

    // Count all types including the new one
    [...allContent, { type: newType }].forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    // Find the most used type
    return Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    )[0];
  }

  getStats(): ContentStats {
    const defaultStats: ContentStats = {
      totalGenerated: 0,
      textContent: 0,
      imageContent: 0,
      favoriteCount: 0,
      lastGenerated: null,
      mostUsedType: null,
    };

    const stats = this.getFromStorage<ContentStats>(STORAGE_KEYS.CONTENT_STATS, defaultStats);

    // Update favorite count from actual content
    const favoriteCount = this.getFavoriteContent().length;
    if (stats.favoriteCount !== favoriteCount) {
      stats.favoriteCount = favoriteCount;
      this.setToStorage(STORAGE_KEYS.CONTENT_STATS, stats);
    }

    return stats;
  }

  // User Preferences
  getUserPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      defaultContentType: 'copy',
      preferredMarketingType: 'Ad Copy',
      autoSave: true,
      exportFormat: 'json',
      theme: 'light',
    };

    return this.getFromStorage<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences);
  }

  updateUserPreferences(preferences: Partial<UserPreferences>): boolean {
    const currentPreferences = this.getUserPreferences();
    const updatedPreferences = { ...currentPreferences, ...preferences };
    return this.setToStorage(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
  }

  // Export and Import
  exportContent(format: 'json' | 'txt' | 'csv' = 'json'): string {
    const allContent = this.getAllContent();

    switch (format) {
      case 'json':
        return JSON.stringify(allContent, null, 2);

      case 'txt':
        return allContent.map(item => {
          const textContent = (item as GeneratedTextItem).content;
          const imagePrompt = (item as GeneratedImageItem).prompt;

          return `Type: ${item.type}
Timestamp: ${item.timestamp}
Content: ${textContent || `Image: ${imagePrompt}`}
---`;
        }).join('\n\n');

      case 'csv':
        const headers = 'ID,Type,Timestamp,Content,Image URL,Prompt,Feedback';
        const rows = allContent.map(item => {
          const textContent = (item as GeneratedTextItem).content || '';
          const imageUrl = (item as GeneratedImageItem).imageUrl || '';
          const imagePrompt = (item as GeneratedImageItem).prompt || '';

          return `"${item.id}","${item.type}","${item.timestamp}","${textContent.replace(/"/g, '""')}","${imageUrl}","${imagePrompt}","${item.feedback || ''}"`;
        });

        return [headers, ...rows].join('\n');

      default:
        return JSON.stringify(allContent, null, 2);
    }
  }

  importContent(data: string, format: 'json' = 'json'): boolean {
    try {
      if (format === 'json') {
        const importedContent: GeneratedItem[] = JSON.parse(data);

        // Validate the imported data
        if (!Array.isArray(importedContent)) {
          throw new Error('Invalid data format');
        }

        // Merge with existing content, avoiding duplicates
        const existingContent = this.getAllContent();
        const existingIds = new Set(existingContent.map(item => item.id));

        const newContent = importedContent.filter(item =>
          item.id && item.type && item.timestamp && !existingIds.has(item.id)
        );

        const mergedContent = [...existingContent, ...newContent];
        return this.setToStorage(STORAGE_KEYS.GENERATED_CONTENT, mergedContent);
      }

      return false;
    } catch (error) {
      console.error('Error importing content:', error);
      return false;
    }
  }

  // Utility methods
  clearAllContent(): boolean {
    return this.setToStorage(STORAGE_KEYS.GENERATED_CONTENT, []);
  }

  clearStats(): boolean {
    const defaultStats: ContentStats = {
      totalGenerated: 0,
      textContent: 0,
      imageContent: 0,
      favoriteCount: 0,
      lastGenerated: null,
      mostUsedType: null,
    };
    return this.setToStorage(STORAGE_KEYS.CONTENT_STATS, defaultStats);
  }

  getStorageSize(): { used: number; total: number; percentage: number } {
    if (!this.isStorageAvailable()) {
      return { used: 0, total: 0, percentage: 0 };
    }

    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    const percentage = (used / total) * 100;

    return { used, total, percentage: Math.round(percentage * 100) / 100 };
  }
}

// Export singleton instance
export const contentStorage = new ContentStorageService();
export default contentStorage;
