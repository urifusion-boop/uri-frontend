import { Box, Radio, Tooltip, Typography } from "@mui/material";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: any;
  checked?: boolean;
  onSelect?: () => void;
  width?: string;
  isDisabled?: boolean;
};

const FeatureCard = ({ title, description, icon: Icon, checked, onSelect, isDisabled, width = "178px" }: FeatureCardProps) => {
  return (
    <Tooltip title={isDisabled ? "Coming Soon.." : ""} placement="top" arrow>
      <Box
        component="button"
        onClick={onSelect}
        sx={{
          display: "flex",
          gap: "12px",
          flexDirection: "column",
          boxShadow: "0.5px -1px 2px 0px #0000000D",
          border: checked ? "2px solid #DB81B0" : "1px solid #CFCFCF4D",
          backgroundColor: "#FAFAFA",
          borderRadius: "6px",
          padding: "25px 15px",
          maxWidth: width,
          minWidth: width,
          position: "relative",
          opacity: isDisabled ? 0.5 : 1,
        }}
        style={{ scrollSnapAlign: "start" }}
      >
        <Radio
          name="radio-buttons"
          size="small"
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            color: isDisabled ? "gray" : "#CD1B78",
            "&.Mui-checked": {
              color: "#CD1B78",
            },
          }}
          checked={checked}
          onChange={onSelect}
        />
        <Icon
          style={{
            width: "30px",
            height: "30px",
            color: isDisabled ? "gray" : "#CD1B78",
          }}
        />
        <Box>
          <Typography
            sx={{
              textAlign: "start",
              fontSize: "18px",
              fontWeight: 600,
              color: "#585858",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#676767",
              textAlign: "start",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default FeatureCard;
