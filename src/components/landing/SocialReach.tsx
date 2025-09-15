import { Box } from "@mui/material";
import { CollaboratorIcon, TargetIcon, PeopleIcon } from "../atoms/Icons";

const reachData = [
  {
    title: "Sentiment Analysis",
    description:
      "Decode Feelings, Drive Decisions. Understand how your audience truly feels about your brand or product.",
    icon: <CollaboratorIcon />,
  },
  { 
    title: "Social Listening",
    description:
      "Hear What Matters. Tune into conversations that shape your brand’s story.",
    icon: <TargetIcon />,
  },
  {
    title: "Crisis Management",
    description:
      "Act Fast, Stay Ahead. Respond to crises in real time and protect your brand from lasting damage.",
    icon: <PeopleIcon />,
  },
];

function SocialReach() {
  return (
    <div
      className="max-w-[1280px]  md:mx-auto md:pt-[54px] pt-[40px] 
    md:pb-[78px] mx-6 pb-[58px] px-[32px] text-center rounded-[20px] md:px-[48px] bg-[#FFF5FBCC]"
    >
      <h2 className="font-bold md:text-[20px] text-base text-[#CD1B78] font-urbanist">
        SOCIAL REACH
      </h2>
      <h3 className="font-[600] md:text-[48px] text-[32px] mt-2 font-urbanist">
        Boost your{" "}
        <span className="inline text-[#CD1B78] md:text-[48px] text-[32px] font-[600]">
          Social
        </span>{" "}
        Reach
      </h3>
      <p className="text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium">
        Make the most of your social media data with insights that drive real
        results.
      </p>
      <div className="mt-[30px] flex flex-col md:flex-row md:mt-[50px] md:gap-10 gap-6">
        {reachData.map((data, i) => (
          <Box
            key={i}
            className="px-4 text-left py-7 bg-white rounded-[10px] md:px-6 flex-1 hover:shadow-lg cursor-pointer transition-all"
            sx={{
              borderTop: "5px solid transparent",
              "&:hover": {
                borderColor: "#CD1B78",
              },
            }}
          >
            {data.icon}
            <h4 className="mt-4 text-[22px] font-[500] font-urbanist">
              {data.title}
            </h4>
            <p className="font-[500] h-[90px] text-[14px] text-[#443E3EBF] mt-4 font-urbanist">
              {data.description}
            </p>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default SocialReach;
