import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ILeadFormSnapshotApi = 'getByLeadFormId' | 'getByUserId' | 'getByFilters' | 'getLatestSnapshot' | 'delete' | 'getById';

const rawLeadFormSnapshotApiRoutes: Record<ILeadFormSnapshotApi, string> = {
  getByLeadFormId: '/lead-form-snapshots/getByLeadFormId',
  getByUserId: '/lead-form-snapshots/getByUserId',
  getByFilters: '/lead-form-snapshots/getByFilters',
  getLatestSnapshot: '/lead-form-snapshots/getLatestSnapshot',
  delete: '/lead-form-snapshots/delete',
  getById: '/lead-form-snapshots/getById',
};

// curl -X 'GET' \
//   'https://api.uricreative.com:8445/lead-form-snapshots/getById?lead_form_snapshot_id=1' \
//   -H 'accept: application/json'

// curl -X 'GET' \
//   'https://api.uricreative.com:8445/lead-form-snapshots/getByLeadFormId?lead_form_id=1&skip=0&limit=10' \
//   -H 'accept: application/json'

// curl -X 'GET' \
// 'https://api.uricreative.com:8445/lead-form-snapshots/getByUserId?user_id=1&skip=0&limit=10' \
// -H 'accept: application/json'

// curl -X 'GET' \
//   'https://api.uricreative.com:8445/lead-form-snapshots/getByFilters?skip=0&limit=10&user_id=yt65&lead_form_id=12ed&form_type=ORGANIZATION&form_title=ab&q_keywords=food&revenue_range_min=10&revenue_range_max=50&q_organization_name=abc&business_name=abc&business_summary=blah%20blah&business_website=example.com' \
//   -H 'accept: application/json'

// curl -X 'GET' \
//   'https://api.uricreative.com:8445/lead-form-snapshots/getLatestSnapshot?user_id=2e3d&lead_form_id=13e2dw&form_type=PERSON&form_title=ab&q_keywords=abc&revenue_range_min=10&revenue_range_max=20&q_organization_name=abc&business_name=abc&business_summary=blah&business_website=ex.com' \
//   -H 'accept: application/json'

// curl -X 'DELETE' \
//   'https://api.uricreative.com:8445/lead-form-snapshots/delete?lead_form_snapshot_id=sms' \
//   -H 'accept: application/json'

export const leadFormSnapshotApiRoutes: Record<ILeadFormSnapshotApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLeadFormSnapshotApiRoutes);
