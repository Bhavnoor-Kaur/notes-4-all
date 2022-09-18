import React from "react";
import { Container } from "@mui/system";
import { AppBar, createTheme, ThemeProvider } from "@mui/material";

import CreateNote from "./pages/CreateNote";
import GenerateNote from "./pages/GenerateNote";
import Navbar from "./components/Navbar";


const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#00BFB2"
      },
      danger: {
        main: "#"
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
    <Navbar />
    <Container maxWidth="xs">
      {/* <CreateNote /> */}
      <GenerateNote />
    </Container>
    </ThemeProvider>
  );
};

export default App;