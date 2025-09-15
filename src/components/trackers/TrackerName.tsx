import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import CustomModal from "../modals/CustomModal";
import { BiPlus, BiX } from "react-icons/bi";
import InputField from "@/components/atoms/Input";
import { countries } from "@/data/countries";
import CustomButton from "@/components/atoms/CustomButton";
import { BsChevronDown } from "react-icons/bs";
import { useTrackerName } from "@/hooks/tracker/trackerName.hook";
import { TrackerDto } from "../../models/dtos/TrackerDto";
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

interface IProps {
  trackerType: string;
  trackers: TrackerDto[];
  setTrackers: (trackers: TrackerDto[]) => void;
  currentTracker: TrackerDto | null;
  setCurrentTracker: (tracker: TrackerDto) => void;
  isLoading: boolean;
}

const TrackerName: React.FC<IProps> = ({
  trackerType,
  trackers,
  setTrackers,
  currentTracker,
  setCurrentTracker,
  isLoading,
}) => {
  const {
    setOpenDialog,
    trackerName,
    setOpen,
    openDialog,
    selectedTracker,
    setSelectedTracker,
    selectedPlatform,
    setSelectedPlatform,
    selectedCountries,
    setSelectedCountries,
    keywords,
    setKeywords,
    addKeyword,
    deleteKeyword,
    platforms,
    open,
    push,
    trackerSectionName,

    openNewTracker,
    setOpenNewTracker,
    openUpdateTracker,
    setOpenUpdateTracker,
    newTracker,
    setNewTracker,
    updatedTracker,
    setUpdatedTracker,
    createTracker,
    updateTracker,
  } = useTrackerName(trackerType, currentTracker, setCurrentTracker);

  useEffect(() => {
    if (trackers.length < 1 && !isLoading) setOpenNewTracker(true);
  }, [isLoading, setOpenNewTracker, trackers]);

  return (
    <>
      <Box
        my={4}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center" }}
          onClick={() => setOpenDialog(true)}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.8rem",
                md: "2rem",
                lg: "2.5rem",
              },
              color: "#141416",
            }}
            fontWeight={500}
          >
            {currentTracker?.name ?? ""}
          </Typography>
          <BsChevronDown size={"1rem"} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              marginRight: "20px",
            }}
            className="tracker-edit"
            onClick={() => setOpenNewTracker(true)}
          >
            <FaPlus size={"1.5rem"} />
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1rem",
                  md: "1rem",
                  lg: "1.5rem",
                },
                color: "#141416",
              }}
            >
              create tracker
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
            className="tracker-edit"
            onClick={() => setOpenUpdateTracker(true)}
          >
            <FaPencilAlt size={"1rem"} />
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1rem",
                  md: "1rem",
                  lg: "1.5rem",
                },
                color: "#141416",
              }}
            >
              edit tracker
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Dialog */}
      <CustomModal
        open={openDialog}
        setOpen={setOpenDialog}
        closeOnOverlayClick
        bgColor="#fff"
        radius="5px"
        maxWidth="400px"
      >
        <Box
          sx={{
            py: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "1rem",
              color: "#141416",
            }}
            fontWeight={500}
            mb={3}
            px={2}
          >
            Select Tracker
          </Typography>
          <Box px={2}>
            <Select
              value={selectedTracker}
              onChange={(value) => {
                setSelectedTracker(value.target.value);
              }}
              sx={{
                width: "100%",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cd1b78",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cd1b78",
                },
              }}
            >
              {trackers.map((tracker) => (
                <MenuItem
                  key={tracker.tracker_id}
                  value={tracker.tracker_id}
                  color="red"
                >
                  {tracker.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button sx={{ color: "#000" }} onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              sx={{ color: "#000" }}
              onClick={() => {
                push(`/tracker/${selectedTracker}/${trackerSectionName}`);
                setOpenDialog(false);
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </CustomModal>

      {/* Edit Tracker Modal */}
      {updatedTracker && (
        <CustomModal
          open={openUpdateTracker}
          width="1000px"
          radius="10px"
          bgColor="#fff"
          maxHeight="600px"
          closeOnOverlayClick
          setOpen={setOpenUpdateTracker}
        >
          <Box sx={{ position: "relative" }}>
            {/* Header */}
            <Box
              sx={{
                borderBottom: "1px solid #d5d5d5",
                pb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box />
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.2rem",
                  textAlign: "center",
                  color: "#141416",
                }}
                fontWeight={600}
              >
                Edit Tracker Settings
              </Typography>
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => setOpenUpdateTracker(false)}
              >
                <BiX size={28} color="#141416" />
              </Box>
            </Box>

            {/* Tracker Name */}
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  mb: 1.2,
                  fontSize: "1rem",
                  color: "#141416",
                }}
              >
                Tracker Name*
              </Typography>
              <Box maxWidth={"400px"}>
                <InputField
                  placeholder="Enter Tracker name"
                  type="text"
                  value={updatedTracker?.name ?? ""}
                  onChange={(e) =>
                    setUpdatedTracker({
                      ...updatedTracker,
                      name: e.target.value,
                    })
                  }
                  noBg
                />
              </Box>
            </Box>

            {/* Keywords */}
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  mb: 1.2,
                  fontSize: "1rem",
                  color: "#141416",
                }}
              >
                I&apos;m looking for post that includes:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {updatedTracker.keywords?.map((word, i) => (
                  <InputField
                    key={i}
                    placeholder="Enter keyword."
                    type="text"
                    value={word}
                    onChange={(e) => {
                      setUpdatedTracker({
                        ...updatedTracker,
                        keywords: updatedTracker.keywords?.map((key, index) => {
                          if (index === i) return e.target.value;
                          else return key;
                        }),
                      });
                    }}
                    noBg
                    rightIcon={
                      updatedTracker.keywords &&
                      updatedTracker.keywords.length > 1
                    }
                    icon={
                      <BiX
                        color="#141416"
                        onClick={() =>
                          setUpdatedTracker({
                            ...updatedTracker,
                            keywords: updatedTracker.keywords?.filter(
                              (key) => key !== word
                            ),
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                ))}
                <Box
                  p={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setUpdatedTracker({
                      ...updatedTracker,
                      keywords: updatedTracker.keywords?.concat(""),
                    })
                  }
                >
                  <BiPlus />
                </Box>
              </Box>
            </Box>

            {/* Excluded Keywords */}
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  mb: 1.2,
                  fontSize: "1rem",
                  color: "#141416",
                }}
              >
                I don&apos;t want to see:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {updatedTracker.excluded?.map((word, i) => (
                  <InputField
                    key={i}
                    placeholder="Enter excluded keyword."
                    type="text"
                    value={word}
                    onChange={(e) => {
                      setUpdatedTracker({
                        ...updatedTracker,
                        excluded: updatedTracker.excluded?.map((key, index) => {
                          if (index === i) return e.target.value;
                          else return key;
                        }),
                      });
                    }}
                    noBg
                    rightIcon
                    icon={
                      <BiX
                        color="#141416"
                        onClick={() =>
                          setUpdatedTracker({
                            ...updatedTracker,
                            excluded: updatedTracker.excluded?.filter(
                              (key) => key !== word
                            ),
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                ))}
                <Box
                  p={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setUpdatedTracker({
                      ...updatedTracker,
                      excluded: updatedTracker.excluded?.concat(""),
                    })
                  }
                >
                  <BiPlus />
                </Box>
              </Box>
            </Box>

            {/* Platforms */}
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  mb: 1.2,
                  fontSize: "1rem",
                  color: "#141416",
                }}
              >
                Choose platforms:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {platforms.map((platform) => (
                  <Box
                    onClick={() =>
                      setUpdatedTracker({
                        ...updatedTracker,
                        platforms: [platform.name],
                      })
                    }
                    sx={{ cursor: "pointer" }}
                    key={platform.name}
                  >
                    <platform.icon
                      size={18}
                      color={
                        updatedTracker.platforms &&
                        updatedTracker.platforms.includes(platform.name)
                          ? "#cd1b78"
                          : "#141416"
                      }
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Location Filter */}
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  mb: 2.5,
                  fontSize: "1rem",
                  color: "#141416",
                }}
              >
                Choose countries to filter:
              </Typography>

              <Autocomplete
                id="country-select-demo"
                multiple
                value={selectedCountries}
                sx={{ maxWidth: 300 }}
                options={countries}
                onChange={(event, newValue) => {
                  setSelectedCountries(
                    newValue.map((country) => {
                      return {
                        code: country.code,
                        label: country.label,
                      };
                    })
                  );

                  setUpdatedTracker({
                    ...updatedTracker,
                    locations: newValue.map((country) => country.label),
                  });
                }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                  return (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.label}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      selectedCountries.length > 0 ? "" : "Select country"
                    }
                  />
                )}
              />
            </Box>
            <Box
              mt={3}
              sx={{
                display: "flex",
                maxWidth: "150px",
                justifyContent: "flex-end",
                ml: "auto",
              }}
            >
              <CustomButton
                mode="primary"
                onClick={() => {
                  setOpenUpdateTracker(false);
                  updateTracker();
                }}
              >
                Save
              </CustomButton>
            </Box>
          </Box>
        </CustomModal>
      )}

      {/* New Tracker Modal */}
      <CustomModal
        open={openNewTracker}
        width="1000px"
        radius="10px"
        bgColor="#fff"
        maxHeight="600px"
        closeOnOverlayClick
        setOpen={setOpenNewTracker}
      >
        <Box sx={{ position: "relative" }}>
          {/* Header */}
          <Box
            sx={{
              borderBottom: "1px solid #d5d5d5",
              pb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box />
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.2rem",
                textAlign: "center",
                color: "#141416",
              }}
              fontWeight={600}
            >
              Create New Tracker
            </Typography>
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => setOpenNewTracker(false)}
            >
              <BiX size={28} color="#141416" />
            </Box>
          </Box>

          {/* Tracker Name */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: "1rem",
                color: "#141416",
              }}
            >
              Tracker name*
            </Typography>
            <Box maxWidth={"400px"}>
              <InputField
                placeholder="Enter Tracker name"
                type="text"
                value={newTracker.name ?? ""}
                onChange={(e) =>
                  setNewTracker({ ...newTracker, name: e.target.value })
                }
                noBg
              />
            </Box>
          </Box>

          {/* Keywords */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: "1rem",
                color: "#141416",
              }}
            >
              I&apos;m looking for post that includes:
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {newTracker.keywords?.map((word, i) => (
                <InputField
                  key={i}
                  placeholder="Enter keyword."
                  type="text"
                  value={word}
                  onChange={(e) => {
                    setNewTracker({
                      ...newTracker,
                      keywords: newTracker.keywords?.map((key, index) => {
                        if (index === i) return e.target.value;
                        else return key;
                      }),
                    });
                  }}
                  noBg
                  rightIcon={
                    newTracker.keywords && newTracker.keywords.length > 1
                  }
                  icon={
                    <BiX
                      color="#141416"
                      onClick={() =>
                        setNewTracker({
                          ...newTracker,
                          keywords: newTracker.keywords?.filter(
                            (key) => key !== word
                          ),
                        })
                      }
                      style={{ cursor: "pointer" }}
                    />
                  }
                />
              ))}
              <Box
                p={1}
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  setNewTracker({
                    ...newTracker,
                    keywords: newTracker.keywords?.concat(""),
                  })
                }
              >
                <BiPlus />
              </Box>
            </Box>
          </Box>

          {/* Keywords */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: "1rem",
                color: "#141416",
              }}
            >
              I don&apos;t want to see:
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {newTracker.excluded?.map((word, i) => (
                <InputField
                  key={i}
                  placeholder="Enter excluded keyword."
                  type="text"
                  value={word}
                  onChange={(e) => {
                    setNewTracker({
                      ...newTracker,
                      excluded: newTracker.excluded?.map((key, index) => {
                        if (index === i) return e.target.value;
                        else return key;
                      }),
                    });
                  }}
                  noBg
                  rightIcon
                  icon={
                    <BiX
                      color="#141416"
                      onClick={() =>
                        setNewTracker({
                          ...newTracker,
                          excluded: newTracker.excluded?.filter(
                            (key) => key !== word
                          ),
                        })
                      }
                      style={{ cursor: "pointer" }}
                    />
                  }
                />
              ))}
              <Box
                p={1}
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  setNewTracker({
                    ...newTracker,
                    excluded: newTracker.keywords?.concat(""),
                  })
                }
              >
                <BiPlus />
              </Box>
            </Box>
          </Box>

          {/* Platforms */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: "1rem",
                color: "#141416",
              }}
            >
              Choose platforms:
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {platforms.map((platform) => (
                <Box
                  onClick={() =>
                    setNewTracker({ ...newTracker, platforms: [platform.name] })
                  }
                  sx={{ cursor: "pointer" }}
                  key={platform.name}
                >
                  <platform.icon
                    size={18}
                    color={
                      newTracker.platforms &&
                      newTracker.platforms.includes(platform.name)
                        ? "#cd1b78"
                        : "#141416"
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Location Filter */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 2.5,
                fontSize: "1rem",
                color: "#141416",
              }}
            >
              Choose countries to filter:
            </Typography>

            <Autocomplete
              id="country-select-demo"
              multiple
              value={selectedCountries}
              sx={{ maxWidth: 300 }}
              options={countries}
              onChange={(event, newValue) => {
                setSelectedCountries(
                  newValue.map((country) => {
                    return {
                      code: country.code,
                      label: country.label,
                    };
                  })
                );

                setNewTracker({
                  ...newTracker,
                  locations: newValue.map((country) => country.label),
                });
              }}
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => {
                return (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    selectedCountries.length > 0 ? "" : "Select country"
                  }
                />
              )}
            />
          </Box>
          <Box
            mt={3}
            sx={{
              display: "flex",
              maxWidth: "150px",
              justifyContent: "flex-end",
              ml: "auto",
            }}
          >
            <CustomButton
              mode="primary"
              onClick={() => {
                setOpenNewTracker(false);
                createTracker();
              }}
            >
              Save
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default TrackerName;
