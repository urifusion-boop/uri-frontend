import { Box, Typography, Grid, lighten, Divider, Chip } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { InfluencerDto } from "@/models/dtos/InfluencerDto";
import PlatformIcon from "../atoms/PlatformIcons";
import dayjs from "dayjs";
import IosSwitch from "../atoms/IosSwitch";

interface ConnectedAccountsScreenProps {
  connectedAccounts?: InfluencerDto[];
  disconnect: (influencerId: string, platform: string) => void;
}

const ConnectedAccountsScreen = ({
  connectedAccounts,
  disconnect,
}: ConnectedAccountsScreenProps) => {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.2rem",
          },
          fontWeight: 700,
          mb: 0.3,
        }}
      >
        Connected Accounts
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        gutterBottom
        sx={{
          fontSize: "0.8rem",
        }}
      >
        You can manage and edit your connected accounts.
      </Typography>
      <Grid container spacing={4} mt={4}>
        {connectedAccounts?.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.influencer_id}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                height: "100%",
                p: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <img
                    src={account.profile_pic}
                    alt={account.social_name}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: "-10px",
                      bottom: "-10px",
                    }}
                  >
                    <PlatformIcon
                      platform={account.social_platform ?? ""}
                      size={25}
                    />
                  </Box>
                </Box>
                <IosSwitch
                  sx={{ m: 1 }}
                  checked={account.connected ?? false}
                  onChange={() => {
                    disconnect(
                      account.influencer_id ?? "",
                      account.social_platform ?? ""
                    );
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.9rem",
                        md: "1rem",
                      },
                      fontWeight: 600,
                    }}
                  >
                    {account.social_username}
                  </Typography>
                  {account.connected && (
                    <FaCheckCircle color={lighten("#008000", 0.5)} size={16} />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  {account.social_name}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      display: "block",
                      fontSize: "0.7rem",
                    }}
                  >
                    Created on
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {dayjs(account.createdAt).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={account.connected ? "Connected" : "Disconnected"}
                  sx={{
                    fontSize: "0.7rem",
                    backgroundColor: account.connected
                      ? lighten("#4CAF50", 0.9)
                      : lighten("#ff9800", 0.9),
                    color: account.connected ? "#2E7D32" : "#E65100",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ConnectedAccountsScreen;
