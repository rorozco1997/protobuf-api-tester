import React, { useEffect, useState } from "react";
import root from "../protobuf/bundle";
import {
  PrimaryButton,
  TextField,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";

import "./ProtoInteract.scss";

export const ProtoInteract: React.FunctionComponent = () => {
  const [packageMap, setPackageMap] = useState<Map<string, string[]>>(
    new Map()
  );
  const [packageList, setPackageList] = useState<IDropdownOption[]>([]);
  const [messageList, setMessageList] = useState<IDropdownOption[]>([]);
  const [packageSelected, setPackageSelected] = useState<string>("");
  const [requestMessage, setRequestMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [httpMethod, setHttpMethod] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [userJsonInput, setUserJsonInput] = useState<string>("");
  const [responseCode, setResponseCode] = useState<string>("");
  const [responseData, setResponseData] = useState<string>("");

  const httpMethods: IDropdownOption[] = [
    { key: "GET", text: "GET" },
    { key: "POST", text: "POST" },
  ];

  useEffect(() => {
    if (packageList.length === 0) {
      const newPackageMap = new Map<string, string[]>();
      const newPackageList: IDropdownOption[] = [];
      function computeMapAndList(nextObj: any, packageNameAcc: string) {
        if (!nextObj.nested) {
          console.log("Shouldn't be possible?");
          return;
        }

        const objKeys = Object.keys(nextObj.nested);

        objKeys.forEach((objKey: string) => {
          const nextDescriptor = nextObj.nested[objKey];

          if (nextDescriptor.nested) {
            computeMapAndList(
              nextDescriptor,
              packageNameAcc ? packageNameAcc + "." + objKey : objKey
            );
          } else {
            if (newPackageMap.has(packageNameAcc)) {
              const pkgMessages = newPackageMap.get(packageNameAcc);

              if (!pkgMessages) {
                throw new Error(
                  "MASSIVE ERROR IN PKGMESSAGES. ABORT AND FIX BUG."
                );
              }

              pkgMessages.push(objKey);
              newPackageMap.set(packageNameAcc, pkgMessages);
            } else {
              newPackageList.push({
                key: packageNameAcc,
                text: packageNameAcc,
              });
              newPackageMap.set(packageNameAcc, [objKey]);
            }
          }
        });
      }

      computeMapAndList(root, "");
      setPackageList(newPackageList);
      setPackageMap(newPackageMap);
    }
  }, [packageList]);

  useEffect(() => {
    if (packageSelected) {
      const messageList = packageMap.get(packageSelected);

      if (!messageList) {
        throw new Error("Package counted but no messages!");
      }

      setMessageList(
        messageList.map((messageName: string) => {
          return { key: messageName, text: messageName };
        })
      );
    }
  }, [packageSelected, packageMap]);

  if (!root.nested) {
    alert("Protobuf import not successful. Closing");
    return <h1>Protobuf Import Failure. Restart script!</h1>;
  }

  async function networkCall(
    packageSelected: string,
    requestMessage: string,
    responseMessage: string,
    httpMethod: string,
    endpoint: string,
    jsonData: string
  ) {
    try {
      if (!root.nested) {
        throw new Error("Protobuf failed");
      }

      let data;

      if (jsonData) {
        const jsonParsed = JSON.parse(jsonData);
        const req = root.lookupType(`${packageSelected}.${requestMessage}`);
        const message = req.create(jsonParsed);
        data = req.encode(message).finish();
      }

      const response = await fetch(endpoint, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/octet-stream",
        },
        mode: "cors",
        body: data ? data : undefined,
      });

      if (responseMessage) {
        const resp = root.lookupType(`${packageSelected}.${responseMessage}`);
        const responseBody = await (await response.blob()).arrayBuffer();
        const parsedResponse = resp.decode(new Uint8Array(responseBody));
        setResponseData(JSON.stringify(parsedResponse.toJSON()));
      }

      setResponseCode(response.status.toString());
    } catch (err) {
      alert(`Error: ${err}. Please try again`);
    }
  }

  return (
    <div className="protoInteract">
      <h1 className="protoInteract__element">
        Select Your Package and Messages
      </h1>
      <Dropdown
        className="protoInteract__element"
        placeholder="Select a detected package"
        label="Package Selection"
        options={packageList}
        selectedKey={packageSelected}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          item?: IDropdownOption
        ) => {
          setPackageSelected(item ? item.text : "");

          if (item) {
            const nested = root.nested
              ? (root.nested[item.text] as any)
              : undefined;
            if (nested) {
              setMessageList(
                Object.keys(nested.nested).map((message: string) => {
                  return { key: message, text: message };
                })
              );
            }
          }
        }}
      />
      {packageSelected && (
        <div>
          <Dropdown
            className="protoInteract__element"
            placeholder="Select a message as your request type"
            label="Request Selection (if applicable)"
            options={messageList}
            selectedKey={requestMessage}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              item?: IDropdownOption
            ) => {
              setRequestMessage(item ? item.text : "");
            }}
          />
          <Dropdown
            className="protoInteract__element"
            placeholder="Select a message as your response type"
            label="Response Selection (if applicable)"
            options={messageList}
            selectedKey={responseMessage}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              item?: IDropdownOption
            ) => {
              setResponseMessage(item ? item.text : "");
            }}
          />
          <Dropdown
            className="protoInteract__element"
            placeholder="Select HTTP method"
            label="HTTP Method"
            options={httpMethods}
            selectedKey={httpMethod}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              item?: IDropdownOption
            ) => {
              setHttpMethod(item ? item.text : "");
            }}
          />
          <TextField
            className="protoInteract__element"
            label={"Enter Endpoint"}
            value={endpoint}
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
              newValue?: string
            ) => {
              setEndpoint(newValue ? newValue : "");
            }}
          />
          <TextField
            className="protoInteract__element"
            label={"Enter JSON data (if applicable)"}
            value={userJsonInput}
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
              newValue?: string
            ) => {
              setUserJsonInput(newValue ? newValue : "");
            }}
          />
          <PrimaryButton
            className="protoInteract__element"
            label="Execute"
            text="Execute"
            onClick={() => {
              networkCall(
                packageSelected,
                requestMessage,
                responseMessage,
                httpMethod,
                endpoint,
                userJsonInput
              );
            }}
          />
          <hr />
          {responseCode !== "" && (
            <div>
              <h1 className="protoInteract__element">Response Information</h1>
              <TextField
                className="protoInteract__element"
                label="Response code"
                readOnly
                value={responseCode}
              />
              <TextField
                className="protoInteract__element"
                label="Response body"
                readOnly
                value={
                  responseData ? responseData : "No response body available"
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
