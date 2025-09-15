import Text from "@/components/atoms/CustomText";
import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import useCustomTheme from "../../hooks/theme.hook";
import { useModal } from "../../hooks/utils.hook";
import CustomButton from "../atoms/CustomButton";
import { AiOutlineClose } from "react-icons/ai";
import InputField from "../atoms/Input";
import { Stage } from "../atoms/ProfileStagesContainer";
import SelectField from "../atoms/SelectField";
import {
  branchOrHeadOffice,
  businessTypes,
  cityOptions,
  countries,
  stateOptions,
} from "../../data/profileSetup";
import { ISelectData } from "../../types";
import { IFile } from "../../hooks/profile/client/clientProfileSetup.hook";
import { toast } from "react-hot-toast";
import DragAndDrop from "../atoms/DragAndDrop";
import { DocumentService } from "@/api/DocumentService";
import { useAuth } from "@/providers/AuthProvider";
import { ClientProfileService } from "../../api/ClientProfileService";
import CustomModal from "../modals/CustomModal";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { SchemaHelper } from "../../helpers/SchemaHelper";
import BusinessDetailSchema from "../../data/schemas/BusinessDetailSchema";
import LocationSchema from "../../data/schemas/LocationSchema";
import { TextHelper } from "../../helpers/TextHelper";
import { FaRegEdit } from "react-icons/fa";
import { ClientProfileDto } from "../../models/dtos/ClientProfileDto";

interface IProps {
  profile?: ClientProfileDto;
  openModal: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
  onClick?: () => void;
}

interface IProp {
  profile?: ClientProfileDto;
  onClick?: () => void;
}

const EditProfile: React.FC<IProp> = ({ profile, onClick }) => {
  const { themeColors } = useCustomTheme();
  const { open, setOpen, openModal, closeModal } = useModal();
  const [stages, setStages] = useState(["Business Details", "Location"]);
  const [currentStage, setCurrentStage] = useState(0);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [stages, currentStage]);

  return (
    <Box sx={{ padding: "0px 50px" }}>
      <Box className="desktop-only">
        <Box
          className="d-flex items-center justify-center hide-scrollbar"
          mt={3}
          sx={{ overflowX: "scroll" }}
        >
          {stages.slice(0, 3).map((item: string, index: number) => {
            return (
              <Box
                className="pointer"
                key={index}
                onClick={() => setCurrentStage(index)}
              >
                <Stage
                  stage={index + 1}
                  lastStage={index + 1 === stages.length}
                  active={
                    stages.findIndex(
                      (stage: string) => stage === stages[currentStage]
                    ) >= index
                  }
                >
                  {item}
                </Stage>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box className="mobile-only">
        {stages.slice(0, 3).map((item: string, index: number) => {
          return (
            <Box
              className="pointer"
              key={index}
              onClick={() => setCurrentStage(index)}
              mb={2}
            >
              <Stage
                stage={index + 1}
                lastStage={index + 1 === stages.length}
                active={
                  stages.findIndex(
                    (stage: string) => stage === stages[currentStage]
                  ) >= index
                }
                noArrow
              >
                {item}
              </Stage>
            </Box>
          );
        })}
      </Box>

      <Grid container>
        <Grid xs={12} md={2} lg={3} item></Grid>
        <Grid xs={12} md={8} lg={6} item>
          {currentStage === 0 && (
            <BusinessDetails
              profile={profile}
              openModal={() => openModal()}
              setCurrentStage={setCurrentStage}
            />
          )}
          {currentStage === 1 && (
            <Location
              profile={profile}
              openModal={() => openModal()}
              setCurrentStage={setCurrentStage}
              onClick={onClick}
            />
          )}
        </Grid>
        <Grid xs={12} md={2} lg={3} item></Grid>
      </Grid>

      <CustomModal
        width="756px"
        open={open}
        setOpen={setOpen}
        closeOnOverlayClick={true}
      >
        <Box
          sx={{
            width: "20px",
            height: "20px",
            backgroundColor: themeColors.borderColor,
            borderRadius: "20px",
            position: "absolute",
            top: "30px",
            right: "30px",
            cursor: "pointer",
          }}
          onClick={() => setOpen(false)}
        >
          <AiOutlineClose
            style={{
              color: themeColors.blackWhite,
              margin: "2px",
              width: "15px",
              height: "15px",
            }}
          />
        </Box>
        <img
          src="/assets/icons/send-icon-primary.svg"
          alt="image"
          width={70}
          height={70}
          style={{ marginBottom: "20px" }}
        />
        <Text size={24} weight={600}>
          Successfully updated your profile!
        </Text>
      </CustomModal>
    </Box>
  );
};

const BusinessDetails: React.FC<IProps> = ({
  profile,
  openModal,
  setCurrentStage,
}) => {
  const { themeColors } = useCustomTheme();
  const queryClient = useQueryClient();
  const { userDetails, userProfile, saveClientUserProfile } = useAuth();
  const [businessName, setBusinessName] = useState(
    profile?.businessDetail?.name ?? userProfile.businessDetail?.name
  );
  const [fileLoading, setFileLoading] = useState(false);
  const [nextSaving, setNextSaving] = useState(false);

  const [businessTypeSelect, setBusinessTypeSelect] = useState<ISelectData>(
    businessTypes.find(
      (type) =>
        type.value ===
        (profile?.businessDetail?.type ?? userProfile?.businessDetail?.type)
    ) ?? ({} as ISelectData)
  );
  const [branchSelect, setBranchSelect] = useState<ISelectData>(
    branchOrHeadOffice.find(
      (category) =>
        category.value ===
        (profile?.businessDetail?.category ??
          userProfile.businessDetail?.category)
    ) ?? ({} as ISelectData)
  );

  const [logo, setLogo] = useState<IFile>(
    profile?.logo ??
      userProfile.logo ?? {
        docName: "",
        docType: "",
        publicId: "",
        url: "",
      }
  );

  const schema = new SchemaHelper(BusinessDetailSchema);
  const isValidSchema = (field?: string) =>
    schema.isValidSchema(
      {
        name: businessName,
        type: businessTypeSelect.value,
        category: branchSelect.value,
        logo,
      },
      field
    );

  const onNextSave = async () => {
    setNextSaving(true);
    const response = await ClientProfileService.updateProfileApi({
      ...profile,
      userId: profile?.userId ?? userDetails?.userId,
      businessDetail: {
        name: businessName,
        type: String(businessTypeSelect.value),
        category: String(branchSelect.value),
        address:
          profile?.businessLocation?.address ??
          userProfile.businessLocation?.address ??
          "Address.",
      },
      logo,
    });

    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveClientUserProfile({
          ...profile,
          businessDetail: {
            name: businessName,
            type: String(businessTypeSelect.value),
            category: String(branchSelect.value),
            address: userProfile.businessLocation?.address ?? "",
          },
          logo,
        });
      }

      setNextSaving(false);
      toast.success("Profile updated successfully.");
      setCurrentStage(1);
    } else {
      setNextSaving(false);
      toast.error(response.responseMessage);
    }
  };

  const handleFile = async (file: any) => {
    file = file[0];
    if (!file) return;
    if (logo?.publicId) {
      const deleteResponse = await DocumentService.deleteFile(logo.publicId);
    }

    const formData = new FormData();
    formData.append("file", file);

    setFileLoading(true);
    const response = await DocumentService.uploadFile(
      formData,
      `${profile?.userId ?? userProfile?.userId}/Logos/${Date.now()}_${
        file.name
      }`
    );
    setFileLoading(false);
    if (response?.status) {
      setLogo({
        docName: "Logo",
        docType: response.responseData?.docType!,
        publicId: response.responseData?.publicId!,
        url: response.responseData?.url!,
      });
    } else {
      toast(response?.responseMessage);
    }
    return;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <InputField
        label="Business | Client Name*"
        placeholder="Business | Client Name"
        type="text"
        value={businessName}
        onChange={(e) => {
          setBusinessName(e.target.value);
        }}
      />
      {!isValidSchema("name") ? (
        <Text size={12} weight={400} color="red">
          Name must be at least five characters.
        </Text>
      ) : null}

      <SelectField
        label="Business Type*"
        options={businessTypes}
        value={businessTypeSelect}
        onChange={(e) => {
          setBusinessTypeSelect(e ? e : { label: "", value: "" });
        }}
        placeholder="Choose your business type."
        mt={3}
      />
      {!isValidSchema("type") ? (
        <Text size={12} weight={400} color="red">
          Business Type is required.
        </Text>
      ) : null}

      <SelectField
        label="Branch or Head Office*"
        options={branchOrHeadOffice}
        value={branchSelect}
        onChange={(e) => {
          setBranchSelect(e ? e : { label: "", value: "" });
        }}
        placeholder="Branch or Head office"
        mt={3}
      />
      {!isValidSchema("category") ? (
        <Text size={12} weight={400} color="red">
          Category is required.
        </Text>
      ) : null}

      <Box sx={{ mt: 3 }}>
        <Text size={14} weight={400}>
          Upload your cover image/business logo *
        </Text>

        <Box
          sx={{
            mt: 2,
            border: `2px dashed ${themeColors.placeholder}`,
            borderRadius: "8px",
          }}
        >
          {logo?.url ? (
            <div
              style={{
                height: "300px",
                borderRadius: "10px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <img
                src={TextHelper.setUrl(logo?.url) ?? ""}
                alt="image not found"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                  zIndex: "2",
                }}
              />
              <Box
                style={{
                  width: "36px",
                  height: "36px",
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  borderRadius: "20px",
                  backgroundColor: themeColors.primary,
                  cursor: "pointer",
                  zIndex: "2",
                }}
                onClick={() =>
                  setLogo({
                    docName: "",
                    docType: "",
                    publicId: "",
                    url: "",
                  })
                }
              >
                <FaRegEdit
                  style={{
                    width: "18px",
                    height: "18px",
                    color: "white",
                    margin: "9px",
                  }}
                />
              </Box>
            </div>
          ) : (
            <DragAndDrop
              handleDragDrop={(file) => handleFile(file)}
              fileName="Logo"
              isLoading={fileLoading}
              currentFile={logo ? logo.url : ""}
            />
          )}
        </Box>
        {!logo.url ? (
          <Text size={12} weight={400} color="red" sx={{ mt: 1 }}>
            Logo is required.
          </Text>
        ) : null}
      </Box>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} md={12} lg={12} item>
            <CustomButton
              mode="primary"
              disabled={!isValidSchema() || nextSaving || !logo.url}
              onClick={() => onNextSave()}
              loading={nextSaving}
            >
              Save
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Location: React.FC<IProps> = ({
  profile,
  openModal,
  setCurrentStage,
  onClick,
}) => {
  const queryClient = useQueryClient();
  const { userDetails, userProfile, saveClientUserProfile } = useAuth();
  const [address, setAddress] = useState(
    profile?.businessLocation?.address ??
      userProfile.businessLocation?.address ??
      ""
  );
  const [state, setState] = useState(
    profile?.businessLocation?.state ??
      userProfile.businessLocation?.state ??
      "Lagos"
  );

  const [countrySelect, setCountrySelect] = useState<ISelectData>(
    countries.find(
      (country) =>
        country.value ===
        (profile?.businessLocation?.country ??
          userProfile.businessLocation?.country)
    ) ?? ({} as ISelectData)
  );
  const [stateSelect, setStateSelect] = useState<ISelectData>(
    stateOptions().find(
      (state) =>
        state.value ===
        (profile?.businessLocation?.state ??
          userProfile.businessLocation?.state)
    ) ?? ({} as ISelectData)
  );
  const [citySelect, setCitySelect] = useState<ISelectData>(
    cityOptions(state).find(
      (city) =>
        city.value ===
        (profile?.businessLocation?.city ?? userProfile.businessLocation?.city)
    ) ?? ({} as ISelectData)
  );

  const [saving, setSaving] = useState(false);

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

  const onSave = async () => {
    setSaving(true);

    const updatedLocation = {
      address,
      city: String(citySelect.value),
      state,
      country: String(countrySelect.value),
    };
    const response = await ClientProfileService.updateProfileApi({
      ...profile,
      userId: profile?.userId ?? userDetails?.userId,
      businessLocation: updatedLocation,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveClientUserProfile({
          ...userProfile,
          businessLocation: updatedLocation,
        });
      }
      setSaving(false);
      toast.success("Profile updated successfully.");
      onClick && onClick();
    } else {
      setSaving(false);
      toast.error(response.responseMessage);
    }
  };

  const onBackSave = async () => {
    const updatedLocation = {
      address,
      city: String(citySelect.value),
      state,
      country: String(countrySelect.value),
    };
    const response = await ClientProfileService.updateProfileApi({
      userId: profile?.userId ?? userDetails?.userId,
      businessLocation: updatedLocation,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveClientUserProfile({
          ...userProfile,
          businessLocation: updatedLocation,
          isCompleted: response.responseData?.isCompleted,
        });
      }
      openModal();
      toast.success("Profile updated successfully.");
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
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
              onClick={() => setCurrentStage(0)}
              style={{ marginBottom: "30px" }}
              disabled={!isValidSchema()}
            >
              Back
            </CustomButton>
          </Grid>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="primary"
              disabled={!isValidSchema() && saving}
              onClick={() => onSave()}
              loading={saving}
            >
              Save
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditProfile;
