import { Box } from '@mui/material';

const TopBrands = () => {
  const brands = [
    { name: 'LSETF', icon: '/assets/icons/lsetf.svg' },
    { name: 'ALX', icon: '/assets/icons/alx-gray.svg' },
    { name: 'REVVE', icon: '/assets/icons/revve-gray.svg' },
    { name: 'CULMINATE CONSULTING', icon: '/assets/icons/culminate-gray.svg' },
    { name: 'LOBSTER', icon: '/assets/icons/lobster-gray.svg' },
    { name: 'SENDSAFE', icon: '/assets/icons/sendsafe-gray.svg' },
    { name: 'GOAJO', icon: '/assets/icons/goajo-gray.svg' },
  ];

  return (
    <Box
      sx={{
        mx: 'auto',
        pt: '46px',
        maxWidth: '100%',
      }}
    >
      <h2 className="text-[#141416] text-xl font-urbanist text-center">Trusted by top brands</h2>
      <Box
        sx={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'center' },
          overflowX: 'auto',
          px: { xs: 2, md: 0 },
          mt: 3,
          scrollbarWidth: 'thin',
          scrollbarColor: '#dedede #f7f7f7',
          '&::-webkit-scrollbar': {
            height: '4px', // Ultra thin
            background: '#f7f7f7',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#dedede',
            borderRadius: '4px',
          },
        }}
        tabIndex={0}
        aria-label="Trusted brands logos - scrollable"
      >
        {brands.map((brand) => (
          <Box
            key={brand.name}
            sx={{
              flex: '0 0 auto',
              minWidth: 100,
              maxWidth: 128,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={brand.icon}
              alt={brand.name}
              loading="lazy"
              sx={{
                width: 'auto',
                height: { xs: 40, md: 70 }, // Responsive: 40px mobile, 70px desktop
                objectFit: 'contain',
                filter: 'grayscale(100%)',
                opacity: 0.8,
                transition: 'height 0.2s',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TopBrands;
