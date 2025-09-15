import useCustomTheme from "@/hooks/theme.hook";
import { Box, Link } from "@mui/material";
import Wrapper from "../wrappers/Wrapper";

const AuthNav = () => {
  const { themeColors } = useCustomTheme();

  return (
    <Box sx={{ borderBottom: `2px solid ${themeColors.borderColor}` }}>
      <Wrapper>
        <Box sx={{ py: 2 }} className="d-flex items-center justify-between">
          <Box className="d-flex items-center">
            <Link href={process.env.NEXT_PUBLIC_CLIENT_HOST}>
              <img
                src="/assets/images/logo.png"
                alt="logo"
                width={70}
                height={40}
                style={{ marginLeft: "10px" }}
              />
            </Link>
          </Box>
        </Box>
      </Wrapper>
    </Box>
  );
};

export default AuthNav;
