import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

import { TextHelper } from '@/helpers/TextHelper';
import StarredMailIcon from '@/utils/icon/StarredMailIcon';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

interface AlertSideBarProps {
  onClick: (filter: string) => void;
  selectedFilter: string;
}

interface AlertSideBarProps {
  onClick: (filter: string) => void;
  selectedFilter: string;
  totalAlerts?: number;
}

const AlertSideBar = ({ onClick, selectedFilter, totalAlerts }: AlertSideBarProps) => {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#fff',
        height: 'calc(100vh - 200px)',
        padding: '16px',
        borderRight: '1px solid #eaeaea',
        borderLeft: '1px solid #eaeaea',
      }}
    >
      <Typography className="text-[20px] font-semibold mb-[24px] ml-[16px] text-[#000000]">Alerts</Typography>
      <List>
        {[
          { label: 'inbox', icon: <MailOutlinedIcon /> },
          { label: 'starred', icon: <StarredMailIcon /> },
          { label: 'Deleted', icon: <DeleteOutlineOutlinedIcon /> },
        ].map((item, index) => {
          return (
            <ListItem
              key={index}
              sx={{
                marginBottom: '8px',
                borderRadius: '6px',
                backgroundColor: item.label === selectedFilter ? '#FCEFF6' : 'transparent',
                '&:hover': { backgroundColor: '#FCEFF6' },
              }}
              className="cursor-pointer"
              onClick={() => onClick(item.label)}
            >
              <ListItemIcon className="text-[#767676]">{item.icon}</ListItemIcon>
              <ListItemText
                primary={TextHelper.capitalize(item.label)}
                primaryTypographyProps={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginLeft: '-23px',
                }}
                className="text-[#767676] font-bold"
              />
              {item.label === selectedFilter && (
                <Typography variant="caption" className="bg-[#C10A0A] text-white rounded-[4px] px-[5px] py-[4px] font-medium">
                  {totalAlerts}
                </Typography>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default AlertSideBar;
