import { Grid } from '@mui/material';
import LeadTypeCard from './LeadTypeCard';

const LeadTypeGrid = () => {
  return (
    <Grid container spacing={3}>
      <LeadTypeCard
        colorMap={{
          individual: '#f8fafc', // gray-50
          organization: '#f7f7f7', // gray-100
          business: '#f9f7f7', // gray-150
          conversational: '#f9fafb', // gray-150
          googlemaps: '#fef3f2', // red-50
        }}
      />
    </Grid>
  );
};

export default LeadTypeGrid;
