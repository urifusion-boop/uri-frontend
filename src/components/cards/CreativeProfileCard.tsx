import { UserTypeEnum } from '@/models/enum-models/UserTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import { TextHelper } from '../../helpers/TextHelper';
import { CreativeProfileDto } from '../../models/dtos/CreativeProfileDto';
import Text from '../atoms/CustomText';

interface IProps {
  creativeData: CreativeProfileDto;
  onClick: () => void;
}

const CreativeProfileCard: React.FC<IProps> = ({ creativeData, onClick }) => {
  const [_, setOpenCreativeModal] = useState(false);
  const { userDetails } = useAuth();

  return (
    <Box width={'100%'} position={'relative'} borderRadius={'5.45px'} overflow={'hidden'} mx={'auto'} bgcolor={'rgb(171, 112, 52)'} sx={{ aspectRatio: 1 }}>
      <img
        src={
          creativeData.headshot && creativeData.headshot.url
            ? TextHelper.setUrl(creativeData.headshot.url)
            : creativeData.gender === 'MALE'
              ? `/assets/images/default-user-avatar-male.png`
              : `/assets/images/default-user-avatar-female.png`
        }
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: '0',
          objectFit: 'cover',
        }}
        alt="image-not-found"
        onClick={() => onClick()}
        className="pointer"
      />
      <Box position={'absolute'} width={'100%'} height={'55px'} bottom={0} className="glass-blur" sx={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
        {' '}
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} px={2} py={1}>
          <Box>
            <Text size={14} weight={700} color="#2d2d2d">
              {TextHelper.capitalize(creativeData.user?.firstName) ?? ''} {TextHelper.capitalize(creativeData.user?.lastName) ?? ''}
            </Text>
            <Text size={10} weight={600}>
              {creativeData.creativeCategories && creativeData.creativeCategories?.length > 0 ? (
                <span className="creative-tag-creative-page" style={{ color: '#2d2d2d' }}>
                  {creativeData.creativeCategories[0].replace('_', ' ')}
                </span>
              ) : (
                'N/A'
              )}
              {creativeData.creativeCategories && creativeData.creativeCategories?.length > 1 ? (
                <span className="creative-tag-creative-page" style={{ color: '#2d2d2d' }}>{`+${creativeData.creativeCategories?.length - 1}`}</span>
              ) : null}
            </Text>
          </Box>

          <Box className="d-flex" gap={1} alignItems={'center'}>
            {userDetails?.userType === UserTypeEnum.BUSINESS && (
              <LuSend size={20} color="#2d2d2d" onClick={() => setOpenCreativeModal(true)} onKeyDown={(e) => e.key === 'Enter' && setOpenCreativeModal(true)} role="button" tabIndex={0} />
            )}
            <Box onClick={() => onClick()}>
              <MdOutlineRemoveRedEye color="#2d2d2d" size={24} onClick={() => onClick()} className="pointer" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const CreativeCardSkeleton = () => {
  return (
    <div style={{ backgroundColor: 'red' }}>
      <Skeleton height={300} width={300} />
      <Skeleton count={2} />
    </div>
  );
};

export default CreativeProfileCard;
