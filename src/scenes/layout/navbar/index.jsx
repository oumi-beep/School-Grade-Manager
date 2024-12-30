import {
  Box,
  IconButton,
  InputBase,
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
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import loginImage from "../../../assets/images/login.jpg";
import { ToggledContext } from "../../../App";
const Navbar = () => {

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

      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>


      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <img src={loginImage} alt="Logo" style={{ width: '40px', height: '40px' }} />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ensa-Kh</span>
      </Box>


      <Box>
        <nav className="nav-links">
          <a href="/Dashboard">Dashboard</a>
          <a href="/Dashboard/Professors">Professors</a>
          <a href="/Dashboard/Fields">Fields</a>
          <a href="/Dashboard/ModuleElement">Modules and Elements</a>
          <a href="/Dashboard/ModeEvaluation">Evaluation Modalities</a>
          <a href='/Dashboard/invoices' >Acount</a>
          <a href="/Dashboard/faq">FAQ</a>
          <a href="/Dashboard/calendar">Calendar</a>
        </nav>
      </Box>

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

export default Navbar;
