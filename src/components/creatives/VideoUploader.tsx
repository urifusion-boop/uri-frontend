import { CreativeProfileService } from '@/api/CreativeProfileService';
import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import SelectField from '@/components/atoms/SelectField';
import Spinner from '@/components/loaders/Spinner';
import { clientsEmbedLinks } from '@/data/clients';
import useCustomTheme from '@/hooks/theme.hook';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import { useAuth } from '@/providers/AuthProvider';
import style from '@/styles/Atoms.module.css';
import { CreativeProfileProps } from '@/types';
import { Box, Paper, styled } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsPlus } from 'react-icons/bs';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import { YouTubeEmbed } from 'react-social-media-embed';
import { AdminProfileService } from '../../api/admin/AdminProfileService';
import { UserRoleEnum } from '../../models/enum-models/UserRoleEnums';
import CustomModal from '../modals/CustomModal';

const Item = styled(Paper)(() => ({
  textAlign: 'left',
  color: '#000',
  borderRadius: '10px',
  border: '2px dashed #CD1B78',
  boxShadow: 'none',
  overflow: 'hidden',
  height: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  flexDirection: 'column',
  gap: '10px',
}));

interface IProps extends CreativeProfileProps {
  index: number;
}

const VideoUpload = ({ creativeProfile, index }: IProps) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [selectedOption, setSelectedOption] = useState('YOUTUBE');
  const [loading, setLoading] = useState(false);
  const { userDetails } = useAuth();
  const { themeColors } = useCustomTheme();
  const queryClient = useQueryClient();
  const route = useRouter();
  const [adminDeletionReason, setAdminDeletionReason] = useState('');
  const [adminDeleteVideoModal, setAdminDeleteVideoModal] = useState(false);
  const [video, setVideo] = useState(creativeProfile?.videos ? creativeProfile.videos[index] : null);
  const { id } = route.query;

  const handleVideoUpload = async () => {
    // if (!TextHelper.isYoutubeUrl(link))
    //   return toast.error("Invalid Youtube Link");

    setLoading(true);

    let videos = creativeProfile?.videos ? [...creativeProfile.videos] : [];

    videos[index] = {
      url: link,
      videoType: selectedOption,
    };

    await CreativeProfileService.updateProfileApi({
      ...creativeProfile,
      videos: videos,
    })
      .then((res) => {
        queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
        toast.success('Profile Updated');
      })
      .catch((res) => console.log(res))
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  };

  const isOwnProfile = userDetails?.userId === id; // Check if the user is viewing their own profile

  const adminDeleteVideo = useMutation({
    mutationFn: async () => {
      const result = await AdminProfileService.deleteCreativeProfileDoc({
        url: video?.url,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.images) {
          setVideo(null);
        }
      }
      setAdminDeletionReason('');
      setAdminDeleteVideoModal(false);
    },
    onSuccess: () => {
      // queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
      toast.success('Deleted Video');
    },
  });

  return (
    <>
      {creativeProfile?.videos && video ? (
        <Box height={'300px'} border={'2px solid #CD1B78'} borderRadius={'10px'} overflow={'hidden'} position={'relative'}>
          {isOwnProfile && ( // Only show the edit icon if the user is viewing their own profile
            <Box
              sx={{
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '10px',
                right: '10px',
                borderRadius: '20px',
                backgroundColor: 'whitesmoke',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setOpen(true)}
            >
              {loading ? (
                <Spinner color={themeColors.primary} />
              ) : (
                <MdEdit
                  style={{
                    width: '20px',
                    height: '20px',
                    color: themeColors.primary,
                    margin: '5px',
                  }}
                />
              )}
            </Box>
          )}

          {userDetails?.role === UserRoleEnum.ADMIN && ( // Only show the edit icon if the user is viewing their own profile
            <Box
              sx={{
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '10px',
                right: '10px',
                borderRadius: '20px',
                backgroundColor: 'whitesmoke',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setAdminDeleteVideoModal(true)}
            >
              {adminDeleteVideo.isLoading ? (
                <Spinner color={themeColors.primary} />
              ) : (
                <MdDeleteOutline
                  style={{
                    width: '20px',
                    height: '20px',
                    color: themeColors.primary,
                    margin: '5px',
                  }}
                />
              )}
            </Box>
          )}
          <YouTubeEmbed url={creativeProfile.videos[index].url} width={'100%'} height={300} />
        </Box>
      ) : isOwnProfile ? ( // Also allow the user to add a new video if they are viewing their own profile
        <Item>
          <button onClick={() => setOpen(true)}>
            <Box
              sx={{
                width: '45px',
                height: '45px',
                bgcolor: '#CD1B78',
                borderRadius: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {loading ? <Spinner color="#fff" /> : <BsPlus size={25} color="#fff" />}
            </Box>
          </button>
          <Text size={14} color="#CD1B78" weight={700}>
            Use embedded link
          </Text>
          <Text size={12} color="#14141666" weight={700}>
            Only Youtube copied link allowed
          </Text>
        </Item>
      ) : null}
      <CustomModal open={open} setOpen={setOpen} showCloseIcon closeOnOverlayClick width="600px">
        <Box display={'flex'} flexDirection={'column'} gap={'30px'} p={3}>
          <Text size={32} color="#141416" weight={700} sx={{ textAlign: 'center !important', width: '100%' }}>
            Enter embedded link
          </Text>
          <SelectField
            options={clientsEmbedLinks}
            onChange={(e) => {
              if (!e || Array.isArray(e)) return;
              setSelectedOption(e.value as string);
            }}
            placeholder="Select"
            value={{
              label: selectedOption,
              value: selectedOption.toUpperCase(),
            }}
          />

          <input className={style.input} placeholder="Enter link" onChange={(e) => setLink(e.target.value)} required />
          <Box display={'flex'} justifyContent={'space-between'} gap={'24px'}>
            <CustomButton disabled={loading} mode="inverse" onClick={() => setOpen(false)}>
              Cancel
            </CustomButton>
            <CustomButton disabled={loading} mode="primary" onClick={handleVideoUpload}>
              {loading ? <Spinner color="#fff" /> : 'Upload'}
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>

      <CustomModal open={adminDeleteVideoModal} showCloseIcon width="600px" setOpen={setAdminDeleteVideoModal} bgColor="#fff">
        <Box
          sx={{
            padding: '10px 20px',
          }}
        >
          <Text size={22} weight={500} sx={{ mb: 1 }}>
            Delete Creative Video
          </Text>
          <Text size={13} weight={500}>
            Add a reason for deleting this file.
          </Text>
          <textarea
            maxLength={200}
            required
            style={{
              width: '100%',
              minHeight: '173px',
              maxHeight: '173px',
              margin: '20px 0 0px',
              border: '1px solid #E0DEF7',
              borderRadius: '5px',
              outline: '1px solid #E0DEF7',
              padding: '18px',
              background: themeColors.background,
            }}
            placeholder="Not more than 50 characters."
            onChange={(e) => {
              setAdminDeletionReason(String(e.target.value).trim().length <= 50 ? e.target.value : adminDeletionReason);
            }}
            value={adminDeletionReason}
          ></textarea>
          <CustomButton mode="primary" style={{ width: '253px', marginTop: '30px' }} onClick={() => adminDeleteVideo.mutate()} disabled={adminDeleteVideo.isLoading}>
            {adminDeleteVideo.isLoading ? <Spinner color={'#fff'} /> : 'Done'}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default VideoUpload;
