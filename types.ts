
export type View = 'dashboard' | 'content-studio' | 'campaign-planner' | 'seo-assistant';

// MARKETING DOMAIN TYPES

export type ContentTone = 'Informative' | 'Persuasive' | 'Friendly' | 'Professional';
export type ContentFormat = 'Blog' | 'Email' | 'Ad' | 'Social';
export type ContentLength = 'Short' | 'Medium' | 'Long';

export interface ContentRequest {
  topic: string;
  audience: string;
  tone: ContentTone;
  format: ContentFormat;
  keywords?: string[];
  length?: ContentLength;
  callToAction?: string;
}

export interface ContentVariant {
  headline: string;
  body: string;
  channel: 'LinkedIn' | 'X' | 'Instagram' | 'Facebook';
}

export interface ContentOutput {
  title: string;
  summary: string;
  body: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  variants?: ContentVariant[];
}

export type CampaignObjective = 'Awareness' | 'Engagement' | 'LeadGen' | 'Conversion';

export interface CampaignChannelPlan {
  channel: 'Email' | 'LinkedIn' | 'X' | 'Instagram' | 'Blog' | 'YouTube' | 'Ads';
  cadence: string;
  contentTypes: string[];
}

export interface CampaignCalendarItem {
  date: string; // YYYY-MM-DD
  channel: string;
  contentTitle: string;
  description: string;
  owner: string;
}

export interface CampaignKpiTarget {
  name: string;
  target: number;
  unit: string; // e.g., % or number
}

export interface CampaignPlan {
  campaignName: string;
  objective: CampaignObjective;
  targetAudience: string;
  channels: CampaignChannelPlan[];
  contentCalendar: CampaignCalendarItem[];
  kpis: CampaignKpiTarget[];
  brief: string;
}

export type SearchIntent = 'Informational' | 'Transactional' | 'Navigational' | 'Commercial';

export interface SEOClusterItem {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: string;
}

export interface SEOCluster {
  seedKeyword: string;
  intent: SearchIntent;
  cluster: SEOClusterItem[];
}

export interface SEOOutlineSection {
  h2: string;
  bullets: string[];
}

export interface SEOOutline {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  sections: SEOOutlineSection[];
  faqs: { question: string; answer: string }[];
  internalLinks?: string[];
}

export interface MarketingKpi {
  name: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}
