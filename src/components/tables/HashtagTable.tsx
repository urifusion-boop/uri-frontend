import { HashtagMentionFrequency } from '@/models/dtos/AiMediaReportDto';
import {
  TableContainer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Tooltip,
} from '@mui/material';

interface HashtagTableProps {
  hashtagMentionFrequency: HashtagMentionFrequency[];
}

const HashtagTable: React.FC<HashtagTableProps> = ({
  hashtagMentionFrequency,
}) => {
  return (
    <TableContainer
      component={Paper}
      className='p-4 bg-white shadow-sm rounded-md'>
      <Typography mb={1} fontWeight={600} fontSize={20}>
        Most Used Hashtags
      </Typography>
      <Table>
        <TableHead>
          <TableRow className='bg-[#F4F4F4]'>
            <TableCell sx={{ width: '10%' }}>
              <Typography fontWeight={600} fontSize={16}>
                No.
              </Typography>
            </TableCell>
            <TableCell sx={{ width: '50%' }}>
              <Typography fontWeight={600} fontSize={16}>
                Hashtag
              </Typography>
            </TableCell>
            <TableCell sx={{ width: '40%' }}>
              <Typography fontWeight={600} fontSize={16}>
                Frequency
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hashtagMentionFrequency.length > 0 ? (
            hashtagMentionFrequency.map((row, index) => {
              // Normalize frequency as a percentage
              const maxFrequency = Math.max(
                ...hashtagMentionFrequency.map((h) => h.count)
              );
              const normalizedFrequency = (row.count / maxFrequency) * 100;

              return (
                <TableRow key={index}>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={14}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500} fontSize={14}>
                      {row.hashtag}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${row.count} mentions`} arrow>
                      <LinearProgress
                        variant='determinate'
                        value={normalizedFrequency}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: '#eee',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#CD1B78',
                          },
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} align='center'>
                <Typography
                  fontWeight={500}
                  fontSize={14}
                  color='textSecondary'>
                  No hashtag data available.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HashtagTable;
