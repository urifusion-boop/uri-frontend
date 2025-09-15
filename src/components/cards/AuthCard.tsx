import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

function AuthCard({
  description,
  children,
  className,
}: Readonly<{
  description: string;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <Box
      className={`rounded-[10px] border border-gray-100 shadow-sm md:p-8 p-6 bg-white flex-1 ${className}`}
      justifySelf={"center"}
    >
      <Link
        className="mx-auto max-w-fit block"
        href={process.env.NEXT_PUBLIC_CLIENT_HOST ?? "/"}
      >
        <img src="/assets/images/logo.png" alt="logo" width={70} height={40} />
      </Link>

      <Typography
        variant="h4"
        fontSize={16}
        className="mt-2 text-center text-[#141416]"
      >
        {description}
      </Typography>
      <div className="md:mt-[50px] mt-[35px]">{children}</div>
    </Box>
  );
}

export default AuthCard;
