import { Post, VideoObject } from '@/models/dtos/TrackerDto';
import { Box, Link, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

interface SearchResultProps {
  result: Post;
}

const ResultContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
});

const ImageContainer = styled('img')({
  width: '100%',
  maxWidth: '300px',
  borderRadius: '8px',
  objectFit: 'cover',
  marginBottom: '1rem',
});

const ThumbnailGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '10px',
});

const PersonList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const DynamicSearchResultRenderer: React.FC<SearchResultProps> = ({ result }) => {
  const { title, link, snippet, displayLink, formattedUrl, htmlFormattedUrl, pagemap } = result;

  const findImages = () => {
    const images = [];

    if (pagemap) {
      if (pagemap.cse_thumbnail) {
        images.push(...pagemap.cse_thumbnail.map((img: any) => img.src));
      }
      if (pagemap.cse_image) {
        images.push(...pagemap.cse_image.map((img: any) => img.src));
      }
      if (pagemap.imageobject) {
        images.push(...pagemap.imageobject.map((img: any) => img.thumbnailurl || img.contenturl));
      }
    }

    return images;
  };

  const renderPersonDetails = () => {
    if (!pagemap?.person) return null;

    return (
      <PersonList>
        {pagemap.person.map((person: any, index: number) => (
          <Box
            key={index}
            sx={{
              padding: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
            }}
          >
            {person.givenname && (
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Name: {person.givenname}
              </Typography>
            )}
            {person.additionalname && (
              <Typography variant="body2" color="textSecondary">
                Username: {person.additionalname}
              </Typography>
            )}
            {person.identifier && (
              <Typography variant="caption" color="textSecondary">
                ID: {person.identifier}
              </Typography>
            )}
          </Box>
        ))}
      </PersonList>
    );
  };

  const renderInteractionCounter = () => {
    if (!pagemap?.interactioncounter) return null;

    return (
      <Box>
        <Typography variant="h6">Interactions:</Typography>
        {pagemap.interactioncounter.map((interaction: any, index: number) => (
          <Box key={index} sx={{ padding: '0.5rem' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {interaction.name || interaction.interactiontype.replace('https://schema.org/', '')}:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {interaction.userinteractioncount}{' '}
              {interaction.url && (
                <Link href={interaction.url} target="_blank" rel="noopener noreferrer">
                  (View)
                </Link>
              )}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderCreativeWorks = () => {
    if (!pagemap?.creativework) return null;

    return (
      <Box>
        <Typography variant="h6">Creative Works:</Typography>
        {pagemap.creativework.map((work: any, index: number) => (
          <Box key={index}>
            <Link href={work.url} target="_blank" rel="noopener noreferrer">
              {work.name || work.url}
            </Link>
          </Box>
        ))}
      </Box>
    );
  };

  const renderSocialMediaPosts = () => {
    if (!pagemap?.socialmediaposting) return null;

    return (
      <Box>
        <Typography variant="h6">Social Media Posts:</Typography>
        {pagemap.socialmediaposting.map((post: any, index: number) => (
          <Box
            key={index}
            sx={{
              padding: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              mb: '0.5rem',
            }}
          >
            <Typography variant="subtitle2">ID: {post.identifier}</Typography>
            {post.datecreated && (
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(post.datecreated).toLocaleString()}
              </Typography>
            )}
            {post.articlebody && (
              <Typography variant="body2" color="textSecondary">
                {post.articlebody}
              </Typography>
            )}
            {post.url && (
              <Link href={post.url} target="_blank" rel="noopener noreferrer">
                View Post
              </Link>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderVideos = () => {
    if (!pagemap?.videoobject) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Videos:
        </Typography>

        {pagemap.videoobject.map((video: VideoObject, index: number) => (
          <Box
            key={index}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: '#fff',
            }}
          >
            {video.contenturl ? (
              <Box
                component="video"
                src={video.contenturl}
                controls
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  mb: 1.5,
                  maxHeight: 400,
                }}
              />
            ) : (
              <VideoIframe link={video.embedurl} />
            )}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                my: 0.5,
              }}
            >
              {video.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload Date: {dayjs(video.uploaddate).format('YYYY-MM-DD')}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const images = findImages();

  return (
    <ResultContainer className="scroll">
      {images.length > 0 && <ImageContainer src={images[0]} alt={title} />}

      <Typography variant="h5" component="a" href={link ?? formattedUrl ?? htmlFormattedUrl} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: '#1a0dab' }}>
        {title}
      </Typography>

      {snippet && (
        <Typography variant="body2" color="textSecondary">
          {snippet}
        </Typography>
      )}

      {displayLink && (
        <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          {displayLink}
        </Typography>
      )}

      {images.length > 1 && (
        <ThumbnailGrid>
          {images.slice(1).map((src, index) => (
            <Box key={index}>
              <img src={src} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', borderRadius: '5px' }} />
            </Box>
          ))}
        </ThumbnailGrid>
      )}

      {renderVideos()}
      {renderPersonDetails()}
      {renderInteractionCounter()}
      {renderCreativeWorks()}
      {renderSocialMediaPosts()}
    </ResultContainer>
  );
};

export default DynamicSearchResultRenderer;

const VideoIframe = ({ link }: { link?: string }) => {
  function handleIframeError(event: React.SyntheticEvent<HTMLIFrameElement, Event>): void {
    console.error('Failed to load iframe content: bb', event.currentTarget.src);
    event.currentTarget.style.display = 'none';
  }

  return (
    <iframe
      width="100%"
      height="315"
      src={link}
      title="Video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      onError={handleIframeError}
      style={{ borderRadius: '8px', border: 'none' }}
    />
  );
};
