import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { LeadDto } from '../../models/dtos/LeadsDto';

interface ImportStepReviewProps {
  leads: LeadDto[];
  onBack: () => void;
  onConfirm: () => void;
}

const ImportStepReview: React.FC<ImportStepReviewProps> = ({ leads, onBack, onConfirm }) => (
  <>
    <Typography align="center" fontWeight={700} fontSize={26} mt={2} mb={1}>
      Review Your <span style={{ color: '#CD1B78' }}>Leads</span> Before <span style={{ color: '#CD1B78' }}>Importing</span>
    </Typography>
    <Typography align="center" color="#65676B" fontSize={15} mb={3}>
      Here’s a preview of your uploaded data. Make sure everything looks good before finalizing the import.
    </Typography>
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '11px',
        border: '1.5px solid #e5e7eb',
        px: 2,
        py: 1,
        maxHeight: 230,
        overflow: 'auto',
        mb: 2,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            {['User', 'Company', 'Email', 'Phone Number', 'Job Title', 'Location'].map((head) => (
              <TableCell key={head} sx={{ fontWeight: 700, fontSize: 15 }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead, idx) => (
            <TableRow key={idx}>
              <TableCell>{lead.first_name ?? ''}</TableCell>
              <TableCell>{lead.last_name ?? ''}</TableCell>
              <TableCell>{lead.lead_email ?? ''}</TableCell>
              <TableCell>{lead.phone ?? ''}</TableCell>
              <TableCell>{lead.job_title ?? ''}</TableCell>
              <TableCell>{lead.location ?? ''}</TableCell>
              <TableCell>{lead.company_name ?? ''}</TableCell>
              <TableCell>{lead.lead_source ?? ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
    <Box display="flex" gap={2} mt={2} justifyContent="center">
      <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }}>
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        sx={{
          bgcolor: '#CD1B78',
          minWidth: 120,
          '&:hover': { bgcolor: '#ad1766' },
        }}
      >
        Looks Good!
      </Button>
    </Box>
  </>
);

export default ImportStepReview;
