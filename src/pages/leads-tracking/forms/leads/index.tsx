import { UserModuleService } from '@/api/UserModuleService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import LeadsView from '@/components/lead-tracking/LeadsView';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { FaBuilding, FaComments, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const FormLeads = () => {
  const [leadType] = useQueryState('type', parseAsStringLiteral(['individual', 'organization', 'business', 'conversational', 'google-maps']).withDefault('individual'));
  const { userDetails } = useAuth();

  // Track module access when page loads
  useEffect(() => {
    const trackAccess = async () => {
      if (!userDetails?.userId || !leadType) return;

      const moduleIdMap: Record<string, string> = {
        individual: 'individual-leads',
        organization: 'organization-leads',
        conversational: 'conversational-leads',
        'google-maps': 'googlemaps-leads',
      };

      const moduleId = moduleIdMap[leadType];
      if (moduleId) {
        try {
          await UserModuleService.trackModuleAccess(userDetails.userId, moduleId);
        } catch (error) {
          console.error('Error tracking module access:', error);
        }
      }
    };

    trackAccess();
  }, [userDetails?.userId, leadType]);

  const selectedEnum =
    leadType === 'organization'
      ? LeadTypeEnum.ORGANIZATION
      : leadType === 'conversational'
        ? LeadTypeEnum.CONVERSATIONAL
        : leadType === 'business'
          ? LeadTypeEnum.BUSINESS
          : leadType === 'google-maps'
            ? LeadTypeEnum.GOOGLE_MAPS
            : LeadTypeEnum.PERSON;
  const label =
    leadType === 'organization' ? 'Organization' : leadType === 'conversational' ? 'Sales Signals' : leadType === 'business' ? 'Business' : leadType === 'google-maps' ? 'Google Maps' : 'Individual';
  const icon =
    leadType === 'organization' ? (
      <FaBuilding />
    ) : leadType === 'conversational' ? (
      <FaComments />
    ) : leadType === 'business' ? (
      <FaBuilding />
    ) : leadType === 'google-maps' ? (
      <FaMapMarkerAlt />
    ) : (
      <FaUser />
    );

  return (
    <DashboardLayout excludeHeader bgColor="#fff">
      <SeoHead title={`${label} Leads`} />
      <LeadsView leadType={selectedEnum} label={label} icon={icon} excludeTabs={['snapshots', 'analytics']} />
    </DashboardLayout>
  );
};

export default FormLeads;
