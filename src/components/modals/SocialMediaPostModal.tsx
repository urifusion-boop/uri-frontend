import ImageUpload from '@/components/editor/ImageUpload';
import { contentTypeArray } from '@/data/contentMangement';
import { PostType, SocialMediaPostType } from '@/data/schemas/SocialMediaPostSchema';
import { DateHelper } from '@/helpers/DateHelper';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { ContentTypeEnum } from '@/models/enum-models/ContentTypeEnum';
import { PostStatusEnum } from '@/models/enum-models/PostStatusEnum';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Modal, Radio, Select, TextField, Tooltip, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ContentState, EditorState } from 'draft-js';
import { useEffect, useMemo, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { CgTrashEmpty } from 'react-icons/cg';
import { IoPerson } from 'react-icons/io5';
import { ErrorText } from '../atoms/CustomText';
import PlatformIcon from '../atoms/PlatformIcons';
import ContentManagementChatBot from '../content-creation/ContentManagementChatBot';
import RichTextEditor from '../editor/RichTextEditor';
import Spinner from '../loaders/Spinner';
import SocialMediaPreviewContainer from '../preview/SocialMediaPreviewContainer';

dayjs.extend(utc);

// Modal styling
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  height: '80%',
  maxHeight: '700px',
};

// Props interface for the modal
interface SocialMediaPostModalProps {
  open: boolean; // Controls modal visibility
  toggleModal: () => void; // Function to toggle modal
  primaryAction: (closeModal?: () => void) => void; // Primary action handler
  primaryLoading?: boolean; // Loading state for primary action
  methods: UseFormReturn<SocialMediaPostType>; // Form methods from react-hook-form
  onDeletePost?: (post_id: string) => void; // Optional delete post handler
  connectedAccounts: InfluencerDto[]; // List of connected influencer accounts
}

// Main component for the social media post modal
const SocialMediaPostModal = ({ open, primaryAction, toggleModal, primaryLoading, methods, onDeletePost, connectedAccounts }: SocialMediaPostModalProps) => {
  // State variables for managing modal behavior and data
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<
    {
      platform: string;
      username: string;
      socialUserId: string;
      influencerId: string;
    }[]
  >([]);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [step, setStep] = useState(0); // Tracks the current step in the modal
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(selectedPost?.content ?? '')));
  const [customizeForPlatform, setCustomizeForPlatform] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  // Destructure methods from react-hook-form
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = methods;

  const isPostPublished = selectedPost?.status === PostStatusEnum.PUBLISHED;

  // Function to render post types for Instagram
  const renderPostTypes = () => {
    const selectedPlatformPostType = contentTypeArray[selectedPost?.platformDetails?.platform as keyof typeof contentTypeArray]
      ? contentTypeArray[selectedPost?.platformDetails?.platform as keyof typeof contentTypeArray]
      : [];

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Post Type
        </Typography>
        <FormGroup row sx={{ gap: 2 }}>
          {selectedPlatformPostType.map((postType) => (
            <FormControlLabel
              key={postType.value}
              control={
                <Radio
                  checked={postType.value === selectedPost?.post_type}
                  value={postType.value}
                  disabled={isPostPublished}
                  onChange={(e) => {
                    setSelectedPost((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        post_type: e.target.value,
                      };
                    });
                    clearErrors();
                  }}
                />
              }
              label={postType.label}
            />
          ))}
        </FormGroup>
      </Box>
    );
  };

  // Function to close the modal and reset state
  const closeModal = () => {
    setSelectedPost((prev) => (prev = null));
    setStep(0);
    toggleModal();
    setSelectedPlatform([]);
    setCustomizeForPlatform(false);
  };

  // Function to handle platform selection for influencers
  const handlePlatformSelection = (influencer: InfluencerDto, onChange: (...event: any) => void) => {
    setSelectedPlatform((prev) => {
      const isAlreadySelected = prev.some((item) => item.platform === influencer.social_platform && item.username === influencer.social_name);

      // Add or remove the selected platform
      const updatedPlatforms = isAlreadySelected
        ? prev.filter((item) => !(item.platform === influencer.social_platform && (item.username === influencer.social_name || item.socialUserId === influencer.social_user_id)))
        : [
            ...prev,
            {
              platform: influencer.social_platform ?? '',
              username: influencer.social_name ?? '',
              socialUserId: influencer.social_user_id ?? '',
              influencerId: influencer.influencer_id ?? '',
            },
          ];

      const values = getValues('posts') || [];

      // Add or remove related posts
      const updatedPosts = isAlreadySelected
        ? values.filter((post) => !(post.platformDetails.platform === influencer.social_platform && post.platformDetails.username === influencer.social_name))
        : [
            ...values,
            {
              platformDetails: {
                platform: influencer.social_platform ?? '',
                username: influencer.social_name ?? '',
              },
              content: selectedPost?.content ?? '',
              media: selectedPost?.media ?? [],
              post_type: selectedPost?.post_type ?? '',
              start_date: selectedPost?.start_date ?? '',
              start_time: selectedPost?.start_time ?? '',
              socialUserId: influencer.social_user_id ?? '',
              post_id: selectedPost?.post_id ?? '',
              influencerId: influencer.influencer_id ?? '',
            },
          ];

      // Update the form posts
      onChange(updatedPosts);

      if (updatedPlatforms.length === 0) {
        setStep(0);
        setCustomizeForPlatform(false);
      } else {
        setStep(1);
      }

      clearErrors();

      return updatedPlatforms;
    });
  };

  const platformKey = `${selectedPost?.platformDetails?.platform ?? ''}${selectedPost?.platformDetails?.username ?? ''}`;

  // Effect to update posts when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      const currentPosts = getValues('posts') || [];

      const updatedPosts = customizeForPlatform
        ? currentPosts.map((post) =>
            post?.platformDetails?.platform === selectedPost?.platformDetails?.platform && post?.platformDetails?.username === selectedPost?.platformDetails?.username ? selectedPost : post
          )
        : selectedPlatform.map((platform) => ({
            platformDetails: {
              platform: platform.platform,
              username: platform.username,
            },
            content: selectedPost.content,
            media: selectedPost.media,
            post_type: selectedPost.post_type,
            start_date: selectedPost.start_date,
            start_time: selectedPost.start_time,
            socialUserId: platform.socialUserId,
            post_id: selectedPost.post_id,
            influencerId: platform.influencerId,
          }));

      setValue('posts', updatedPosts);
    }
  }, [selectedPost]);

  // Effect to update editor state when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(selectedPost.content ?? '')));
    }
  }, [platformKey]);

  // Effect to set selected post on modal open
  useEffect(() => {
    const values = getValues();

    if (values?.posts?.length > 0) {
      setSelectedPost(values?.posts?.[0]);
      setStep(1);
      setSelectedPlatform([
        {
          platform: values?.posts?.[0]?.platformDetails?.platform ?? '',
          username: values?.posts?.[0]?.platformDetails?.username ?? '',
          socialUserId: values?.posts?.[0]?.socialUserId ?? '',
          influencerId: values?.posts?.[0]?.influencerId ?? '',
        },
      ]);
      setEditorState(EditorState.createWithContent(ContentState.createFromText(values.posts?.[0].content ?? '')));
    } else {
      setSelectedPost(null);
      setStep(0);
      setSelectedPlatform([]);
    }
  }, [open]);

  const accountDetail = useMemo(() => {
    return PlatformHelper?.getSocialUserDetailsByPlatform(connectedAccounts, selectedPost?.platformDetails?.platform?.toUpperCase() ?? '', selectedPost?.socialUserId);
  }, [connectedAccounts, selectedPost?.platformDetails?.platform, selectedPost?.socialUserId]);

  return (
    <Modal open={open} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div style={style as any} className={`flex gap-2 ${step === 0 ? 'max-w-[500px] min-w-[500px]' : 'max-w-[1000px] min-w-[800px]'} w-full max-h-[700px]`}>
        {openSidebar && (
          <BiX
            className="absolute -top-4 -right-6 cursor-pointer text-white"
            onClick={() => {
              setOpenSidebar((t) => !t);
              setOpenPreview(false);
            }}
            size={24}
          />
        )}

        <Controller
          name="posts"
          control={control}
          render={({ field: { value, onChange } }) => {
            const index = value?.findIndex(
              (post) => post?.platformDetails?.platform === selectedPost?.platformDetails?.platform && post?.platformDetails?.username === selectedPost?.platformDetails?.username
            );

            return (
              <div
                className={`bg-white p-4 mx-auto rounded-md overflow-y-auto
            ${step === 0 ? 'w-full' : 'w-[55%]'} scroll`}
              >
                {/* Heading */}
                <div className="flex items-center justify-between">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'column',
                    }}
                  >
                    <p className="font-semibold m-0">{selectedPost?.post_id ? 'Edit Social Media Post' : 'Create Social Media Post'}</p>
                    {!selectedPost?.post_id && (
                      <Tooltip title="This option cannot be changed once selected to ensure consistent post settings across platforms.">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.2,
                            justifyContent: '',
                          }}
                        >
                          <InputLabel
                            htmlFor="customize-for-platform"
                            sx={{
                              fontSize: '14px',
                            }}
                          >
                            I want different post for each platform
                          </InputLabel>
                          <Checkbox checked={customizeForPlatform} onChange={(e) => setCustomizeForPlatform(true)} color="primary" id="customize-for-platform" />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    {!selectedPost?.post_id && (
                      <Box>
                        <InputLabel htmlFor="platform-label">Select platform to preview</InputLabel>
                        <Select
                          labelId="platform-label"
                          value={`${selectedPost?.platformDetails?.username}-${selectedPost?.platformDetails?.platform}`}
                          onChange={(e) => {
                            const [username, platform] = e.target.value.split('-');
                            const selectedPostFromValue = value && value?.find((post) => post?.platformDetails?.platform === platform && post?.platformDetails?.username === username);

                            if (selectedPostFromValue) {
                              setSelectedPost(selectedPostFromValue);
                              setStep(1);
                            }

                            setEditorState(EditorState.createWithContent(ContentState.createFromText(selectedPost?.content ?? '')));

                            clearErrors('posts');
                          }}
                          sx={{
                            height: '40px',
                            '& .MuiInputBase-input': {
                              fontSize: '12px',
                              display: 'flex',
                              gap: 1,
                            },
                            minWidth: 120,
                            maxWidth: 300,
                            width: '100%',
                          }}
                        >
                          {selectedPlatform.map((platform) => (
                            <MenuItem
                              key={`${platform?.username}-${platform?.platform}`}
                              value={`${platform?.username}-${platform?.platform}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '12px',
                              }}
                            >
                              {platform?.username} <PlatformIcon platform={platform?.platform ?? ''} size={16} />
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}

                    {selectedPost?.post_id && (
                      <CgTrashEmpty
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePost && onDeletePost(selectedPost?.post_id ?? '');
                          closeModal();
                        }}
                      />
                    )}
                  </Box>
                </div>

                {/* Selected platform */}
                {!selectedPost?.post_id && (
                  <div className="flex items-center gap-4 overflow-x-auto w-full scroll">
                    {connectedAccounts.length > 0 &&
                      connectedAccounts.map((influencer) => {
                        const isSelected = selectedPlatform.some((item) => item?.platform === influencer?.social_platform && item?.username === influencer?.social_name);

                        return (
                          <Box
                            key={influencer?.influencer_id}
                            className={`filter hover:grayscale-0 transition duration-300 cursor-pointer ${isSelected ? 'grayscale-0' : 'grayscale relative'}`}
                            onClick={() => handlePlatformSelection(influencer, onChange)}
                            sx={{
                              flex: '0 0 auto', // Prevent shrinking
                              border: '3px solid',
                              borderColor: isSelected ? PlatformHelper.getPlatformColor(influencer?.social_platform ?? '') : 'transparent',
                              borderRadius: '50%',
                              p: 0.5,
                              my: 2,
                            }}
                          >
                            {influencer?.profile_pic && influencer?.profile_pic?.length > 0 ? (
                              <img src={influencer?.profile_pic} alt="profile" className="w-10 h-10 rounded-full object-cover" style={{ minWidth: '40px', minHeight: '40px' }} />
                            ) : (
                              <Box
                                sx={{
                                  cursor: 'pointer',
                                  p: 0.5,
                                  minWidth: '40px',
                                  minHeight: '40px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <IoPerson className="w-7 h-7" color="#000" />
                              </Box>
                            )}
                            <Box
                              sx={{
                                border: `1px solid ${PlatformHelper.getPlatformColor(influencer?.social_platform ?? '')}`,
                                borderRadius: '50%',
                                position: 'absolute',
                                padding: '2px',
                                right: '-10px',
                                bottom: '-10px',
                                backgroundColor: '#fff',
                              }}
                            >
                              <PlatformIcon platform={influencer?.social_platform ?? ''} size={16} />
                            </Box>
                          </Box>
                        );
                      })}
                  </div>
                )}

                {step === 0 && (
                  <Box
                    marginTop={2}
                    sx={{
                      height: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2">Select a Platform to create a post</Typography>
                  </Box>
                )}

                {step === 1 && (
                  <div>
                    {renderPostTypes()}
                    {errors?.posts?.[index]?.post_type?.message && (
                      <ErrorText color="red">{errors?.posts?.[index]?.post_type?.message}: Select &quot;I want different post for each platform&quot; to customize post for each platform.</ErrorText>
                    )}

                    <Box marginTop={2}>
                      <RichTextEditor
                        editorState={editorState}
                        onEditorStateChange={(newEditorState) => {
                          if (isPostPublished) return;

                          setEditorState(newEditorState);

                          const contentState = newEditorState.getCurrentContent();
                          const newContent = contentState.getPlainText();

                          // Update selected post content
                          setSelectedPost((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              content: newContent,
                            };
                          });

                          // Update form value
                          const currentPosts = getValues('posts') || [];
                          const updatedPosts = currentPosts.map((post) =>
                            post?.platformDetails?.platform === selectedPost?.platformDetails?.platform && post?.platformDetails?.username === selectedPost?.platformDetails?.username
                              ? { ...post, content: newContent }
                              : post
                          );

                          clearErrors('posts');

                          setValue('posts', updatedPosts);
                        }}
                      />
                      <ErrorText color="red">{errors?.posts?.[index]?.content?.message}</ErrorText>
                    </Box>

                    <Box marginTop={2}>
                      <ImageUpload
                        onImageUpload={() => {}}
                        imagesUpdate={selectedPost?.media}
                        disabled={isPostPublished}
                        onChange={(media) => {
                          if (isPostPublished) return;

                          setSelectedPost((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              media: media,
                            };
                          });

                          clearErrors('posts');
                        }}
                      />
                      {errors?.posts?.[index]?.media?.message && <ErrorText color="red">{errors?.posts?.[index]?.media?.message}</ErrorText>}
                    </Box>
                    <Box
                      component="button"
                      className="text-xs cursor-pointer border p-2 rounded-md w-fit"
                      onClick={() => {
                        setOpenSidebar((t) => !t);
                        setOpenPreview(false);
                      }}
                    >
                      Use Ai Assistant
                    </Box>

                    <Box
                      mt={'40px'}
                      flexDirection={{
                        xs: 'column',
                        sm: 'row',
                      }}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '20px',
                      }}
                    >
                      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="LL"
                            value={value ? dayjs(selectedPost?.start_date) : null}
                            disabled={isPostPublished}
                            onChange={(newValue) => {
                              if (isPostPublished) return;

                              setSelectedPost((prev) => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  start_date: dayjs(newValue).format('YYYY-MM-DD'),
                                };
                              });

                              clearErrors('posts');
                            }}
                            sx={{
                              input: { color: '#141416', width: '100%' },
                            }}
                            label="Publish Date"
                            disablePast
                          />
                        </LocalizationProvider>
                        {errors?.posts?.[index]?.start_date?.message && <ErrorText color="red">{errors?.posts?.[index]?.start_date?.message}</ErrorText>}
                      </Box>
                      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                              position: 'relative',
                            }}
                          >
                            {/* Custom Input Field for time */}
                            <Tooltip title="Select a time to publish the post preferably 15mins before and date and time are selected using UTC time zone">
                              <TextField value={selectedPost?.start_time ?? ''} onClick={() => setOpenTimePicker(true)} label="Publish Time" disabled={isPostPublished} />
                            </Tooltip>
                            {/* Time Picker Button */}
                            <TimePicker
                              open={openTimePicker}
                              onClose={() => setOpenTimePicker(false)}
                              value={selectedPost?.start_time ? dayjs(DateHelper.convertUtcToLocal(selectedPost.start_time)) : null}
                              disabled={isPostPublished}
                              minTime={dayjs(selectedPost?.start_date).isSame(dayjs(), 'day') ? dayjs() : null}
                              onChange={(newValue) => {
                                if (!newValue || isPostPublished) return;

                                const utcTime = newValue.utc().format('HH:mm:ss');

                                setSelectedPost((prev) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    start_time: utcTime,
                                  };
                                });

                                clearErrors('posts');
                              }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  visibility: 'hidden',
                                  position: 'absolute',
                                  inset: 0,
                                },
                              }}
                            />
                            {/* Custom Icon Button to trigger the Time Picker */}
                            <IconButton onClick={() => setOpenTimePicker(true)} disabled={isPostPublished}>
                              <AccessTimeIcon />
                            </IconButton>
                          </Box>
                        </LocalizationProvider>
                        {errors?.posts?.[index]?.start_time?.message && <ErrorText color="red">{errors?.posts?.[index]?.start_time?.message}</ErrorText>}
                      </Box>
                    </Box>
                    <Box className="flex justify-end" sx={{ gap: 1, marginTop: 4 }}>
                      <Button variant="outlined" disabled={primaryLoading || isPostPublished} onClick={closeModal}>
                        Close
                      </Button>

                      <Button
                        variant="contained"
                        disabled={primaryLoading || isPostPublished}
                        onClick={() => {
                          methods.handleSubmit((data) => primaryAction(closeModal))();
                        }}
                      >
                        {primaryLoading ? <Spinner color="#fff" size={20} /> : 'Save'}
                      </Button>
                    </Box>
                  </div>
                )}
              </div>
            );
          }}
        />
        {step === 1 && (
          <>
            {!openPreview && openSidebar && (
              <div className={`transition-all duration-300 rounded-md ease-in-out ${openSidebar ? 'w-[45%] opacity-100' : 'w-0 opacity-0 p-0'}`}>
                <ContentManagementChatBot />
              </div>
            )}

            {!openSidebar && (
              <div className={`transition-all duration-300 bg-white rounded-md ease-in-out  ${!openSidebar ? 'w-[45%] opacity-100' : 'w-0 opacity-0 p-0'}`}>
                <Box
                  display="flex"
                  flexDirection="column"
                  bgcolor="#F5F5F5"
                  border="1px solid #ccc"
                  height={'100%'}
                  borderRadius="8px"
                  padding="16px"
                  width={'100%'}
                  sx={{
                    overflowY: 'auto',
                  }}
                  className="scroll"
                >
                  <Typography variant="h6" fontSize={16} fontWeight={700} gutterBottom>
                    {TextHelper.capitalize(selectedPost?.platformDetails?.platform)} Preview
                  </Typography>

                  <SocialMediaPreviewContainer
                    platform={selectedPost?.platformDetails?.platform.toUpperCase() as SocialMediaEnum}
                    editorState={EditorState.createWithContent(ContentState.createFromText(selectedPost?.content ?? ''))}
                    attachments={selectedPost?.media ?? []}
                    username={accountDetail?.username ?? 'username'}
                    displayName={accountDetail?.display_name ?? 'display name'}
                    profileImage={accountDetail?.profile_pic ?? 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix'}
                    postType={selectedPost?.post_type as ContentTypeEnum}
                    selectedPostTypes={selectedPost?.post_type as ContentTypeEnum}
                  />
                </Box>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default SocialMediaPostModal;
