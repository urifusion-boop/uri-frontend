import DashboardLayout from "@/components/atoms/DashboardLayout";
import { Box, Typography, useMediaQuery } from "@mui/material";
import SeoHead from "../../components/atoms/SeoHead";
import CustomTabSelect from "@/components/atoms/CustomTabSelect";
import { useState } from "react";

const Help = () => {
  const matches = useMediaQuery("(max-width: 500px)");
  const matches2 = useMediaQuery("(max-width: 1000px)");
  const [activeTab, setActiveTab] = useState("tutorial");

  const helpContent = [
    {
      image: "/assets/images/whatsapp.svg",
      title: "Talk to us",
      description: "Need assistance or have questions? Chat with us",
      link: "https://wa.link/8srzt1",
    },
    {
      image: "/assets/images/gmail.svg",
      title: "Send us an Email",
      description: "For inquiries, drop  us a message",
      link: "mailto:hello@pengrid.io",
    },
  ];

  const tabButtons: any = [
    {
      label: "Tutorial",
      value: "tutorial",
    },
    {
      label: "Contact Us",
      value: "contact us",
    },
  ];

  const tutorialContent = [
    {
      title: "Complete profile setup",
      description: "Step-by-step guide on how to complete your profile",
    },
    {
      title: "Content Management",
      description: "Below is a video of how to manage your content.",
    },
  ];

  return (
    <>
      <SeoHead title="Help" />
      <DashboardLayout>
        <Box>
          <Box height={"60px"} position={"relative"} mb="33px">
            <img
              src="/assets/images/help-bg.svg"
              alt="help"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box
            display={"flex"}
            mb={"57px"}
            flexDirection={"column"}
            mx={"42px"}
          >
            <Typography
              fontSize={matches ? 24 : 48}
              fontWeight={700}
              mb={"20px"}
              color={"#141416"}
            >
              Help Center
            </Typography>
            <Typography
              fontSize={20}
              fontWeight={500}
              color={"#6C727F"}
              maxWidth={"864px"}
            >
              Welcome to our Help Center! Whether you{"'"}re looking for help on
              how to use the app or need assistance, we{"'"}re here to help.
              Explore our guides or contact support through various channels for
              personalized assistance.
            </Typography>
          </Box>
          <Box ml={"42px"}>
            <CustomTabSelect
              active={activeTab}
              buttons={tabButtons}
              onClick={(value) => setActiveTab(value)}
              width="32px"
            />
          </Box>
          {activeTab === "contact us" && (
            <Box maxWidth={"1600px"} mx={matches ? "12px" : "42px"} pb={"30px"}>
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"40px"}
                flexDirection={matches2 ? "column" : "row"}
              >
                {helpContent.map((item) => (
                  <a href={item.link} target="_blank" key={item.title}>
                    <Box
                      bgcolor={"#fff"}
                      textAlign={"center"}
                      padding={"20px 12px"}
                      borderRadius={"10px"}
                      maxHeight={"234px"}
                      minHeight={"234px"}
                      maxWidth={"328px"}
                      minWidth={"328px"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                      border={"1px solid rgba(214, 221, 235, 0.50)"}
                      boxShadow={
                        " 0px 1.852px 3.148px 0px rgba(0, 0, 0, 0.01), 0px 8.148px 6.519px 0px rgba(0, 0, 0, 0.01), 0px 20px 13px 0px rgba(0, 0, 0, 0.01), 0px 38.519px 25.481px 0px rgba(0, 0, 0, 0.02), 0px 64.815px 46.852px 0px rgba(0, 0, 0, 0.02), 0px 100px 80px 0px rgba(0, 0, 0, 0.03)"
                      }
                    >
                      <Box
                        height={"67px"}
                        width={"67px"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        sx={{ borderRadius: "50%" }}
                        boxShadow={" rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                      >
                        <img
                          src={item.image}
                          width={40}
                          height={40}
                          alt={item.title}
                        />
                      </Box>
                      <Typography
                        my={"14px"}
                        fontSize={22}
                        fontWeight={600}
                        color={"#141416"}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        fontSize={14}
                        color={"#6C727F"}
                        fontWeight={500}
                        maxWidth={"250px"}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </a>
                ))}
                <button onClick={() => alert("Coming soon...")}>
                  <Box
                    bgcolor={"#fff"}
                    textAlign={"center"}
                    padding={"20px 12px"}
                    borderRadius={"10px"}
                    maxHeight={"234px"}
                    minHeight={"234px"}
                    maxWidth={"328px"}
                    minWidth={"328px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDirection={"column"}
                    border={"1px solid rgba(214, 221, 235, 0.50)"}
                    boxShadow={
                      " 0px 1.852px 3.148px 0px rgba(0, 0, 0, 0.01), 0px 8.148px 6.519px 0px rgba(0, 0, 0, 0.01), 0px 20px 13px 0px rgba(0, 0, 0, 0.01), 0px 38.519px 25.481px 0px rgba(0, 0, 0, 0.02), 0px 64.815px 46.852px 0px rgba(0, 0, 0, 0.02), 0px 100px 80px 0px rgba(0, 0, 0, 0.03)"
                    }
                  >
                    <Box
                      height={"67px"}
                      width={"67px"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      sx={{ borderRadius: "50%" }}
                      boxShadow={" rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                    >
                      <img
                        src={"/assets/images/ticket.svg"}
                        width={40}
                        height={40}
                        alt={"Ticket"}
                      />
                    </Box>

                    <Typography
                      my={"14px"}
                      fontSize={22}
                      fontWeight={600}
                      color={"#141416"}
                    >
                      Raise a Ticket
                    </Typography>
                    <Typography
                      fontSize={14}
                      color={"#6C727F"}
                      fontWeight={500}
                      maxWidth={"250px"}
                    >
                      Facing a challenge? Create an issue
                    </Typography>
                  </Box>
                </button>
              </Box>
            </Box>
          )}

          {activeTab === "tutorial" && (
            <Box
              mx={matches ? "21px" : "42px"}
              mt={4}
              className={"help-tutorial-grid"}
              maxWidth={"1300px"}
              pb={2}
            >
              {tutorialContent.map((item) => (
                <Box
                  p={"20px"}
                  border={"1px solid #D6DDEB80"}
                  bgcolor={"#fff"}
                  width={"100%"}
                  sx={{
                    maxWidth: { xs: "328px", md: "500px" },
                  }}
                  key={item.title}
                >
                  <Typography
                    color={"#CD1B78"}
                    fontSize={"20px"}
                    fontWeight={600}
                    ml={"12px"}
                    mb={"12px"}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color={"#6C727F"}
                    fontSize={14}
                    fontWeight={500}
                    ml={"12px"}
                    maxWidth={"241px"}
                    mb={"35px"}
                    height={"65px"}
                  >
                    {item.description}
                  </Typography>
                  <Box position={"relative"}>
                    <img
                      src="/assets/images/coming soon.png"
                      alt="coming"
                      width={"100%"}
                      style={{
                        objectFit: "cover",
                        borderRadius: "10px",
                        aspectRatio: 1,
                      }}
                    />

                    <Typography
                      color={"#CD1B78"}
                      fontSize={14}
                      fontWeight={500}
                      ml={"12px"}
                      mt={"20px"}
                      position={"absolute"}
                      top={"40%"}
                      left={"40%"}
                      sx={{ transform: "translate(-50%, -50%)" }}
                      bgcolor={"#fff"}
                      py={"5px"}
                      px={"10px"}
                      borderRadius={"5px"}
                    >
                      Coming soon...
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Help;
