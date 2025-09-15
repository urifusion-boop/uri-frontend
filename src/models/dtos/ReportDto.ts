import { ReportTypeEnum } from '@/models/enum-models/ReportTypeEnum';
import { HashtagTrackingReportFieldsEnum } from '../enum-models/HashtagTrackingReportFieldsEnum';

export class GenerateReportDto {
  user_id?: string;
  influencer_id?: string;
  keyword_tracker_id?: string;
  report_generation_type?: ReportTypeEnum;
  report_generation_subtype?: string;
  recipient?: string;
  period?: string;
  account_tracking_included_fields?: string[];
}

export interface HashtagTrackingReportDto {
  user_id: string;
  tracker_id: string;
  recipient: string;
  period: string;
  report_generation_type: string;
  report_generation_subtype: string;
  included_fields: HashtagTrackingReportFieldsEnum[];
}

export interface AccountTrackingReportDto {
  influencer_ids: InfluencerIds;
  user_id: string;
  tracker_id: string;
  recipient: string;
  period: string;
  report_generation_type: string;
  report_generation_subtypes: string[];
  included_fields: string[];
}

export interface InfluencerIds {
  instagram: string;
  facebook: string;
  linkedin: string;
}
