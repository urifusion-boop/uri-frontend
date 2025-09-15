import { Badge } from '@mui/material';
import React from 'react';

interface Props {
  count: number;
}

const UnreadCountBadge: React.FC<Props> = ({ count }) => {
  return (
    <Badge
      badgeContent={count}
      color="primary"
      sx={{
        '& .MuiBadge-badge': {
          top: '50%',
          right: -8,
        },
      }}
    />
  );
};

export default UnreadCountBadge;
