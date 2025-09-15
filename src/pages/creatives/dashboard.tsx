import { useCreativesDashHook } from "@/hooks/creatives/dashboard.hook";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Typography } from "@mui/material";
import SeoHead from "../../components/atoms/SeoHead";
import { useState } from "react";
import DashboardLayout from "@/components/atoms/DashboardLayout";

import GlobalServices from "@/components/dashboard/GlobalServices";
import DashboardCard from "@/components/dashboard/DashboardCard";

const CreativesDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { tabButtons } = useCreativesDashHook();
  const { userDetails } = useAuth();

  return (
    <DashboardLayout>
      <SeoHead title="Dashboard" />

      <div className="body__overlay"></div>
      <div className="app__slide-wrapper">
        <div className="mt-4 bg-white rounded-lg p-3">
          <DashboardCard username={userDetails?.firstName ?? ""} />

          <Box
            display="flex"
            borderBottom="1px solid #E0E0E0"
            justifyContent="flex-start"
            width={"100%"}
            overflow="auto"
            mt={3}
            mb={3}
          >
            {tabButtons.map((tab) => (
              <Box
                key={tab.value}
                px={3}
                py={1}
                sx={{
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab.value ? "3px solid #CD1B78" : "none",
                  transition: "border-bottom 0.3s ease",
                }}
                onClick={() => setActiveTab(tab.value)}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  style={{ textTransform: "capitalize" }}
                  fontSize={14}
                  fontWeight={activeTab === tab.value ? 600 : 400}
                  color={activeTab === tab.value ? "#CD1B78" : "#6F6F6F"}
                >
                  <tab.icon
                    color={activeTab === tab.value ? "#CD1B78" : "#6F6F6F"}
                  />
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "inherit",
                    }}
                  >
                    {tab.value === "navigation" ? "Navigation" : tab.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box my={3} width={"100%"}>
            {activeTab === "overview" && (
              <>
                <div className="row g-20"></div>
                <GlobalServices />
              </>
            )}
          </Box>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreativesDashboard;
