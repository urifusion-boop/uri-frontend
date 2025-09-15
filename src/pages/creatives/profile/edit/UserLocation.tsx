import { CreativeProfileService } from "@/api/CreativeProfileService";
import CustomButton from "@/components/atoms/CustomButton";
import InputField from "@/components/atoms/Input";
import SelectField from "@/components/atoms/SelectField";
import Text from "@/components/atoms/CustomText";
import { queryClient } from "@/configs/query-client.config";
import { cityOptions, countries, stateOptions } from "@/data/profileSetup";
import LocationSchema from "@/data/schemas/LocationSchema";
import { SchemaHelper } from "@/helpers/SchemaHelper";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { useAuth } from "@/providers/AuthProvider";
import { ISelectData } from "@/types";
import { Box, Grid } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreativeProfileDto } from "../../../../models/dtos/CreativeProfileDto";

interface IProps {
  profile?: CreativeProfileDto;
  openModal: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

const UserLocation: React.FC<IProps> = ({ profile, setCurrentStage }) => {
  const { userDetails, userProfile, saveCreativeUserProfile } = useAuth();
  const [address, setAddress] = useState(
    profile?.location?.address ?? userProfile.location?.address ?? ""
  );
  const [state, setState] = useState(
    profile?.location?.state ?? userProfile.location?.state ?? "Lagos"
  );
  const [nextSaving, setNextSaving] = useState(false);

  const [countrySelect, setCountrySelect] = useState<ISelectData>(
    countries.find(
      (country) =>
        country.value ===
        (profile?.location?.country ?? userProfile.location?.country)
    ) ?? ({} as ISelectData)
  );
  const [stateSelect, setStateSelect] = useState<ISelectData>(
    stateOptions().find(
      (state) =>
        state.value ===
        (profile?.location?.state ?? userProfile.location?.state)
    ) ?? ({} as ISelectData)
  );
  const [citySelect, setCitySelect] = useState<ISelectData>(
    cityOptions(state).find(
      (city) =>
        city.value === (profile?.location?.city ?? userProfile.location?.city)
    ) ?? ({} as ISelectData)
  );

  const schema = new SchemaHelper(LocationSchema);
  const isValidSchema = (field?: string) =>
    schema.isValidSchema(
      {
        address: address,
        country: countrySelect.value,
        state: stateSelect.value,
        city: citySelect.value,
      },
      field
    );

  const onNextSave = async () => {
    setNextSaving(true);

    const updatedLocation = {
      address,
      city: String(citySelect.value),
      state,
      country: String(countrySelect.value),
    };
    const response = await CreativeProfileService.updateProfileApi({
      userId: profile?.userId ?? userDetails?.userId,
      location: updatedLocation,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveCreativeUserProfile({
          ...userProfile,
          location: response.responseData?.location,
          isCompleted: response.responseData?.isCompleted,
        });
      }

      setNextSaving(false);
      toast.success("Profile updated successfully.");
      setCurrentStage(2);
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
        label="Address*"
        placeholder="Address"
        type="text"
        value={address}
        onChange={(e) => {
          setAddress(e?.target.value);
        }}
      />
      {!isValidSchema("address") ? (
        <Text size={12} weight={400} color="red">
          Address must be at least ten characters.
        </Text>
      ) : null}

      <SelectField
        label="Country"
        options={countries}
        value={countrySelect}
        onChange={(e) => {
          setCountrySelect(e ? e : { label: "", value: "" });
        }}
        placeholder="Select a Country"
        mt={3}
      />
      {!isValidSchema("country") ? (
        <Text size={12} weight={400} color="red">
          Country is required.
        </Text>
      ) : null}

      <SelectField
        mt={3}
        label="State"
        value={stateSelect}
        options={stateOptions()}
        onChange={(e) => {
          setStateSelect(e ? e : { label: "", value: "" });
          e ? setState(String(e.value)) : null;
        }}
        placeholder="Select a State"
        defaultValue={{ label: "Lagos", value: "Lagos" }}
      />
      {!isValidSchema("state") ? (
        <Text size={12} weight={400} color="red">
          State is required.
        </Text>
      ) : null}

      <SelectField
        mt={3}
        label="City"
        options={cityOptions(state)}
        value={citySelect}
        onChange={(e) => {
          setCitySelect(e ? e : { label: "", value: "" });
        }}
        placeholder="Select a City"
      />
      {!isValidSchema("city") ? (
        <Text size={12} weight={400} color="red">
          City is required.
        </Text>
      ) : null}

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="inverse"
              disabled={!isValidSchema()}
              onClick={() => {
                setCurrentStage(0);
              }}
            >
              Back
            </CustomButton>
          </Grid>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="primary"
              disabled={!isValidSchema() || nextSaving}
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

export default UserLocation;
