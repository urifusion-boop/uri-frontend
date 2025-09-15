import { Box, Button, Grid, InputLabel, MenuItem, Pagination, Select, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import CardHeaderDropdown from '@/components/atoms/CardHeaderDropdown';
import CustomTabs from '@/components/atoms/CustomTabs';
import EmptyState from '@/components/atoms/EmptyState';
import KanbanBoard from '@/components/atoms/KanbanBoard';
import PostCard from '@/components/atoms/PostCard';
import ContentCalendar from '@/components/content-creation/Calender';
import Layout from '@/components/content-creation/Layout';
import ConnectedPlatforms from '@/components/content-creation/Platforms';
import BeaconBubble from '@/components/guide-tour/bubble';
import GuideTour from '@/components/guide-tour/guide-tour';
import { CONTENT_TOUR_STEPS } from '@/components/guide-tour/tour-steps/content-management-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import ConnectSocialMediaModal from '@/components/modals/ConnectSocialMediaModal';
import DeleteModal from '@/components/modals/DeleteModal';
import PostIdeaModal from '@/components/modals/PostIdeaModal';
import SocialMediaPostModal from '@/components/modals/SocialMediaPostModal';
import { LightThemeColors } from '@/configs/colors.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useConnectedAccountsHook } from '@/hooks/content-management/connectedAccounts.hook';
import { useSocialMediaPostHook } from '@/hooks/content-management/socialMediaPost.hook';
import { useTaskManagerHook } from '@/hooks/content-management/taskManager.hook';
import { SocialMediaPostDto } from '@/models/dtos/SocialMediaPostDto';
import { TaskMangerDto } from '@/models/dtos/TaskManagerDto';
import { PostStatusEnum } from '@/models/enum-models/PostStatusEnum';
import { TaskMangerStatusEnum } from '@/models/enum-models/TaskManagerEnum';
import FolderIcon from '@mui/icons-material/Folder';
import dayjs from 'dayjs';
import { useQueryState } from 'nuqs';
import { SlotInfo } from 'react-big-calendar';
import { BsPlusLg } from 'react-icons/bs';
import { MdOutlinePostAdd } from 'react-icons/md';

interface Column {
  id: string;
  title: string;
  tasks?: TaskMangerDto[];
}

const CreateContent = () => {
  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'posts',
  });

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    steps: CONTENT_TOUR_STEPS,
    initialRun: true,
    tourKey: 'hasSeenContentTour',
  });

  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [initialColumnsState, setInitialColumnsState] = useState<Record<string, Column>>({});

  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    type: 'post' | 'task' | 'account' | null;
    onDelete: () => void;
  }>({
    isOpen: false,
    type: null,
    onDelete: () => {},
  });

  const toggleDeleteModal = () => setDeleteModalConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }));

  const isMobile = useMediaQuery('(max-width:800px)');

  const { isConnecting, getAuthUrlFunction, connectedAccounts, disconnectAccount, selectedPlatformForDisConnect, setSelectedPlatformForDisConnect } = useConnectedAccountsHook(
    toggleDeleteModal,
    process.env.NEXT_PUBLIC_CONTENT_MANAGEMENT_REDIRECT_URL
  );

  const {
    methods: taskMethods,
    isCreatingTask,
    onCreate,
    openIdeaModal,
    setOpenIdeaModal,
    isTasksLoading,
    deleteTask,
    isDeletingTask,
    setSelectedTask,
    toDoTaskHook,
    editTask,
  } = useTaskManagerHook(toggleDeleteModal);

  const {
    methods: postMethods,
    isCreatingOrEditingPost,
    onCreateOrEdit: onPostCreateOrEdit,
    openPostModal,
    setOpenPostModal,
    socialMediaPosts,
    isPostsLoading,
    page,
    setPage,
    deletePost,
    isDeletingPost,
    setSelectedPostId,
    setPostStatus,
    postStatus,
  } = useSocialMediaPostHook(toggleDeleteModal);

  const handleNewIdea = (status: string) => {
    setOpenIdeaModal(!openIdeaModal);
    taskMethods.reset({ status });
  };

  const handleNewPost = (task?: any) => {
    setOpenPostModal(!openPostModal);
    postMethods.reset({
      posts: [
        {
          start_date: dayjs().format(),
          platformDetails: {
            platform: connectedAccounts?.[0]?.social_platform ?? '',
            username: connectedAccounts?.[0]?.social_name ?? '',
          },
          socialUserId: connectedAccounts?.[0]?.social_user_id ?? '',
          content: task?.description ?? '',
          media: task?.attachments ?? [],
          influencerId: connectedAccounts?.[0]?.influencer_id ?? '',
        },
      ],
    });
  };

  const tabs = ['posts', 'scheduled', 'ideas', 'platforms'];

  const onTaskSelected = (task: TaskMangerDto) => {
    taskMethods.reset({
      ...task,
      status: task.status,
    });
    setOpenIdeaModal(true);
  };

  const onPostSelected = (post: SocialMediaPostDto) => {
    postMethods.reset({
      posts: [
        {
          ...post,
          start_time: post.start_time,
          post_url: post.post_url ?? '',
          content: post.content,
          media: post?.media?.map((media) => ({
            url: media.url,
            docName: media.alt_text,
            docType: media.media_type,
            publicId: media.alt_text,
          })),
          platformDetails: {
            platform: post.platform,
            username: '',
          },
          socialUserId: post.social_user_id,
          post_id: post.post_id,
          start_date: post.start_date,
          influencerId: post.influencer_id,
          status: post.status,
          post_type: post.post_type,
        },
      ],
    });

    setOpenPostModal(true);
  };

  function getPastDate(daysAgo: number) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  const handleDeleteTrigger = (type: 'post' | 'task' | 'account') => {
    setDeleteModalConfig({
      isOpen: true,
      type,
      onDelete: () => {
        switch (type) {
          case 'post':
            return deletePost();
          case 'task':
            return deleteTask();
          case 'account':
            return disconnectAccount.mutate();
          default:
            return;
        }
      },
    });
  };

  const getPaginationFunction = (status: string) => {
    switch (status) {
      case TaskMangerStatusEnum.TO_DO:
        return {
          fetchNextPage: toDoTaskHook?.fetchNextPage,
          hasNextPage: toDoTaskHook?.hasNextPage,
          isFetchingNextPage: toDoTaskHook?.isFetchingNextPage,
          isLoading: toDoTaskHook?.isLoading,
        };
      default:
        return null;
    }
  };

  const todoTasks = useMemo(() => toDoTaskHook?.data?.pages.flatMap((page: any) => page?.data) ?? [], [toDoTaskHook?.data?.pages]);

  const allTasks = useMemo(() => [...todoTasks], [todoTasks]);

  useEffect(() => {
    const columns: Record<string, Column> = {
      [TaskMangerStatusEnum.TO_DO]: {
        id: TaskMangerStatusEnum.TO_DO,
        title: 'To Do',
        tasks: [],
      },
      [TaskMangerStatusEnum.IN_PROGRESS]: {
        id: TaskMangerStatusEnum.IN_PROGRESS,
        title: 'In Progress',
        tasks: [],
      },
      [TaskMangerStatusEnum.DONE]: {
        id: TaskMangerStatusEnum.DONE,
        title: 'Done',
        tasks: [],
      },
    };

    allTasks.forEach((task) => {
      if (!task?.status) return;

      if (!columns[task.status]) {
        columns[task.status] = {
          id: task.status,
          title: task.status,
          tasks: [],
        };
      }

      (columns[task.status].tasks ?? []).push(task);
    });

    // ✅ Only update state if columns actually changed
    setInitialColumnsState((prevState) => {
      const prevColumnsString = JSON.stringify(prevState);
      const newColumnsString = JSON.stringify(columns);

      return prevColumnsString === newColumnsString ? prevState : columns;
    });
  }, [allTasks]);

  return (
    <>
      <Layout>
        {/* Main */}
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />

        <Box p={3}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              mb: 4,
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
            }}
          >
            <Box display="flex" alignItems={isMobile ? 'flex-start' : 'center'} flexDirection={isMobile ? 'column' : 'row'} gap={3}>
              <Typography
                fontWeight="bold"
                display="flex"
                alignItems="center"
                sx={{
                  whiteSpace: 'nowrap',
                }}
                fontSize={isMobile ? 22 : 30}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    mr: 2,
                    height: 45,
                    width: 45,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FolderIcon sx={{ color: '#fff', fontSize: '25px' }} />
                </Box>
                Content Management
                {startTour && <BeaconBubble onClick={startTour} />}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <CardHeaderDropdown
                options={[
                  {
                    label: 'New Idea',
                    onClick: () => handleNewIdea(TaskMangerStatusEnum.TO_DO),
                  },
                  {
                    label: 'New Post',
                    onClick: () => handleNewPost(),
                  },
                ]}
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: LightThemeColors.uriColor,
                      color: '#fff',
                      padding: '6px 16px',
                      cursor: 'pointer',
                      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                      borderRadius: '4px',
                    }}
                    className="tour-content-new-btn"
                  >
                    <BsPlusLg />
                    <Typography variant="button" fontWeight="bold">
                      New
                    </Typography>
                  </Box>
                }
              />
              <Button
                variant="contained"
                className="tour-content-connect-btn"
                color="primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
                onClick={() => setOpenConnectModal(true)}
              >
                <BsPlusLg />
                <Typography variant="button" fontWeight="bold">
                  Connect Platform
                </Typography>
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} tourKey="tour-content" />

          {activeTab === 'posts' && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  mb: 2,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <InputLabel
                  htmlFor="platform-label"
                  sx={{
                    fontSize: '12px',
                  }}
                >
                  Post Status
                </InputLabel>
                <Select
                  labelId="post-status"
                  value={postStatus}
                  onChange={(e) => {
                    setPostStatus(e.target.value as PostStatusEnum);
                  }}
                  sx={{
                    height: '40px',
                    '& .MuiInputBase-input': {
                      fontSize: '12px',
                      display: 'flex',
                      gap: 1,
                    },
                    width: '120px',
                  }}
                >
                  {Object.values(PostStatusEnum).map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '12px',
                      }}
                    >
                      {TextHelper.capitalize(status)}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {isPostsLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Skeleton variant="rectangular" height={200} animation="wave" />
                    </Grid>
                  ))}
                </Grid>
              ) : socialMediaPosts?.data && socialMediaPosts?.data.length > 0 ? (
                <Box>
                  <Grid container spacing={3}>
                    {socialMediaPosts?.data?.map((post) => (
                      <Grid item xs={12} sm={6} md={4} key={post.post_id}>
                        <PostCard post={post} handlePostSelect={onPostSelected} influencerData={connectedAccounts ?? []} />
                      </Grid>
                    ))}
                  </Grid>
                  <Pagination
                    count={Math.ceil(Number(socialMediaPosts?.total ?? 1) / 10)}
                    shape="rounded"
                    size="small"
                    className="mx-6 my-4 flex justify-center mt-14"
                    page={Number(page)}
                    onChange={(event, pageNumber) => setPage(pageNumber)}
                  />
                </Box>
              ) : (
                <EmptyState
                  actionRequired
                  onAction={handleNewPost}
                  buttonText="Create your first post"
                  heading="No Posts Yet"
                  subtitle="Start by creating your first post!"
                  icon={<MdOutlinePostAdd size={150} color="#cd1b78" />}
                />
              )}
            </>
          )}

          {activeTab === 'ideas' && (
            <KanbanBoard
              columns={initialColumnsState}
              setColumns={setInitialColumnsState}
              handleNewIdea={handleNewIdea}
              loading={isTasksLoading}
              onTaskSelected={onTaskSelected}
              onDragEndFn={(task) => editTask(task)}
              onDeleteTask={(taskId) => {
                handleDeleteTrigger('task');
                setSelectedTask(taskId);
              }}
              getPaginationFunction={getPaginationFunction}
            />
          )}

          {activeTab === 'scheduled' && (
            <ContentCalendar
              events={socialMediaPosts?.data?.map((post) => ({
                title: post.content,
                start: new Date(post?.start_date ?? ''),
                end: new Date(post?.start_date ?? ''),
                resource: {
                  ...post,
                },
              }))}
              onSelectSlot={(slotInfo: SlotInfo) => {
                if (slotInfo.start < getPastDate(0)) {
                  return;
                }

                postMethods.reset({
                  posts: [
                    {
                      start_date: slotInfo.start.toISOString(),
                      platformDetails: {
                        platform: connectedAccounts?.[0]?.social_platform ?? '',
                        username: connectedAccounts?.[0]?.social_name ?? '',
                      },
                      socialUserId: connectedAccounts?.[0]?.social_user_id ?? '',
                    },
                  ],
                });
                setOpenPostModal(true);
              }}
              onSelectEvent={(events) => {
                onPostSelected(events.resource as SocialMediaPostDto);
              }}
            />
          )}

          {activeTab === 'platforms' && (
            <ConnectedPlatforms
              disconnect={(influencerId, platform) => {
                handleDeleteTrigger('account');
                setSelectedPlatformForDisConnect({
                  influencerId: influencerId ?? '',
                  platform: platform ?? '',
                });
              }}
              connectedAccounts={connectedAccounts ?? []}
            />
          )}
        </Box>
      </Layout>

      {/* Connect Platform Modal */}
      <ConnectSocialMediaModal
        connectedAccounts={connectedAccounts ?? []}
        handleClose={() => setOpenConnectModal(false)}
        open={openConnectModal}
        handleConnect={(platform, username) => getAuthUrlFunction(platform, username)}
        isConnecting={isConnecting}
      />

      {/* Idea Modal */}
      <PostIdeaModal
        open={openIdeaModal}
        toggleModal={() => setOpenIdeaModal(!openIdeaModal)}
        primaryAction={onCreate}
        secondaryAction={(task) => {
          setOpenIdeaModal(false);
          setOpenPostModal(true);
          handleNewPost(task);
        }}
        primaryLoading={isCreatingTask}
        methods={taskMethods}
      />

      {/* Social Media Post Modal */}
      <SocialMediaPostModal
        open={openPostModal}
        toggleModal={() => setOpenPostModal(!openPostModal)}
        primaryAction={(closeModal) => onPostCreateOrEdit(closeModal)}
        primaryLoading={isCreatingOrEditingPost}
        methods={postMethods}
        onDeletePost={(postId) => {
          handleDeleteTrigger('post');
          setSelectedPostId(postId);
          setOpenPostModal(false);
        }}
        connectedAccounts={connectedAccounts ?? []}
      />

      {/* Delete Modal */}
      <DeleteModal
        handleClose={() => setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }))}
        open={deleteModalConfig.isOpen}
        handleDelete={deleteModalConfig.onDelete}
        message={`Are you sure you want to delete this ${deleteModalConfig.type === 'account' ? TextHelper.capitalize(selectedPlatformForDisConnect.platform) : ''} ${deleteModalConfig.type}?`}
        isLoading={isDeletingPost || isDeletingTask || disconnectAccount.isLoading}
      />
    </>
  );
};

export default CreateContent;
