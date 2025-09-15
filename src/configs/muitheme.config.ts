import { createTheme } from '@mui/material/styles';

import { Urbanist } from 'next/font/google';

// Load Google Font
const roboto = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1920,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#0d0e0f',
      secondary: '#111417',
    },
    primary: {
      main: '#cd1b78',
      light: '#111417',
      A100: '#0275D8',
      A200: '#99C1E1',
      A400: '#1A73E8',
    },
    secondary: {
      main: '#353F50',
      light: '#5F738C',
      A100: '#667085',
      A200: '#848F9F',
    },
    info: {
      dark: '#F3F5F6',
      main: '#FFFFFF',
      A100: '#DADADA',
    },
    error: {
      main: '#FB5A36',
    },
    success: {
      main: '#008000',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'error' },
          style: {
            color: '#fff',
            backgroundColor: '#FB5A36',
            '&:hover': {
              backgroundColor: '#FB5A36',
            },
          },
        },
      ],
    },
  },
});
