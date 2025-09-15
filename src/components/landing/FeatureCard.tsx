import { Box, Typography } from "@mui/material";

import CustomButton from "../atoms/CustomButton";
import { useRouter } from "next/router";

interface FeatureCardDto {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

const FeatureCard = ({
  data,
  h1,
  h2,
  h1tinted,
  h1middle,
  h2middle,
  showFeatureTitle = true,
  h2tinted,
  showFeaturesList = true,
  description,
}: {
  data?: FeatureCardDto[];
  h1?: string;
  h2?: string;
  h1tinted?: string;
  h2tinted?: string;
  h1middle?: string;
  showFeaturesList?: boolean;
  description?: string;
  showFeatureTitle?: boolean;
  h2middle?: string;
}) => {
  const router = useRouter();

  return (
    <Box
      className="flex-1"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        {showFeaturesList && showFeatureTitle && (
          <h2 className="text-[20px] text-[#CD1B78] font-bold">OUR FEATURES</h2>
        )}
        <h3 className="mt-3 md:text-[42px] text-[28px] font-bold align-middle">
          {h1}
          <span className="inline md:text-[42px] text-[28px] font-bold text-[#CD1B78]">
            {h1tinted}
          </span>
          {h1middle && (
            <span className="inline md:text-[42px] text-[28px] font-bold">
              {h1middle}
            </span>
          )}
        </h3>
        <h3 className="md:text-[42px] -mt-2 text-[28px] font-bold  text-[#CD1B78]">
          {h2}{" "}
          {h2middle && (
            <span className="inline md:text-[42px] text-[28px] font-bold text-black ">
              {h2middle}
            </span>
          )}
          <span className="inline md:text-[42px] text-[28px] font-bold">
            {h2tinted}
          </span>
        </h3>
        <Typography className="mt-4 text-base md:text-[20px] text-[#212529] font-medium leading-[30px]">
          {description}
        </Typography>
        {showFeaturesList && (
          <div className="mt-[25px] md:mt-[40px] md:space-y-[40px] space-y-[25px]">
            {data?.map((data, i) => (
              <div key={i} className="flex items-center gap-4">
                <Box className="w-[35px] h-[35px]">{data.icon}</Box>
                <div className="border-l-2 pl-4 border-dashed border-[#CD1B78]">
                  <h4 className="text-[24px] font-[600] text-[#212529] leading-[28px]">
                    {data.title}
                  </h4>
                  <p className="text-base text-[#212529] mt-1 max-w-[383px]">
                    {data.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <CustomButton
          mode="primary"
          style={{ marginTop: "40px", maxWidth: "275px" }}
          onClick={() => router.push("/signup-as")}
        >
          Get Started
        </CustomButton>
      </Box>
    </Box>
  );
};

export default FeatureCard;
