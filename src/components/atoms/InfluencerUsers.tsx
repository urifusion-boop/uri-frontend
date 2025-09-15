/* eslint-disable no-unused-vars */
import {
  Avatar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { FaUser } from "react-icons/fa6";
import Text from "./CustomText";
import EmptyState from "./EmptyState";
import { LightThemeColors } from "@/configs/colors.config";
import Spinner from "../loaders/Spinner";
import { BiLogoTwitter } from "react-icons/bi";

interface InfluencedUsersProps {
  mostEngagingUsers?: {
    username: string;
    followers: number;
    avgEngagements: number;
    imageUri?: string;
  }[];
  mostFrequentUsers?: {
    username: string;
    followers: number;
    avgEngagements: number;
    imageUri?: string;
  }[];
  loading?: boolean;
  seeAllBtn?: () => void;
}

enum FilterPostType {
  MostEngaging = "MostEngaging",
  MostFrequent = "LeastEngaging",
}

export default function InfluencerUsers({
  mostEngagingUsers,
  mostFrequentUsers,
  loading,
  seeAllBtn,
}: Readonly<InfluencedUsersProps>) {
  const [filterType, setFilterType] = React.useState<FilterPostType>(
    FilterPostType.MostEngaging
  );

  const displayedUsers =
    filterType === FilterPostType.MostEngaging
      ? mostEngagingUsers
      : mostFrequentUsers;

  return (
    <Box py={3} borderRadius={2} px={4} bgcolor={"white"} height="100%">
      <Text weight={600} size={22}>
        Influencers
      </Text>
      <Box display={"flex"} mt={2} justifyContent={"space-around"}>
        <div style={{ cursor: "pointer" }}>
          <Text
            onClick={() => setFilterType(FilterPostType.MostEngaging)}
            color={filterType === FilterPostType.MostEngaging ? "#CD1B78" : ""}
            weight={filterType === FilterPostType.MostEngaging ? 700 : 400}
            size={16}
          >
            Most Engaging
          </Text>
        </div>
        <div style={{ cursor: "pointer" }}>
          <Text
            onClick={() => setFilterType(FilterPostType.MostFrequent)}
            color={filterType === FilterPostType.MostFrequent ? "#CD1B78" : ""}
            weight={filterType === FilterPostType.MostFrequent ? 700 : 400}
            size={16}
          >
            Least Engaging
          </Text>
        </div>
      </Box>

      <Box mt={3} borderRadius={4}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "250px",
              width: "100%",
            }}
          >
            <Spinner color={LightThemeColors.uriColor} text="Just a sec..." />
          </Box>
        ) : displayedUsers && displayedUsers.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Influencer</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Followers</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Avg Engagements</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={user.imageUri}
                          sx={{ width: 30, height: 30 }}
                        />
                        <Typography>{user.username}</Typography>
                        <BiLogoTwitter color="#1DA1F2" size={20} />
                      </Box>
                    </TableCell>
                    <TableCell align="left">{user.followers}</TableCell>
                    <TableCell align="left">{user.avgEngagements}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              width: "100%",
            }}
          >
            <EmptyState
              icon={<FaUser color={LightThemeColors.uriColor} size={40} />}
              message="No influencers found"
              actionRequired={false}
            />
          </Box>
        )}
      </Box>
      {seeAllBtn && displayedUsers && displayedUsers?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: "10px",
          }}
        >
          <Button
            sx={{
              fontSize: "16px",
            }}
            onClick={seeAllBtn}
          >
            See All Influencers
          </Button>
        </Box>
      )}
    </Box>
  );
}
