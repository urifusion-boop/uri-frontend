import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import GenerateLeadForm from '@/components/lead-tracking/forms/GenerateLeadForm';
import GuideTour from '@/components/guide-tour/guide-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import { Box, Container } from '@mui/material';
import { UserModuleService } from '@/api/UserModuleService';
import { useAuth } from '@/providers/AuthProvider';
import { RiAddBoxLine } from 'react-icons/ri';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';

const tourSteps = [
  {
    target: '.tour-form-type-selector',
    content: 'Select Lead Type',
    description: 'Choose the type of leads you want to generate - Individual, Organization, Business, or Conversational.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-form-fields',
    content: 'Fill in Details',
    description: 'Enter your search criteria. The more specific you are, the better quality leads you will receive.',
    placement: 'top' as const,
    icon: MdOutlineTipsAndUpdates,
  },
  {
    target: '.tour-generate-btn',
    content: 'Generate Leads',
    description: 'Click this button to start generating leads based on your criteria. You can update the form anytime.',
    placement: 'top' as const,
    icon: RiAddBoxLine,
  },
];

const LeadsManagePage = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { type } = router.query;
  const { run, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: tourSteps,
    tourKey: `leads-form-${type || 'default'}-tour`,
  });

  // Track module access when page loads
  useEffect(() => {
    const trackAccess = async () => {
      if (!userDetails?.userId || !type) return;

      const moduleIdMap: Record<string, string> = {
        'individual': 'individual-leads',
        'organization': 'organization-leads',
        'conversational': 'conversational-leads',
      };

      const moduleId = moduleIdMap[type as string];
      if (moduleId) {
        try {
          await UserModuleService.trackModuleAccess(userDetails.userId, moduleId);
        } catch (error) {
          console.error('Error tracking module access:', error);
        }
      }
    };

    trackAccess();
  }, [userDetails?.userId, type]);

  return (
    <DashboardLayout excludeHeader={true} bgColor="#f9fafb">
      <Box p={4} sx={{ backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', my: 4 }}>
        <Container maxWidth="lg" sx={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <GenerateLeadForm />
        </Container>
      </Box>
      <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
    </DashboardLayout>
  );
};

export default LeadsManagePage;
