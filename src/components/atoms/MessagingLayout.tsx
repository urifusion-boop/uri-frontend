import React, { ReactNode, useState } from "react";
import styles from "@/styles/Dashboard.module.css";
import useCustomTheme from "@/hooks/theme.hook";
import PageHeader from "../headers/PageHeader";
import DashSideNav from "./DashSideNav";

interface IProps {
  children: ReactNode;
}

const MessagingLayout: React.FC<IProps> = ({ children }) => {
  const { themeColors } = useCustomTheme();
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <>
      <DashSideNav open={sideNavOpen} setOpen={setSideNavOpen} />
      <div
        className={styles.container}
        style={{
          width: sideNavOpen ? "calc(100% - 300px)" : "calc(100% - 80px)",
          marginLeft: sideNavOpen ? "300px" : "80px",
          backgroundColor: themeColors.background,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <PageHeader toggleSideNav={toggleSideNav} />
        <div
          style={{
            backgroundColor: `${themeColors.background}`,
            display: "flex",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default MessagingLayout;
