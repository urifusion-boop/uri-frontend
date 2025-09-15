import { Container } from "@mui/material";
import { NextPage } from "next";
import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  relative?: boolean;
}

const Wrapper: NextPage<IProps> = ({ children, relative }) => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ position: relative ? "relative" : "static" }}
      >
        {children}
      </Container>
    </>
  );
};

export default Wrapper;
