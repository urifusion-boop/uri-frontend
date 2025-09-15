import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
  Tooltip,
  Typography,
  lighten,
} from "@mui/material";
import { useState } from "react";
import { LightThemeColors } from "@/configs/colors.config";
import { availablePlatforms } from "@/data/platformOptions";
import { BiX } from "react-icons/bi";
import Spinner from "../loaders/Spinner";
import { InfluencerDto } from "@/models/dtos/InfluencerDto";
import { PlatformHelper } from "@/helpers/PlatformHelper";
import { SocialMediaEnum } from "@/models/enum-models/SocialMediaEnum";
import { CampaignPlatformEnum } from "@/models/enum-models/PlatformEnum";

type platformType = {
  name: string;
  value: CampaignPlatformEnum;
  icon: string;
  text: string;
  tokenProvider: SocialMediaEnum;
};

interface ConnectSocialMediaModalProps {
  open: boolean;
  handleClose: () => void;
  connectedAccounts: InfluencerDto[];
  handleConnect: (platform: string, username?: string) => void;
  isConnecting?: boolean;
}

const ConnectSocialMediaModal = ({
  handleClose,
  open,
  connectedAccounts,
  handleConnect,
  isConnecting,
}: ConnectSocialMediaModalProps) => {
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const onCloseUsernameModal = () => {
    setOpenUsernameModal(false);
  };

  const handleSave = () => {
    onCloseUsernameModal();
    handleConnect(selectedPlatform, username);
  };

  const renderConnectedAccountsMessage = () => {
    if (connectedAccounts.length > 0) {
      return {
        title: "Connected Accounts",
        message:
          "You’ve successfully connected your social media accounts. Want to connect more? Add another platform to expand your content reach.",
      };
    }
    return {
      title: "Connect Social Media Accounts",
      message:
        "You can connect your social media accounts to manage your content across multiple platforms.",
    };
  };

  const { title, message } = renderConnectedAccountsMessage();

  const getButtonStyles = (platform: platformType) => ({
    display: "flex",
    gap: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 2,
    borderRadius: 2,
    cursor: "pointer",
    bgcolor: PlatformHelper.hasConnectedPlatform(
      connectedAccounts,
      platform.tokenProvider
    )
      ? lighten(LightThemeColors.uriColor, 0.9)
      : platform.tokenProvider === selectedPlatform
        ? lighten(LightThemeColors.uriColor, 0.8)
        : "#fff",
    border: `1px solid ${platform.tokenProvider === selectedPlatform ? LightThemeColors.uriColor : "transparent"}`,
    "&:hover": {
      bgcolor: lighten(LightThemeColors.uriColor, 0.8),
      borderColor: LightThemeColors.uriColor,
    },
  });

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            p: { xs: 2, sm: 3 },
            width: { xs: "100%", sm: "80%", md: "60%" },
            maxHeight: "90vh",
            borderRadius: 2,
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Button
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#000",
              minWidth: "auto",
            }}
            onClick={handleClose}
          >
            <BiX size={24} />
          </Button>

          <Typography
            variant="h5"
            fontWeight="bold"
            color="#000"
            gutterBottom
            sx={{ fontSize: { xs: 18, sm: 24 } }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="#000"
            sx={{
              fontSize: { xs: 12, sm: 14 },
            }}
          >
            {message}
          </Typography>

          <Box
            mt={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {availablePlatforms.map((platform) => (
              <Button
                key={platform.name}
                sx={{
                  ...getButtonStyles(platform),
                  opacity: platform.disable ? 0.5 : 1,
                }}
                onClick={() => {
                  if (!platform.disable) {
                    setSelectedPlatform(platform.tokenProvider);
                  }
                }}
                // disabled={platform.disable}
              >
                <Tooltip
                  title={platform.disable ? "Coming Soon..." : ""}
                  arrow
                  placement="top"
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      style={{
                        width: 48,
                        height: 48,
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "flex-start",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="#000"
                          sx={{ fontSize: { xs: 14, sm: 16 } }}
                        >
                          {platform.name}
                        </Typography>
                        {PlatformHelper.hasConnectedPlatform(
                          connectedAccounts,
                          platform.tokenProvider
                        ) && (
                          <Typography
                            variant="subtitle2"
                            color="#000"
                            sx={{
                              fontSize: 12,
                              bgcolor: lighten("#008000", 0.5),
                              px: 1,
                              borderRadius: 2,
                              color: "#fff",
                            }}
                          >
                            Connected
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333",
                          fontSize: { xs: 12, sm: 14 },
                          textAlign: "start",
                        }}
                      >
                        {platform.text}
                      </Typography>
                    </Box>
                  </span>
                </Tooltip>
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              mt: 3,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ fontSize: { xs: 12, sm: 14 } }}
              disabled={selectedPlatform?.length === 0}
              onClick={() => {
                if (selectedPlatform === SocialMediaEnum.TIKTOK) {
                  setOpenUsernameModal(true);
                } else {
                  handleConnect(selectedPlatform);
                }
              }}
            >
              {isConnecting ? <Spinner size={24} color="#fff" /> : "Connect"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* TikTok username modal */}
      <Dialog
        open={openUsernameModal}
        onClose={onCloseUsernameModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Enter Your TikTok Username</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Please provide your TikTok username to link your profile.
          </Typography>
          <TextField
            label="TikTok Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseUsernameModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConnectSocialMediaModal;
