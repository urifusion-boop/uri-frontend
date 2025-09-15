import useCustomTheme from '@/hooks/theme.hook';
import { Box, Typography, useMediaQuery, Paper } from '@mui/material';
import styles from '../../styles/landing.module.css';

interface KanbanColumn {
  id: string;
  title: string;
  cards: CardItem[];
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const ContentManagement = () => {
  const matches = useMediaQuery('(max-width: 920px)');
  const isMobile = useMediaQuery('(max-width: 600px)');
  const { themeColors } = useCustomTheme();
  const steps = [
    {
      title: 'Connect Your Account',
      description:
        'Start by connecting your social media accounts to streamline your content management process.',
      icon: '🔗',
    },
    {
      title: 'Create Your Content',
      description:
        'Use our intuitive editor to craft engaging content for your audience.',
      icon: '✍️',
    },
    {
      title: 'Manage Your Workflow',
      description:
        'Organize and track your content creation process using our drag-and-drop dashboard.',
      icon: '📊',
    },
  ];

  return (
    <Box
      className={styles.connectContainer}
      id='creatives'
      sx={{
        background: 'white',
        py: 8,
      }}>
      <Typography
        sx={{ fontWeight: 700, zIndex: 10 }}
        variant={'h4'}
        align='center'
        marginLeft={'auto'}
        marginRight={'auto'}
        maxWidth={'md'}>
        Manage Content
        <span
          style={{
            color: themeColors.primary,
            marginLeft: '10px',
            marginRight: '10px',
          }}>
          with Ease
        </span>{' '}
      </Typography>
      <Typography
        variant='body2'
        align='justify'
        sx={{
          maxWidth: '500px',
          textAlign: 'center',
          fontFamily: 'Plus Jakarta Sans,sans-serif',
          margin: '6px auto',
        }}>
        Turn your thoughts into action with our Idea Manager.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '2rem auto',
          px: 3,
          position: 'relative',
        }}>
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              textAlign: 'center',
            }}>
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                marginBottom: 2,
              }}>
              {step.icon}
            </Box>
            <Typography variant='h6' fontWeight={600} mb={1}>
              {step.title}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                maxWidth: '250px',
              }}>
              {step.description}
            </Typography>
            {index < steps.length - 1 && !isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '40px',
                  right: '-30%',
                  width: '60%',
                  borderTop: '2px dashed #e0e0e0',
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ContentManagement;
