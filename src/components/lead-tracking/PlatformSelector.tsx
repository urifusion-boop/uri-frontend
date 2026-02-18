import { PlatformConfigFormDto } from '@/models/dtos/LeadFormDto';
import { BrowsercloudPlatformEnum, PlatformDisplayNames } from '@/models/enum-models/BrowsercloudPlatformEnum';
import FacebookIcon from '@mui/icons-material/Facebook';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Box, Checkbox, FormControlLabel, IconButton, SvgIcon, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface PlatformSelectorProps {
  platformConfigs: PlatformConfigFormDto[];
  setPlatformConfigs: (configs: PlatformConfigFormDto[]) => void;
}

const PlatformIcons: Record<BrowsercloudPlatformEnum, React.ReactNode> = {
  [BrowsercloudPlatformEnum.TWITTER]: <TwitterIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.LINKEDIN]: <LinkedInIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.FACEBOOK]: <FacebookIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.THREADS]: <Box sx={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace' }}>@</Box>,
  [BrowsercloudPlatformEnum.TIKTOK]: (
    <SvgIcon sx={{ fontSize: 20 }} viewBox="0 0 24 24">
      <path d="M16.5 6.5c1.1 1 2.4 1.7 3.9 1.9v3.1c-1.5-.1-2.9-.6-4.2-1.4v6.3c0 3.7-3 6.6-6.7 6.6-1.7 0-3.2-.6-4.4-1.7-1.2-1.1-2-2.6-2.2-4.3-.3-2.1.4-4.1 1.8-5.6 1.4-1.5 3.4-2.4 5.5-2.4.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.1-.9-.1-2.1 0-3.8 1.7-3.8 3.7 0 2.1 1.7 3.7 3.8 3.7 2.1 0 3.8-1.7 3.8-3.7V3h3.3c.2 1.3.8 2.5 1.7 3.5z" />
    </SvgIcon>
  ),
  [BrowsercloudPlatformEnum.JOB_BOARDS]: <WorkOutlineIcon sx={{ fontSize: 20 }} />,
};

const PlatformTooltips: Partial<Record<BrowsercloudPlatformEnum, string>> = {
  [BrowsercloudPlatformEnum.JOB_BOARDS]: 'Detects companies hiring for roles related to your service. Hiring indicates active business problems and budget readiness.',
};

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platformConfigs, setPlatformConfigs }) => {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  // Temporarily disable specific platforms in the form UI
  // JOB_BOARDS now enabled - using Bright Data LinkedIn Jobs API
  const disabledPlatforms = new Set<BrowsercloudPlatformEnum>([BrowsercloudPlatformEnum.THREADS, BrowsercloudPlatformEnum.LINKEDIN]);

  const togglePlatform = (platform: BrowsercloudPlatformEnum) => {
    console.log('🎯 Platform toggle clicked:', platform);
    const existingConfig = platformConfigs.find((c) => c.platform === platform);
    console.log('📦 Existing config:', existingConfig);

    if (existingConfig) {
      // Toggle enabled status
      const newConfigs = platformConfigs.map((c) => (c.platform === platform ? { ...c, enabled: !c.enabled } : c));
      console.log('🔄 Toggling existing platform, new configs:', newConfigs);
      setPlatformConfigs(newConfigs);
    } else {
      // Add new platform config
      const newConfigs = [
        ...platformConfigs,
        {
          platform,
          enabled: true,
          min_followers: undefined,
          exclude_retweets: platform === BrowsercloudPlatformEnum.TWITTER ? true : undefined,
          verified_only: false,
          content_types: [],
        },
      ];
      console.log('➕ Adding new platform config:', newConfigs);
      setPlatformConfigs(newConfigs);
    }
  };

  const updatePlatformConfig = (platform: string, field: keyof PlatformConfigFormDto, value: any) => {
    setPlatformConfigs(platformConfigs.map((c) => (c.platform === platform ? { ...c, [field]: value } : c)));
  };

  const isPlatformEnabled = (platform: BrowsercloudPlatformEnum): boolean => {
    if (disabledPlatforms.has(platform)) return false;
    return platformConfigs.find((c) => c.platform === platform)?.enabled || false;
  };

  const getPlatformConfig = (platform: BrowsercloudPlatformEnum): PlatformConfigFormDto | undefined => {
    return platformConfigs.find((c) => c.platform === platform);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563' }}>
          Monitor Platforms (Real-time V2)
        </Typography>
        <Tooltip title="Select which social media platforms to monitor in real-time for potential leads">
          <IconButton size="small">
            <InfoOutlinedIcon sx={{ fontSize: 16, color: '#6b7280' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="caption" sx={{ color: '#6b7280', mb: 2, display: 'block' }}>
        Enable real-time monitoring across multiple platforms. Your leads will be detected instantly as they appear.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {Object.values(BrowsercloudPlatformEnum).map((platform) => {
          const isEnabled = isPlatformEnabled(platform);
          const config = getPlatformConfig(platform);
          const isExpanded = expandedPlatform === platform;
          const isDisabled = disabledPlatforms.has(platform);

          return (
            <Box
              key={platform}
              sx={{
                border: '1px solid',
                borderColor: isEnabled ? '#3b82f6' : '#e5e7eb',
                borderRadius: '12px',
                p: 2,
                backgroundColor: isEnabled ? '#eff6ff' : '#fff',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEnabled}
                    onChange={() => !isDisabled && togglePlatform(platform)}
                    disabled={isDisabled}
                    sx={{
                      color: '#6b7280',
                      '&.Mui-checked': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {PlatformIcons[platform]}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {PlatformDisplayNames[platform]}
                    </Typography>
                    {isDisabled && (
                      <Typography variant="caption" sx={{ color: '#9ca3af', ml: 1 }}>
                        (Coming soon)
                      </Typography>
                    )}
                    {PlatformTooltips[platform] && (
                      <Tooltip title={PlatformTooltips[platform]} arrow>
                        <IconButton size="small" sx={{ ml: 0.5 }}>
                          <InfoOutlinedIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                }
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PlatformSelector;
