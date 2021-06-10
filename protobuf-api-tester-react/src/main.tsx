import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { ProtoInteract } from "./components/ProtoInteract";
import { ProtoInfo } from "./common/constants";

export const Main: React.FunctionComponent = () => {
  const [protoInfo, setProtoInfo] = useState<ProtoInfo>({
    protoPath: "",
    pathToMainProtos: "",
    endpoint: "",
    packageName: "",
    requestMessageName: "",
    responseMessageName: "",
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/proto-interact"
          render={() => <ProtoInteract protoInfo={protoInfo} />}
        />
        <Route
          path="/"
          render={() => (
            <HomePage protoInfo={protoInfo} setProtoInfo={setProtoInfo} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};
