import { Box, ListItemText, MenuItem, Select } from "@mui/material";

import { DateFilterEnum } from "@/models/enum-models/DateFIlterEnum";
import { FaCalendarAlt } from "react-icons/fa";
import React from "react";
import { TextHelper } from "@/helpers/TextHelper";

interface IDateFilterProps {
  selectedDate: DateFilterEnum | null;
  setSelectedDate: (date: DateFilterEnum | null) => void;
  wrapperStyle?: React.CSSProperties;
}

const DateFilter = React.memo(({ selectedDate, setSelectedDate, wrapperStyle }: IDateFilterProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "324px",
        ...wrapperStyle,
      }}
    >
      <Select
        labelId="icon-select-label"
        value={selectedDate ?? "Select Date Range"}
        onChange={(e) => {
          setSelectedDate(e.target.value as DateFilterEnum | null);
        }}
        sx={{
          backgroundColor: "#fff",
          width: "100%",
          height: "48px",
          color: "#7E7E7E",
          "& .MuiSelect-select": {
            fontSize: "14px !important",
          },
        }}
        startAdornment={<FaCalendarAlt size={20} />}
      >
        <MenuItem disabled value={"Select Date Range"}>
          <ListItemText
            primary={"Select Date Range"}
            sx={{
              ml: 1,
              fontSize: "14px",
            }}
          />
        </MenuItem>
        {Object.values(DateFilterEnum).map((fil) => (
          <MenuItem value={fil} key={fil}>
            <ListItemText
              primary={TextHelper.removeChar(fil, "_")}
              sx={{
                ml: 1,
                fontSize: "14px",
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
});

DateFilter.displayName = "DateFilter";

export default DateFilter;
