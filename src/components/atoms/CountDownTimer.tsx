import { useEffect, useState } from "react";
import {
  Box,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface CountdownTimerProps {
  targetTime: number; // Time in seconds
  onComplete?: () => void;
  tooltip?: string;
}

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 10,
    textAlign: "center",
  },
});

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTime,
  onComplete,
  tooltip,
}) => {
  const [timeLeft, setTimeLeft] = useState(targetTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0);
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <CustomWidthTooltip
      title={tooltip ?? "Time to next lead generation"}
      enterTouchDelay={0}
      arrow
    >
      <Box
        sx={{
          display: "flex",
          gap: "7px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          {/* Countdown Display */}
          {[
            { value: hours, label: "Hrs" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Secs" },
          ].map(({ value, label }) => (
            <Box
              key={label}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  backgroundColor: "#FEE0F05E",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  color: "#2C2C2C80",
                  fontSize: "28px",
                }}
              >
                {value.toString().padStart(2, "0")}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "16px", color: "#2C2C2C80" }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
        <IoMdInformationCircleOutline
          color="#2C2C2C80"
          size={16}
          style={{
            marginTop: "20px",
          }}
        />
      </Box>
    </CustomWidthTooltip>
  );
};

export default CountdownTimer;
