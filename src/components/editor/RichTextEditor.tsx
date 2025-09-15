import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { EditorState, Modifier } from "draft-js";
import { Box, CircularProgress } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { GrEmoji } from "react-icons/gr";

// Dynamic import of the Editor component with SSR disabled
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    ),
  }
);

interface RichTextEditorProps {
  editorState: EditorState;
  onEditorStateChange: (state: EditorState) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editorState,
  onEditorStateChange,
}) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setIsEmojiPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle emoji click and insert it into the editor

  const toolbarConfig = {
    options: ["inline", "blockType", "fontSize"],
    inline: { inDropdown: false },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    image: {
      alt: { present: true, mandatory: false },
      previewImage: true,
      inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
      defaultSize: {
        height: "300px",
        width: "auto",
      },
    },
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        className="scroll"
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          bgcolor: "#fff",
          "& .rdw-editor-main": {
            minHeight: "300px",
            maxHeight: "300px",
            padding: "0 16px",
          },
        }}
      >
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            ...toolbarConfig,
          }}
          toolbarCustomButtons={[
            <Box
              key="emoji-picker"
              onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "0",
                p: "8px",
                cursor: "pointer",
                alignItems: "center",
                display: "flex",
              }}
            >
              <GrEmoji color="#000" size={16} />
            </Box>,
          ]}
        />
      </Box>

      {isEmojiPickerVisible && (
        <Box
          sx={{ position: "absolute", top: "75px", zIndex: 10 }}
          ref={emojiPickerRef}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                emoji.native
              );
              onEditorStateChange(
                EditorState.push(editorState, contentState, "insert-characters")
              );

              setIsEmojiPickerVisible(false);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RichTextEditor;
