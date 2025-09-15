import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, lighten } from "@mui/material";
import { BiX } from "react-icons/bi";
import { useFeedbackHook } from "@/hooks/feeback/feeback.hook";
import { z } from "zod";
import Spinner from "../loaders/Spinner";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { LightThemeColors } from "@/configs/colors.config";
import { triggerToast } from "../atoms/CustomToast";
import { memo, useMemo } from "react";

const FeedbackSchema = z.object({
  satisfaction: z.number().min(1, "Satisfaction must be at least 1"),
  favoriteFeatures: z
    .array(z.string())
    .nonempty("You must select at least one favorite feature"),
  thoughts: z.string().min(5, "Thoughts must be at least 5 character"),
  emoji: z.string().min(1, "Emoji must be at least 1 character"),
});

interface FeedbackModalProps {
  emojis?: string[];
  features?: string[];
}

const FeedbackModal = ({
  emojis = ["😡", "😫", "😕", "😴", "😶", "🙂", "🤯", "🤩", "🔥", "🚀"],
  features = [
    "Keyword Tracking",
    "Hashtag Tracking",
    "Account Tracking",
    "Content Management",
  ],
}: FeedbackModalProps) => {
  const toggleModal = () => setOpen(!open);
  const router = useRouter();

  const {
    createFeedback,
    feedback,
    setFeedback,
    open,
    setOpen,
    openSuccessModal,
    setOpenSuccessModal,
  } = useFeedbackHook();

  const { userDetails } = useAuth();

  const validationResult = FeedbackSchema.safeParse(feedback);

  const emojiList = useMemo(() => emojis, [emojis]);
  const featureList = useMemo(() => features, [features]);

  return userDetails?.userId ? (
    <>
      <Modal
        open={open}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          outline: "none", // Removes focus outline
          border: "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "12px",
            width: { xs: "80%", md: "80%" },
            maxWidth: "468px",
            maxHeight: "555px",
            boxShadow: 24,
            py: "0.4em",
            overflowY: "auto",
            height: "95%",
          }}
          className="scroll"
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #A6A6A6",
              px: "2em",
            }}
          >
            <Typography
              id="modal-modal-title"
              component="h2"
              sx={{
                fontSize: "1em",
                fontWeight: 700,
                color: "#CD1B7885",
              }}
            >
              Feedback
            </Typography>
            <IconButton onClick={toggleModal}>
              <BiX
                color="#6D6D6D"
                style={{
                  fontSize: "1em",
                }}
              />
            </IconButton>
          </Box>
          {/* Body */}
          <Box sx={{ px: "2em", mt: "1em" }}>
            <Typography
              sx={{
                color: "#3A3A3A",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "26.4px",
                fontFamily: "Urbanist",
              }}
            >
              How satisfied were you using our features?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: "0.6em",
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <Box
                  component={"button"}
                  key={i}
                  sx={{
                    backgroundColor:
                      feedback.satisfaction === i + 1
                        ? lighten(LightThemeColors.primary, 0.2)
                        : "#FFF7FB",
                    py: { xs: "0.3em", md: "0.4em" },
                    borderRadius: "50%",
                    px: { xs: "0.6em", md: "0.8em" },
                  }}
                  onClick={() =>
                    setFeedback({ ...feedback, satisfaction: i + 1 })
                  }
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.2em", md: "0.8em" },
                      color:
                        feedback.satisfaction === i + 1 ? "#fff" : "#000000",
                    }}
                  >
                    {i + 1}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.1em" },
                  color: "#A6A6A6",
                  fontWeight: 400,
                }}
              >
                Not Satisfied
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.1em" },
                  color: "#A6A6A6",
                  fontWeight: 400,
                }}
              >
                Very Satisfied
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#3A3A3A",
                fontSize: "0.8em",
                fontWeight: 600,
                mt: "2em",
              }}
            >
              What is your Favorite Feature?
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5em",
                justifyContent: "space-between",
                mt: "0.8em",
                overflowX: "auto",
              }}
              className="no-scroll"
            >
              {featureList.map((feature) => (
                <Box
                  key={feature}
                  component={"button"}
                  sx={{
                    backgroundColor: feedback.favoriteFeatures.includes(feature)
                      ? lighten(LightThemeColors.primary, 0.2)
                      : "#FFE4F24D",
                    py: "0.5em",
                    px: "0.7em",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() =>
                    setFeedback({ ...feedback, favoriteFeatures: [feature] })
                  }
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.6em", md: "0.6em" },
                      color: feedback.favoriteFeatures.includes(feature)
                        ? "#fff"
                        : "#3A3A3A",
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography
              sx={{
                color: "#3A3A3A",
                fontSize: "0.8em",
                fontWeight: 600,
                mt: "2em",
              }}
            >
              What are you thinking about us?{" "}
              <Typography
                component={"span"}
                sx={{
                  color: "#454545",
                  fontSize: "0.4em",
                  fontWeight: 500,
                }}
              >
                (option)
              </Typography>
            </Typography>

            <Box
              component={"textarea"}
              value={feedback.thoughts}
              onChange={(e) =>
                setFeedback({ ...feedback, thoughts: e.target.value })
              }
              sx={{
                width: "100%",
                height: { xs: "6em", md: "5em" },
                mt: "0.5em",
                borderRadius: "10px",
                p: "0.8em",
                fontSize: "0.8em",
                fontWeight: 600,
                color: "#3A3A3A",
                resize: "none",
                backgroundColor: "#F4F4F4",
                outline: "none",
              }}
            />

            <Typography
              sx={{
                color: "#3A3A3A",
                fontSize: "0.8em",
                fontWeight: 600,
                mt: "2em",
              }}
            >
              Give us an emoji!
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "space-between",
                mt: "0.8em",
              }}
            >
              {emojiList.map((emoji, index) => (
                <Box
                  key={emoji + index}
                  component={"button"}
                  onClick={() => setFeedback({ ...feedback, emoji })}
                  sx={{
                    backgroundColor:
                      feedback.emoji === emoji
                        ? lighten(LightThemeColors.primary, 0.2)
                        : "#FFC2E266",
                    py: "0.1em",
                    px: "0.2em",
                    borderRadius: "50%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8em", md: "1em" },
                    }}
                  >
                    {emoji}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: "2em",
                gap: "15px",
              }}
            >
              <Typography
                component={"button"}
                sx={{
                  color: "#A6A6A6",
                  fontSize: "0.6em",
                  fontWeight: 400,
                }}
                onClick={toggleModal}
              >
                Remind me Later
              </Typography>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#CD1B78",
                  color: "#fff",
                  fontSize: "0.6em",
                  fontWeight: 600,
                  borderRadius: "9px",
                  py: "0.6em",
                  px: "20px",
                  elevation: 0,
                }}
                onClick={() => {
                  if (!validationResult.success) {
                    return triggerToast(
                      "error",
                      validationResult.error.errors.map(
                        (error) => error.message
                      )?.[0] ?? "Validation Failed"
                    );
                  } else {
                    createFeedback.mutate();
                  }
                }}
              >
                {createFeedback.isLoading ? (
                  <Spinner size={16} color="#fff" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openSuccessModal}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "18.63px",
            width: { xs: "95%", md: "80%" },
            maxWidth: "500px",
            boxShadow: 24,
            py: "1em",
            maxHeight: "80%",
            height: "auto",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={() => setOpenSuccessModal(false)}
            sx={{
              position: "absolute",
              top: "0.5em",
              right: "0.5em",
            }}
          >
            <BiX
              color="#6D6D6D"
              style={{
                fontSize: "1em",
              }}
            />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: "1.2em",
              pb: "0.8em",
              pt: "4em",
              flexDirection: "column",
              gap: "1.5em",
            }}
          >
            <img
              src="/assets/images/landing/feedback-success.png"
              alt="feedback"
              style={{ width: "auto", height: "8em" }}
            />
            <Typography
              sx={{
                color: "#636363",
                fontSize: "1em",
                fontWeight: 500,
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              Thank you for sharing your thoughts we appreciate your feedback.
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#CD1B78",
                color: "#fff",
                fontSize: "0.6em",
                fontWeight: 600,
                borderRadius: "6px",
                py: "0.6em",
                px: "1.5em",
              }}
              onClick={() => {
                setOpenSuccessModal(false);
                router.push("/dashboard");
              }}
            >
              Back to dashboard
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  ) : null;
};

export default memo(FeedbackModal);
