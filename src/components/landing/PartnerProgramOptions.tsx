import { Box } from '@mui/material';

const programOptions = [
  {
    title: 'Affiliate',
    description: 'Are you a content creator with a loyal following? Get rewarded for spreading the word about our tool!',
    cta: 'Apply Now',
    href: '/partner/affiliate', // replace with actual route
  },
  {
    title: 'Developer',
    description: 'Love building tools and integrations? Let’s create something powerful together.',
    cta: 'Apply Now',
    href: '/partner/developer', // replace with actual route
  },
];

function PartnerProgramOptions() {
  return (
    <div className="max-w-[900px] mx-auto py-16 px-4 text-center">
      <h2 className="text-[28px] md:text-[36px] font-bold font-urbanist leading-tight">
        Which <span className="text-[#CD1B78]">Partner</span> Program is <span className="text-[#CD1B78]">Right</span> for you??
      </h2>
      <p className="mt-2 text-[#333] font-medium text-sm md:text-base">Choose the partnership that best aligns with your goals and expertise.</p>

      <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
        {programOptions.map((opt, i) => (
          <Box key={i} className="flex-1 border border-[#EAEAEA] rounded-[12px] py-8 px-6 bg-white shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold font-urbanist mb-2">{opt.title}</h3>
            <p className="text-sm text-[#443E3E] font-medium mb-6">{opt.description}</p>
            <a href={opt.href}>
              <button className="px-6 py-2 rounded-md bg-[#CD1B78] text-white font-semibold text-sm hover:bg-[#b81a68] transition">{opt.cta}</button>
            </a>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default PartnerProgramOptions;
