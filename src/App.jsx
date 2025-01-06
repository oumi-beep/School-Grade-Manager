import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar } from "./scenes";
import NavbarProfessorsSide from "./scenes/layout/NavbarProfessorsSide";
import { Outlet, useLocation } from "react-router-dom";
import './indexx.css';

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  const location = useLocation();

  // Check if the current path is "/ProfessorsSide"
  const isProfessorsSide = location.pathname.startsWith("/ProfessorsSide");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              {/* Render the appropriate Navbar based on the route */}
              {isProfessorsSide ? <NavbarProfessorsSide /> : <Navbar />}

              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
