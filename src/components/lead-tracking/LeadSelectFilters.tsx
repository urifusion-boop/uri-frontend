import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import Select from "../atoms/Select";
import { LeadStatusEnum } from "@/models/enum-models/LeadStatusEnum";

interface LeadSelectFiltersProps {
  leadStatus: string | null;
  setLeadStatus: (value: string | null) => void;
  interestLevel: string | null;
  setInterestLevel: (value: string | null) => void;
  /**
   * Optional styling for the outer container.
   */
  containerSx?: SxProps<Theme>;
  /**
   * Optional styling for the lead status select wrapper.
   */
  leadSelectWrapperSx?: SxProps<Theme>;
  /**
   * Optional styling for the interest level select wrapper.
   */
  interestSelectWrapperSx?: SxProps<Theme>;
  /**
   * Optional label to display above the lead status select.
   */
  leadStatusLabel?: React.ReactNode;
  /**
   * Optional label to display above the interest level select.
   */
  interestLevelLabel?: React.ReactNode;
}

const LeadSelectFilters: React.FC<LeadSelectFiltersProps> = ({
  leadStatus,
  setLeadStatus,
  interestLevel,
  setInterestLevel,
  containerSx,
  leadSelectWrapperSx,
  interestSelectWrapperSx,
  leadStatusLabel,
  interestLevelLabel,
}) => {
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        gap: 3,
        justifyContent: "space-between",
        ...containerSx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          ...leadSelectWrapperSx,
        }}
      >
        {leadStatusLabel && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "14px", color: "#575757" }}
          >
            {leadStatusLabel}
          </Typography>
        )}
        <Select
          containerClassName="w-full"
          options={[
            ...Object.values(LeadStatusEnum).map((status) => ({
              value: status,
              label: status,
            })),
            { value: null, label: "Clear" },
          ]}
          placeholder="Lead Status"
          onChange={(value) => setLeadStatus(value)}
          value={leadStatus ?? ""}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          ...interestSelectWrapperSx,
        }}
      >
        {interestLevelLabel && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "14px", color: "#575757" }}
          >
            {interestLevelLabel}
          </Typography>
        )}
        <Select
          containerClassName="w-full"
          options={[
            { value: "High", label: "High" },
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: null, label: "Clear" },
          ]}
          placeholder="Interests Level"
          onChange={(value) => setInterestLevel(value)}
          value={interestLevel ?? ""}
        />
      </Box>
    </Box>
  );
};

export default LeadSelectFilters;
