import * as React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box } from "@mui/material";

type Anchor = "top" | "left" | "bottom" | "right";

interface IProps {
  anchor: "top" | "left" | "bottom" | "right";
  open: boolean;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomDrawer: React.FC<IProps> = ({
  anchor,
  open,
  children,
  setOpen,
}) => {
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  return (
    <div>
      <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >
        <Box
          sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          {children}
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export const useDrawer = () => {
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return { open, setOpen, openDrawer, closeDrawer };
};

export default CustomDrawer;
