import { Box, Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CustomModal from '../modals/CustomModal';

const LEAD_FIELDS = ['first_name', 'last_name', 'email', 'phone', 'company', 'title'];

interface ImportMappingProps {
  open: boolean;
  file: File | null;
  onClose: () => void;
  onStart: (mapping: Record<string, string>, file: File) => void;
}

const parseHeaders = async (file: File): Promise<string[]> => {
  const text = await file.text();
  const firstLine = text.split(/\r?\n/)[0];
  return firstLine.split(',').map((h) => h.trim());
};

const ImportMapping = ({ open, file, onClose, onStart }: ImportMappingProps) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    if (file) {
      parseHeaders(file)
        .then(setHeaders)
        .catch(() => setHeaders([]));
    }
  }, [file]);

  if (!file) return null;

  return (
    <CustomModal open={open} setOpen={onClose} width="600px" maxWidth="600px" bgColor="#fff">
      <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
        Map File Columns
      </Typography>
      <Typography textAlign="center" mb={3} color="text.secondary">
        Match the columns from your file to Lead fields
      </Typography>
      <Grid container spacing={2} mb={2}>
        {headers.map((header) => (
          <Grid item xs={12} md={6} key={header}>
            <Typography fontWeight="bold" mb={1}>
              {header}
            </Typography>
            <Select fullWidth size="small" value={mapping[header] ?? ''} onChange={(e) => setMapping((prev) => ({ ...prev, [header]: e.target.value as string }))}>
              <MenuItem value="">Ignore</MenuItem>
              {LEAD_FIELDS.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={() => {
            onStart(mapping, file);
          }}
        >
          Start Import
        </Button>
      </Box>
    </CustomModal>
  );
};

export default ImportMapping;
