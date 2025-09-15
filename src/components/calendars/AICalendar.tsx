import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { PostRoundedIcon } from "../atoms/Icons";
import { WeeklyCampaignCalendar } from "@/models/dtos/AiMediaReportDto";

interface AICalendarProps {
  weeklyCampaignCalendar: WeeklyCampaignCalendar[];
}

const AICalendar: React.FC<AICalendarProps> = ({ weeklyCampaignCalendar }) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().startOf("week"));

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    dayjs().startOf("week").add(i, "day")
  );

  const selectedCampaigns = weeklyCampaignCalendar.filter(
    (campaign) => campaign.day_of_the_week === selectedDay.format("dddd")
  );

  return (
    <Box className="p-4 bg-white shadow-sm rounded-md">
      <Typography fontWeight={600} fontSize={24}>
        AI-Powered Weekly Content Calendar
      </Typography>

      {/* Weekday Selector */}
      <div className="mt-8 grid grid-cols-7 gap-6">
        {weekDays.map((day) => {
          const isSelected = selectedDay.format("DD") === day.format("DD");

          return (
            <button
              key={day.format("YYYY-MM-DD")}
              onClick={() => setSelectedDay(day)}
              aria-label={`Select ${day.format("dddd, MMMM D")}`}
              aria-pressed={isSelected}
              className={`${
                isSelected
                  ? "bg-[#CD1B78] text-white"
                  : "bg-transparent text-black"
              } cursor-pointer rounded-md space-y-[6px] text-center p-[10px]`}
            >
              <Typography
                fontWeight={600}
                fontSize={16}
                className={isSelected ? "text-white" : "text-black"}
              >
                {day.format("ddd")}
              </Typography>
              <Typography
                fontWeight={600}
                fontSize={24}
                className={isSelected ? "text-white" : "text-black"}
              >
                {day.format("D")}
              </Typography>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-md bg-[#FFF4FAA6]">
        {selectedCampaigns.length > 0 ? (
          selectedCampaigns.map((campaign, index) => (
            <div key={index} className="flex gap-1 items-start mb-4">
              <PostRoundedIcon />
              <div>
                <Typography
                  fontWeight={600}
                  fontSize={16}
                  className="text-[#CD1B78]"
                >
                  {campaign.title}
                </Typography>
                <Typography
                  fontWeight={600}
                  className="text-[#7A7A7A]"
                  fontSize={14}
                >
                  {campaign.post_time}
                </Typography>
                <Typography
                  fontWeight={500}
                  className="text-[#6B6B6B]"
                  fontSize={14}
                >
                  {campaign.media_type}
                </Typography>
                <Typography
                  fontWeight={500}
                  className="text-[#4E4E4E] max-w-[440px]"
                  fontSize={14}
                >
                  {campaign.post}
                </Typography>
                <Typography
                  fontWeight={400}
                  className="text-[#4E4E4E]"
                  fontSize={12}
                >
                  <strong>Hashtags:</strong> {campaign.hashtags.join(", ")}
                </Typography>
                <Typography
                  fontWeight={400}
                  className="text-[#4E4E4E]"
                  fontSize={12}
                >
                  <strong>Why This Post?</strong> {campaign.post_justification}
                </Typography>
              </div>
            </div>
          ))
        ) : (
          <Typography fontWeight={500} className="text-[#4E4E4E]" fontSize={14}>
            No AI-powered suggestions available for this day.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default AICalendar;
