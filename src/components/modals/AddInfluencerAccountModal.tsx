import { useCreateInfluencer, useUpdateInfluencer } from '@/hooks/influcencers-tracking/influencers.hook';
import { CreateInfluencerDto, InfluencerDto } from '@/models/dtos/InfluencerDto';
import { Box, Button, Grid, Radio, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiLogoTiktok, BiX } from 'react-icons/bi';

import { isFeatureDisabled } from '@/configs/rules.config';
import { platformOptions } from '@/data/platformOptions';
import { AgreementHelper } from '@/helpers/AgreementHelper';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import { TFeatureLimit } from '@/models/dtos/FeatureLimitDto';
import { AddAccountSchema } from '@/models/schema/AddAccountSchema';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { zodResolver } from '@hookform/resolvers/zod';
import InstagramIcon from '@mui/icons-material/Instagram';
import { BsChevronLeft } from 'react-icons/bs';
import { CiCircleInfo } from 'react-icons/ci';
import { FaFacebook } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa6';
import { IoMdPerson } from 'react-icons/io';
import { AppTokenHelper } from '../../helpers/AppTokenHelper';
import { CampaignPlatformEnum } from '../../models/enum-models/PlatformEnum';
import { useAuth } from '../../providers/AuthProvider';
import ActionButtons from '../atoms/ActionButtons';
import InputField from '../atoms/Input';
import Spinner from '../loaders/Spinner';
import CustomModal from './CustomModal';

const accountIcons: Record<string, JSX.Element> = {
  Instagram: <InstagramIcon color="primary" />,
  Facebook: <FaFacebook size={24} color="#CD1B78" />,
  TikTok: <BiLogoTiktok size={24} color="#CD1B78" />,
  LinkedIn: <FaLinkedinIn size={24} color="#CD1B78" />,
};

const accountLimitKey: Record<string, keyof Omit<TFeatureLimit['accountTracking'], 'count'> | undefined> = {
  Instagram: 'instagramAccounts',
  Facebook: 'facebookAccounts',
  LinkedIn: 'linkedInAccounts',
  TikTok: undefined,
};

interface FormData {
  social_name: string;
  email: string;
  tags: string[];
  social_username: string;
  influencer_id?: string;
}

interface AddInfluencerAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInfluencerDto) => void;
  initialData?: InfluencerDto; // Can be used for editing if data is passed
  authenticateFaceBook: () => void;
  authenticateX: () => void;
  gettingUrl?: boolean;
  authenticateLinkedIn: () => void;
}

const AddInfluencerAccountModal = ({ open, onClose, onSubmit, initialData, authenticateFaceBook, gettingUrl, authenticateX, authenticateLinkedIn }: AddInfluencerAccountModalProps) => {
  const [isEdit, setIsEdit] = useState(!!initialData); // Determine if it's in edit mode
  const { userDetails } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const _platformOptions = useMemo(() => {
    return platformOptions
      .map((platform) => {
        const limitKey = accountLimitKey[platform.name] as keyof typeof featureLimit.accountTracking;
        const isDisabled = isFeatureDisabled(featureLimit, 'accountTracking', limitKey as string) || platform.disable;
        return {
          ...platform,
          disable: isDisabled,
          tooltip: isDisabled ? `You have reached the limit for ${platform.name} accounts.` : platform.tooltip,
        };
      })
      .sort((a, b) => {
        if (a.disable && !b.disable) return 1;
        if (!a.disable && b.disable) return -1;
        return 0;
      });
  }, [featureLimit]);

  const { mutate: createInfluencer, isLoading: creating } = useCreateInfluencer();
  const { mutate: updateInfluencer, isLoading: updating } = useUpdateInfluencer(initialData?.influencer_id ?? '');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: zodResolver(AddAccountSchema),
    defaultValues: initialData || {
      social_name: '',
      tags: [],
      social_username: '',
    },
  });

  useEffect(() => {
    setIsEdit(!!initialData);

    if (initialData) {
      const { email, ...data } = initialData;
      reset({ ...data, email });

      const validPlatform = PlatformHelper.getValidPlatform(initialData.social_platform);
      setSelectedPlatform(validPlatform);
      setStep(1);
    } else {
      reset({
        social_name: '',
        tags: [],
        social_username: '',
      });

      setSelectedPlatform(null);
      setStep(0);
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    const processedData: CreateInfluencerDto = {
      ...data,
      social_platform: selectedPlatform?.toUpperCase() ?? '',
      tags: data.tags.map((tag) => tag.trim()),
      user_id: userDetails?.userId ?? '',
      email: data.email,
    };

    if (isEdit) {
      updateInfluencer(processedData, { onSuccess: onClose });
    } else {
      createInfluencer(processedData, { onSuccess: onClose });
    }
  };

  const platformAction = (platform: string) => {
    switch (platform) {
      case CampaignPlatformEnum.INSTAGRAM:
        setStep(1);
        break;
      case CampaignPlatformEnum.FACEBOOK:
        authenticateFaceBook();
        break;
      case CampaignPlatformEnum.TIKTOK:
        setStep(1);
        break;
      case CampaignPlatformEnum.X:
        authenticateX();
        break;
      case CampaignPlatformEnum.LINKEDIN:
        authenticateLinkedIn();
        break;
      default:
        break;
    }
  };

  return (
    <CustomModal open={open} setOpen={onClose} width="700px" maxWidth={step === 1 ? '500px' : '800px'} bgColor="#fff">
      <BiX
        size={24}
        color="#000"
        style={{
          position: 'absolute',
          top: '28px',
          right: '22px',
          borderRadius: 1,
          backgroundColor: '#F5F5F5',
          cursor: 'pointer',
          padding: 1.2,
        }}
        onClick={onClose}
      />

      {/* Step one */}
      {step === 0 && !isEdit && (
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Typography
            variant="h6"
            fontWeight="semi-bold"
            sx={{
              textAlign: 'center',
              color: '#141416',
              fontWeight: 700,
              fontSize: {
                xl: '32px',
                lg: '32px',
                md: '32px',
                sm: '24px',
                xs: '24px',
              },
              mt: 6,
              mb: 3,
            }}
          >
            Track Social Account
          </Typography>

          <Grid container spacing={3} mb={4}>
            {_platformOptions.map((platform) => (
              <Grid
                item
                xs={12}
                key={platform.name}
                sx={{
                  opacity: platform.disable ? 0.5 : 1,
                }}
              >
                <Tooltip title={platform.tooltip} arrow>
                  <Button
                    sx={{
                      gap: 2,
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: '9px',

                      border: selectedPlatform === platform.value ? '1px solid #CD1B78' : 'none',
                    }}
                    onClick={() => {
                      if (platform.disable) return;
                      setSelectedPlatform(platform.value);
                    }}
                  >
                    <Radio checked={selectedPlatform === platform.value} value={platform.value} size="small" />
                    <img src={platform.icon} alt={platform.name} style={{ width: '48px', height: '48px' }} />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            fontWeight={500}
                            color="#141416"
                            sx={{
                              fontSize: {
                                xl: '20px',
                                lg: '20px',
                                md: '20px',
                                sm: '16px',
                                xs: '14px',
                              },
                            }}
                          >
                            {platform.name}
                          </Typography>
                          {platform.isRecommended && (
                            <Typography variant="h6" fontWeight={400} color="#BDBDBD" fontSize="10px">
                              (recommended)
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body1" color="#555555" fontSize="10px" fontWeight={500} textAlign="left">
                          {platform.text}
                        </Typography>
                      </Box>
                      {platform.infoWithIcon && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: '#F9F9F9',
                            padding: '11px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          <CiCircleInfo color="#747474" size={12} />
                          <Typography variant="body1" color="#555555" fontWeight={500} fontSize="10px">
                            {platform.info}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          <ActionButtons onCancel={onClose} onConfirm={() => platformAction(selectedPlatform ?? '')} isConfirmDisabled={!selectedPlatform} isLoading={gettingUrl} />
        </Box>
      )}

      {/* Step Two */}
      {(step === 1 || isEdit) && (
        <Box display={'flex'} flexDirection={'column'} gap={2} mb={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <BsChevronLeft onClick={() => setStep(0)} size={20} style={{ cursor: 'pointer' }} />
            <Typography variant="h6" fontWeight="semi-bold">
              {isEdit ? 'Update Influencer' : 'Add Influencer'}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} mb={1}>
              <Controller
                control={control}
                name="social_name"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField
                    label={initialData?.social_name ?? 'Name*'}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    errorText={errors?.social_name?.message?.toString()}
                    icon={<IoMdPerson size={24} color="#CD1B78" />}
                    labelIcon
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {selectedPlatform === CampaignPlatformEnum.INSTAGRAM && (
              <Grid item xs={12} mb={1}>
                <Controller
                  control={control}
                  name="social_username"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Instagram Username (without @)"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.social_username?.message?.toString()}
                      icon={accountIcons.Instagram}
                      labelIcon
                      readOnly={initialData && isEdit && AppTokenHelper.hasTokenUsage(userDetails?.appTokens ?? [], AgreementHelper.getAgreementType(initialData)) ? true : false}
                    />
                  )}
                />
              </Grid>
            )}

            {selectedPlatform === CampaignPlatformEnum.FACEBOOK && (
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  {accountIcons.Facebook}
                  <Controller
                    control={control}
                    name="social_username"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField label="Facebook Username" value={value} onChange={onChange} onBlur={onBlur} errorText={errors?.social_username?.message?.toString()} />
                    )}
                  />
                </Box>
              </Grid>
            )}

            {selectedPlatform === CampaignPlatformEnum.TIKTOK && (
              <Grid item xs={12} mb={1}>
                <Controller
                  control={control}
                  name="social_username"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Tiktok Username"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.social_username?.message?.toString()}
                      icon={accountIcons.TikTok}
                      labelIcon
                      readOnly={initialData && isEdit && AppTokenHelper.hasTokenUsage(userDetails?.appTokens ?? [], AgreementHelper.getAgreementType(initialData)) ? true : false}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleFormSubmit)} variant="contained" color="primary" disabled={creating || updating}>
              {creating || updating ? <Spinner color="#fff" /> : isEdit ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Box>
      )}
    </CustomModal>
  );
};

export default AddInfluencerAccountModal;
