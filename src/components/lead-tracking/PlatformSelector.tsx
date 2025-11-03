import { BrowsercloudPlatformEnum, PlatformDisplayNames } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { PlatformConfigFormDto } from '@/models/dtos/LeadFormDto';
import { Box, Typography, Checkbox, FormControlLabel, Collapse, TextField, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useState } from 'react';

interface PlatformSelectorProps {
  platformConfigs: PlatformConfigFormDto[];
  setPlatformConfigs: (configs: PlatformConfigFormDto[]) => void;
}

const PlatformIcons: Record<BrowsercloudPlatformEnum, React.ReactNode> = {
  [BrowsercloudPlatformEnum.TWITTER]: <TwitterIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.LINKEDIN]: <LinkedInIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.FACEBOOK]: <FacebookIcon sx={{ fontSize: 20 }} />,
  [BrowsercloudPlatformEnum.THREADS]: (
    <Box sx={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace' }}>@</Box>
  ),
};

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platformConfigs, setPlatformConfigs }) => {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  // Temporarily disable specific platforms in the form UI
  const disabledPlatforms = new Set<BrowsercloudPlatformEnum>([
    BrowsercloudPlatformEnum.LINKEDIN,
    BrowsercloudPlatformEnum.THREADS,
    BrowsercloudPlatformEnum.FACEBOOK,
  ]);

  const togglePlatform = (platform: BrowsercloudPlatformEnum) => {
    const existingConfig = platformConfigs.find((c) => c.platform === platform);

    if (existingConfig) {
      // Toggle enabled status
      setPlatformConfigs(
        platformConfigs.map((c) =>
          c.platform === platform ? { ...c, enabled: !c.enabled } : c
        )
      );
    } else {
      // Add new platform config
      setPlatformConfigs([
        ...platformConfigs,
        {
          platform,
          enabled: true,
          min_followers: undefined,
          exclude_retweets: platform === BrowsercloudPlatformEnum.TWITTER ? true : undefined,
          verified_only: false,
          content_types: [],
        },
      ]);
    }
  };

  const updatePlatformConfig = (platform: string, field: keyof PlatformConfigFormDto, value: any) => {
    setPlatformConfigs(
      platformConfigs.map((c) =>
        c.platform === platform ? { ...c, [field]: value } : c
      )
    );
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
                        (disabled for now)
                      </Typography>
                    )}
                  </Box>
                }
              />

              <Collapse in={isEnabled}>
                <Box sx={{ mt: 2, pl: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Min Followers */}
                  <TextField
                    label="Min. Followers"
                    type="number"
                    size="small"
                    value={config?.min_followers || ''}
                    onChange={(e) =>
                      updatePlatformConfig(platform, 'min_followers', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    placeholder="e.g. 100"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                      },
                    }}
                    helperText="Filter by minimum follower count"
                  />

                  {/* Verified Only */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={config?.verified_only || false}
                        onChange={(e) =>
                          updatePlatformConfig(platform, 'verified_only', e.target.checked)
                        }
                        disabled={isDisabled}
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Verified accounts only
                      </Typography>
                    }
                  />

                  {/* Twitter-specific: Exclude Retweets */}
                  {platform === BrowsercloudPlatformEnum.TWITTER && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={config?.exclude_retweets || false}
                          onChange={(e) =>
                            updatePlatformConfig(platform, 'exclude_retweets', e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          Exclude retweets
                        </Typography>
                      }
                    />
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PlatformSelector;
