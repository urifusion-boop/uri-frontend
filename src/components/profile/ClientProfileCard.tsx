import React from "react";
import { Box } from "@mui/material";
import Text from "../atoms/CustomText";
import Skeleton from "react-loading-skeleton";
import { ClientProfileDto } from "../../models/dtos/ClientProfileDto";
import { TextHelper } from "../../helpers/TextHelper";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useAuth } from "@/providers/AuthProvider";

interface IProps {
  clientData: ClientProfileDto;
  onClick: () => void;
}

const ClientProfileCard: React.FC<IProps> = ({ clientData, onClick }) => {
  const { userDetails } = useAuth();

  return (
    <>
      <Box
        width={"100%"}
        position={"relative"}
        borderRadius={"5.45px"}
        overflow={"hidden"}
        mx={"auto"}
        bgcolor={"rgb(171, 112, 52)"}
        sx={{ aspectRatio: 1 }}
      >
        <img
          src={
            clientData.logo && clientData.logo.url
              ? TextHelper.setUrl(clientData.logo.url)
              : `/assets/images/logo.png`
          }
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: "0",
            objectFit: "cover",
          }}
          alt="image-not-found"
          onClick={() => onClick()}
          className="pointer"
        />
        <Box
          position={"absolute"}
          width={"100%"}
          height={"55px"}
          bottom={0}
          className="glass-blur"
          sx={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
        >
          {" "}
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={2}
            py={1}
          >
            <Box>
              <Text size={14} weight={700} color="#2d2d2d">
                {TextHelper.capitalize(clientData.user?.firstName) ?? ""}{" "}
                {TextHelper.capitalize(clientData.user?.lastName) ?? ""}
              </Text>
              <Text size={10} weight={600}>
                {clientData.businessDetail?.name ?? ""}
              </Text>
            </Box>

            <Box className="d-flex" gap={1} alignItems={"center"}>
              <Box onClick={() => onClick()}>
                <MdOutlineRemoveRedEye
                  color="#2d2d2d"
                  size={24}
                  onClick={() => onClick()}
                  className="pointer"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const ClientCardSkeleton = () => {
  return (
    <div style={{ backgroundColor: "red" }}>
      <Skeleton height={300} width={300} />
      <Skeleton count={2} />
    </div>
  );
};

export default ClientProfileCard;
