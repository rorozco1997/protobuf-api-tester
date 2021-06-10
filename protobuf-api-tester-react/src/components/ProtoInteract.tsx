import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ProtoInfo } from "../common/constants";
import protobuf from "protobufjs";
import { PrimaryButton, Shimmer, TextField } from "@fluentui/react";

interface ProtoInteractProps {
  protoInfo: ProtoInfo;
}

// TODO: handle cases where it's just by query
export const ProtoInteract: React.FunctionComponent<ProtoInteractProps> = ({
  protoInfo,
}) => {
  const history = useHistory();
  const [isLoadingProtosIn, setIsLoadingProtosIn] = useState(true);
  const [requestMessageType, setRequestMessageType] = useState<any>(undefined);
  const [responseMessageType, setResponseMessageType] =
    useState<any>(undefined);
  const [userJsonInput, setUserJsonInput] = useState();

  if (isLoadingProtosIn) {
    protobuf.load(protoInfo.pathToMainProtos, (err, root) => {
      if (err || !root) {
        console.log(err);
        alert("Error loading protos. Returning.");
        history.push("/");
      } else {
        const requestMessage = root.lookupType(
          `${protoInfo.packageName}.${protoInfo.requestMessageName}`
        );
        setRequestMessageType(requestMessage);

        const responseMessage = root.lookup(
          `${protoInfo.packageName}.${protoInfo.responseMessageName}`
        );
        setResponseMessageType(responseMessage);

        setIsLoadingProtosIn(false);
      }
    });
  }

  if (
    !protoInfo ||
    !protoInfo.protoPath ||
    !protoInfo.endpoint ||
    !protoInfo.pathToMainProtos
  ) {
    history.push("/");
  }

  return (
    <div>
      {isLoadingProtosIn && (
        <Shimmer hidden={!isLoadingProtosIn} value="Loading Protos" />
      )}
      {!isLoadingProtosIn && (
        <div>
          <TextField
            label={"Enter JSON data"}
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
              newValue?: string
            ) => {
              try {
                if (newValue) {
                  const data = JSON.parse(newValue);
                  setUserJsonInput(data);
                } else {
                  setUserJsonInput(undefined);
                }
              } catch (err) {
                alert("Could not parse JSON. Input valid JSON");
              }
            }}
          />
          <PrimaryButton
            label="Execute"
            onClick={() => {
              alert(
                "Parse output: " + requestMessageType.verify(userJsonInput)
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
