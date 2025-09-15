import { LightThemeColors } from "@/configs/colors.config";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Spinner from "../loaders/Spinner";

const countryFlagEmoji = require("country-flag-emoji");

interface CountryData {
  data: {
    country_code: string;
    value: number;
  }[];
  loading?: boolean;
  middleText?: string;
  height?: number;
  heading?: string;
}

const CountryDataTable = ({
  data,
  loading,
  middleText,
  height,
  heading,
}: CountryData) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  const getValidCountryCode = (input: string): string | undefined => {
    const normalizedInput = input.trim().toUpperCase();

    const country = countryFlagEmoji.list.find(
      (c: any) => c.name.toLowerCase() === normalizedInput.toLowerCase()
    );

    if (country) return country.code;

    const isValidCode = countryFlagEmoji.list.some(
      (c: any) => c.code === normalizedInput
    );

    return isValidCode ? normalizedInput : undefined;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 36px)",
          }}
        >
          <Spinner
            color={LightThemeColors.uriColor}
            size={25}
            text="Just a sec...."
          />
        </Box>
      );
    }

    if (data.length > 0) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 2,
          }}
        >
          {data.map((item) => (
            <Box
              key={`${item.country_code}-${item.value}`}
              sx={{
                border: "1px solid #DBDBDB4D",
                boxShadow: "1px 1px 2px 0px #0000000D",
                borderRadius: 2,
                // width: 150,
                minHeight: 150,
                padding: 2,
              }}
            >
              {getValidCountryCode(item.country_code) ? (
                <img
                  src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${getValidCountryCode(item.country_code)}.svg`}
                  alt="flag"
                  width={80}
                  height={57.78}
                />
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 65,
                    backgroundColor: "#8F8F8F",
                    mb: 1,
                    borderRadius: 1,
                  }}
                />
              )}

              <Typography fontSize={isMobile ? 12 : 14} fontWeight={400}>
                <span style={{ color: "#272727" }}>{item.country_code}</span>{" "}
                <span style={{ color: "#505050" }}>
                  {countryFlagEmoji.get(item.country_code)?.name}
                </span>
              </Typography>

              <Typography fontSize={isMobile ? 12 : 14} fontWeight={300}>
                <span style={{ color: "#505050" }}>Count:</span>{" "}
                <span style={{ color: "#272727" }}>{item.value}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Box
        display={"flex"}
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography fontSize={14} fontWeight={600}>
          No Data Available
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      p={2}
      border="1px solid #ddd"
      borderRadius={2}
      bgcolor="white"
      sx={{
        maxHeight: height ?? 500,
        overflowY: "auto",
      }}
      className="scroll"
    >
      <Typography fontSize={isMobile ? 14 : 16} variant="h6" mb={2}>
        {heading ?? "Audience Location"}
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default CountryDataTable;
