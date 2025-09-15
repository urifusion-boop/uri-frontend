import { Box, Button, Modal, SxProps, Theme, Typography, useMediaQuery } from "@mui/material";
import React, { ReactNode } from "react";

import { FaFileCsv } from "react-icons/fa";
import { IconType } from "react-icons";
import { LightThemeColors } from "@/configs/colors.config";
import Spinner from "../loaders/Spinner";

/**
 * Base props for the reusable Export Modal.
 */
export interface BaseExportModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Title to display (e.g., "Export Leads")
   */
  title?: ReactNode; // Updated type to allow React elements
  /**
   * Optional image or icon URL (e.g., "/assets/images/pdf-image.png")
   */
  imageSrc?: string;
  /**
   * Alternatively, you can provide a custom image component.
   * For example: like incase of download fail
   * <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
   *   <DocumentErrorIcon style={{ color: '#CD1B78', height: '58px', width: '55px' }} />
   * </Box>
   */
  imageContent?: ReactNode;
  /**
   * Optional style overrides for the image container.
   * If not provided, default styling will be used.
   */
  imageContainerSx?: SxProps<Theme>;
  /**
   * Optional style overrides for the image element.
   */
  imageSx?: React.CSSProperties;
  /**
   * Main description text under the title
   */
  description?: string;
  /**
   * Primary button text (e.g., "Export", "Save")
   */
  descriptionSx?: SxProps<Theme>;
  /**
   * Sub description text that appears below the main description.
   */
  subDescription?: string;
  /**
   * Optional style overrides for the sub description text.
   */
  subDescriptionSx?: SxProps<Theme>;
  /**
   * Primary button text (e.g., "Export", "Save")
   */
  primaryBtnText?: string;
  /**
   * Secondary button text (e.g., "Cancel")
   */
  secondaryBtnText?: string;
  /**
   * Called when the primary button is clicked
   */
  onPrimaryClick?: () => void;
  /**
   * Called when the secondary button is clicked
   */
  onSecondaryClick?: () => void;
  /**
   * Any additional form elements or content you want to render
   */
  children?: ReactNode;
  /**
   * Optional style overrides
   */
  sx?: SxProps<Theme>;
  isPrimaryLoading?: boolean;
  isSecondaryLoading?: boolean;
  icon?: IconType;
}

const BaseExportModal: React.FC<BaseExportModalProps> = React.memo(
  ({
    open,
    onClose,
    title = "Export Data",
    imageContainerSx,
    imageSx,
    description,
    descriptionSx,
    subDescription,
    subDescriptionSx,
    primaryBtnText,
    secondaryBtnText,
    onPrimaryClick,
    onSecondaryClick,
    children,
    sx = {},
    isPrimaryLoading,
    isSecondaryLoading,
    imageSrc,
    icon: Icon,
  }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: { xs: "95%", sm: "100%" },
      bgcolor: "#fff",
      transform: { xs: "translate(-50%, -50%)" },
      p: 4,
      borderRadius: "10px",
      maxWidth: "440px",
      ...(isMobile && {
        left: "50%",
      }),
    };

    // Default styles for the image container.
    const defaultImageContainerSx: SxProps<Theme> = {
      width: "fit-content",
      mx: "auto",
      mt: "30px",
      mb: "20px",
      backgroundColor: LightThemeColors.uriColor,
      borderRadius: "8px",
      py: "10px",
      px: "16px",
    };

    // Default styles for the description.
    const defaultDescriptionSx: SxProps<Theme> = {
      fontWeight: 700,
      color: "#333333",
      fontSize: "16px",
      textAlign: "center",
      maxWidth: "390px",
      mx: "auto",
    };

    // Default styles for the sub description
    const defaultSubDescriptionSx: SxProps<Theme> = {
      fontWeight: 700,
      color: "#333333",
      fontSize: "24px",
      textAlign: "center",
      maxWidth: "370px",
      mx: "auto",
      mt: 4,
    };

    return (
      <Modal
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker backdrop
            },
          },
        }}
      >
        <Box sx={style}>
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#212529",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            {title}
          </Typography>

          {/* image (pdf/svg)*/}
          {/* Image or Custom Image Content */}

          {imageSrc ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2, ...imageContainerSx }}>
              <img
                src={imageSrc}
                alt="Export Icon"
                style={{
                  height: "50px",
                  width: "50px",
                  ...imageSx,
                }}
              />
            </Box>
          ) : (
            <Box sx={{ ...defaultImageContainerSx }}>
              {Icon ? <Icon style={{ color: "#fff", height: "50px", width: "38px" }} /> : <FaFileCsv style={{ color: "#fff", height: "50px", width: "38px" }} />}
            </Box>
          )}

          {/* Sub Description */}
          {subDescription && (
            <Typography variant="body2" sx={{ ...defaultSubDescriptionSx, ...subDescriptionSx }}>
              {subDescription}
            </Typography>
          )}

          {/* Description */}
          {description && (
            <Typography variant="body1" sx={{ ...defaultDescriptionSx, ...descriptionSx }}>
              {description}
            </Typography>
          )}

          {/* Children (custom form, inputs, fileter) */}
          {children && <Box sx={{ mt: 0.1 }}>{children}</Box>}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              justifyContent: "center",
              mt: 4,
            }}
          >
            {primaryBtnText && (
              <Button variant="contained" color="primary" sx={{ px: "29px", py: 1 }} onClick={onPrimaryClick}>
                {isPrimaryLoading ? <Spinner color="#fff" /> : primaryBtnText}
              </Button>
            )}

            {secondaryBtnText && (
              <Button variant="outlined" color="primary" sx={{ px: "29px", py: 1 }} onClick={onSecondaryClick || onClose}>
                {isSecondaryLoading ? <Spinner color={LightThemeColors.uriColor} /> : secondaryBtnText}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    );
  }
);

BaseExportModal.displayName = "BaseExportModal";

export default BaseExportModal;
