import { Box, Button, Card, Container, Grid, IconButton, InputAdornment, List, ListItem, Modal, Skeleton, TextField, Tooltip, Typography, lighten, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BsFillSendFill, BsPaperclip } from 'react-icons/bs';
import { FaEllipsisH, FaFolder } from 'react-icons/fa';

import CardHeaderDropdown from '@/components/atoms/CardHeaderDropdown';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import SeoHead from '@/components/atoms/SeoHead';
import { AnimatedBox } from '@/components/boxes/AnimatedBox';
import BeaconBubble from '@/components/guide-tour/bubble';
import GuideTour from '@/components/guide-tour/guide-tour';
import { INSIGHTS_TOUR_STEPS } from '@/components/guide-tour/tour-steps/insight-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import Spinner from '@/components/loaders/Spinner';
import { SingleMessage } from '@/components/messages/SingleMessage';
import DeleteModal from '@/components/modals/DeleteModal';
import { isFeatureLocked } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useAiMessageHook } from '@/hooks/uri-assistant/aiMessage.hook';
import { useUriAssistantThreadHook } from '@/hooks/uri-assistant/uriAssistantThreads.hook';
import { AiMessageDto } from '@/models/dtos/AiMessageDto';
import { CreateAiThreadDto } from '@/models/dtos/AiThreadDto';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { AiOutlinePlus } from 'react-icons/ai';
import { CiCamera } from 'react-icons/ci';
import { HiHashtag } from 'react-icons/hi';
import { LuPaintbrush } from 'react-icons/lu';
import { RiChatOffFill } from 'react-icons/ri';

const chatButton = [
  {
    text: AiAssistantThreadTypeEnum.KEYWORD_TRACKING_INSIGHTS,
    icon: HeartRateSearch,
    disabled: true,
    tooltipMessage: 'Coming Soon',
  },
  {
    text: AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS,
    icon: ChartLine,
  },
  {
    text: AiAssistantThreadTypeEnum.HASHTAG_TRACKING_INSIGHTS,
    icon: HiHashtag,
  },
  {
    text: AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS,
    icon: FaFolder,
  },
];

const UriAssistant = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const {
    createThread,
    getThreadByFilters,
    deleteThread,
    openDeleteModal,
    setOpenDeleteModal,
    selectedThreadId,
    setSelectedThreadId,
    createNewThreadModalOpen,
    setCreateNewThreadModalOpen,
    loadingIndex,
    setLoadingIndex,
  } = useUriAssistantThreadHook();

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { createMessage, messages, isLoading, message, setMessage, clearMessages, saveChatHistory, chatHistory } = useAiMessageHook(selectedThreadId ?? '');

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, messages]);

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: INSIGHTS_TOUR_STEPS,
    tourKey: 'hasSeenInsightsTour',
  });

  const selectedThread = getThreadByFilters.data?.data?.find((thread: any) => thread.thread_id === selectedThreadId);

  const threadDescriptions = {
    [AiAssistantThreadTypeEnum.KEYWORD_TRACKING_INSIGHTS]: 'Ask questions regarding any keyword',
    [AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS]: 'Ask questions regarding content management',
    [AiAssistantThreadTypeEnum.HASHTAG_TRACKING_INSIGHTS]: 'Ask questions regarding any hashtag',
    [AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS]: 'Ask questions regarding any account',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = message.trim();
    const newMessage = {
      role: 'user',
      content: [{ text: { value: userMessage }, type: 'text' }],
    };

    saveChatHistory([...chatHistory, { ...newMessage, content: newMessage.content[0].text.value }]);

    messages?.push(newMessage as AiMessageDto);
    setMessage('');

    createMessage.mutate({
      thread_id: selectedThreadId ?? '',
      message: userMessage,
    });
  };

  const handleDeleteChat = () => {
    deleteThread.mutate(selectedThreadId ?? '');
    setOpenDeleteModal(false);
  };

  const renderChatHistory = () => {
    if (isLoading && !chatHistory) {
      return Array.from({ length: 5 }).map((_, index) => (
        <AnimatedBox
          key={index}
          sx={{
            mb: '24px',
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end',
            gap: 1,
          }}
        >
          <Skeleton variant="rectangular" width="150px" height="40px" animation="wave" sx={{ borderRadius: '10px' }} />
        </AnimatedBox>
      ));
    }

    if (chatHistory && chatHistory.length > 0) {
      return (
        <List sx={{ fontSize: '0.775rem' }}>
          {chatHistory.map((msg, index) => (
            <SingleMessage key={index} msg={msg} maxWidth={{ xs: 'calc(80vw)', sm: '500px' }} />
          ))}
        </List>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <RiChatOffFill size={100} color="#B3B3B3" />
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#B3B3B3',
            textAlign: 'center',
          }}
        >
          No Message available
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <SeoHead title="AI Insight Assistant" />
      <DashboardLayout>
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
        <AnimatedBox>
          <Container
            maxWidth="xl"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: 2,
            }}
          >
            {isFeatureLocked(featureLimit, 'aiMessage') ? (
              <FeatureLimitLock />
            ) : (
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Chat Area */}
                <Grid item xs={8}>
                  <Card
                    sx={{
                      height: 'calc(100vh - 200px)',
                      minHeight: '580px',
                      display: 'flex',
                      flexDirection: 'column',
                      elevation: 0,
                      boxShadow: '-1px -1px 10px 2px rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                    }}
                  >
                    {selectedThreadId ? (
                      <>
                        {/* Header */}
                        <Box
                          sx={{
                            borderBottom: '1px solid #A7A7A780',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 32px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {/* Bot Image */}
                            <Box
                              sx={{
                                borderRadius: '50%',
                                border: '6px solid #CD1B7878',
                                width: isMobile ? '50px' : '70px',
                                height: isMobile ? '50px' : '69.4px',
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor: '#CD1B78',
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  alt="uri-assistant"
                                  src="/assets/images/bot.png"
                                  style={{
                                    width: '36px',
                                    height: '28px',
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  color: '#4B4B4B',
                                  fontSize: '24px',
                                  fontWeight: 600,
                                }}
                              >
                                {selectedThread ? TextHelper.capitalize(selectedThread.thread_type) : 'Keyword Tracking'}
                              </Typography>
                              <Typography
                                sx={{
                                  color: '#626262',
                                  fontSize: '16px',
                                  fontWeight: 600,
                                }}
                              >
                                {selectedThread
                                  ? threadDescriptions[selectedThread.thread_type as keyof typeof threadDescriptions] || `Ask questions regarding ${selectedThread.thread_type.toLowerCase()}`
                                  : 'Ask questions regarding any keyword'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center',
                            }}
                          >
                            <IconButton onClick={() => setOpenDeleteModal(true)}>
                              {clearMessages.isLoading ? <Spinner size={24} color="#CD1B78" /> : <LuPaintbrush size={24} color="#CD1B78" />}
                            </IconButton>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                display: 'flex',
                                gap: 1,
                              }}
                              onClick={() => setCreateNewThreadModalOpen(true)}
                            >
                              <AiOutlinePlus /> <span>New Chat</span>
                            </Button>
                          </Box>
                        </Box>

                        <Box display="flex" flexDirection="column" bgcolor="#fff" border="1px solid #ccc" borderRadius="8px" height="100%" overflow="hidden">
                          <Box flexGrow={1} overflow="auto" mb={2} display="flex" flexDirection="column-reverse" px="26px" className="scroll">
                            <List
                              sx={{
                                fontSize: '0.975rem' /* Adjust size as needed */,
                              }}
                            >
                              {renderChatHistory()}
                              <div ref={messagesEndRef} />
                            </List>
                          </Box>

                          {createMessage.isLoading && (
                            <Typography
                              sx={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#CD1B78',
                                textAlign: 'center',
                              }}
                            >
                              Dera is typing
                            </Typography>
                          )}
                        </Box>

                        {/* Input */}
                        <Box
                          component={'form'}
                          sx={{
                            display: 'flex',
                            gap: 1,
                            maxWidth: '775px',
                            margin: '0 auto',
                            width: '100%',
                            mt: '10px',
                            mb: '13px',
                            alignItems: 'center',
                            padding: '0 36px',
                          }}
                          onSubmit={handleSendMessage}
                        >
                          <TextField
                            placeholder="Type a message"
                            variant="outlined"
                            fullWidth
                            sx={{
                              backgroundColor: '#FFFFFF',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                              },
                            }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 1,
                                    }}
                                  >
                                    <IconButton>
                                      <BsPaperclip />
                                    </IconButton>
                                    <IconButton>
                                      <CiCamera />
                                    </IconButton>
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Box
                            component={'button'}
                            sx={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#CD1B78',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                              opacity: createMessage.isLoading ? 0.6 : 1,
                            }}
                            disabled={createMessage.isLoading}
                          >
                            <BsFillSendFill size={21} color="#fff" />
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <NoConversationSelected
                        startTour={startTour}
                        createAssistant={(data, onSuccessAction) =>
                          createThread.mutate({
                            data,
                            onSuccessAction: () => {
                              onSuccessAction?.();
                            },
                          })
                        }
                      />
                    )}
                  </Card>
                </Grid>

                {/* Conversation List */}
                <Grid item xs={4}>
                  <Card
                    sx={{
                      height: 'calc(100vh - 200px)',
                      minHeight: '580px',
                      overflowY: 'auto',
                      boxShadow: '-1px -1px 10px 2px rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                    }}
                    className="scroll"
                  >
                    <Box
                      sx={{
                        mt: '40px',
                        borderBottom: '1px solid #64616133',
                        padding: '0 16px',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '24px',
                          fontWeight: 600,
                          color: '#000000',
                          pb: '16px',
                        }}
                      >
                        Threads{' '}
                        <span
                          style={{
                            color: '#6D6C6C',
                          }}
                        >
                          ({getThreadByFilters.data?.total ?? 0})
                        </span>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: '18px',
                      }}
                    >
                      <TextField
                        placeholder="Search..."
                        variant="outlined"
                        fullWidth
                        sx={{
                          backgroundColor: '#F2F2F280',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <List
                      sx={{
                        px: '16px',
                        height: 'calc(100% - 200px)',
                      }}
                    >
                      {getThreadByFilters.isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <ListItem key={index}>
                            <Skeleton variant="rectangular" width="100%" height="40px" animation="wave" />
                          </ListItem>
                        ))
                      ) : (getThreadByFilters.data?.data ?? []).length > 0 ? (
                        getThreadByFilters?.data?.data?.map((message: any) => (
                          <ListItem
                            key={message.id}
                            onClick={() => {
                              setSelectedThreadId(message.thread_id);
                            }}
                            sx={{
                              border: '1px solid ',
                              borderRadius: '8px',
                              mb: '12px',
                              cursor: 'pointer',
                              borderColor: `${selectedThreadId === message.thread_id ? '#CD1B78' : '#B3B3B3CC'}`,
                              backgroundColor: `${selectedThreadId === message.thread_id ? lighten('#CD1B78', 0.95) : '#FFFFFF'}`,
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#202020',
                                  }}
                                >
                                  {message.messages?.[0]?.content?.[0].text}{' '}
                                </Typography>
                                <CardHeaderDropdown
                                  options={[
                                    {
                                      label: 'Delete',
                                      onClick: () => {
                                        setOpenDeleteModal(true);
                                        setSelectedThreadId(message.thread_id);
                                      },
                                    },
                                  ]}
                                  icon={<FaEllipsisH size={16} color="#000" />}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  color: '#000000',
                                }}
                              >
                                {TextHelper.capitalize(message.thread_type)}
                              </Typography>
                            </Box>
                          </ListItem>
                        ))
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            gap: 2,
                          }}
                        >
                          <RiChatOffFill size={100} color="#B3B3B3" />
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#B3B3B3',
                              textAlign: 'center',
                            }}
                          >
                            No threads available
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Container>
        </AnimatedBox>
      </DashboardLayout>

      {/* Delete Modal */}
      <DeleteModal
        handleClose={() => setOpenDeleteModal(false)}
        open={openDeleteModal}
        handleDelete={handleDeleteChat}
        isLoading={deleteThread.isLoading}
        message="Are you sure you want to delete this thread?"
      />

      {/* Create a New Tread Type */}
      <Modal open={createNewThreadModalOpen} onClose={() => setCreateNewThreadModalOpen(false)} aria-labelledby="thread-type-modal">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 700,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Select a Thread Type</Typography>
            <IconButton onClick={() => setCreateNewThreadModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid
            container
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              mt: 4,
            }}
            rowSpacing={2}
            columnSpacing={2}
          >
            {chatButton.map((button, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Tooltip title={button.tooltipMessage} placement="top" disableHoverListener={isMobile} disableFocusListener={isMobile} disableTouchListener={false}>
                  <Box
                    component={'button'}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px',
                      padding: isMobile ? '6px 8px' : '12px 16px',
                      cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                      border: '1px solid #CD1B78B2',
                      gap: 1,
                      width: '100%',
                      opacity: button.disabled ? 0.4 : loadingIndex === index ? 0.6 : 1,
                    }}
                    onClick={() => {
                      if (button.disabled) return;
                      setLoadingIndex(index);

                      createThread.mutate({
                        data: {
                          thread_type: button.text,
                          request_body: {},
                        },
                        onSuccessAction: () => {
                          setLoadingIndex(null);
                          setCreateNewThreadModalOpen(false);
                        },
                      });
                    }}
                    disabled={loadingIndex === index}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#CD1B78',
                        borderRadius: '8px',
                        padding: isMobile ? '8px' : '10px',
                      }}
                    >
                      {loadingIndex === index ? (
                        <Spinner size={20} color="#fff" />
                      ) : (
                        <button.icon
                          style={{
                            width: '20px',
                            height: '20px',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#292929',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '18px',
                      }}
                    >
                      {TextHelper.capitalize(button.text)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default UriAssistant;

type NoConversationSelectedProps = {
  createAssistant: (data: Partial<CreateAiThreadDto>, onSuccessfulCreate?: () => void) => void;
  startTour?: () => void;
};

const NoConversationSelected = ({ createAssistant, startTour }: NoConversationSelectedProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        px: 2,
      }}
    >
      {/* Bot Image */}
      <Box
        sx={{
          borderRadius: '50%',
          border: '8px solid #CD1B7878',
          width: isMobile ? '120px' : '154px',
          height: isMobile ? '120px' : '154px',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#CD1B78',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/assets/images/bot.png"
            style={{
              width: isMobile ? '90px' : '118px',
              height: isMobile ? '65px' : '88px',
            }}
            alt="bot image"
          />
        </Box>
      </Box>

      {/* Text */}
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          textAlign: 'center',
          color: '#292929',
          fontWeight: 700,
          fontSize: isMobile ? '24px' : '36px',
        }}
      >
        Your Insight Assistant
        {startTour && <BeaconBubble onClick={startTour} />}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: '#292929',
          fontWeight: 500,
          fontSize: isMobile ? '16px' : '24px',
          px: 2,
        }}
      >
        Ask any questions related to what you are tracking.
      </Typography>

      {/* Chat Buttons */}
      <Grid
        container
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          mt: 4,
        }}
        rowSpacing={2}
        columnSpacing={2}
        className="tour-insight-features"
      >
        {chatButton.map((button, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Tooltip
              title={button.tooltipMessage}
              disableHoverListener={isMobile} // Disables hover on mobile
              disableFocusListener={isMobile} // Optional: Disable focus trigger
              disableTouchListener={false}
            >
              <Box
                component={'button'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '10px',
                  padding: isMobile ? '6px 8px' : '12px 16px',
                  cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                  border: '1px solid #CD1B78B2',
                  gap: 1,
                  width: '100%',
                  opacity: button.disabled ? 0.4 : loadingIndex === index ? 0.6 : 1,
                }}
                onClick={() => {
                  if (button.disabled) return;
                  setLoadingIndex(index);

                  createAssistant(
                    {
                      thread_type: button.text,
                      request_body: {},
                    },
                    () => setLoadingIndex(null)
                  );
                }}
                disabled={loadingIndex === index}
              >
                <Box
                  sx={{
                    backgroundColor: '#CD1B78',
                    borderRadius: '8px',
                    padding: isMobile ? '8px' : '10px',
                  }}
                >
                  {loadingIndex === index ? (
                    <Spinner size={20} color="#fff" />
                  ) : (
                    <button.icon
                      style={{
                        width: '20px',
                        height: '20px',
                        color: 'white',
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#292929',
                    fontWeight: 500,
                    fontSize: isMobile ? '14px' : '18px',
                  }}
                >
                  {TextHelper.capitalize(button.text)}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
