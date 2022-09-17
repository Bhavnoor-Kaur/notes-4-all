import React from "react";
import { Container } from "@mui/system";

import CreateNote from "./pages/CreateNote";
import GenerateNote from "./pages/GenerateNote";

const App = () => {

  return (
    <Container maxWidth="xs">
      {/* <CreateNote /> */}
      <GenerateNote />
    </Container>
  );
};

export default App;