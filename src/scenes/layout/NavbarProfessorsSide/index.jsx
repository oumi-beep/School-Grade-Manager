import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import loginImage from "../../../assets/images/login.jpg";
import { ToggledContext } from "../../../App";

const NavbarProfessorsSide = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      {/* Menu Icon */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
      </Box>

      {/* Logo and Title */}
      <Box display="flex" alignItems="center" gap={2}>
        <img
          src={loginImage}
          alt="Logo"
          style={{ width: '40px', height: '40px' }}
        />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ensa-Kh</span>
      </Box>

      {/* Navigation Links for Professors */}
      <Box>
        <nav className="nav-links">
          <a href="/ProfessorsSide">Overview</a>
          <a href="/ProfessorsSide/notes">Enter Grades</a>
          <a href="/ProfessorsSide/validate">Validate Grades</a>
          <a href="/ProfessorsSide/Elements">Elements</a>
          <a href="/ProfessorsSide/Modules">Modules</a>
          <a href="/ProfessorsSide/schedule">schedule</a>
         </nav>

      </Box>

      {/* Icon Buttons for Settings and Mode Toggle */}
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton>
          <PersonOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NavbarProfessorsSide;
