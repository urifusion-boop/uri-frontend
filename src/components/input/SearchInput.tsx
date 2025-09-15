import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, IconButton, TextField } from '@mui/material';

const SearchInput = () => {
  return (
    <Box display="flex" alignItems="center" gap={2} mt={3} mb={4}>
      <TextField fullWidth variant="outlined" placeholder="Search your leads" size="small" sx={{ flexGrow: 1 }} />
      <Button variant="contained" sx={{ textTransform: 'none', backgroundColor: '#CD1B78', px: 3 }}>
        Search
      </Button>
      <IconButton>
        <RefreshIcon />
      </IconButton>
    </Box>
  );
};

export default SearchInput;
