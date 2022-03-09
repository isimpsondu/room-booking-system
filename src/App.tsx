import React from "react";
import { ChainId, DAppProvider } from "@usedapp/core";
import { Container } from "@material-ui/core";
import { Header } from "./components/Header";
import { Main } from "./components/Main";

const config = {
  readOnlyChainId: ChainId.Rinkeby,
};

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container>
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
