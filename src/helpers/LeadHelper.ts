import { LeadDto } from '@/models/dtos/LeadsDto';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';

export class LeadHelper {
  static getLeadFormType(leadType: LeadTypeEnum) {
    switch (leadType) {
      case LeadTypeEnum.PERSON:
        return 'individual';
      case LeadTypeEnum.ORGANIZATION:
        return 'organization';
      case LeadTypeEnum.BUSINESS:
        return 'business';
      case LeadTypeEnum.CONVERSATIONAL:
        return 'conversational';
      default:
        return '';
    }
  }

  static getLeadInitials = (row?: LeadDto) => {
    if (!row) return '-';
    if (row.username?.length && row.username?.length > 2) return row.username?.slice(0, 2);
    if (row.first_name?.length && row.first_name?.length > 2) return row.first_name?.slice(0, 2);
    if (row.last_name?.length && row.last_name?.length > 2) return row.last_name?.slice(0, 2);
    return '-';
  };
}
