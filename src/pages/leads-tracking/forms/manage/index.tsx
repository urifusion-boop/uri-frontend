import DashboardLayout from '@/components/atoms/DashboardLayout';
import GenerateLeadForm from '@/components/lead-tracking/forms/GenerateLeadForm';
import { Box, Container } from '@mui/material';

const LeadsManagePage = () => {
  return (
    <DashboardLayout excludeHeader={true} bgColor="#f9fafb">
      <Box p={4} sx={{ backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', my: 4 }}>
        <Container maxWidth="lg" sx={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <GenerateLeadForm />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default LeadsManagePage;
