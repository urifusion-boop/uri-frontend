import { LeadDto } from '@/models/dtos/LeadsDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
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
      case LeadTypeEnum.GOOGLE_MAPS:
        return 'googlemaps';
      default:
        return '';
    }
  }

  static getFormTypeFromLeadType(leadType: LeadTypeEnum): FormTypeEnum {
    switch (leadType) {
      case LeadTypeEnum.PERSON:
        return FormTypeEnum.PERSON;
      case LeadTypeEnum.ORGANIZATION:
        return FormTypeEnum.ORGANIZATION;
      case LeadTypeEnum.BUSINESS:
        return FormTypeEnum.BUSINESS;
      case LeadTypeEnum.CONVERSATIONAL:
        return FormTypeEnum.CONVERSATIONAL;
      case LeadTypeEnum.GOOGLE_MAPS:
        return FormTypeEnum.GOOGLE_MAPS;
      default:
        return FormTypeEnum.PERSON;
    }
  }

  static getFormTypeFromUrlParam(urlParam: string): FormTypeEnum {
    switch (urlParam) {
      case 'individual':
        return FormTypeEnum.PERSON;
      case 'organization':
        return FormTypeEnum.ORGANIZATION;
      case 'business':
        return FormTypeEnum.BUSINESS;
      case 'conversational':
        return FormTypeEnum.CONVERSATIONAL;
      case 'googlemaps':
      case 'google-maps':
        return FormTypeEnum.GOOGLE_MAPS;
      default:
        return FormTypeEnum.PERSON;
    }
  }

  static getLeadInitials = (row?: LeadDto) => {
    if (!row) return '-';
    if (row.username?.length && row.username?.length > 2) return row.username?.slice(0, 2);
    if (row.first_name?.length && row.first_name?.length > 2) return row.first_name?.slice(0, 2);
    if (row.last_name?.length && row.last_name?.length > 2) return row.last_name?.slice(0, 2);
    return '-';
  };

  /**
   * Convert Google Maps rating (0-5 stars) to Trust Score percentage
   * This disguises Google rating as URI-branded "Trust Score"
   */
  static getTrustScoreFromRating(googleRating?: number): number | null {
    if (!googleRating) return null;
    return Math.round((googleRating / 5) * 100);
  }

  /**
   * Get Trust Score label (Strong, Moderate, etc.)
   */
  static getTrustScoreLabel(googleRating?: number): string {
    if (!googleRating) return 'No Rating';
    if (googleRating >= 4.5) return 'Very High';
    if (googleRating >= 4.0) return 'High';
    if (googleRating >= 3.5) return 'Moderate';
    if (googleRating >= 3.0) return 'Fair';
    return 'Low';
  }

  /**
   * Format address as "Regional Zone" (disguises Google Maps location)
   * Extracts neighborhood/area + city from full address
   * Example: "123 Main St, Ogba, Lagos, Nigeria" → "Ogba, Lagos"
   */
  static formatAsRegionalZone(formattedAddress?: string): string {
    if (!formattedAddress) return '';

    const parts = formattedAddress.split(',').map((p) => p.trim());

    // Try to get the last 2-3 meaningful parts (area + city)
    // Skip country if it's the last part
    if (parts.length >= 3) {
      // Return area, city (skip street and country)
      return parts.slice(-3, -1).join(', ');
    } else if (parts.length === 2) {
      // Just city, country - return city
      return parts[0];
    }

    return formattedAddress;
  }

  /**
   * Get Trust Score color based on rating
   */
  static getTrustScoreColor(googleRating?: number): string {
    if (!googleRating) return '#9ca3af';
    if (googleRating >= 4.0) return '#10b981'; // Green
    if (googleRating >= 3.0) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }
}
