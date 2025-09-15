import { authRoutes } from "@/constants/ClientRoute";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProfileSetup = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(authRoutes.signupAs);
  }, [router]);
  return <></>;
};

export default ProfileSetup;
