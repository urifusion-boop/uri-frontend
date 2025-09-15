export interface LeadFormSnapshotDto {
  lead_form_snapshot_id: string;
  lead_form_id: string;
  user_id: string;
  form_type: string;
  form_title: string;
  q_keywords: string;
  revenue_range_min: number;
  revenue_range_max: number;
  q_organization_name: string;
}

export class LeadFormSnapshotGetByFiltersDto {
  lead_form_id?: string;
  user_id?: string;
  form_type?: string;
  form_title?: string;
  q_keywords?: string;
  revenue_range_min?: number;
  revenue_range_max?: number;
  q_organization_name?: string;
  skip?: number;
  limit?: number;
  page?: number;
  per_page?: number;
}
