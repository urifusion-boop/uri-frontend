import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { ReactNode } from 'react';

interface ICustomTableProps {
  headings: ReactNode[];
  data: { [key: string]: any }[];
}

const CustomTable = ({ headings, data }: ICustomTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #f0f0f0', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell key={index} sx={{ fontWeight: 600, fontSize: 16 }}>
                {heading}
              </TableCell>
            ))}
            {/* <TableCell padding="checkbox">
              <Checkbox size="small" />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>E-mail Address</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Last Login</TableCell>
            <TableCell>Actions</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            return (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {Object.values(row).map((item, idx) => {
                  return <TableCell key={index + idx}>{item}</TableCell>;
                })}
              </TableRow>
            );
          })}
          {/* <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell padding="checkbox">
              <Checkbox size="small" />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Fatimah Ola
                </Typography>
                <Chip label="You" size="small" sx={{ ml: 1, height: 24, bgcolor: '#f5f5f5', fontSize: '0.7rem' }} />
              </Box>
            </TableCell>
            <TableCell>fatimah@uricreative</TableCell>
            <TableCell>Super Admin</TableCell>
            <TableCell>Feb 5, 2025, 10:00 AM</TableCell>
            <TableCell sx={{ color: 'text.disabled' }}>No action</TableCell>
          </TableRow>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox size="small" />
            </TableCell>
            <TableCell sx={{ fontWeight: 500 }}>Ebube Onwordi</TableCell>
            <TableCell>esther@uricreative</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Feb 5, 2025, 10:00 AM</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex' }}>
                <IconButton size="small">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
