import { Avatar, Box, Collapse, Typography } from '@mui/material';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

import { TextHelper } from '@/helpers/TextHelper';
import { useState } from 'react';
import PlatformIcon from '../atoms/PlatformIcons';
import AlertList from '../features/alert/AlertList';
import InboxFilters from '../features/alert/InboxFilters';

const ChatsTab = () => {
  const accountConnected = true;
  return <>{accountConnected ? <AccountConnected /> : <NoAccountConnected />}</>;
};

export default ChatsTab;

const NoAccountConnected = () => {
  const platforms = ['instagram', 'facebook', 'twitter', 'linkedin'];

  return (
    <Box
      sx={{
        px: '20px',
        backgroundColor: '#FAFAFA',
        height: '100%',
        py: '40px',
      }}
    >
      <Box
        sx={{
          boxShadow: '-1px -1px 8px 3px #0000000D',
          borderRadius: '10px',
          py: '123px',
          maxWidth: '840px',
          mx: 'auto',
          px: '20px',
          backgroundColor: '#fff',
        }}
      >
        <Typography
          sx={{
            fontSize: 'clamp(1.75rem, 1.6464rem + 0.442vw, 2rem)',
            fontWeight: 600,
            color: '#262626',
            maxWidth: '600px',
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          Link Your Account to Chat with Leads
        </Typography>
        <Typography
          sx={{
            fontSize: 'clamp(1.125rem, 1.0732rem + 0.221vw, 1.25rem)',
            fontWeight: 600,
            color: '#4B4B4B',
            maxWidth: '650px',
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          To start messaging your leads, please connect your social media accounts
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            justifyContent: 'center',
            gap: '20px',
            mt: '40px',
            px: '16px',
          }}
        >
          {platforms.map((platform) => (
            <Box
              component="button"
              key={platform}
              sx={{
                boxShadow: '-1px -1px 4px 0px #0000001A',
                borderRadius: '10px',
                padding: '20px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: '#F8F8F8',
                },
              }}
            >
              <PlatformIcon platform={platform} size={60} />
              <Typography
                sx={{
                  fontSize: 'clamp(1.125rem, 1.0732rem + 0.221vw, 1.25rem)',
                  fontWeight: 600,
                  color: '#000000',
                  textAlign: 'center',
                  marginTop: '16px',
                }}
              >
                {TextHelper.capitalize(platform)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const AccountConnected = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [socialAccounts] = useState([
    {
      platform: 'Instagram',
      accounts: [{ handle: '@uri.creative' }, { handle: '@business_insta' }],
    },
    {
      platform: 'Twitter',
    },
    {
      platform: 'Facebook',
    },
    {
      platform: 'LinkedIn',
    },
  ]);

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: 250,
          backgroundColor: '#fff',
          height: 'calc(100vh - 200px)',
          padding: '14px',
          borderRight: '1px solid #eaeaea',
          borderLeft: '1px solid #eaeaea',
        }}
      >
        <Typography
          sx={{
            color: '#000000',
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          All Accounts
        </Typography>

        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '27px',
          }}
        >
          {socialAccounts.map(({ platform, accounts }) => {
            return (
              <Box key={platform} component="li">
                {accounts ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: '#FCEFF6',
                      padding: '6px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 35,
                            height: 35,
                            backgroundColor: '#000',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -8,
                            right: -5,
                          }}
                        >
                          <PlatformIcon platform={platform} size={22} />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          color: '#4B4B4B',
                          fontSize: '16px',
                          fontWeight: 600,
                        }}
                      >
                        {accounts[0].handle}
                      </Typography>
                    </Box>
                    {openDropdown ? (
                      <HiOutlineChevronDown size={16} color="#000000" onClick={() => setOpenDropdown(!openDropdown)} />
                    ) : (
                      <HiOutlineChevronUp size={16} color="#000000" onClick={() => setOpenDropdown(!openDropdown)} />
                    )}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        border: '1px solid #D1CCCC5C',
                        padding: '6px',
                        borderRadius: '50%',
                        width: 'fit-content',
                      }}
                    >
                      <PlatformIcon platform={platform} size={22} imageIcon={false} color="#868688" />
                    </Box>
                    <Typography
                      sx={{
                        color: '#4B4B4B',
                        fontSize: '16px',
                        fontWeight: 600,
                      }}
                    >
                      Connect {platform}
                    </Typography>
                  </Box>
                )}
                {accounts && (
                  <Collapse in={openDropdown} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        marginTop: '10px',
                      }}
                    >
                      {accounts.map((account) => (
                        <Typography
                          key={account.handle}
                          sx={{
                            color: '#4B4B4B',
                            fontSize: '16px',
                            fontWeight: 600,
                            mb: '10px',
                          }}
                        >
                          {account.handle}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="pl-[5px] md:pl-[30px]">
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: '40%',
              borderRight: '1px solid #eaeaea',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)',
              overflowX: 'hidden',
              height: '100%',
            }}
            className="scroll pr-[5px] md:pr-[30px]"
          >
            <Box>
              <InboxFilters selectedInboxFilter={'All'} setSelectedInboxFilter={() => {}} selectedFilter="inbox" />
              <AlertList
                chat
                alerts={[1, 2, 3, 4, 5, 4].map((alert) => ({
                  id: `${alert}`,
                  is_read: true,
                  keyword: 'Willy Williamson',
                  author: 'Williams Williamson',
                  timestamp: '4:09 PM',
                  starred: false,
                  comment:
                    'I’ve been having issues with my current network, slow internet and frequent disconnections. Can anyone recommend a more reliable network provider with good coverage and fast data speeds?',
                  created_at: 'created_at',
                  deleted_at: 'deleted_at',
                  updated_at: 'updated_at',
                  user_id: 'user_id',
                  deleted: false,
                }))}
              />
            </Box>
          </Box>

          {/* Selected message */}
          <Box
            sx={{
              width: '60%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)',
              overflowX: 'hidden',
              padding: '16px',
            }}
            className="scroll"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #8C8C8C4D',
                gap: '12px',
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#000',
                }}
              />
              <Box>
                <Typography
                  sx={{
                    color: '#212529',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  Willy Williamson
                </Typography>
                <Typography
                  sx={{
                    color: '#4E4E4E',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  Williams Williamson
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                mx: 'auto',
                width: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 113,
                  height: 113,
                  backgroundColor: '#000',
                  mt: '22px',
                  mb: '12px',
                }}
              />
              <Typography
                sx={{
                  color: '#212529',
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                Willy Williamson
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Typography
                  sx={{
                    color: '#777777',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  47K followers
                </Typography>
                &bull;
                <Typography
                  sx={{
                    color: '#777777',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  3.1K posts
                </Typography>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box
              sx={{
                marginTop: '30px',
              }}
            >
              {[
                'I’ve been having issues with my current network, slow internet and frequent disconnections. Can anyone recommend a more reliable network provider with good coverage and fast data speeds?',
                'Hi there! 😊 Sorry to hear about your network issues. MTN offers wide coverage and fast data speeds to keep you connected anytime, anywhere. Send us a DM, and we’ll help you find the best plan for your needs! 📶💛',
              ].map((message, index) => {
                const isUserMessage = index % 2 === 0;

                return (
                  <Box
                    key={message}
                    sx={{
                      display: 'flex',
                      justifyContent: isUserMessage ? 'flex-start' : 'flex-end',
                      marginBottom: '30px',
                      alignItems: 'flex-end',
                      gap: '12px',
                    }}
                  >
                    {isUserMessage && (
                      <Avatar
                        sx={{
                          width: 35,
                          height: 35,
                          backgroundColor: '#000',
                          marginLeft: '8px',
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        backgroundColor: isUserMessage ? '#FFE9F599' : '#F3F3F3',
                        padding: '12px',
                        borderRadius: '10px',
                        maxWidth: '419px',
                        width: '70%',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#212529',
                          fontSize: '16px',
                          fontWeight: 500,
                        }}
                      >
                        {message}
                      </Typography>
                    </Box>
                    {!isUserMessage && (
                      <Avatar
                        sx={{
                          width: 35,
                          height: 35,
                          backgroundColor: '#cd1b78',
                          marginRight: '8px',
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
