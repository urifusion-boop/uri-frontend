import { TiktokMedia } from '@/models/dtos/TiktokInsightDto';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, Button, Grid, IconButton, Modal, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { CiImageOff } from 'react-icons/ci';
import { FaTiktok } from 'react-icons/fa6';

interface MediaGalleryProps {
  media: TiktokMedia;
  setSelectedPost: Dispatch<SetStateAction<TiktokMedia | null>>;
}

const TiktokMediaGallery = ({ media, setSelectedPost }: MediaGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<TiktokMedia | null>(null);

  const handleOpen = (mediaItem: TiktokMedia) => {
    setSelectedMedia(mediaItem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3} key={media?.id}>
        <Box alignSelf={'stretch'} height={'100%'}>
          <Box
            height={'100%'}
            sx={{
              borderTop: '10px solid #c13584',
              minHeight: 100,
              bgcolor: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              padding: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              {/* Instagram Icon */}
              <Box
                bgcolor={'#c13584'}
                sx={{
                  height: 25,
                  width: 25,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                }}
              >
                <FaTiktok size={15} color="#fff" />
              </Box>
            </Box>

            {/* Post Image */}
            {media?.cover_image_url ? (
              <Box
                sx={{
                  height: 200,
                  width: '100%',
                  mt: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  border: '2px solid #c13584',
                  position: 'relative',
                }}
              >
                <img
                  src={media?.cover_image_url}
                  alt="post"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  loading="lazy"
                />
                <IconButton
                  onClick={() => handleOpen(media)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: 40,
                  }}
                >
                  <PlayCircleIcon fontSize="inherit" />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  height: 200,
                  width: '100%',
                  mt: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  border: '2px solid #c13584',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CiImageOff size={40} color="#c13584" />
              </Box>
            )}

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  Comments:
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  {media?.comment_count}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  Likes:
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  {media?.like_count ?? 0}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  Engagement:{' '}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.65rem',
                      lg: '0.75rem',
                    },
                    color: '#555',
                  }}
                >
                  {(media?.like_count ?? 0) + (media?.comment_count ?? 0)}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'center'}>
                <Button
                  style={{
                    fontSize: 11,
                  }}
                  color="primary"
                  onClick={() => setSelectedPost(media)}
                >
                  Show Engagement
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '80%',
            maxWidth: 700,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          {selectedMedia && (
            <>
              <iframe width="100%" height="400" src={selectedMedia?.embed_link} title={selectedMedia.title} allow="autoplay; encrypted-media" allowFullScreen style={{ marginBottom: 20 }}></iframe>
              <Typography variant="subtitle1" color="textSecondary">
                {selectedMedia.video_description || 'No Description'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Views: {selectedMedia.view_count}</Typography>
                <Typography variant="body2">Shares: {selectedMedia.share_count}</Typography>
                <Typography variant="body2">Duration: {selectedMedia.duration} sec</Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TiktokMediaGallery;
