import { Box, Grid } from "@mui/material";
import React, { ReactNode } from "react";
import Text from "./CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import { FiChevronRight } from "react-icons/fi";

export interface IStage {
  name: string;
  active?: boolean;
  currentStage?: string;
  partlyActive?: boolean;
}

interface IProps {
  stages: string[];
  currentStage: string;
  isAgency?: boolean;
}

const ProfileStagesContainer: React.FC<IProps> = ({
  stages,
  currentStage,
  isAgency,
}) => {
  const { themeColors } = useCustomTheme();

  return (
    <Box
      sx={{
        marginTop: { xs: "20px", md: "40px", lg: "70px" },
        pb: { xs: 2, md: 3 },
        borderBottom: `2px solid ${themeColors.borderColor}`,
      }}
    >
      <Text size={40} weight={700} center>
        Set up your profile
      </Text>
      <Box className="desktop-only">
        <Box
          className="d-flex items-center justify-center hide-scrollbar"
          mt={3}
          sx={{ overflowX: "scroll" }}
        >
          {stages.slice(0, 3).map((item, index) => {
            return (
              <Stage
                key={index}
                stage={index + 1}
                lastStage={index + 1 === stages.length}
                active={
                  stages.findIndex((stage) => stage === currentStage) >= index
                }
              >
                {item}
              </Stage>
            );
          })}
        </Box>
      </Box>
      <Box className="mobile-only">
        <Box sx={{ padding: "30px 30px 10px 30px" }}>
          <Box
            className="d-flex"
            sx={{ justifyContent: "space-between" }}
            mb={1}
          >
            <Text size={16} weight={500} color={themeColors.primary}>
              {stages.find((item) => item === currentStage)}
            </Text>
            <Text
              size={16}
              weight={500}
              color={themeColors.primary}
              sx={{ marginLeft: "auto" }}
            >
              {`${stages.findIndex((item) => item === currentStage) + 1}/${stages.length}`}
            </Text>
          </Box>
          <Grid container spacing={1}>
            {stages.map((item, index) => (
              <Grid
                item
                xs={item === currentStage ? 6 : 6 / (stages.length - 1)}
                key={index}
              >
                <Box
                  sx={{
                    height: "5px",
                    backgroundColor:
                      item === currentStage
                        ? themeColors.primary
                        : themeColors.borderColor,
                  }}
                ></Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

interface IStageProps {
  active?: boolean;
  partlyActive?: boolean;
  stage: number;
  children: ReactNode;
  lastStage?: boolean;
  noArrow?: boolean;
}

export const Stage: React.FC<IStageProps> = ({
  active,
  partlyActive,
  stage,
  children,
  lastStage,
  noArrow,
}) => {
  const { themeColors } = useCustomTheme();
  return (
    <Box className="d-flex items-center" sx={{ mr: 1, width: "fit-content" }}>
      <Box
        className="d-flex justify-center items-center"
        sx={{
          width: "28px",
          height: "28px",
          borderRadius: "14px",
          border: partlyActive ? `1px solid ${themeColors.primary}` : "none",
          background: active
            ? themeColors.primary
            : partlyActive
              ? themeColors.inputBorder
              : themeColors.borderColor,
        }}
      >
        <Text
          sx={{ color: active ? "#FFF" : themeColors.blackWhite }}
          size={16}
          weight={700}
        >
          {stage}
        </Text>
      </Box>
      <Box className="d-flex items-end" sx={{ width: "fit-content" }}>
        <Box ml={2}>
          <Text
            size={16}
            weight={500}
            sx={{ textOverflow: "unset", whiteSpace: "nowrap" }}
          >
            {children}
          </Text>
        </Box>
        {!lastStage && !noArrow && (
          <Box ml={1} className="pointer">
            <FiChevronRight
              color={themeColors.secondary}
              width={20}
              height={20}
              style={{ fontWeight: 700 }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileStagesContainer;
