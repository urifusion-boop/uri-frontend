import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import Text from "../atoms/CustomText";
import styles from "../../styles/landing.module.css";
import Link from "next/link";

import { IoLogoInstagram } from "react-icons/io";
import { LuTwitter } from "react-icons/lu";
import { RiFacebookCircleLine } from "react-icons/ri";
import CustomButton from "../atoms/CustomButton";
import CustomModal from "../modals/CustomModal";
import { useModal } from "../../hooks/utils.hook";
import InputField from "../atoms/Input";
import TextAreaField from "../atoms/CustomTextArea";
import { ContactMessageService } from "../../api/ContactService";
import { TextHelper } from "../../helpers/TextHelper";
import { useRouter } from "next/router";
import { AppleIcon, GooglePlayStoreIcon } from "@/components/atoms/Icons";

interface IProps {
  toggleTAndC: () => void;
  toggleFAQs: () => void;
}

const Footer: React.FC<IProps> = ({ toggleTAndC, toggleFAQs }) => {
  const router = useRouter();
  const { open, setOpen, openModal } = useModal();
  const [contactFormDetails, setContactFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [messageSent, setMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendContactMessage = async () => {
    setIsLoading(true);
    const response =
      await ContactMessageService.createMessageApi(contactFormDetails);
    if (response.status) setMessageSent(true);
    setIsLoading(false);
    setContactFormDetails({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <Box className={styles.footerContainer}>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, pb: 3, borderBottom: "2px solid dimgray" }}
      >
        <Grid item xs={12} sm={3}>
          <img
            src="/assets/images/landing/logo-white.png"
            alt="Image not found"
            className={styles.footerLogo}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Text
            className="pointer"
            size={17}
            weight={500}
            color="white"
            sx={{ mt: 2 }}
            center
            onClick={() => router.push("/terms-and-conditions")}
          >
            Terms & Conditions
          </Text>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Text
            className="pointer"
            size={17}
            weight={500}
            color="white"
            sx={{ mt: 2 }}
            center
            onClick={() => router.push("/privacy-policy")}
          >
            Privacy Policy
          </Text>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Text
            className="pointer"
            size={17}
            weight={500}
            color="white"
            sx={{ mt: 2 }}
            center
            onClick={() => toggleFAQs()}
          >
            FAQs
          </Text>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={5}>
          <Box className="d-flex" mb={3}>
            <Link href="https://www.instagram.com/uri.creative?igsh=OGQ5ZDc2ODk2ZA==">
              <IoLogoInstagram
                style={{
                  color: "white",
                  marginRight: "20px",
                  width: "20px",
                  height: "20px",
                }}
              />
            </Link>
            <Link href="https://twitter.com/uricreative?t=2H3TtMmJr8SiKELAzc2WkQ&s=08">
              <LuTwitter
                style={{
                  color: "white",
                  marginRight: "20px",
                  width: "20px",
                  height: "20px",
                }}
              />
            </Link>
            <Link href="https://www.facebook.com">
              <RiFacebookCircleLine
                style={{
                  color: "white",
                  marginRight: "20px",
                  width: "20px",
                  height: "20px",
                }}
              />
            </Link>
          </Box>
          <Box mb={"30px"} maxWidth={"350px"} gap={"12px"} display={"flex"}>
            <Box
              bgcolor={"white"}
              paddingY={"8px"}
              paddingX={"12px"}
              borderRadius={"5px"}
              alignItems={"center"}
              className="d-flex"
              flexBasis={"100%"}
              mt={2}
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <GooglePlayStoreIcon />
              <Box marginLeft={"8px"}>
                <Text size={10} weight={500} color="black">
                  GET IT ON
                </Text>
                <Text size={13} weight={600} color="black">
                  Google Play
                </Text>
              </Box>
            </Box>
            <Box
              alignItems={"center"}
              bgcolor={"white"}
              paddingY={"8px"}
              paddingX={"12px"}
              borderRadius={"5px"}
              className="d-flex"
              flexBasis={"100%"}
              mt={2}
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <AppleIcon />
              <Box marginLeft={"8px"}>
                <Text size={10} weight={500} color="black">
                  Download on the
                </Text>
                <Text size={13} weight={600} color="black">
                  App Store
                </Text>
              </Box>
            </Box>
          </Box>

          <Text size={15} weight={500} color="white">
            2024 Uzuri Creative Ltd . All Rights Reserved
          </Text>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Box className="d-flex justify-end" mb={3}>
            <Text
              size={22}
              weight={700}
              style={{ color: "white", fontFamily: "poorich" }}
            >
              Have any questions? Reach out to us
            </Text>
          </Box>
          <div>
            <Box className="d-flex justify-end">
              <CustomButton
                mode="primary"
                type="submit"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                }}
                loading={false}
                onClick={() => openModal()}
              >
                Contact Us
              </CustomButton>
            </Box>
          </div>
        </Grid>
      </Grid>

      <CustomModal
        width="556px"
        open={open}
        setOpen={setOpen}
        closeOnOverlayClick={true}
      >
        {!messageSent ? (
          <Box sx={{ padding: "10px 10px" }}>
            <Text size={32} weight={700} center>
              Reach out to us!
            </Text>
            <Text size={16} weight={500} sx={{ mb: 2 }} center>
              {`We're always happy to hear from you.`}
            </Text>

            <Box mb={2}>
              <InputField
                placeholder="Your Full Name"
                type="text"
                value={contactFormDetails.name}
                onChange={(e) => {
                  setContactFormDetails({
                    ...contactFormDetails,
                    name: e.target.value,
                  });
                }}
              />
              {contactFormDetails.name.trim().length < 3 ? (
                <Text size={12} weight={400} color="red">
                  Full Name must be at least three characters.
                </Text>
              ) : null}
            </Box>
            <Box mb={2}>
              <InputField
                placeholder="Your Email Address"
                type="email"
                value={contactFormDetails.email}
                onChange={(e) => {
                  setContactFormDetails({
                    ...contactFormDetails,
                    email: e.target.value,
                  });
                }}
                style={{ marginBottom: "20px" }}
              />
              {!TextHelper.containsEmail(contactFormDetails.email) ? (
                <Text size={12} weight={400} color="red">
                  Please input a valid email address.
                </Text>
              ) : null}
            </Box>
            <TextAreaField
              style={{
                padding: "30px",
                fontSize: "15px",
              }}
              placeholder="Your message."
              value={contactFormDetails.message}
              onChange={(e) =>
                setContactFormDetails({
                  ...contactFormDetails,
                  message: e.target.value,
                })
              }
            />
            {contactFormDetails.message.trim().length < 10 ? (
              <Text size={12} weight={400} color="red">
                Message must be at least ten characters.
              </Text>
            ) : null}

            <CustomButton
              mode="primary"
              style={{ margin: "35px 0px" }}
              type="submit"
              loading={isLoading}
              disabled={
                isLoading ||
                contactFormDetails.name.trim().length < 3 ||
                !TextHelper.containsEmail(contactFormDetails.email) ||
                contactFormDetails.message.trim().length < 10
              }
              data-testid="close-request-sent-button"
              onClick={() => {
                sendContactMessage();
              }}
            >
              Submit
            </CustomButton>
          </Box>
        ) : (
          <Box sx={{ padding: "10px 30px" }}>
            <Text size={52} weight={700} center>
              ✅
            </Text>
            <Text size={20} weight={500} sx={{ lineHeight: "50px" }} center>
              Thank you for your message.
              <br />
              We will respond to you shortly.
            </Text>
            <CustomButton
              mode="primary"
              style={{ margin: "35px 0px" }}
              type="submit"
              data-testid="close-request-sent-button"
              onClick={() => {
                setOpen(false);
                setMessageSent(false);
              }}
            >
              Close
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </Box>
  );
};

export default Footer;
