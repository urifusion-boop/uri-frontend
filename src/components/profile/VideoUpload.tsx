import { ClientProfileService } from '@/api/ClientProfileService';
import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import SelectField from '@/components/atoms/SelectField';
import Spinner from '@/components/loaders/Spinner';
import { clientsEmbedLinks } from '@/data/clients';
import { TextHelper } from '@/helpers/TextHelper';
import useCustomTheme from '@/hooks/theme.hook';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import { useAuth } from '@/providers/AuthProvider';
import style from '@/styles/Atoms.module.css';
import { ClientProfileProps } from '@/types';
import { Box, Paper, styled } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsPlus } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { YouTubeEmbed } from 'react-social-media-embed';
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

interface IProps extends ClientProfileProps {
  index: number;
}

const VideoUpload = ({ clientProfile, index }: IProps) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [selectedOption, setSelectedOption] = useState('Youtube');
  const [loading, setLoading] = useState(false);
  const { userDetails } = useAuth();
  const { themeColors } = useCustomTheme();
  const queryClient = useQueryClient();
  const route = useRouter();
  const { id } = route.query;

  const handleVideoUpload = async () => {
    if (!TextHelper.isYoutubeUrl(link)) return toast.error('Invalid Youtube Link');

    setLoading(true);

    let videos = clientProfile.videos ? [...clientProfile.videos] : [];

    videos[index] = {
      url: link,
      videoType: selectedOption.toUpperCase(),
    };

    await ClientProfileService.updateProfileApi({
      ...clientProfile,
      videos: videos,
    })
      .then((res) => {
        queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
        toast.success('Profile Updated');
      })
      .catch((res) => console.log(res))
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  };

  return (
    <>
      {clientProfile.videos && clientProfile.videos[index] ? (
        <Box height={'300px'} border={'2px solid #CD1B78'} borderRadius={'10px'} overflow={'hidden'} position={'relative'}>
          {userDetails?.userId === id && (
            <Box
              sx={{
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '10px',
                right: '10px',
                borderRadius: '20px',
                backgroundColor: '#000',
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
          <YouTubeEmbed
            url={clientProfile.videos[index].url}
            width={'100%'}
            height={300}
            youTubeProps={{
              opts: {
                playerVars: {
                  autoplay: 0,
                },
              },
            }}
          />
        </Box>
      ) : userDetails?.userId === id ? (
        <>
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
                {loading ? (
                  <Spinner color="#fff" />
                ) : (
                  <>
                    <Box>
                      <BsPlus size={25} color="#fff" />
                    </Box>
                  </>
                )}
              </Box>
            </button>
            <Text size={14} color="#CD1B78" weight={700}>
              Use embedded link
            </Text>
            <Text size={12} color="#14141666" weight={700}>
              Only Youtube copied link allowed
            </Text>
          </Item>
        </>
      ) : (
        <></>
      )}
      <CustomModal open={open} setOpen={setOpen} showCloseIcon closeOnOverlayClick width="600px">
        <Box display={'flex'} flexDirection={'column'} gap={'30px'} p={3}>
          <Text size={32} color="#141416" weight={700} sx={{ textAlign: 'center !important', width: '100%' }}>
            Enter Video link
          </Text>
          <SelectField
            options={clientsEmbedLinks}
            onChange={(e) => {
              if (!e || Array.isArray(e)) return;
              setSelectedOption(e.label as string);
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
    </>
  );
};

export default VideoUpload;
