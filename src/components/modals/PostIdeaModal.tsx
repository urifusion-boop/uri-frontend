import { Box, Button, FormControl, Input, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { ContentState, EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import ChatBot from '@/components/atoms/chatbot/ChatBot';
import ImageUpload from '@/components/editor/ImageUpload';
import { TasksManagerType } from '@/data/schemas/TasksManagerSchema';
import { TextHelper } from '@/helpers/TextHelper';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import { TaskMangerStatusEnum } from '@/models/enum-models/TaskManagerEnum';
import { BiX } from 'react-icons/bi';
import { FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { ErrorText } from '../atoms/CustomText';
import RichTextEditor from '../editor/RichTextEditor';
import Spinner from '../loaders/Spinner';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  height: '80%',
  maxHeight: '700px',
};

interface PostIdeaModalProps {
  open: boolean;
  toggleModal: () => void;
  primaryAction: () => void;
  secondaryAction: (task?: any) => void;
  primaryLoading?: boolean;
  secondaryLoading?: boolean;
  methods: UseFormReturn<TasksManagerType>;
}

const PostIdeaModal = ({ open, primaryAction, secondaryAction, toggleModal, primaryLoading, secondaryLoading, methods }: PostIdeaModalProps) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [openSocialModal, setOpenSocialMediaModal] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText('')));

  const [, setImages] = useState<string[]>();

  const [socialMedia, setSocialMedia] = useState<SocialMediaEnum | null>(null);

  const tasksStatus = [
    { label: 'To do', value: TaskMangerStatusEnum.TO_DO },
    { label: 'In Progress', value: TaskMangerStatusEnum.IN_PROGRESS },
    { label: 'Done', value: TaskMangerStatusEnum.DONE },
  ];

  const {
    register,
    control,
    formState: { errors },
    watch,
    getValues,
  } = methods;

  const taskId = watch('taskId');

  const extractContent = () => {
    const contentState = editorState?.getCurrentContent();
    return contentState?.getPlainText();
  };

  useEffect(() => {
    if (taskId) {
      const description = watch('description');

      setEditorState(EditorState.createWithContent(ContentState.createFromText(description || '')));
    } else {
      setEditorState(EditorState.createEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return (
    <Modal open={open} onClose={toggleModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div
        style={style as any}
        className={`flex  gap-2 relative max-w-[1000px] min-w-[800px]
        `}
      >
        <BiX className="absolute -top-4 -right-6 cursor-pointer text-white" onClick={toggleModal} size={24} />
        <div
          className={`bg-white ${openSocialModal ? 'h-[300px]' : ''} w-[55%] 
         p-4 basis-full mx-auto rounded-md max-h-[700px] overflow-y-auto scroll`}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">{taskId ? 'Edit Idea' : 'Create Idea'}</p>
            <FormControl
              style={{
                minWidth: 120,
                maxWidth: 150,
              }}
            >
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange} onBlur={onBlur} label="Status">
                    {tasksStatus.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.status && <ErrorText>{errors.status.message}</ErrorText>}
            </FormControl>
          </div>

          {openSocialModal && (
            <div>
              <div className="flex gap-3 mt-4">
                <FaSquareXTwitter
                  size={40}
                  className="cursor-pointer"
                  color={socialMedia === SocialMediaEnum.TWITTER ? '#cd1b78' : ''}
                  onClick={() => {
                    setSocialMedia(SocialMediaEnum.TWITTER);
                    setOpenSocialMediaModal(false);
                    setOpenPreview(true);
                  }}
                />
                <FaLinkedin
                  size={40}
                  className="cursor-pointer"
                  color={socialMedia === SocialMediaEnum.LINKEDIN ? '#cd1b78' : ''}
                  onClick={() => {
                    setSocialMedia(SocialMediaEnum.LINKEDIN);
                    setOpenSocialMediaModal(false);
                    setOpenPreview(true);
                  }}
                />
              </div>
              <Typography marginTop={6} textAlign={'center'} fontSize={14}>
                Select the social media platform you want to post to
              </Typography>
            </div>
          )}

          {!openSocialModal && (
            <div>
              <Input placeholder="Give your idea a title" className="w-full mt-4 font-semibold text-xl text-gray-500" {...register('title')} />
              {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
              <Box marginTop={2}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RichTextEditor
                      editorState={editorState}
                      onEditorStateChange={(editorState) => {
                        setEditorState(editorState);
                        onChange(extractContent());
                      }}
                    />
                  )}
                />
                {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
              </Box>

              <Controller
                name="attachments"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box
                    sx={{
                      mt: 2,
                    }}
                  >
                    <ImageUpload
                      onImageUpload={() => {}}
                      imagesUpdate={value}
                      onChange={(images) => {
                        onChange(images);
                        setImages(images.map((img) => TextHelper.setUrl(img.url)));
                      }}
                    />
                  </Box>
                )}
              />
              <div
                className="text-xs cursor-pointer border p-2 rounded-md w-fit"
                onClick={() => {
                  setOpenSidebar((t) => !t);
                  setOpenSocialMediaModal(false);
                  setOpenPreview(false);
                }}
              >
                Use Ai Assistant
              </div>
              <Box
                className="flex justify-end"
                sx={{
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  className="mt-4 mr-4"
                  onClick={() => {
                    if (!socialMedia) {
                      setOpenSocialMediaModal(true);
                    }

                    secondaryAction(getValues());
                  }}
                >
                  {secondaryLoading ? <Spinner color="#fff" size={20} /> : 'Create Post'}
                </Button>
                <Button onClick={() => primaryAction()} variant="contained" className="mt-4">
                  {primaryLoading ? <Spinner color="#fff" size={20} /> : 'Save'}
                </Button>
              </Box>
            </div>
          )}
        </div>

        {!openSocialModal && !openPreview && openSidebar && (
          <div className={`transition-all duration-300 rounded-md ease-in-out ${openSidebar ? 'w-[70%] opacity-100' : 'w-0 opacity-0 p-0'}`}>
            <ChatBot />
          </div>
        )}

        {/* {openPreview && (
          <div
            className={`transition-all duration-300 bg-white rounded-md ease-in-out ${
              openPreview
                ? "w-[70%] max-w-[70%] opacity-100"
                : "w-0 opacity-0 p-0"
            }`}
          >
            <Box
              display="flex"
              flexDirection="column"
              bgcolor="#F5F5F5"
              border="1px solid #ccc"
              height={"100%"}
              borderRadius="8px"
              padding="16px"
            >
              <Typography variant="h6" fontSize={16} fontWeight={700}>
                {socialMedia === SocialMediaEnum.TWITTER
                  ? "X / Twitter Preview"
                  : "LinkedIn Preview"}
              </Typography>

              <Box
                marginTop={2}
                maxWidth={"100%"}
                border={"1px solid #ccc"}
                borderRadius="8px"
                padding="16px"
              >
                <Box display={"flex"} gap={2}>
                  <Typography variant="h6" fontSize={14} fontWeight={700}>
                    Jennifer Awanyi on{" "}
                    {socialMedia === SocialMediaEnum.TWITTER
                      ? "Twitter"
                      : "Linkedin"}
                  </Typography>
                  <Typography variant="h6" fontSize={12} color="grey">
                    2h ago
                  </Typography>
                </Box>
                <Box marginTop={2}>
                  {socialMedia === SocialMediaEnum.LINKEDIN ? (
                    <Box marginTop={2}>
                      <textarea
                        disabled
                        style={previewTextAreaStyle}
                        value={
                          editorState
                            ? editorState.getCurrentContent().getPlainText()
                            : ""
                        }
                      ></textarea>
                      {images && <ImagePreviewGrid images={images} />}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        marginTop={2}
                        borderTop="1px solid #e0e0e0"
                        paddingTop={2}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "#0a66c2" },
                          }}
                        >
                          <ThumbUpAlt fontSize="small" />
                          <Typography fontSize={12}>Like</Typography>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "#0a66c2" },
                          }}
                        >
                          <Comment fontSize="small" />
                          <Typography fontSize={12}>Comment</Typography>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "#0a66c2" },
                          }}
                        >
                          <Repeat fontSize="small" />
                          <Typography fontSize={12}>Repost</Typography>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "#0a66c2" },
                          }}
                        >
                          <Share fontSize="small" />
                          <Typography fontSize={12}>Share</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <div>
                      <textarea
                        disabled
                        style={previewTextAreaStyle}
                        value={
                          editorState
                            ? `${editorState.getCurrentContent().getPlainText()} @jenniferawanyi`
                            : "@jenniferawanyi"
                        }
                      ></textarea>

                      {images && <ImagePreviewGrid images={images} />}
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
          </div>
        )} */}
      </div>
    </Modal>
  );
};

export default PostIdeaModal;
