import React from "react";
import { Container } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material";
import { 
  BrowserRouter as Router,
  Routes,
  Route 
} from 'react-router-dom';

import Navbar from "./components/Navbar";
import GenerateNote from "./pages/GenerateNote";
import Dashboard from "./pages/Dashboard";
import NavigateRoute from "./components/NavigateRoute";


const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#00BFB2",
      },
      danger: {
        main: "#8B0000",
      }
    }
  });
  

  return (
    <Router>
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container>
        <Routes>
          <Route path="*" element={<NavigateRoute to="/dashboard" />}></Route> 
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/record" element={<GenerateNote />}></Route>
        </Routes>
      </Container>
    </ThemeProvider>
    </Router>
  );
};

export default App;