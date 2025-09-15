import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import CustomButton from "../atoms/CustomButton";
import EmptySubscriptionIcon from "../atoms/EmptySubscriptionIcon";
import { SubscriptionCancelledIcon } from "../atoms/Icons";
import CustomModal from "../modals/CustomModal";
import Text from "@/components/atoms/CustomText";

export const ManageSubscription = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSubscribed = true; //dummy data fro now
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSuccessModal, setShowCancelSuccessModal] = useState(false);

  return (
    <Box>
      <Text size={isMobile ? 16 : 24} weight={600}>
        Manage Subscription
      </Text>
      {!isSubscribed && (
        <div>
          <Box
            display={"flex"}
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            <EmptySubscriptionIcon />
          </Box>
          <CustomButton
            style={{ maxWidth: "470px" }}
            mode="primary"
            onClick={() => null}
          >
            Upgrade
          </CustomButton>
        </div>
      )}
      {isSubscribed && (
        <Box marginTop={"46px"}>
          <Text size={12} weight={600} color="#555555">
            CURRENT PLAN
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"12px"}
            style={{
              width: "100%",
              maxWidth: "700px",
              marginTop: "10px",
              borderRadius: "8px",
              padding: "26px 24px",
              backgroundImage: "url(/assets/images/subscription-card-bg.png)",
            }}
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text color="#fff" weight={700} size={14}>
                Plan Type
              </Text>
              <Text color="#fff" weight={700} size={14}>
                Professional
              </Text>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text color="#fff" weight={400} size={12}>
                Price
              </Text>
              <Text color="#fff" weight={400} size={12}>
                5,000/mon
              </Text>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text color="#fff" weight={400} size={12}>
                Renewal Date
              </Text>
              <Text color="#fff" weight={400} size={12}>
                July 30, 2025
              </Text>
            </Box>
          </Box>
          <Box
            marginTop={"46px"}
            maxWidth={"700px"}
            paddingX={isMobile ? "36px" : "0px"}
          >
            <CustomButton
              onClick={() => setShowCancelModal(true)}
              style={{
                maxWidth: "447px",
                margin: "0 auto",
              }}
              mode="inverse"
            >
              UPDATE SUBSCRIPTION PLAN
            </CustomButton>
            <CustomButton
              textColor="#000"
              style={{
                maxWidth: "fit-content",
                margin: "0 auto",
                backgroundColor: "transparent",
                borderWidth: 0,
                marginTop: "5px",
                borderColor: "transparent",
              }}
              mode="secondary"
            >
              CANCEL
            </CustomButton>
          </Box>
        </Box>
      )}

      <CustomModal
        width="600px"
        setOpen={setShowCancelModal}
        showCloseIcon
        open={showCancelModal}
      >
        <Text
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
          weight={600}
          size={isMobile ? 20 : 24}
        >
          Are you sure you want to cancel
        </Text>
        <Text
          weight={500}
          style={{
            textAlign: "center",
            color: "#6C727F",
            marginTop: "10px",
          }}
          size={14}
        >
          Your premium benefits will end once your current billing period ends.
          We’ll miss you, but you can resubscribe at any time
        </Text>
        <Box marginTop={"46px"}>
          <CustomButton
            mode="primary"
            onClick={() => {
              setShowCancelModal(false);
            }}
          >
            Keep Uri Premium
          </CustomButton>
          <CustomButton
            onClick={() => {
              setShowCancelSuccessModal(true);
              setShowCancelModal(false);
            }}
            textColor="#FF2323"
            style={{
              maxWidth: "fit-content",
              margin: "0 auto",
              backgroundColor: "transparent",
              borderWidth: 0,
              marginTop: "5px",
              borderColor: "transparent",
            }}
            mode="secondary"
          >
            UNSUBSCRIBE
          </CustomButton>
        </Box>
      </CustomModal>

      <CustomModal
        width="600px"
        setOpen={setShowCancelSuccessModal}
        showCloseIcon
        open={showCancelSuccessModal}
      >
        <Text
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
          weight={600}
          size={isMobile ? 20 : 24}
        >
          Subscription Cancelled
        </Text>
        <Text
          weight={500}
          style={{
            textAlign: "center",
            color: "#6C727F",
            marginTop: "10px",
          }}
          size={14}
        >
          Your premium benefits remain until the period ends. We are here if you
          change your mind.
        </Text>
        <Box display={"flex"} justifyContent={"center"} marginTop={"16px"}>
          <SubscriptionCancelledIcon />
        </Box>
        <Box marginTop={"46px"}>
          <CustomButton
            mode="primary"
            onClick={() => {
              setShowCancelSuccessModal(false);
            }}
          >
            Done
          </CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
};
