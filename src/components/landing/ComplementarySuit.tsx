import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import React from "react";
import { CiSearch } from "react-icons/ci";
import useCustomTheme from "@/hooks/theme.hook";
import { HiMiniChartBar } from "react-icons/hi2";
import { RiStarSLine } from "react-icons/ri";
import { MdGroups } from "react-icons/md";

interface CustomAccordionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function CustomAccordion({
  icon,
  title,
  description,
  index,
}: CustomAccordionProps) {
  const [open, setOpen] = React.useState(0);
  const { themeColors } = useCustomTheme();

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "start",
        gap: 1,
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <IconButton
          sx={{ backgroundColor: themeColors.primary, color: "#FFF" }}
        >
          {icon}
        </IconButton>
        {open === index && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "100%",
                mt: 1,
                borderWidth: 1,
                backgroundColor: "black",
              }}
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        onClick={() => (index === open ? setOpen(7) : setOpen(index))}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        {open === index ? (
          <Typography variant="body2">{description}</Typography>
        ) : null}
      </Box>
    </Grid>
  );
}

const accordionItems = [
  {
    icon: <CiSearch />,
    title: "Conduct deep research",
    description:
      "Bring structure and meaning to billions of voices with game-changing AI solutions.",
  },
  {
    icon: <HiMiniChartBar />,
    title: "Monitor your brand",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat eligendi quisquam, nemo mollitia suscipit in quam delectus ratione animi perferendis laudantium? Pariatur tempore alias amet aspernatur! Porro non earum consequuntur?",
  },
  {
    icon: <RiStarSLine />,
    title: "Create winning content",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat eligendi quisquam, nemo mollitia suscipit in quam delectus ratione animi perferendis laudantium? Pariatur tempore alias amet aspernatur! Porro non earum consequuntur?",
  },
  {
    icon: <MdGroups />,
    title: "Engage with customers",
    description:
      "Bring structure and meaning to billions of voices with game-changing AI solutions.",
  },
];

export const ComplementarySuit: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const { themeColors } = useCustomTheme();

  return (
    <Grid
      container
      width="100%"
      height="100%"
      mt={4}
      sx={{ padding: "0 32px" }}
      flexDirection={"row"}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          paddingLeft: isMobile ? 0 : 4,
          justifyContent: "center",
          width: "45%",
          height: "100%",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h3"}
          sx={{ fontWeight: "bold" }}
        >
          A complementary suit <br /> of specialised, best in class tools.
        </Typography>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.16))",
          }}
        >
          {accordionItems.map((item, index) => (
            <Box key={index}>
              <CustomAccordion
                icon={item.icon}
                index={index}
                title={item.title}
                description={item.description}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        width="60%"
        height="100%"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/assets/images/landing/allinsights.png"
          alt="Insights"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensures the image covers the entire box without distortion
          }}
        />
      </Box>
    </Grid>
  );
};
