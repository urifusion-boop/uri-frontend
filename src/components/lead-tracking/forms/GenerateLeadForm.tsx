import SeoHead from '@/components/atoms/SeoHead';
import FormTypeSelector from '@/components/lead-tracking/forms/FormTypeSelector';
import { default as IndividualLeadForm } from '@/components/lead-tracking/forms/IndividualLeadForm';
import OrganizationLeadForm from '@/components/lead-tracking/forms/OrganizationLeadForm';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BusinessLeadForm from './BusinessLeadForm';
import ConversationLeadForm from './ConversationLeadForm';

const GenerateLeadForm = () => {
  const router = useRouter();
  const [selectedFormType, setSelectedFormType] = useState<string>('individual');

  useEffect(() => {
    const type = router.query.type;
    if (type === 'organization' || type === 'individual' || type === 'business' || type === 'conversational') {
      setSelectedFormType(type);
    }
  }, [router.query.type]);

  const handleTypeSelect = (type: string) => {
    setSelectedFormType(type);
    // Update URL query parameter
    router.push({
      pathname: router.pathname,
      query: { ...router.query, type },
    }, undefined, { shallow: true });
  };

  const renderForm = () => {
    console.log('selectedFormType', selectedFormType);
    switch (selectedFormType) {
      case 'individual':
        return <IndividualLeadForm />;
      case 'organization':
        return <OrganizationLeadForm />;
      case 'business':
        return <BusinessLeadForm />;
      case 'conversational':
        return <ConversationLeadForm />;
      default:
        return <IndividualLeadForm />;
    }
  };

  return (
    <>
      <SeoHead title="Lead Generation" />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1f2937',
              mb: 1,
              fontSize: { xs: '24px', md: '32px' },
            }}
          >
            Let&apos;s Build Your Perfect Lead Form!
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '15px' }}>
            Select the lead type, customize your input fields, and get ready for AI-powered lead tracking
          </Typography>
        </Box>

        <FormTypeSelector selectedType={selectedFormType} onTypeSelect={handleTypeSelect} />

        <Box sx={{ mt: 2 }}>{renderForm()}</Box>
      </Box>
    </>
  );
};

export default GenerateLeadForm;
