import { Box, Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { countries } from '@/data/countries';
import { TextHelper } from '@/helpers/TextHelper';
import { TrackerDto } from '@/models/dtos/TrackerDto';
import { useRouter } from 'next/router';
import React from 'react';
import CardHeaderDropdown from '../atoms/CardHeaderDropdown';
import { triggerToast } from '../atoms/CustomToast';
import PlatformIcon from '../atoms/PlatformIcons';

interface TrackerTableProps {
  data: TrackerDto[] | null | undefined;
  isLoading: boolean;
  error?: string;
  setSelectedTracker: (tracker: TrackerDto) => void;
  deleteTracker: (selectedTracker: TrackerDto) => void;
  visibleColumns?: string[]; // Optional prop to control visible columns
  customHeaders?: Record<string, string>; // Optional prop for header overrides
  trackerType?: 'keyword' | 'hashtag'; // New prop to determine tracker type
}

const KeywordTrackerTable: React.FC<TrackerTableProps> = ({
  data,
  isLoading,
  error,
  setSelectedTracker,
  deleteTracker,
  visibleColumns = ['Tracker Name', 'Keywords', 'Platforms', 'Exclude Keywords', 'Locations', 'Actions'],
  customHeaders = {}, // Default to no overrides
  trackerType = 'keyword', // Default to "keyword"
}) => {
  const router = useRouter();

  const getCountries = (locations: string[]) => {
    return locations
      .map((location) => {
        const country = countries.find((country) => country.code === location);
        return country ? country?.label : TextHelper.capitalize(location);
      })
      .join(', ');
  };

  return (
    <TableContainer sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Table sx={{ minWidth: 650 }} aria-label="tracker table">
        <TableHead>
          <TableRow>
            {visibleColumns?.map((header) => (
              <TableCell
                key={header}
                sx={{
                  color: '#000',
                }}
              >
                {customHeaders[header] || header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={visibleColumns?.length}>
                <Typography color="red" variant="h5" fontWeight={700} align="center">
                  An error occurred!
                </Typography>
                <Typography variant="h6" align="center">
                  {error}
                </Typography>
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            [1, 2, 3].map((item) => (
              <TableRow key={item}>
                <TableCell colSpan={visibleColumns.length} align="center">
                  <Skeleton variant="rectangular" width="100%" height={25} />
                </TableCell>
              </TableRow>
            ))
          ) : data && data.length > 0 ? (
            data.map((tracker) => (
              <TableRow key={tracker?.tracker_id}>
                {visibleColumns.includes('Tracker Name') && <TableCell sx={{ color: '#4a4a4a' }}>{tracker.name}</TableCell>}
                {visibleColumns.includes('Keywords') && <TableCell sx={{ color: '#4a4a4a', textWrap: 'nowrap' }}>{tracker?.keywords?.join(', ')}</TableCell>}
                {visibleColumns.includes('Platforms') && (
                  <TableCell sx={{ color: '#4a4a4a', whiteSpace: 'nowrap' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      {tracker?.platforms?.map((platform) => (
                        <Box key={platform} width={24}>
                          <PlatformIcon platform={platform} size={24} />
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                )}
                {visibleColumns.includes('Exclude Keywords') && (
                  <TableCell sx={{ color: '#4a4a4a', textWrap: 'nowrap' }}>{tracker?.excluded && tracker?.excluded?.length > 0 ? tracker?.excluded?.join(', ') : 'N/A'}</TableCell>
                )}
                {visibleColumns.includes('Locations') && (
                  <TableCell sx={{ color: '#4a4a4a', textWrap: 'nowrap' }}>{tracker?.locations && tracker?.locations?.length > 0 ? getCountries(tracker?.locations) : 'N/A'}</TableCell>
                )}
                {visibleColumns.includes('Actions') && (
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        if (tracker.keywords?.join('').length === 0) {
                          return triggerToast('error', 'Please add keywords to track');
                        }
                        const route = trackerType === 'hashtag' ? `/hashtag-tracking/${tracker.tracker_id}` : `/keyword-tracking/${tracker.tracker_id}/tracker`;
                        router.push(route);
                      }}
                    >
                      Track
                    </Button>

                    <CardHeaderDropdown
                      options={[
                        {
                          label: 'Edit',
                          onClick: () => setSelectedTracker(tracker),
                        },
                        {
                          label: 'Delete',
                          onClick: () => deleteTracker(tracker),
                        },
                      ]}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length}>
                <Typography variant="h6" align="center">
                  No trackers found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KeywordTrackerTable;
