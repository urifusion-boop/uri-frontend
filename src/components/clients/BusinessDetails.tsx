import { Box, Grid, Paper, styled } from "@mui/material";
import { ClientProfileDto } from "@/models/dtos/ClientProfileDto";
import Text from "@/components/atoms/CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import { TextHelper } from "@/helpers/TextHelper";
import AddSummary from "@/components/profile/AddSummary";
import AddWorkDetails from "@/components/profile/AddWorkDetails";

const Item = styled(Paper)(() => ({
  backgroundColor: "#FFF8FC",
  padding: "20px 20px 18px",
  textAlign: "left",
  color: "#000",
  height: "320px",
  borderRadius: "8px",
  border: "2px solid rgba(214, 221, 235, 0.30)",
  boxShadow: "none",
  overflow: "hidden",
}));

interface BusinessDetailsProps {
  clientProfile: ClientProfileDto;
}

const BusinessDetails = ({ clientProfile }: BusinessDetailsProps) => {
  const { themeColors } = useCustomTheme();

  const address =
    clientProfile?.businessLocation?.address ||
    clientProfile?.businessLocation?.city ||
    clientProfile?.businessLocation?.state ||
    clientProfile?.businessLocation?.country
      ? `${clientProfile.businessLocation.address}, ${clientProfile.businessLocation.city}, ${clientProfile.businessLocation.state}, ${TextHelper.capitalize(clientProfile.businessLocation.country)}`
      : "No address";

  return (
    <Grid container spacing={"25px"}>
      <Grid item xs={12} md={6}>
        <Item>
          <AddSummary clientProfile={clientProfile} />
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <Box className="d-flex" sx={{ justifyContent: "space-between" }}>
            <Text size={16} weight={600} color={themeColors.primary}>
              Business details
            </Text>
          </Box>
          <Box>
            <Box>
              <Text
                size={16}
                weight={500}
                sx={{ mt: 2 }}
                style={{ maxWidth: "200px" }}
              >
                Business Address
              </Text>
              <Text size={16} weight={700} sx={{ mt: 0.5 }}>
                {address}
              </Text>
            </Box>
            <Box>
              <Text
                size={16}
                weight={500}
                sx={{ mt: 2 }}
                style={{ maxWidth: "200px" }}
              >
                Business Type
              </Text>
              <Text size={16} weight={700} sx={{ mt: 0.5 }}>
                {clientProfile?.businessDetail?.type
                  ? TextHelper.capitalize(
                      clientProfile?.businessDetail?.type
                    ).replace(/_/g, " ")
                  : "No Business Type"}
              </Text>
            </Box>
            <Box>
              <Text
                size={16}
                weight={500}
                sx={{ mt: 2 }}
                style={{ maxWidth: "200px" }}
              >
                Business Category
              </Text>
              <Text size={16} weight={700} sx={{ mt: 0.5 }}>
                {clientProfile?.businessDetail?.category
                  ? TextHelper.capitalize(
                      clientProfile?.businessDetail?.category
                    ).replace(/_/g, " ")
                  : "No Business Category"}
              </Text>
            </Box>
          </Box>
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item sx={{ height: "auto", minHeight: "160px" }}>
          <AddWorkDetails clientProfile={clientProfile} />
        </Item>
      </Grid>
    </Grid>
  );
};

export default BusinessDetails;
