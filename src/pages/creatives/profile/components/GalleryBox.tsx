import { CreativeProfileService } from '@/api/CreativeProfileService';
import { DocumentService } from '@/api/DocumentService';
import Spinner from '@/components/loaders/Spinner';
import { dummy } from '@/data/creatives';
import useCustomTheme from '@/hooks/theme.hook';
import { CreativeProfileDto } from '@/models/dtos/CreativeProfileDto';
import { Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import ValidationImageUploader from '../../../../components/atoms/ValidationImageUploader';
import { TextHelper } from '../../../../helpers/TextHelper';
import { IFile } from '../../../../hooks/profile/client/clientProfileSetup.hook';
import { useModal } from '../../../../hooks/utils.hook';
import { useAuth } from '../../../../providers/AuthProvider';

interface IGalleryBox {
  item: {
    name: string;
    height: number;
    index: number;
    width: number;
  };
  index: number;
  creativeProfile: CreativeProfileDto;
  onClick: (imageUrl: string) => void; // Add onClick prop
}

const GalleryBox = ({ item, index, creativeProfile, onClick }: IGalleryBox) => {
  const { themeColors } = useCustomTheme();
  const [loading] = useState(false);
  const [changeImageLoading, setChangeImageLoading] = useState(false);
  const { open, setOpen } = useModal();
  const { saveCreativeUserProfile } = useAuth();
  const matches = useMediaQuery('(max-width: 600px)');

  const handleImageUpload = async (data: IFile) => {
    let img = creativeProfile.images && creativeProfile.images?.length > 0 ? [...creativeProfile.images] : [...dummy];

    img[index] = data;

    await CreativeProfileService.updateProfileApi({
      ...creativeProfile,
      images: img,
    })
      .then((res) => {
        toast.success('Profile Updated');
        saveCreativeUserProfile({ ...creativeProfile, images: img });
      })
      .catch((res) => console.log(res));
  };

  const handleImageChange = async (data: IFile) => {
    setChangeImageLoading(true);

    if (creativeProfile.images) {
      await DocumentService.deleteFile(creativeProfile.images[index].publicId).catch((response) => {
        return;
      });
    }

    let img = creativeProfile.images && creativeProfile.images?.length > 0 ? [...creativeProfile.images] : [...dummy];

    img[index] = data;

    await CreativeProfileService.updateProfileApi({
      ...creativeProfile,
      images: img,
    })
      .then((res) => {
        toast.success('Profile Updated');
        saveCreativeUserProfile({ ...creativeProfile, images: img });
      })
      .catch((res) => console.log(res));

    setChangeImageLoading(false);
  };

  const handleImageClick = () => {
    const imageUrl = creativeProfile?.images![index].url || '';
    if (imageUrl) {
      onClick(imageUrl);
    }
  };

  return (
    <>
      {creativeProfile && creativeProfile.images && creativeProfile.images[index] && creativeProfile.images[index].docName !== 'test' ? (
        <Box
          gridArea={item.name}
          sx={{
            width: matches ? '100%' : item.width,
            height: item.height,
            cursor: 'pointer',
          }}
          position={'relative'}
          borderRadius={'11px'}
          overflow={'hidden'}
          onClick={handleImageClick}
        >
          {/* <Image
            src={TextHelper.setUrl(creativeProfile.images[index]?.url || "")}
            alt={""}
            fill
            objectFit="cover"
          /> */}

          <img
            src={TextHelper.setUrl(creativeProfile?.images[index]?.url || '')}
            alt={creativeProfile.user?.firstName || ''}
            loading="lazy"
            width="100%"
            height={item.height}
            style={{
              objectFit: 'cover',
            }}
          />
          {changeImageLoading && (
            <Box position={'absolute'} left={'50%'} top={'50%'}>
              <Spinner color={themeColors.primary} />
            </Box>
          )}

          <Box
            style={{
              width: '30px',
              height: '30px',
              position: 'absolute',
              top: '10px',
              right: '10px',
              borderRadius: '20px',
              backgroundColor: 'whitesmoke',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <MdEdit
              style={{
                width: '20px',
                height: '20px',
                color: themeColors.primary,
                margin: '5px',
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: `${themeColors.placeholder}40`,
            width: matches ? '100%' : item.width,
            height: item.height,
            borderRadius: '8px',
            breakInside: 'avoid',
            position: 'relative',
            cursor: 'pointer',
          }}
          gridArea={item.name}
          key={item.name}
          onClick={() => setOpen(true)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
              opacity: '0.8',
            }}
          >
            {loading ? <Spinner color={themeColors.primary} /> : <AiOutlinePlusCircle style={{ width: '30px', height: '30px', color: 'white' }} />}
          </Box>
        </Box>
      )}

      <ValidationImageUploader
        open={open}
        setOpen={setOpen}
        validate="face"
        onSave={(data) =>
          creativeProfile && creativeProfile.images && creativeProfile.images[index] && creativeProfile.images[index].docName !== 'test' ? handleImageChange(data) : handleImageUpload(data)
        }
      />
    </>
  );
};

export default GalleryBox;
