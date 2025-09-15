import { LightThemeColors } from '@/configs/colors.config';
import { DateHelper } from '@/helpers/DateHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { FormSnapshotDto } from '@/models/dtos/LeadsDto';
import Check from '@mui/icons-material/Check';
import NotInterested from '@mui/icons-material/NotInterested';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Chip, Container, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

interface FormListProps {
  data: FormSnapshotDto[];
  total: number;
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  handleRefresh: () => void;
}

const PAGE_SIZE = 10;

const FormListTable: React.FC<FormListProps> = ({ data, total, page, setPage, handleRefresh }) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuFormId, setMenuFormId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, formId: string) => {
    setMenuAnchor(event.currentTarget);
    setMenuFormId(formId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuFormId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography>Form List</Typography>
          <Box bgcolor="#FAF3EC" px={2} py={0.5} borderRadius={2} fontSize={14} color={LightThemeColors.uriColor}>
            Total Forms : {total}
          </Box>
          <Box flex={1} />
          <IconButton onClick={handleRefresh} sx={{ border: '1px solid #f5dbb3', background: '#fff', borderRadius: 2, height: 36, width: 36 }}>
            <RefreshIcon sx={{ color: LightThemeColors.uriColor }} />
          </IconButton>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }}>S.No.</TableCell>
                <TableCell>Form Name</TableCell>
                <TableCell>Form Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Recurring</TableCell>
                <TableCell>Next Generation</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell> Leads</TableCell>
                {/* <TableCell align="center">Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((form, idx) => (
                <TableRow key={form.lead_form_snapshot_id} hover>
                  <TableCell>{idx + 1 + (page - 1) * PAGE_SIZE}</TableCell>
                  <TableCell>
                    <Tooltip title={form.form_title}>
                      <Typography fontSize={13} color="text.secondary">
                        {TextHelper.truncateText(form.form_title, 10, '...')}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label={form.form_type} sx={{ backgroundColor: '#f6f6f6', color: '#a5681d' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={form.disabled_reason ?? 'Active'}>
                      <IconButton color={form.disabled ? 'warning' : 'default'} size="small">
                        {form.disabled ? <NotInterested fontSize="small" /> : <Check fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontSize={13} color={form.auto_generate ? 'warning.main' : 'inherit'}>
                        {form.auto_generate ? 'Auto Generated' : 'Manual'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="text.secondary">
                      {DateHelper.formatDate(form.next_generation_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Tooltip title={[getKeywords(form)].filter(Boolean).join(', ')}>
                        <Typography fontSize={13} color="text.secondary">
                          {TextHelper.truncateText(getKeywords(form), 20, '...')}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="text.secondary">
                      {DateHelper.formatDate(form.created_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="warning" sx={{ borderRadius: 1, px: 2, fontSize: 13 }}>
                      View ({form.metadata?.total_leads ?? 0})
                    </Button>
                  </TableCell>
                  {/* Action */}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No forms found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Pagination count={Math.ceil(Number(total || 1) / PAGE_SIZE)} shape="rounded" size="small" className="mx-6 my-4" page={Number(page)} onChange={(_, p) => setPage(p)} />
        </Box>
      </Box>
    </Container>
  );
};

const getKeywords = (form: FormSnapshotDto) => {
  return [...(form.keywords ?? []), ...(form.person_titles ?? []), ...(form.person_seniorities ?? [])].filter(Boolean).join(', ');
};

export default FormListTable;
