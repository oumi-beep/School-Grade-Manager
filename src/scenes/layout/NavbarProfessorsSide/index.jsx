import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

   const userFirstname = localStorage.getItem("userFirstname ") || "Unknown";
  const userLastName = localStorage.getItem("userLastName") || "User";
  const userEmail = localStorage.getItem("email") || "No email";

   const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include", // Important for sending session cookies
      });
  
      // Clear user data from localStorage
      localStorage.clear();
  
      // Redirect to the login page
      console.log("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

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
          style={{ width: "40px", height: "40px" }}
        />
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Ensa-Kh</span>
      </Box>

      {/* Navigation Links for Professors */}
      <Box>
        <nav className="nav-links">
          <a href="/ProfessorsSide">Overview</a>
          <a href="/ProfessorsSide/notes">Enter Grades</a>
          <a href="/ProfessorsSide/validate">Validate Grades</a>
          <a href="/ProfessorsSide/Elements">Elements</a>
          <a href="/ProfessorsSide/Modules">Modules</a>
          <a href="/ProfessorsSide/schedule">Schedule</a>
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
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlined />
        </IconButton>
        {/* Dropdown Menu for Professor Information */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem>
            <Typography variant="subtitle1" fontWeight="bold">
              {`${userFirstname} ${userLastName}`}
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">Email: {userEmail}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Button
              variant="contained"
              color="error"
              style={{ backgroundColor: "#6c757d" }}
              fullWidth
            >
              Logout
            </Button>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default NavbarProfessorsSide;
