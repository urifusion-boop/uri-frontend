import CustomButton from "@/components/atoms/CustomButton";
import Text from "@/components/atoms/CustomText";
import { TextHelper } from "@/helpers/TextHelper";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import SelectField from "@/components/atoms/SelectField";
import { Fragment, useState } from "react";
import InputField from "@/components/atoms/Input";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
  bodySizes,
  creativeGenders,
  eyeColors,
  skinColors,
} from "@/data/creatives";
import CustomRadio from "@/components/atoms/CustomRadio";
import { CreativeProfileService } from "@/api/CreativeProfileService";
import useCustomTheme from "@/hooks/theme.hook";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/hooks/utils.hook";
import { IFile } from "@/hooks/profile/client/clientProfileSetup.hook";
import { ISelectData } from "@/types";
import { languages, proficiencies } from "@/data/profileSetup";
import ProfileDetailsSchema from "@/data/schemas/ProfileDetailsSchema";
import { SchemaHelper } from "@/helpers/SchemaHelper";
import { queryClient } from "@/configs/query-client.config";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import Badge from "@/components/atoms/ErrorBadge";
import toast from "react-hot-toast";
import { CreativeProfileDto } from "../../../../models/dtos/CreativeProfileDto";
import ValidationImageUploader from "@/components/atoms/ValidationImageUploader";

interface IProps {
  profile?: CreativeProfileDto;
  openModal: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
  onClick: () => void;
}

const ProfileDetails: React.FC<IProps> = ({
  profile,
  openModal,
  setCurrentStage,
  onClick,
}) => {
  const { userDetails, userProfile, saveCreativeUserProfile } = useAuth();
  const { themeColors } = useCustomTheme();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSkinGuide, setShowSkinGuide] = useState(false);
  const { open, setOpen } = useModal();
  const matches = useMediaQuery("(max-width:500px)");

  const [headshot, setHeadshot] = useState<IFile>(
    profile?.headshot ??
      userProfile.headshot ?? {
        docName: "",
        docType: "",
        publicId: "",
        url: "",
      }
  );
  const [gender, setGender] = useState(
    profile?.gender ?? userProfile.gender ?? ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    profile?.dateOfBirth ?? userProfile.dateOfBirth ?? ""
  );
  const [height, setHeight] = useState(
    profile?.bodyFeature?.height ?? userProfile.bodyFeature?.height ?? ""
  );
  const [languageSelect, setLanguageSelect] = useState<ISelectData[]>(
    profile?.languages?.map(
      (lang) =>
        languages.find((item) => item.value === lang.language) ?? {
          label: "",
          value: "",
        }
    ) ??
      userProfile.languages?.map(
        (lang) =>
          languages.find((item) => item.value === lang.language) ?? {
            label: "",
            value: "",
          }
      ) ??
      []
  );
  const [proficiencySelect, setProficiencySelect] = useState<ISelectData[]>(
    profile?.languages?.map(
      (lang) =>
        proficiencies.find((item) => item.value === lang.proficiency) ?? {
          label: "",
          value: "",
        }
    ) ??
      userProfile.languages?.map(
        (lang) =>
          proficiencies.find((item) => item.value === lang.proficiency) ?? {
            label: "",
            value: "",
          }
      ) ??
      []
  );

  const [bodySizeSelect, setBodySizeSelect] = useState<ISelectData>(
    bodySizes.find(
      (bodySize) =>
        bodySize.value ===
        (profile?.bodyFeature?.bodySize ?? userProfile.bodyFeature?.bodySize)
    ) ?? ({} as ISelectData)
  );
  const [skinColorSelect, setSkinColorSelect] = useState<ISelectData>(
    skinColors.find(
      (skinColor) =>
        skinColor.value ===
        (profile?.bodyFeature?.skinColor ?? userProfile.bodyFeature?.skinColor)
    ) ?? ({} as ISelectData)
  );
  const [eyeColorSelect, setEyeColorSelect] = useState<ISelectData>(
    eyeColors.find(
      (eyeColor) =>
        eyeColor.value ===
        (profile?.bodyFeature?.eyeColor ?? userProfile.bodyFeature?.eyeColor)
    ) ?? ({} as ISelectData)
  );

  const [saving, setSaving] = useState(false);

  const schema = new SchemaHelper(ProfileDetailsSchema);
  const isValidSchema = (field?: string, value?: any) =>
    schema.isValidSchema(
      {
        gender,
        dateOfBirth,
        bodyFeature: {
          height,
          eyeColor: eyeColorSelect.value,
          skinColor: skinColorSelect.value,
          bodySize: bodySizeSelect.value,
        },
        languages: languageSelect.map((language, index) => {
          return {
            language: String(language.value),
            proficiency: String(proficiencySelect[index].value),
          };
        }),
      },
      field,
      value
    );

  const onSave = async (showModal?: boolean) => {
    setSaving(true);
    const update: any = {
      gender,
      bodyFeature: {
        height: height ? height : "",
        bodySize: bodySizeSelect.value ? String(bodySizeSelect.value) : "",
        eyeColor: eyeColorSelect.value ? String(eyeColorSelect.value) : "",
        skinColor: skinColorSelect.value ? String(skinColorSelect.value) : "",
      },
      dateOfBirth,
      languages: languageSelect.map((language, index) => {
        return {
          language: String(language.value),
          proficiency: String(proficiencySelect[index].value),
        };
      }),
    };
    if (headshot.url) update.headshot = headshot;

    const response = await CreativeProfileService.updateProfileApi({
      userId: profile?.userId ?? userDetails?.userId,
      ...update,
    });
    if (response.status) {
      queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);

      if (!profile || profile.userId === userDetails?.userId) {
        saveCreativeUserProfile({
          ...userProfile,
          ...update,
          isCompleted: response.responseData?.isCompleted,
        });
      }
      setSaving(false);
      toast.success("Profile updated successfully.");
      onClick();
    } else {
      setSaving(false);
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
        <Badge>
          IMPORTANT: Height, body size, eye color, skin color, and headshot are
          required.
        </Badge>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ mt: 4 }}>
          <Text size={14} weight={500}>
            What is your gender
          </Text>
          <Box sx={{ mt: 3 }} className="d-flex items-center wrap">
            {creativeGenders.map((item, index) => (
              <Box key={index}>
                <CustomRadio
                  label={item?.label}
                  checked={gender === item.value}
                  onChange={(e) => {
                    e.target.value ? setGender(String(item.value)) : null;
                  }}
                  value={item.value}
                />
              </Box>
            ))}
          </Box>
          {!isValidSchema("gender") ? (
            <Text size={12} weight={400} color="red">
              Gender is required.
            </Text>
          ) : null}
        </Box>
        <Grid container sx={{ mt: 3 }} spacing={3}>
          <Grid item xs={12} md={6}>
            <InputField
              label="Height *"
              placeholder="Enter your height."
              type="text"
              value={height}
              onChange={(e) => {
                setHeight(e ? e.target.value : "");
              }}
            />
            {!isValidSchema("bodyFeature.height", height) ? (
              <Text size={12} weight={400} color="red">
                Height is required.
              </Text>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectField
              label="Body Size *"
              options={bodySizes}
              value={bodySizeSelect}
              onChange={(e) => {
              if (Array.isArray(e)) return;
                setBodySizeSelect(e ? e : { label: "", value: 1 });
              }}
              placeholder="Body Size"
            />
            {!isValidSchema("bodyFeature.bodySize", bodySizeSelect.value) ? (
              <Text size={12} weight={400} color="red">
                Body Size is required.
              </Text>
            ) : null}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={"3px"}
              mt={"3px"}
              sx={{ cursor: "pointer" }}
              onClick={() => setShowSizeGuide(true)}
            >
              <IoMdInformationCircleOutline
                style={{ color: themeColors.primary }}
              />
              <Text size={14} weight={400} color={themeColors.primary}>
                Check Size Guide
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectField
              label="Eye Color *"
              options={eyeColors}
              value={eyeColorSelect}
              onChange={(e) => {
              if (Array.isArray(e)) return;
                setEyeColorSelect(e ? e : { label: "", value: 1 });
              }}
              placeholder="Eye Color"
            />
            {!isValidSchema("bodyFeature.eyeColor", eyeColorSelect.value) ? (
              <Text size={12} weight={400} color="red">
                Eye Color is required.
              </Text>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectField
              label="Skin Color *"
              options={skinColors}
              value={skinColorSelect}
              onChange={(e) => {
              if (Array.isArray(e)) return;
                setSkinColorSelect(e ? e : { label: "", value: 1 });
              }}
              placeholder="Skin Color"
            />
            {!isValidSchema("bodyFeature.skinColor", skinColorSelect.value) ? (
              <Text size={12} weight={400} color="red">
                Skin Color is required.
              </Text>
            ) : null}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={"3px"}
              mt={"3px"}
              sx={{ cursor: "pointer" }}
              onClick={() => setShowSkinGuide(true)}
            >
              <IoMdInformationCircleOutline
                style={{ color: themeColors.primary }}
              />
              <Text size={14} weight={400} color={themeColors.primary}>
                Check Skin Guide
              </Text>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <InputField
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
            }}
          />
        </Box>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {languageSelect.map((lang: any, index: number) => (
            <Fragment key={index}>
              <Grid item xs={12} md={6} key={index}>
                <SelectField
                  value={languageSelect[index]}
                  options={languages}
                  onChange={(e) => {
              if (Array.isArray(e)) return;
                    setLanguageSelect(
                      languageSelect.map((item, id) =>
                        id === index && e ? e : item
                      )
                    );
                  }}
                  placeholder="Languages"
                  label="Language*"
                  key={index}
                />
              </Grid>
              <Grid item xs={12} md={6} key={index}>
                <Box className="d-flex">
                  <Box
                    sx={{
                      width: "calc(100% - 54px)",
                    }}
                  >
                    <SelectField
                      value={proficiencySelect[index]}
                      options={proficiencies}
                      onChange={(e) => {
              if (Array.isArray(e)) return;
                        setProficiencySelect(
                          proficiencySelect.map((item, id) =>
                            id === index && e ? e : item
                          )
                        );
                      }}
                      placeholder="Proficiency*"
                      label="Proficiency*"
                      key={index}
                    />
                  </Box>
                  <AiOutlineDelete
                    style={{
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      margin: "45px 0px 0px 20px",
                    }}
                    onClick={() => {
                      setLanguageSelect(
                        languageSelect.filter((lang, id) => id !== index)
                      );
                      setProficiencySelect(
                        proficiencySelect.filter((prof, id) => id !== index)
                      );
                    }}
                  />
                </Box>
              </Grid>
            </Fragment>
          ))}
        </Grid>
        <CustomButton
          mode="inverse"
          style={{
            height: "38px",
            width: "170px",
            backgroundColor: "transparent",
            border: `3px solid ${themeColors.primary}`,
            marginTop: "20px",
            color: themeColors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          type="submit"
          data-testid="number-select-button"
          onClick={() => {
            setLanguageSelect(languageSelect.concat({ label: "", value: "" }));
            setProficiencySelect(
              proficiencySelect.concat({ label: "", value: "" })
            );
          }}
          color={themeColors.primary}
        >
          <AiOutlinePlus
            size={20}
            style={{
              color: themeColors.primary,
            }}
          />
          <span> Add Language</span>
        </CustomButton>
      </Box>

      {showSizeGuide && (
        <>
          <div
            style={{
              backgroundColor: "rgba(214, 221, 235, 0.30)",
              backdropFilter: "blur(18.751157760620117px)",
              width: "100%",
              height: "100vh",
              position: "fixed",
              top: "0px",
              left: "0px",
              cursor: "pointer",
              zIndex: "3",
            }}
            onClick={() => setShowSizeGuide(false)}
          ></div>

          <img
            src="/assets/images/size-guide.png"
            alt="image not found"
            style={{
              maxWidth: matches ? "90%" : "70%",
              maxHeight: matches ? "90%" : "80%",
              position: "fixed",
              top: "50%",
              left: "50%",
              translate: "-50% -50%",
              zIndex: "3",
            }}
          />
        </>
      )}
      {showSkinGuide && (
        <>
          <div
            style={{
              backgroundColor: "rgba(214, 221, 235, 0.30)",
              backdropFilter: "blur(18.751157760620117px)",
              width: "100%",
              height: "100vh",
              position: "fixed",
              top: "0px",
              left: "0px",
              cursor: "pointer",
              zIndex: "3",
            }}
            onClick={() => setShowSkinGuide(false)}
          ></div>{" "}
          <img
            src="/assets/images/skin-guide.png"
            alt="image not found"
            style={{
              maxWidth: matches ? "90%" : "60%",
              maxHeight: matches ? "90%" : "80%",
              position: "fixed",
              top: "50%",
              left: "50%",
              translate: "-50% -50%",
              zIndex: "3",
            }}
          />
        </>
      )}

      {/* <ImageUploade
            open={open}
            setOpen={setOpen}
            validate="face"
            onSave={(data) => setHeadshot(data)}
          />
        </Box> */}
      <Box sx={{ mt: 6 }}>
        <Text size={14} weight={400}>
          Upload Headshot *
        </Text>
        <Box
          sx={{
            mt: 2,
            border: `2px dashed ${themeColors.placeholder}`,
            borderRadius: "8px",
          }}
        >
          {headshot?.url ? (
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
                src={TextHelper.setUrl(headshot?.url) ?? ""}
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
                onClick={() => setOpen(true)}
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
            <CustomButton
              mode="primary"
              onClick={() => setOpen(true)}
              style={{ width: "150px", margin: "80px calc(50% - 75px)" }}
            >
              Upload Image
            </CustomButton>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="inverse"
              onClick={() => {
                onSave();
                setCurrentStage(2);
              }}
              style={{ marginBottom: "30px" }}
            >
              Back
            </CustomButton>
          </Grid>
          <Grid xs={12} md={6} lg={6} item>
            <CustomButton
              mode="primary"
              disabled={!isValidSchema() || saving}
              onClick={() => onSave(true)}
              loading={saving}
            >
              Save
            </CustomButton>
          </Grid>
        </Grid>
      </Box>

      <ValidationImageUploader
        open={open}
        setOpen={setOpen}
        validate="face"
        onSave={(data) => setHeadshot(data)}
      />
    </Box>
  );
};

export default ProfileDetails;
