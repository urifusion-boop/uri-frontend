import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, CircularProgress } from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import CustomButton from "./CustomButton";
import { TextHelper } from "../../helpers/TextHelper";

interface IProps {
  handleDragDrop: (file: any) => void;
  fileName: string;
  isLoading?: boolean;
  currentFile?: string;
}

const DragAndDrop: React.FC<IProps> = ({
  handleDragDrop,
  fileName,
  isLoading,
  currentFile,
}) => {
  const handleFile = useCallback(
    (acceptedFiles: any) => {
      handleDragDrop(acceptedFiles);
      setSelectedFile(acceptedFiles[0]);
    },
    [handleDragDrop]
  );

  const onDrop = (acceptedFiles: any) => {
    handleFile(acceptedFiles);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png", ".jpg"],
      "image/jpeg": [".jpg", ".png"],
      "image/jpg": [".jpeg", ".png"],
      // "video/mp4": [".mp4", ".wmv"],
      // "application/pdf": [".pdf"],
      // "application/msword": [".doc"],
    },
  });
  const { themeColors } = useCustomTheme();
  const [selectedFile, setSelectedFile] = useState<File>();

  return (
    <div {...getRootProps()}>
      <input {...getInputProps({})} />
      {((selectedFile && selectedFile.type.startsWith("image/")) ||
        currentFile) && (
        <Box
          sx={{
            borderRadius: "8px",
            border: themeColors.inputBorder,
            p: 1,
          }}
          className="pointer"
        >
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : currentFile
                  ? TextHelper.setUrl(currentFile)
                  : ""
            }
            alt="image"
            width={100}
            height={50}
            style={{ borderRadius: "8px" }}
          />
        </Box>
      )}
      <Box
        sx={{
          borderRadius: "8px",
          border: `1px dashed ${
            isDragAccept
              ? "green"
              : isDragReject
                ? "red"
                : themeColors.inputBorder
          }`,
          p: 1,
          py: 5,
          mt: selectedFile ? 3 : 0,
        }}
        className="pointer"
      >
        {isLoading && (
          <Box className="d-flex justify-center items-center">
            <CircularProgress sx={{ color: "primary.main" }} size={20} />
          </Box>
        )}
        {!isLoading && (
          <>
            {isDragActive ? (
              <Text size={12} weight={500} mode="secondary" center>
                Drop the file here
              </Text>
            ) : (
              <Box className="text-center d-flex flex-column items-center">
                <Box className="text-center">
                  <img
                    alt="upload"
                    src="/assets/icons/upload-icon.svg"
                    width={24}
                    height={24}
                  />
                </Box>
                <Text size={12} weight={500} mode="secondary" center>
                  Drag and drop your files{" "}
                </Text>
                <Box
                  className="d-flex justify-center"
                  sx={{ width: "122px", my: 1 }}
                >
                  <CustomButton mode="primary" type="button">
                    {selectedFile ? `Replace File` : `Browse File`}
                  </CustomButton>
                </Box>
                <Text mode="secondary" size={16} weight={400} center>
                  {fileName && fileName?.trim() && fileName}
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default DragAndDrop;
