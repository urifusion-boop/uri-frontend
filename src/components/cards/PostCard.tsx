import { Box } from '@mui/material';
import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { IFile } from '../../hooks/profile/client/clientProfileSetup.hook';
import useCustomTheme from '../../hooks/theme.hook';
import { UserTypeEnum } from '../../models/enum-models/UserTypeEnum';
import Text from '../atoms/CustomText';

interface IProps {
  postData: {
    posterFirstName: string;
    posterLastName: string;
    posterProfileImage: IFile;
    posterUserType: string;
    posterCreativeTypes?: string[];
    content: string;
    date: string;
    hearts: number;
    userHearted: boolean;
  };
}

const PostCard: React.FC<IProps> = ({ postData }) => {
  const [post, setPost] = useState(postData);
  const { themeColors } = useCustomTheme();

  return (
    <Box
      sx={{
        width: '500px',
        height: 'fit-content',
        backgroundImage: `url(${post.posterProfileImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'inline-block',
        margin: '0px 20px 0px 0px',
      }}
    >
      <Box
        sx={{
          backgroundColor: `${themeColors.primary}80`,
          width: '100%',
          height: 'fit-content',
          padding: '10px',
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            height: 'fit-content',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <Box className="d-flex">
            <Box
              sx={{
                width: '50px',
                height: '50px',
                backgroundImage: `url(${post.posterProfileImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '100%',
              }}
            ></Box>
            <Box
              sx={{
                width: 'calc(100% - 50px)',
                height: '50px',
                padding: '0px 0px 0px 10px',
              }}
            >
              <Text size={18} weight={600} sx={{ mb: '0px', mt: '1px' }} color="white">
                {post.posterFirstName} {post.posterLastName}
              </Text>
              <Text size={12} weight={400} sx={{ mb: '5px' }} color="white">
                {post.posterUserType === UserTypeEnum.CREATIVE ? post.posterCreativeTypes![0] : UserTypeEnum.BUSINESS}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text
              size={15}
              weight={400}
              sx={{
                mb: '0px',
                mt: '20px',
                whiteSpace: 'pre-wrap',
              }}
              color="white"
            >
              {post.content}
            </Text>
          </Box>
          <Box className="d-flex pointer" sx={{ marginTop: '20px' }} onClick={() => setPost({ ...post, userHearted: !post.userHearted })}>
            {post.userHearted ? (
              <FaHeart
                style={{
                  width: '25px',
                  height: '25px',
                  color: 'white',
                  translate: '0px 0px',
                }}
              />
            ) : (
              <FaRegHeart
                style={{
                  width: '25px',
                  height: '25px',
                  color: 'white',
                  translate: '0px 0px',
                }}
              />
            )}
            <Text size={15} weight={400} sx={{ mb: '0px', mt: '1px', ml: '10px' }} color="white">
              {post.hearts}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostCard;
