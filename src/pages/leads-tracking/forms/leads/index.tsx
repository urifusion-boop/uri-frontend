import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import LeadsView from '@/components/lead-tracking/LeadsView';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { FaBuilding, FaComments, FaUser } from 'react-icons/fa';

const FormLeads = () => {
  const [leadType] = useQueryState('type', parseAsStringLiteral(['individual', 'organization', 'business', 'conversational']).withDefault('individual'));

  const selectedEnum =
    leadType === 'organization' ? LeadTypeEnum.ORGANIZATION : leadType === 'conversational' ? LeadTypeEnum.CONVERSATIONAL : leadType === 'business' ? LeadTypeEnum.BUSINESS : LeadTypeEnum.PERSON;
  const label = leadType === 'organization' ? 'Organization' : leadType === 'conversational' ? 'Conversation' : leadType === 'business' ? 'Business' : 'Individual';
  const icon = leadType === 'organization' ? <FaBuilding /> : leadType === 'conversational' ? <FaComments /> : leadType === 'business' ? <FaBuilding /> : <FaUser />;

  return (
    <DashboardLayout excludeHeader bgColor="#fff">
      <SeoHead title={`${label} Leads`} />
      <LeadsView
        leadType={selectedEnum}
        label={label}
        icon={icon}
        excludeTabs={["snapshots", "analytics"]}
      />
    </DashboardLayout>
  );
};

export default FormLeads;
