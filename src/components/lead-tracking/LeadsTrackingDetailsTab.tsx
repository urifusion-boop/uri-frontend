import { LeadBusinessInfoDto } from "@/models/dtos/LeadsDto";
import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";
import LoaderWrapper from "../atoms/LoaderWrapper";

interface LeadsTrackingDetailsTabProps {
  leadsTrackingInfoDetails: LeadBusinessInfoDto;
  loading: boolean;
}

const LeadsTrackingDetailsTab = ({
  leadsTrackingInfoDetails,
  loading,
}: LeadsTrackingDetailsTabProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FAFAFA",
        py: { xs: "24px" },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1072px",
          mx: "auto",
          backgroundColor: "#fff",
          width: "100%",
          borderRadius: "10px",
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          boxShadow: "-1px -1px 6px 1px #0000000A",
        }}
      >
        <Typography
          sx={{
            color: "#606060B2",
            fontWeight: 600,
            fontSize: { xs: "18px" },
            mb: { xs: "24px" },
            textAlign: "start",
          }}
        >
          Business Details
        </Typography>

        {/* Business Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: { xs: 2 },
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: "16px" },
              whiteSpace: "nowrap",
              flex: { xs: "1 1 100%", sm: "1" },
            }}
          >
            Business Name
          </Typography>
          <LoaderWrapper
            isLoading={loading}
            skeletonHeight="40px"
            sx={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                border: "0.89px solid #D5D7DD99",
                width: "100%",
                flex: 2,
                py: { xs: "10px", md: "12px" },
                px: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#10101099",
                  fontWeight: 500,
                  fontSize: { xs: "14px" },
                }}
              >
                {leadsTrackingInfoDetails.business_name &&
                leadsTrackingInfoDetails.business_name !== ""
                  ? leadsTrackingInfoDetails.business_name
                  : "N/A"}
              </Typography>
            </Box>
          </LoaderWrapper>
        </Box>

        {/* Business Website */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: "16px" },
              whiteSpace: "nowrap",
              flex: { xs: "1 1 100%", sm: "1" },
            }}
          >
            Business Website
          </Typography>
          <LoaderWrapper
            isLoading={loading}
            skeletonHeight="40px"
            sx={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                border: "0.89px solid #D5D7DD99",
                width: "100%",
                flex: 2,
                py: { xs: "10px", md: "12px" },
                px: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#10101099",
                  fontWeight: 500,
                  fontSize: { xs: "14px" },
                }}
              >
                {leadsTrackingInfoDetails.business_website &&
                leadsTrackingInfoDetails.business_website !== ""
                  ? leadsTrackingInfoDetails.business_website
                  : "N/A"}
              </Typography>
            </Box>
          </LoaderWrapper>
        </Box>

        {/* Business Summary*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: "16px" },
              whiteSpace: "nowrap",
              flex: { xs: "1 1 100%", sm: "1" },
              alignSelf: "flex-start",
            }}
          >
            Business Summary
          </Typography>
          <LoaderWrapper
            isLoading={loading}
            skeletonHeight="60px"
            sx={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                border: "0.89px solid #D5D7DD99",
                width: "100%",
                flex: 2,
                py: { xs: "10px", md: "12px" },
                px: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#10101099",
                  fontWeight: 500,
                  fontSize: { xs: "14px" },
                }}
              >
                {leadsTrackingInfoDetails.business_summary &&
                leadsTrackingInfoDetails.business_summary !== ""
                  ? leadsTrackingInfoDetails.business_summary
                  : "N/A"}
              </Typography>
            </Box>
          </LoaderWrapper>
        </Box>

        {/* Keywords*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: "16px" },
              whiteSpace: "nowrap",
              flex: { xs: "1 1 100%", sm: "1" },
              alignSelf: "flex-start",
            }}
          >
            Keywords
          </Typography>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="40px"
              sx={{
                width: "100%",
                flex: 2,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                flex: 2,
                py: { xs: "10px", md: "12px" },
                px: "8px",
                display: "flex",
                alignItems: "center",
                maxWidth: "1200px",
                flexWrap: "wrap",
              }}
            >
              {(leadsTrackingInfoDetails.keywords ?? []).length < 1 ? (
                <Typography
                  sx={{
                    color: "#10101099",
                    fontWeight: 500,
                    fontSize: { xs: "14px" },
                    mr: 2,
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                  }}
                >
                  No Keywords
                </Typography>
              ) : (
                <>
                  {leadsTrackingInfoDetails.keywords?.map((keyword, index) => (
                    <Typography
                      key={keyword}
                      sx={{
                        color: "#10101099",
                        fontWeight: 500,
                        fontSize: { xs: "14px" },
                        mr: 2,
                        mb: 1,
                        backgroundColor: "#FFE3F2C7",
                        border: "0.89px solid #D5D7DD99",
                        px: 1,
                        py: 0.5,
                        borderRadius: "4px",
                      }}
                    >
                      {keyword}
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Keywords*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: "16px" },
              whiteSpace: "nowrap",
              flex: { xs: "1 1 100%", sm: "1" },
              alignSelf: "flex-start",
            }}
          >
            Competitors
          </Typography>

          {loading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="40px"
              sx={{
                width: "100%",
                flex: 2,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                flex: 2,
                py: { xs: "10px", md: "12px" },
                px: "8px",
                display: "flex",
                alignItems: "center",
                maxWidth: "1200px",
                flexWrap: "wrap",
              }}
            >
              {(leadsTrackingInfoDetails.competitors ?? []).length < 1 ? (
                <>
                  {" "}
                  <Typography
                    sx={{
                      color: "#10101099",
                      fontWeight: 500,
                      fontSize: { xs: "14px" },
                      mr: 2,
                      px: 1,
                      py: 0.5,
                      borderRadius: "4px",
                    }}
                  >
                    No Competitors
                  </Typography>
                </>
              ) : (
                <>
                  {" "}
                  {leadsTrackingInfoDetails.competitors?.map(
                    (keyword, index) => (
                      <Typography
                        key={keyword}
                        sx={{
                          color: "#10101099",
                          fontWeight: 500,
                          fontSize: { xs: "14px" },
                          mr: 2,
                          backgroundColor: "#FFE3F2C7",
                          border: "0.89px solid #D5D7DD99",
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                        }}
                      >
                        {keyword}
                      </Typography>
                    )
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LeadsTrackingDetailsTab;
