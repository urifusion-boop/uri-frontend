import { LeadStatusEnum } from "@/models/enum-models/LeadStatusEnum";
import { Box, Divider, Grid, Typography } from "@mui/material";
import LoaderWrapper from "../atoms/LoaderWrapper";
interface DataProps {
  data: Record<string, any>[];
  title: string;
  isLoading?: boolean;
  headers?: string[];
  maxHeight?: string;
}

const HashtagCard = ({
  data,
  title,
  isLoading,
  headers = ["HashTags"],
  maxHeight,
}: DataProps) => {
  const statusColors = {
    [LeadStatusEnum.NEW]: "#FFD700",
    [LeadStatusEnum.CONTACTED]: "#D78110",
    [LeadStatusEnum.QUALIFIED]: "#5B7083",
    [LeadStatusEnum.UNQUALIFIED]: "#FF0000",
    [LeadStatusEnum.CONVERTED]: "#22A014",
  };

  return (
    <Box>
      <Typography
        sx={{
          color: "#000000",
          fontSize: "18px",
          fontWeight: 500,
          mb: "18px",
        }}
      >
        {title}
      </Typography>
      <Grid
        container
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "10px 16px",
          fontWeight: "bold",
        }}
      >
        <Grid item xs={1}>
          <Typography variant="body1">No</Typography>
        </Grid>
        {headers.map((header, index) => (
          <Grid item xs={11 / headers.length} key={"header" + index}>
            <Typography
              variant="body1"
              sx={{
                marginLeft: 0.5,
                whiteSpace: "nowrap",
                wordBreak: "break-word",
              }}
            >
              {header}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Divider />
      {/* Data Rows */}

      <LoaderWrapper
        isLoading={isLoading}
        mb="10px"
        numberOfSkeletons={5}
        skeletonHeight="30px"
      >
        {data.length > 0 ? (
          data.map((item, index) => (
            <Grid
              container
              key={"hashtag-card-row-" + index}
              sx={{
                padding: "8px 16px",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <Grid item xs={1}>
                <Typography variant="body2">{index + 1}</Typography>
              </Grid>
              {headers.map((header, idx) => (
                <Grid
                  item
                  xs={11 / headers.length}
                  key={"hashtag-card-row-" + index + "-header-" + idx}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      marginLeft: 0.5,
                      whiteSpace: "normal", // Allows text to wrap
                      overflow: "hidden", // Prevents text overflow
                      textOverflow: "ellipsis", // Adds "..." when text is too long
                      wordBreak: "break-word", // Ensures words break properly
                      maxWidth: "100%", // Prevents overflow into other columns
                      color:
                        header.toLowerCase() === "status"
                          ? statusColors[
                              item[
                                header.toLowerCase()
                              ] as keyof typeof statusColors
                            ]
                          : "#272727",
                      fontWeight:
                        header.toLowerCase() === "status" ? 700 : "normal",
                      fontSize: "16px",
                    }}
                  >
                    {item[header.toLowerCase()] ?? "N/A"}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "150px",
            }}
          >
            <Typography
              sx={{
                color: "#000000",
                fontSize: "18px",
                textAlign: "center",
                py: 2,
                fontStyle: "italic",
              }}
            >
              No data available
            </Typography>
          </Box>
        )}
      </LoaderWrapper>
    </Box>
  );
};

export default HashtagCard;
