import { CreativeProfileService } from "@/api/CreativeProfileService";
import CustomButton from "@/components/atoms/CustomButton";
import CustomRadio from "@/components/atoms/CustomRadio";
import Badge from "@/components/atoms/ErrorBadge";
import Text from "@/components/atoms/CustomText";
import { queryClient } from "@/configs/query-client.config";
import { creativeTypes } from "@/data/creatives";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { CreativeProfileDto } from "../../../../models/dtos/CreativeProfileDto";

interface IProps {
  profile?: CreativeProfileDto;
  openModal: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

const CreativeCategory: React.FC<IProps> = ({ profile, setCurrentStage }) => {
  const { userDetails, userProfile, saveCreativeUserProfile } = useAuth();
  const [categories, setCategories] = useState<string[]>(
    profile?.creativeCategories ?? userProfile.creativeCategories ?? []
  );

  const [nextSaving, setNextSaving] = useState(false);

  const onNextSave = async () => {
    setNextSaving(true);
    const response = await CreativeProfileService.updateProfileApi({
      userId: profile?.userId ?? userDetails?.userId,
      creativeCategories: categories,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveCreativeUserProfile({
          ...userProfile,
          creativeCategories: response.responseData?.creativeCategories,
          isCompleted: response.responseData?.isCompleted,
        });
      }
      setNextSaving(false);
      toast.success("Profile updated successfully.");
      setCurrentStage(3);
    } else {
      setNextSaving(false);
      toast.error(response.responseMessage);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 7,
      }}
    >
      <Box mt={2}>
        <Badge>IMPORTANT: You must select at least one creative type.</Badge>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Text size={20} weight={700}>
          Select your creative type
        </Text>
        <Text size={16} mode="secondary" weight={400}>
          Please select your area of expertise.
        </Text>
        <Text
          size={16}
          mode="secondary"
          weight={400}
          style={{ margin: "30px 0px" }}
        >
          Select at least one (1) and at most three (3)
        </Text>
      </Box>
      <Box sx={{ px: "15px" }}>
        <Grid container spacing={3} mb={3}>
          {creativeTypes.map((type: any, index: number) => (
            <Grid xs={12} md={6} key={index}>
              <CustomRadio
                label={type?.label}
                checked={categories.includes(type.value)}
                checkbox
                onClick={() => {
                  setCategories(
                    categories.includes(type.value)
                      ? categories.length > 1
                        ? categories.filter((cat) => cat !== type.value)
                        : categories
                      : categories.length < 3
                        ? categories.concat(type.value)
                        : categories
                  );
                }}
                value={type.value}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {categories.length < 1 ? (
        <Text size={12} weight={400} color="red">
          Category is required.
        </Text>
      ) : null}

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="inverse"
              disabled={categories.length < 1}
              onClick={() => {
                setCurrentStage(1);
              }}
            >
              Back
            </CustomButton>
          </Grid>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="primary"
              disabled={categories.length < 1 && nextSaving}
              onClick={onNextSave}
              loading={nextSaving}
            >
              Next
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreativeCategory;
