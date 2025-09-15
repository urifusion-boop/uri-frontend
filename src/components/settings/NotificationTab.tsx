import { useNotificationSettings } from '@/hooks/settings/notificationSettings.hook';
import { InsightNotificationSettingsDto, LeadSettingDto } from '@/models/dtos/NotificationSettingDto';
import AlertOnFilled from '@/utils/icon/AlertOnFilled';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { Box, Checkbox, Grid, TextField, Tooltip, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { GoClockFill } from 'react-icons/go';
import { IoNotificationsOffSharp } from 'react-icons/io5';
import { LiaDesktopSolid } from 'react-icons/lia';
import { MdEmail, MdRecordVoiceOver } from 'react-icons/md';
import CustomButton from '../atoms/CustomButton';
import HorizontalSlider from '../atoms/HorizontalSlider';
import IosSwitch from '../atoms/IosSwitch';
import LoaderWrapper from '../atoms/LoaderWrapper';
import Select from '../atoms/Select';
import FeatureCard from './FeatureCard';
import TitleCard from './TitleCard';

const CompactTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    height: '38px',
    padding: '0 9px',
    borderRadius: '6px',
  },
  '& .MuiOutlinedInput-input': {
    padding: '6px 0',
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-outlined': {
    transform: 'translate(14px, 9px) scale(1)',
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },
  '& .MuiFormHelperText-root': {
    marginTop: '3px',
  },
}));

type NotificationSettingKeys = keyof InsightNotificationSettingsDto;
type OptionType = 'highPriority' | 'mediumPriority' | 'lowPriority' | 'followupReminder';

const NotificationTab = () => {
  const [selectedFeature, setSelectedFeature] = useState<NotificationSettingKeys>('leadTrackingNotificationSettings');
  const [notificationSettings, setNotificationSettings] = useState<InsightNotificationSettingsDto>({
    keywordTrackingNotificationSettings: {
      isPaused: false,
      preferredEmail: '',
      dayOfMonth: 1,
      recurringFrequency: 'monthly',
      trackingType: 'KEYWORD_TRACKING',
    },
    leadTrackingNotificationSettings: {
      isPaused: false,
      preferredEmail: '',
      highPriority: { email: false, inApp: false },
      mediumPriority: { email: false, inApp: false },
      lowPriority: { email: false, inApp: false },
      followupReminder: { email: false, inApp: false },
      trackingType: 'LEAD_TRACKING',
      dayOfMonth: 1,
      recurringFrequency: 'monthly',
    },
    accountTrackingNotificationSettings: {
      isPaused: false,
      preferredEmail: '',
      trackingType: 'ACCOUNT_TRACKING',
      dayOfMonth: 1,
      recurringFrequency: 'monthly',
    },
    alertNotificationSettings: {
      isPaused: false,
      preferredEmail: '',
      trackingType: 'ALERT',
      dayOfMonth: 1,
      recurringFrequency: 'monthly',
    },
  });

  const features = [
    {
      title: 'Lead Tracking',
      description: 'Stay informed on potential leads and interactions.',
      icon: MdRecordVoiceOver,
      setting: 'leadTrackingNotificationSettings',
    },
    {
      title: 'Account Tracking',
      description: 'Get updates on account changes',
      icon: ChartLine,
      setting: 'accountTrackingNotificationSettings',
    },
    {
      title: 'Alert',
      description: 'Receive important updates and critical notifications',
      icon: AlertOnFilled,
      setting: 'alertNotificationSettings',
    },
    {
      title: 'Keyword Tracking',
      description: 'Get notified on relevant trends and mentions',
      icon: HeartRateSearch,
      setting: 'keywordTrackingNotificationSettings',
    },
  ];

  const leadPriorityOptions: { id: keyof LeadSettingDto; label: string }[] = [
    { id: 'highPriority', label: 'High Priority Leads' },
    { id: 'mediumPriority', label: 'Medium Priority Leads' },
    { id: 'lowPriority', label: 'Low Priority Leads' },
    { id: 'followupReminder', label: 'Follow-up Reminder' },
  ];

  const { userNotificationSettingsQuery, updateUserNotificationSettingsMutation } = useNotificationSettings();

  useEffect(() => {
    if (userNotificationSettingsQuery.data) {
      setNotificationSettings({
        accountTrackingNotificationSettings: userNotificationSettingsQuery.data?.accountTrackingNotificationSettings,
        alertNotificationSettings: userNotificationSettingsQuery.data?.alertNotificationSettings,
        keywordTrackingNotificationSettings: userNotificationSettingsQuery.data?.keywordTrackingNotificationSettings,
        leadTrackingNotificationSettings: userNotificationSettingsQuery.data?.leadTrackingNotificationSettings,
      });
    }
  }, [userNotificationSettingsQuery.isSuccess, userNotificationSettingsQuery.data]);

  return (
    <Box
      sx={{
        maxWidth: '930px',
        width: '100%',
        margin: 'auto',
        borderRadius: '12px',
        backgroundColor: '#fff',
        py: '24px',
        boxShadow: '-1px -1px 10px 2px #0000000D',
        px: '14px',
      }}
    >
      <Typography
        sx={{
          fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
          fontWeight: 600,
          color: '#404040',
          mb: '6px',
          px: {
            xs: '14px',
            md: '26px',
          },
          mt: '24px',
        }}
      >
        Notification Settings
      </Typography>
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#3B3B3B',
          px: {
            xs: '14px',
            md: '26px',
          },
        }}
      >
        Manage your notification preferences and stay updated on what matters most.
      </Typography>

      {/* Features Slider */}
      <Box
        sx={{
          mt: '40px',
          px: {
            xs: '14px',
            md: '26px',
          },
        }}
      >
        <LoaderWrapper isLoading={userNotificationSettingsQuery.isLoading} numberOfSkeletons={4} skeletonHeight="150px" skeletonWidth="200px" isGrid gridColumns={4}>
          <HorizontalSlider gap="gap-6" variant="square">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} checked={selectedFeature === feature.setting} onSelect={() => setSelectedFeature(feature.setting as NotificationSettingKeys)} />
            ))}
          </HorizontalSlider>
        </LoaderWrapper>
      </Box>

      {/*DND and email  */}
      <Box
        sx={{
          mt: '32px',
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: '16px',
          justifyContent: 'space-between',
          px: {
            xs: '14px',
            md: '26px',
          },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Dnd */}
        <Box>
          <TitleCard title="Do Not Disturb" icon={IoNotificationsOffSharp} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              mt: '11.8px',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#3C3C3C',
              }}
            >
              Pause notifications
            </Typography>
            <IosSwitch
              selectedColor="#CD1B78"
              width={24}
              height={13.5}
              checked={selectedFeature && notificationSettings?.[selectedFeature] ? notificationSettings[selectedFeature].isPaused : false}
              onChange={(value) => {
                setNotificationSettings((prev) => {
                  if (prev && selectedFeature) {
                    return {
                      ...prev,
                      [selectedFeature]: {
                        ...prev[selectedFeature],
                        isPaused: value.target.checked,
                      },
                    };
                  }
                  return prev;
                });
              }}
            />
          </Box>
        </Box>

        {/* Email */}
        <Box
          sx={{
            maxWidth: '322px',
            width: '100%',
          }}
        >
          <TitleCard title="Preferred Email" icon={MdEmail} />

          <Tooltip title="The registered email will initially be used to send notifications. You can change it anytime." arrow>
            <CompactTextField
              id="outlined-search"
              label="Email"
              type="email"
              fullWidth
              sx={{
                mt: '12px',
                '.MuiFormLabel-root': {
                  color: '#a0a0a0',
                },
              }}
              value={selectedFeature ? notificationSettings?.[selectedFeature]?.preferredEmail : ''}
              onChange={(e) => {
                setNotificationSettings((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      [selectedFeature]: {
                        ...prev[selectedFeature],
                        preferredEmail: e.target.value,
                      },
                    };
                  }
                  return prev;
                });
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Notification schedule */}
      <Box
        sx={{
          borderTop: '1px solid #CBCBCB99',
          px: {
            xs: '14px',
            md: '26px',
          },
          my: '36px',
          py: '24px',
          borderBottom: '1px solid #CBCBCB99',
        }}
      >
        <TitleCard title="Notification Schedule" icon={GoClockFill} />
        <Box
          sx={{
            display: 'flex',
            gap: '13px',
            mt: '19px',
          }}
        >
          <Select
            options={[
              { label: 'Monthly', value: 'MONTHLY' },
              { label: 'Weekly', value: 'WEEKLY' },
            ]}
            placeholder="Monthly"
            value={selectedFeature ? notificationSettings?.[selectedFeature]?.recurringFrequency : 'MONTHLY'}
            onChange={(value) => {
              setNotificationSettings((prev) => {
                if (prev) {
                  return {
                    ...prev,
                    [selectedFeature]: {
                      ...prev[selectedFeature],
                      recurringFrequency: value,
                    },
                  };
                }
                return prev;
              });
            }}
            containerClassName="max-w-[163px] w-full"
          />
          <Select
            options={[
              { label: 'Every 1st of the month', value: '1' },
              { label: 'Every 15th of the month', value: '15' },
              { label: 'Every 28th of the month', value: '28' },
            ]}
            value={selectedFeature ? notificationSettings?.[selectedFeature]?.dayOfMonth?.toString() : '28'}
            onChange={(value) => {
              setNotificationSettings((prev) => {
                if (prev) {
                  return {
                    ...prev,
                    [selectedFeature]: {
                      ...prev[selectedFeature],
                      dayOfMonth: Number(value),
                    },
                  };
                }
                return prev;
              });
            }}
            placeholder="Every 28th of the month"
            containerClassName="max-w-[225px] w-full"
          />
        </Box>
      </Box>

      {/* Check Boxes */}
      {selectedFeature === 'leadTrackingNotificationSettings' && (
        <Box>
          <Grid container spacing={1} sx={{ px: { xs: '14px', md: '26px' } }}>
            <Grid item xs={6} sm={8}>
              <TitleCard title="Lead Tracking" icon={MdRecordVoiceOver} />
            </Grid>
            <Grid item xs={3} sm={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <AiOutlineMail color="#747373" size={20} />
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#262626',
                  }}
                >
                  Email
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                }}
              >
                <LiaDesktopSolid color="#747373" size={20} />
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#262626',
                  }}
                >
                  In-App
                </Typography>
              </Box>
            </Grid>
            {leadPriorityOptions.map((option) => (
              <React.Fragment key={option.id}>
                <Grid item xs={6} sm={8} mt={2}>
                  <Typography
                    sx={{
                      color: '#3C3C3C',
                      fontSize: '18px',
                      fontWeight: 500,
                    }}
                  >
                    {option.label}
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={2} mt={2}>
                  <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                    <Checkbox
                      sx={{
                        color: '#969696',
                        '&.Mui-checked': {
                          color: '#CD1B78',
                        },
                      }}
                      checked={!!(selectedFeature && notificationSettings?.leadTrackingNotificationSettings?.[option.id as OptionType]?.email)}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          if (!prev) return prev;

                          return {
                            ...prev,
                            [selectedFeature]: {
                              ...prev[selectedFeature],
                              [option.id]: {
                                ...prev?.leadTrackingNotificationSettings?.[option.id as OptionType],
                                email: e.target.checked,
                              },
                            },
                          };
                        });
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={3} sm={2} mt={2}>
                  <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                    <Checkbox
                      sx={{
                        color: '#969696',
                        '&.Mui-checked': {
                          color: '#CD1B78',
                        },
                      }}
                      checked={!!(selectedFeature && notificationSettings?.leadTrackingNotificationSettings?.[option.id as OptionType]?.inApp)}
                      onChange={(e) => {
                        setNotificationSettings((prev) => {
                          if (!prev) return prev;

                          return {
                            ...prev,
                            [selectedFeature]: {
                              ...prev[selectedFeature],
                              [option.id]: {
                                ...prev?.leadTrackingNotificationSettings?.[option.id as OptionType],
                                inApp: e.target.checked,
                              },
                            },
                          };
                        });
                      }}
                    />
                  </Box>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      )}

      {/* Save Changes Btn */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: '40px',
          pr: {
            xs: '14px',
            md: '26px',
          },
          boxShadow: 'none',
        }}
      >
        <CustomButton
          mode="primary"
          onClick={() => {
            updateUserNotificationSettingsMutation.mutate(notificationSettings);
          }}
          disabled={userNotificationSettingsQuery.isLoading || updateUserNotificationSettingsMutation.isLoading}
          style={{
            maxWidth: '200px',
          }}
          loading={updateUserNotificationSettingsMutation.isLoading}
        >
          Save Changes
        </CustomButton>
      </Box>
    </Box>
  );
};

export default NotificationTab;
