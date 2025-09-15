import * as React from 'react';
import { Box, Typography, useMediaQuery } from "@mui/material";
import { FaCompass } from "react-icons/fa6";
import { LuClock2 } from 'react-icons/lu';
import { AiFillStar } from 'react-icons/ai';
import { TfiMenuAlt } from 'react-icons/tfi';
import { GiArrowScope } from 'react-icons/gi';


const data = [
  { mainIcon: <FaCompass size={70} />, minorIcon: <LuClock2 />, title: "Comments over time", step: 1 },
  { mainIcon: <AiFillStar size={70} />, minorIcon: <FaCompass />, title: "Likes and shares", step: 1 },
  { mainIcon: <TfiMenuAlt size={70} />, minorIcon: <GiArrowScope />, title: "Interaction analysis", step: 1 }
];

export const NavigationSteps = () => {
  const isMobile = useMediaQuery('(max-width:800px)');
  const isTablet = useMediaQuery('(max-width:1200px)');
  return (
    <Box
      marginTop={1}
      display='grid'
      maxWidth={1300}
      gridTemplateColumns={
        isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4, 1fr)'
      }
      gap={2}>
      {data.map((item, i) => (
        <Cards key={i} item={{
          description: item.title,
          descriptionIcon: item.minorIcon,
          icon: item.mainIcon
        }} index={i} />
      ))}
    </Box>
  );
};


function Cards({
  item,
  index,
}: {
  item: {
    description: string;
    descriptionIcon: React.ReactNode;
    icon: React.ReactNode;
  };
  index: number;
}) {
  return (
    <Box
      bgcolor={'white'}
      minWidth={280}
      boxShadow={'0px 1px 1px #ddd'}
      borderRadius={2}
      overflow={'hidden'}
      sx={{
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          cursor: 'pointer',
          boxShadow: 2
        },
      }}
      border={'1px solid #ddd'}>
      <Box
        paddingInline={2}
        bgcolor={'#F8F9FA'}

        paddingBlock={8}
        display={'flex'}
        justifyContent={'center'}
        sx={{ color: "#CD1B78" }}
      >
        {item.icon}
      </Box>
      <hr />
      <Box paddingInline={2} paddingBlock={1} marginTop={2}>
        <Box display={'flex'} alignItems={'center'} gap={1} >
          {item.descriptionIcon}
          <Typography variant='h6' fontSize={14} fontWeight={'bold'}>
            {item.description}
          </Typography>
        </Box>
        <Box
          paddingBlock={0.5}
          paddingInline={1}
          maxWidth={'fit-content'}
          bgcolor={'#D3D3D3'}
          marginTop={1.2}
          borderRadius={'8px'}>
          <Typography variant='h6' fontSize={10} fontWeight={'bold'}>
            Step {index}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}