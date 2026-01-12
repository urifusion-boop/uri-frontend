import { Grid } from '@mui/material';
import LazarusProtocolCard from './LazarusProtocolCard';
import LeadTypeCard from './LeadTypeCard';
import SignalRefineryTestCard from './SignalRefineryTestCard';

const LeadTypeGrid = () => {
  return (
    <Grid container spacing={3}>
      <LeadTypeCard
        colorMap={{
          individual: '#f8fafc', // gray-50
          organization: '#f7f7f7', // gray-100
          business: '#f9f7f7', // gray-150
          conversational: '#f9fafb', // gray-150
        }}
      />
      {/* Signal Refinery Test Card - Separate Testing System */}
      <SignalRefineryTestCard />
      {/* Lazarus Protocol Card - CRM Resurrection Engine */}
      <LazarusProtocolCard />
    </Grid>
  );
};

export default LeadTypeGrid;
