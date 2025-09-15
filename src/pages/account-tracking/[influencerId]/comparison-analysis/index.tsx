import DashboardLayout from '@/components/atoms/DashboardLayout';
import UxAnalysis from '@/components/charts/benchmark/UxAnalysis';
import { Container } from '@mui/material';

const CompetitorAnaltsis = () => {
  return (
    <DashboardLayout excludeHeader={true}>
      <Container
        maxWidth={false} // Ensure it takes the full width of the layout
        sx={{
          paddingTop: 4,
          paddingLeft: 2,
          paddingRight: 2,
          width: '100%', // Full width
          margin: 0, // No margin to ensure it's fluid
        }}
      >
        {/* Header section */}
        {/* <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}>
          <Typography variant='h5' fontWeight='bold'>
            Influencer Dashboard
          </Typography>
          <Button variant='contained' color='secondary' size='large'>
            View Analytics
          </Button>
        </Box> */}

        {/* <PlatformMetrics /> */}
        {/* Timeline Chart */}
        {/* <TimelineChart /> */}
        {/* Summary Section */}
        {/* <Box mt={4} p={2}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Summary
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
         
            <Box textAlign="center" flex={1}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                3,105
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Channels
              </Typography>
            </Box>

          
            <Box textAlign="center" flex={1}>
              <Typography variant="h4" color="green" fontWeight="bold">
                5,977
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Mentions
              </Typography>
            </Box>

         
            <Box textAlign="center" flex={1}>
              <Typography variant="h4" color="orange" fontWeight="bold">
                21,584,882
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Engagement
              </Typography>
            </Box>

          
            <Box flex={2} textAlign="center">
              <Typography variant="body2" color="textSecondary" mb={1}>
                Gender
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="red">50% Female</Typography>
                <Typography color="gray">Unknown</Typography>
                <Typography color="blue">50% Male</Typography>
              </Box>
              <LinearProgress
                variant="buffer"
                value={50}
                valueBuffer={100}
                sx={{
                  width: "100%",
                  height: 10,
                  borderRadius: 5,
                  mt: 1,
                  bgcolor: "grey.300",
                  "& .MuiLinearProgress-barColorPrimary": {
                    backgroundColor: "blue",
                  },
                  "& .MuiLinearProgress-bar2Buffer": {
                    backgroundColor: "gray",
                  },
                }}
              />
            </Box>
          </Box>

        
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Box width="48%">
              <SentimentAnalysis />
            </Box>
            <Box width="48%">
              <MentionsAnalysis />
            </Box>
          </Box>
        </Box> */}
        {/* <CompetitorAnalysis /> */}
        <UxAnalysis />
      </Container>
    </DashboardLayout>
  );
};

export default CompetitorAnaltsis;
