import { UriHttpClient } from '@/configs/http.config';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

const BASE = `${BackendUrlEnum.INSIGHTS}/social-media/brand-profile`;

export interface BrandGuardrails {
  avoid_topics?: string;
  banned_words?: string;
  emoji_usage?: string; // 'yes' | 'some' | 'no'
  max_hashtags?: string;
  compliance_notes?: string;
}

export interface BrandKeyDate {
  date: string;
  label: string;
}

export interface BrandTeamMember {
  email: string;
  role: string;
}

export interface BrandProfileData {
  // Basics
  brand_name?: string;
  industry?: string;
  website?: string;
  product_description?: string;
  // Identity
  logo_url?: string;
  brand_colors?: string[];
  // Personality
  personality_quiz?: Record<string, string>;
  derived_voice?: string;
  voice_sample?: string;
  platform_tones?: Record<string, string>;
  same_tone_everywhere?: boolean;
  // Content strategy
  content_pillars?: string[];
  preferred_formats?: string[];
  guardrails?: BrandGuardrails;
  cta_styles?: string[];
  default_link?: string;
  // Audience
  audience_age_range?: string;
  target_platforms?: string[];
  primary_goal?: string;
  // Competitors
  competitor_handles?: string[];
  // Scheduling
  key_dates?: BrandKeyDate[];
  posting_cadence?: string;
  posting_time_mode?: string;
  posting_time_prefs?: Record<string, string>;
  // Approval
  approval_workflow?: string;
  approval_channels?: string[];
  notification_events?: string[];
  notification_channel?: string;
  // Team
  team_members?: BrandTeamMember[];
  // Localisation
  languages?: string[];
  region?: string;
  // Meta
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class BrandProfileService {
  static async get(): Promise<UriResponse<BrandProfileData | null>> {
    const res: AxiosResponse<UriResponse<BrandProfileData | null>> = await UriHttpClient.getClient().get(BASE);
    return res.data;
  }

  static async save(data: BrandProfileData): Promise<UriResponse<BrandProfileData>> {
    const res: AxiosResponse<UriResponse<BrandProfileData>> = await UriHttpClient.getClient().post(BASE, data);
    return res.data;
  }

  static async uploadLogo(file: File): Promise<UriResponse<{ logo_url: string }>> {
    const form = new FormData();
    form.append('file', file);
    const res: AxiosResponse<UriResponse<{ logo_url: string }>> = await UriHttpClient.getClient().post(`${BASE}/logo`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  }

  static async complete(data: BrandProfileData): Promise<UriResponse<BrandProfileData>> {
    return BrandProfileService.save({ ...data, onboarding_completed: true });
  }

  /** Returns true if the user has finished brand onboarding. */
  static async isOnboardingDone(): Promise<boolean> {
    try {
      const res = await BrandProfileService.get();
      return !!(res.status && res.responseData?.onboarding_completed);
    } catch {
      return false;
    }
  }
}
