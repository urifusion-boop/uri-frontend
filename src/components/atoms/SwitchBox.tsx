import { Box, SxProps, Theme, Typography } from '@mui/material';

import IosSwitch from '@/components/atoms/IosSwitch';
import React from 'react';

interface ISwitchBoxProps {
  title: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: (item: any, event?: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperStyle?: SxProps<Theme>;
}

const SwitchBox = (props: ISwitchBoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        gap: 2,
        padding: 2,
        border: '1px solid #A6A6A699',
        borderRadius: '8px',
        marginBottom: 2,
        maxWidth: '437px',
        width: '100%',
        ...props.wrapperStyle,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <props.icon size={32} color="#CD1B78" />
        <Typography
          sx={{
            fontSize: { xs: '14px', md: '16px' },
          }}
        >
          {props.title}
        </Typography>
      </Box>
      <IosSwitch
        selectedColor="#CD1B78"
        size="small"
        checked={props.checked}
        onChange={(e) => {
          props.onChange(props, e);
        }}
      />
    </Box>
  );
};

export default SwitchBox;
