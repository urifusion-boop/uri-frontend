import { UserService } from "@/api/UserService";
import CustomButton from "@/components/atoms/CustomButton";
import InputField from "@/components/atoms/Input";
import Text from "@/components/atoms/CustomText";
import { queryClient } from "@/configs/query-client.config";
import PersonalDetailsSchema from "@/data/schemas/PersonalDetailsSchema";
import toast from "react-hot-toast";
import { SchemaHelper } from "@/helpers/SchemaHelper";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { CreativeProfileDto } from "../../../../models/dtos/CreativeProfileDto";

interface IProps {
  profile?: CreativeProfileDto;
  openModal: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

const PersonalDetails: React.FC<IProps> = ({ profile, setCurrentStage }) => {
  const { userDetails, saveUserDetails } = useAuth();
  const [firstName, setFirstName] = useState(
    profile?.user?.firstName ?? userDetails?.firstName
  );
  const [lastName, setLastName] = useState(
    profile?.user?.lastName ?? userDetails?.lastName
  );
  const [nextSaving, setNextSaving] = useState(false);

  const schema = new SchemaHelper(PersonalDetailsSchema);
  const isValidSchema = (field?: string) =>
    schema.isValidSchema(
      {
        firstName,
        lastName,
      },
      field
    );

  const onNextSave = async () => {
    setNextSaving(true);
    const response = await UserService.updateUserApi({
      userId: profile?.userId ?? userDetails?.userId,
      firstName: firstName,
      lastName: lastName,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        userDetails!.firstName = firstName;
        userDetails!.lastName = lastName;
        saveUserDetails(userDetails!);
      }
      setNextSaving(false);
      toast.success("Profile updated successfully.");
      setCurrentStage(1);
    } else {
      setNextSaving(false);
      toast.error(response.responseMessage);
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        mb: 7,
      }}
    >
      <InputField
        label="First Name"
        placeholder="First Name"
        type="text"
        value={firstName}
        onChange={(e) => {
          setFirstName(e?.target.value);
        }}
        mt={3}
      />
      {!isValidSchema("firstName") ? (
        <Text size={12} weight={400} color="red">
          First Name must be at least two characters.
        </Text>
      ) : null}

      <InputField
        label="Last Name"
        placeholder="Last Name"
        type="text"
        value={lastName}
        onChange={(e) => {
          setLastName(e?.target.value);
        }}
        mt={3}
      />
      {!isValidSchema("lastName") ? (
        <Text size={12} weight={400} color="red">
          Last Name must be at least two characters.
        </Text>
      ) : null}

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} md={12} lg={12} item>
            <CustomButton
              mode="primary"
              onClick={onNextSave}
              style={{ marginBottom: "30px" }}
              disabled={!isValidSchema() || nextSaving}
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

export default PersonalDetails;
