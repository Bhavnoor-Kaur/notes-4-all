import React from "react";
import { Container } from "@mui/system";

import CreateNote from "./pages/CreateNote";

const App = () => {

  return (
    <Container maxWidth="xs">
      <CreateNote />
    </Container>
  );
};

export default App;