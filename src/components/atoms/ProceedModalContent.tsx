import CustomButton from "@/components/atoms/CustomButton";
import CustomText from "@/components/atoms/CustomText";
import { dashboardRoutes } from "@/constants/ClientRoute";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

interface IProps {
  onClickComplete: () => void;
  review?: boolean;
  steps?: string;
}

const ProceedModalContent: React.FC<IProps> = ({
  onClickComplete,
  review,
  steps,
}) => {
  const router = useRouter();
  return (
    <Box className="d-flex justify-center" sx={{ my: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: "440px" }}>
        <Box sx={{ my: 2 }} className="d-flex justify-center items-center">
          {review && (
            <img
              src="/assets/gif/almost-there.gif"
              width={150}
              height={150}
              alt=""
            />
          )}
        </Box>
        <CustomText size={32} weight={700} center mode="base">
          {review ? "Review in Progress" : "Complete Profile Setup"}
        </CustomText>
        <CustomText size={16} weight={500} mode="secondary" center>
          {review
            ? "We are reviewing your ID. This may take up to a week. We’ll let you know as soon as we’re done"
            : `You have just ${steps} more steps to go! Do you want to complete your profile setup now or later?`}
        </CustomText>
        <Box sx={{ mt: { xs: 2, md: 4 } }}>
          <CustomButton
            mode="primary"
            onClick={() =>
              review
                ? onClickComplete()
                : router.push(dashboardRoutes.dashboardHome)
            }
          >
            {review ? "Continue" : "Proceed to Dashboard"}
          </CustomButton>
          {!review && (
            <CustomButton
              mode="inverse"
              style={{ marginTop: "12px" }}
              onClick={onClickComplete}
            >
              {review ? "Continue" : "Complete setup now"}
            </CustomButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProceedModalContent;
