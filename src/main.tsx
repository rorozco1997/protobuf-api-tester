import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ProtoInteract } from "./components/ProtoInteract";

export const Main: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" render={() => <ProtoInteract />} />
      </Switch>
    </BrowserRouter>
  );
};
