import { Box, Button, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import SmartModal from '../modals/SmartModal';

function AffiliatePartnerForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Simulate submission
    setOpen(true);
  };

  return (
    <Box className="max-w-[1100px] mx-auto py-[64px] px-6">
      <Typography variant="h3" className="text-center font-urbanist font-bold text-[28px] md:text-[40px]">
        Grow your <span className="text-[#CD1B78]">Business</span> as a <span className="text-[#CD1B78]">Uri</span> Partner
      </Typography>
      <Typography className="text-center text-[#333] text-lg mt-2 mb-10 font-urbanist">At Uri, partnerships drive creativity and success. Let&apos;s build something great together.</Typography>

      <Box className="bg-[#FFF5FB] rounded-[12px] p-6 md:p-10 flex flex-col md:flex-row gap-10 md:items-center">
        {/* Left side */}
        <Box className="flex-1 text-center md:text-left">
          <Image src="/assets/images/affiliate-partners.png" alt="Affiliate Partner" width={320} height={320} className="mx-auto md:mx-0" />
          <Typography variant="h6" className="font-bold mt-4 font-urbanist text-[20px]">
            Affiliate Partner
          </Typography>
          <Typography className="text-sm mt-2 text-[#443E3E] font-urbanist">Join the URI Affiliate Program and get rewarded for spreading the word.</Typography>
        </Box>

        {/* Right side (form) */}
        <Box className="flex-1 bg-[#F8F6F7] rounded-[8px] p-6 md:p-8">
          <Typography variant="h6" className="text-center font-semibold font-urbanist mb-6 text-[18px]">
            Enter your Details
          </Typography>
          <Box className="flex flex-col md:flex-row gap-4 mb-4">
            <TextField
              fullWidth
              placeholder="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              size="small"
              InputProps={{ sx: { backgroundColor: '#fff', borderRadius: '6px' } }}
            />
            <TextField
              fullWidth
              placeholder="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              size="small"
              InputProps={{ sx: { backgroundColor: '#fff', borderRadius: '6px' } }}
            />
          </Box>
          <TextField
            fullWidth
            placeholder="E-Mail Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            size="small"
            className="mb-6"
            InputProps={{ sx: { backgroundColor: '#fff', borderRadius: '6px' } }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#CD1B78',
              textTransform: 'none',
              borderRadius: '6px',
              fontWeight: 600,
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <SmartModal
        open={open}
        onClick={() => setOpen(false)}
        image={<Image src="/assets/images/success.png" alt="Success" width={64} height={64} />}
        mainText="You're In! 🎉"
        subText="Check your email for your referral code and login details to start earning with URI."
        buttonText="Awesome"
      />
    </Box>
  );
}

export default AffiliatePartnerForm;
