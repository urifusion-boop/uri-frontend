import { ClientProfileService } from '@/api/ClientProfileService';
import { DocumentService } from '@/api/DocumentService';
import CustomText from '@/components/atoms/CustomText';
import Spinner from '@/components/loaders/Spinner';
import useCustomTheme from '@/hooks/theme.hook';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import { useAuth } from '@/providers/AuthProvider';
import { ClientProfileProps } from '@/types';
import { Box, Paper, styled } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsPlus } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { TextHelper } from '../../helpers/TextHelper';

interface ImageUploaderProps extends ClientProfileProps {
  index: number;
}

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
  gap: '20px',
}));

const ImageUploader = ({ clientProfile, index }: ImageUploaderProps) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const { themeColors } = useCustomTheme();
  const queryClient = useQueryClient();
  const route = useRouter();
  const { id } = route.query;
  const { userDetails } = useAuth();

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const fileData = new FormData();
    fileData.append('file', fileObj);

    setLoading(true);

    // delete former header pic first
    if (clientProfile.images && clientProfile.images[index]) {
      await DocumentService.deleteFile(clientProfile.images[index].publicId).catch((response) => {
        return;
      });
    }

    // Then upload a new on and update profile
    await DocumentService.uploadFile(fileData, `${userProfile?.userId}/GeneralImages/${Date.now()}_${fileObj.name}`)
      .then(async (response: any) => {
        let img = clientProfile.images && clientProfile.images?.length > 0 ? [...clientProfile.images] : [];

        (img[index] = {
          docName: response.responseData?.docName!,
          docType: response.responseData?.docType!,
          publicId: response.responseData?.publicId!,
          url: response.responseData?.url!,
        }),
          await ClientProfileService.updateProfileApi({
            ...clientProfile,
            images: img,
          })
            .then((res) => {
              queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
              toast.success('Profile Updated');
            })
            .catch((res) => console.log(res));
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => setLoading(false));

    event.target.value = '';
  };

  return (
    <>
      {clientProfile.images && clientProfile.images[index] ? (
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
                backgroundColor: 'whitesmoke',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => uploadImageInputRef.current?.click()}
            >
              {loading ? (
                <Spinner color={themeColors.primary} />
              ) : (
                <>
                  <MdEdit
                    style={{
                      width: '20px',
                      height: '20px',
                      color: themeColors.primary,
                      margin: '5px',
                    }}
                  />
                  <input style={{ display: 'none' }} ref={uploadImageInputRef} type="file" onChange={handleImageUpload} accept=".png,.jpg,.jpeg" />
                </>
              )}
            </Box>
          )}
          <img src={TextHelper.setUrl(clientProfile.images[index].url)} alt={clientProfile.images[index].docName} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      ) : userDetails?.userId === id ? (
        <>
          {' '}
          <Item>
            <img src="/assets/images/add-photo.png" alt="plus" width={50} height={50} />
            <CustomText size={16} color="#6C727F" weight={700}>
              Add a Photo
            </CustomText>
            <button disabled={loading}>
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
                    <Box onClick={() => uploadImageInputRef.current?.click()}>
                      <BsPlus size={24} color="#fff" />
                    </Box>
                    <input style={{ display: 'none' }} ref={uploadImageInputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleImageUpload} />
                  </>
                )}
              </Box>
            </button>
          </Item>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ImageUploader;
