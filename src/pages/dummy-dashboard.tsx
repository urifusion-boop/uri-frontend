import { Box, InputAdornment, TextField } from '@mui/material';

import { DownloadIcon, ExportIcon, EyesOnIcon, FilterIcon } from '@/components/atoms/Icons';
import { Search } from '@mui/icons-material';
import { Button, Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const Page = () => {
  return (
    <Box className="bg-[#FAFAFA] h-screen flex items-center">
      <Box className="max-w-fit mx-auto">
        <SubscriptionManagement />
      </Box>
    </Box>
  );
};

export default Page;

const SubscriptionManagement = () => {
  return (
    <div className="p-6 bg-white">
      <Typography fontSize={24} fontWeight={600}>
        Manage Subscription
      </Typography>
      <Typography className="text-[#3B3B3B] mt-1" fontSize={20} fontWeight={500}>
        Easily manage your subscription preferences, update your plan, or cancel anytime.
      </Typography>
      <Card className="p-6 shadow-md mb-6 max-w-[630px] mt-[60px] bg-subscription-card-bg">
        <Typography fontSize={24} fontWeight={600}>
          Current Plan
        </Typography>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex gap-1 items-center">
              <div className="p-1 px-2 bg-[#CD1B78] rounded-md">
                <Typography fontSize={16} className="text-white">
                  STANDARD
                </Typography>
              </div>
              <Typography fontWeight={600} fontSize={16}>
                Plan
              </Typography>
            </div>
            <Typography className="text-[#6C727F] mt-1" fontSize={14} fontWeight={600}>
              Joined January 2025
            </Typography>
          </div>
          <div>
            <Typography lineHeight={'70px'} fontWeight={800} className="text-[64px] font-bold">
              $40<span className="text-lg">/month</span>
            </Typography>
          </div>
        </div>
        <div className="flex items-end justify-between mt-6">
          <div className="">
            <Typography fontWeight={600} className="text-sm text-[#6C727F]">
              Next Payment
            </Typography>
            <Typography fontWeight={600} className="text-sm text-[#141416]">
              February 27, 2025
            </Typography>
          </div>
          <Typography fontWeight={600} className="text-sm text-[#CD1B78]">
            Update credit card{' '}
          </Typography>
        </div>
        <div className="mt-[52px] flex justify-between gap-4">
          <Button variant="outlined" className="md:min-w-[214px]" color="error">
            Cancel Subscription
          </Button>
          <Button variant="contained" className="md:min-w-[214px]" color="primary">
            Change Plan
          </Button>
        </div>
      </Card>

      {/* Billing History Section */}
      <Card className="p-6 shadow-md mt-8">
        <div className="flex justify-between items-center">
          <Typography fontSize={29} fontWeight={600} className="mb-4">
            Billing History
          </Typography>
          <div className="flex gap-3">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search"
              className="bg-white text-[#5F5F5F] rounded-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-[#5F5F5F]" />
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex items-center gap-1 py-[6px] px-1 border border-[#CCCCCC99] rounded-md w-fit">
              <FilterIcon />
              <Typography fontSize={13} fontWeight={600} className="text-[#5F5F5F] pr-3">
                Filter by
              </Typography>
            </div>
            <div className="flex items-center gap-1 py-[6px] px-1 border border-[#CCCCCC99] rounded-md w-fit">
              <ExportIcon />
              <Typography fontSize={13} fontWeight={600} className="text-[#5F5F5F] pr-3">
                Export
              </Typography>
            </div>
          </div>
        </div>
        <TableContainer component={Box}>
          <Table>
            <TableHead className="bg-[#F5F5F5]">
              <TableRow>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    Plan Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    Amount
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    Purchase Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    End Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={20} fontWeight={600} className="text-[#5F5F5F]">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={18}>
                      Standard Plan
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={18}>
                      $40.00
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={18}>
                      2024-08-17
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={18}>
                      2024-09-16
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={18}>
                      <span className="text-green-500 mr-2">●</span>
                      Successful
                    </Typography>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton>
                      <EyesOnIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};
