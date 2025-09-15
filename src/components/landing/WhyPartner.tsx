import { Box } from '@mui/material';
import { FaChartLine, FaMoneyBillWave, FaTools } from 'react-icons/fa';

const partnerData = [
  {
    title: 'Earn Recurring Commission',
    description: 'Get paid for every customer you refer not just once, but every month they stay subscribed. The more you refer, the more you earn, consistently.',
    icon: <FaMoneyBillWave size={32} color="#CD1B78" />,
  },
  {
    title: 'Get Tools & Support',
    description: 'Access your own partner dashboard, marketing materials, and direct support from our team. We make it easy for you to succeed.',
    icon: <FaTools size={32} color="#CD1B78" />,
    highlight: true,
  },
  {
    title: 'Join a Growing Platform',
    description: "Join a fast-growing African tech platform helping businesses win with data. Your impact goes beyond earnings — you're part of something big.",
    icon: <FaChartLine size={32} color="#CD1B78" />,
  },
];

function WhyPartner() {
  return (
    <div className="max-w-[1280px] mx-auto py-[64px] px-6 text-center">
      <h2 className="text-[32px] md:text-[40px] font-bold font-urbanist">
        Why <span className="text-[#CD1B78]">Partner</span> With Us
      </h2>
      <p className="text-[#333] text-lg md:text-xl mt-3 mb-10 font-urbanist">Partner with Uri for creative solutions that drive real results.</p>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
        {partnerData.map((item, i) => (
          <Box key={i} className={`flex-1 px-6 py-10 rounded-[12px] text-left transition-all ${item.highlight ? 'border-t-4 border-[#CD1B78] bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="mb-5">{item.icon}</div>
            <h4 className="text-lg md:text-xl font-bold text-[#080808] font-urbanist mb-2">{item.title}</h4>
            <p className="text-sm text-[#443E3E] font-urbanist font-medium leading-relaxed">{item.description}</p>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default WhyPartner;
