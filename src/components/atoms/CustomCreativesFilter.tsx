import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Grid,
} from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "../../hooks/theme.hook";
import CustomFilterItem from "./CustomFilterItem";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SelectField from "./SelectField";
import CustomButton from "./CustomButton";
import { bodySizes, eyeColors, skinColors } from "../../data/creatives";
import { stateOptions } from "@/data/profileSetup";

export interface ICreativeFilter {
  searchTerm?: string;
  categories?: string[];
  height?: string;
  bodySize?: string;
  eyeColor?: string;
  skinColor?: string;
  country?: string;
  state?: string;
  city?: string;
}

interface IProps {
  setFilter: (filter: ICreativeFilter) => void;
  setOpen: () => void;
}

const CustomCreativesFilter: React.FC<IProps> = ({ setFilter, setOpen }) => {
  const { themeColors } = useCustomTheme();
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checked, setChecked] = React.useState({
    models: false,
    hostess: false,
    photographers: false,
    stylists: false,
    vendors: false,
    dancers: false,
    contentcreators: false,
    brandambassadors: false,
    eventsCompleted: false,
    location: false,
  });
  const [isExpanded, setIsExpanded] = React.useState({
    models: false,
    hostess: false,
    photographers: false,
    stylists: false,
    vendors: false,
    dancers: false,
    contentcreators: false,
    brandambassadors: false,
    eventsCompleted: false,
    location: false,
  });
  const [state, setState] = useState("");
  const [models, setModels] = useState<any>({
    bodySize: null,
    height: null,
    eyeColor: null,
    skinColor: null,
  });
  const [hostess, setHostess] = useState<any>({
    bodySize: null,
    height: null,
    eyeColor: null,
    skinColor: null,
  });

  const handleSubmit = () => {
    setOpen();
    const filter: ICreativeFilter = {};
    if (searchQuery) filter.searchTerm = searchQuery;
    if (checked.models) {
      filter.categories = ["MODEL"];

      if (models.bodySize) filter.bodySize = models.bodySize.value;
      if (models.eyeColor) filter.eyeColor = models.eyeColor.value;
      if (models.skinColor) filter.skinColor = models.skinColor.value;
    }
    if (checked.hostess) {
      if (filter.categories) filter.categories.push("USHER");
      else filter.categories = ["USHER"];

      if (hostess.bodySize) filter.bodySize = hostess.bodySize.value;
      if (hostess.eyeColor) filter.eyeColor = hostess.eyeColor.value;
      if (hostess.skinColor) filter.skinColor = hostess.skinColor.value;
    }

    if (checked.photographers) {
      if (filter.categories) filter.categories.push("PHOTOGRAPHER");
      else filter.categories = ["PHOTOGRAPHER"];
    }

    if (checked.stylists) {
      if (filter.categories) filter.categories.push("STYLIST");
      else filter.categories = ["STYLIST"];
    }

    if (checked.vendors) {
      if (filter.categories) filter.categories.push("VENDOR");
      else filter.categories = ["VENDOR"];
    }

    if (checked.dancers) {
      if (filter.categories) filter.categories.push("DANCER");
      else filter.categories = ["DANCER"];
    }

    if (checked.contentcreators) {
      if (filter.categories) {
        filter.categories.push("CONTENT_CREATOR");
        filter.categories.push("CONTENT CREATOR");
      } else filter.categories = ["CONTENT_CREATOR", "CONTENT CREATOR"];
    }

    if (checked.brandambassadors) {
      if (filter.categories) {
        filter.categories.push("BRAND_AMBASSADOR");
        filter.categories.push("BRAND AMBASSADOR");
      } else filter.categories = ["BRAND_AMBASSADOR", "BRAND AMBASSADOR"];
    }

    if (state.length > 0) {
      filter.state = state;
    }

    setFilter(
      Object.keys(filter).length > 0 ? filter : ({} as ICreativeFilter)
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setChecked({
      models: false,
      hostess: false,
      photographers: false,
      stylists: false,
      vendors: false,
      dancers: false,
      contentcreators: false,
      brandambassadors: false,
      eventsCompleted: false,
      location: false,
    });
    setHostess({
      bodySize: null,
      height: null,
      eyeColor: null,
      skinColor: null,
    });
    setModels({
      bodySize: null,
      height: null,
      eyeColor: null,
      skinColor: null,
    });
    setState("");
    handleSubmit();
  };

  return (
    <Box
      sx={{
        height: "fit-content",
        backgroundColor: themeColors.surface,
        marginBottom: "20px",
        border: `1px solid ${themeColors.borderColor}`,
        borderRadius: "8px",
        padding: "20px",
      }}
      height={600}
      marginBottom={2}
      border={`1px solid ${themeColors.borderColor}`}
    >
      <Box className="d-flex" my={3}>
        <img
          src="/assets/icons/filter-icon.svg"
          alt="image"
          width={30}
          height={30}
        />
        <Text size={20} weight={700} sx={{ px: 1 }}>
          Filter
        </Text>
      </Box>

      <hr style={{ opacity: 0.3, margin: "10px 0px" }} />

      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <Text size={14} weight={600} color={themeColors.secondary}>
              Applied filters
            </Text>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Text
              size={14}
              weight={500}
              color={themeColors.secondary}
              className="pointer"
              onClick={() => handleReset()}
            >
              Reset
            </Text>
          </Grid>
        </Grid>

        <Box mt={3}>
          {checked.models && (
            <CustomFilterItem
              name="Models"
              onRemove={() => setChecked({ ...checked, models: false })}
            />
          )}
          {checked.hostess && (
            <CustomFilterItem
              name="Hostess"
              onRemove={() => setChecked({ ...checked, hostess: false })}
            />
          )}
          {checked.photographers && (
            <CustomFilterItem
              name="Photograpgers"
              onRemove={() => setChecked({ ...checked, photographers: false })}
            />
          )}
          {checked.stylists && (
            <CustomFilterItem
              name="Stylists"
              onRemove={() => setChecked({ ...checked, stylists: false })}
            />
          )}
          {checked.contentcreators && (
            <CustomFilterItem
              name="Content Creators"
              onRemove={() =>
                setChecked({ ...checked, contentcreators: false })
              }
            />
          )}
          {checked.dancers && (
            <CustomFilterItem
              name="Dancers"
              onRemove={() => setChecked({ ...checked, dancers: false })}
            />
          )}
          {checked.brandambassadors && (
            <CustomFilterItem
              name="Brand Ambassadors"
              onRemove={() =>
                setChecked({ ...checked, brandambassadors: false })
              }
            />
          )}
          {checked.eventsCompleted && (
            <CustomFilterItem
              name="Events Completed"
              onRemove={() =>
                setChecked({ ...checked, eventsCompleted: false })
              }
            />
          )}
          {checked.location && (
            <CustomFilterItem
              name="Location"
              onRemove={() => setChecked({ ...checked, location: false })}
            />
          )}
        </Box>

        <hr style={{ opacity: 0.3, margin: "10px 0px" }} />
        <Box height={200} sx={{ overflowY: "auto" }}>
          <Text size={16} weight={700}>
            Creatives
          </Text>
          <Accordion
            expanded={isExpanded.models}
            onChange={() =>
              setIsExpanded({ ...isExpanded, models: !isExpanded.models })
            }
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              expandIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.models}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({ ...checked, models: !checked.models })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Models
                </Text>
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ padding: "0px 0px 0px 20px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                <SelectField
                  options={bodySizes}
                  value={models.bodySize}
                  onChange={(e) => {
                    setModels({ ...models, bodySize: e });
                  }}
                  placeholder="Body Size"
                />
                <SelectField
                  options={eyeColors}
                  value={models.eyeColor}
                  onChange={(e) => {
                    setModels({ ...models, eyeColor: e });
                  }}
                  placeholder="Eye Color"
                />
                <SelectField
                  options={skinColors}
                  value={models.skinColor}
                  onChange={(e) => {
                    setModels({ ...models, skinColor: e });
                  }}
                  placeholder="Skin Color"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={isExpanded.hostess}
            onChange={() =>
              setIsExpanded({ ...isExpanded, hostess: !isExpanded.hostess })
            }
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              expandIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.hostess}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({ ...checked, hostess: !checked.hostess })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Hostess
                </Text>
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ padding: "0px 0px 0px 20px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                <SelectField
                  options={bodySizes}
                  value={hostess.bodySize}
                  onChange={(e) => {
                    setHostess({ ...hostess, bodySize: e });
                  }}
                  placeholder="Body Size"
                />
                <SelectField
                  options={eyeColors}
                  value={hostess.eyeColor}
                  onChange={(e) => {
                    setHostess({ ...hostess, eyeColor: e });
                  }}
                  placeholder="Eye Color"
                />
                <SelectField
                  options={skinColors}
                  value={hostess.skinColor}
                  onChange={(e) => {
                    setHostess({ ...hostess, skinColor: e });
                  }}
                  placeholder="Skin Color"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              expandIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.stylists}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({ ...checked, stylists: !checked.stylists })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Stylists
                </Text>
              </Box>
            </AccordionSummary>
          </Accordion>

          <Accordion
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.photographers}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({
                      ...checked,
                      photographers: !checked.photographers,
                    })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Photographers
                </Text>
              </Box>
            </AccordionSummary>
          </Accordion>

          <Accordion
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.contentcreators}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({
                      ...checked,
                      contentcreators: !checked.contentcreators,
                    })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Content Creators
                </Text>
              </Box>
            </AccordionSummary>
          </Accordion>

          <Accordion
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.dancers}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({ ...checked, dancers: !checked.dancers })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Dancers
                </Text>
              </Box>
            </AccordionSummary>
          </Accordion>

          <Accordion
            style={{
              boxShadow: "none",
              border: "0px",
              padding: "0px",
              backgroundColor: `${themeColors.surface}`,
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ boxShadow: "none", border: "0px", padding: "0px" }}
            >
              <Box className="d-flex">
                <Checkbox
                  checked={checked.brandambassadors}
                  style={{ color: themeColors.primary }}
                  onChange={() =>
                    setChecked({
                      ...checked,
                      brandambassadors: !checked.brandambassadors,
                    })
                  }
                />
                <Text
                  size={14}
                  weight={600}
                  sx={{ mx: "2px", translate: "0px 10px" }}
                >
                  Brand Ambassadors
                </Text>
              </Box>
            </AccordionSummary>
          </Accordion>

          <hr style={{ opacity: 0.3, margin: "10px 0px" }} />

          <Text size={16} weight={700}>
            Other Information
          </Text>

          <Box px={1} mt={2} mb={1}>
            <SelectField
              label="Location"
              options={stateOptions()}
              value={{ label: state, value: state }}
              onChange={(e) => {
                setState(e?.label as string);
              }}
              placeholder="Select a State"
            />
          </Box>

          <CustomButton
            mode="primary"
            style={{ margin: "16px 0px" }}
            type="submit"
            loading={loading}
            data-testid="apply-filter-button"
            onClick={() => handleSubmit()}
          >
            Apply Filter
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomCreativesFilter;
