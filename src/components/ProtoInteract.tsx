import React, { useEffect, useState } from "react";
import root from "../protobuf/bundle";
import {
  PrimaryButton,
  TextField,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";

export const ProtoInteract: React.FunctionComponent = () => {
  const [packageList, setPackageList] = useState<IDropdownOption[]>([]);
  const [messageList, setMessageList] = useState<IDropdownOption[]>([]);
  const [packageSelected, setPackageSelected] = useState<string>();
  const [requestMessage, setRequestMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [httpMethod, setHttpMethod] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [userJsonInput, setUserJsonInput] = useState<string>("");

  const httpMethods: IDropdownOption[] = [
    { key: "GET", text: "GET" },
    { key: "POST", text: "POST" },
  ];

  useEffect(() => {
    if (packageList.length === 0) {
      setPackageList(
        Object.keys(root.nested as any).map((pkg: string) => {
          return { key: pkg, text: pkg };
        })
      );
    }
  }, [packageList]);

  if (!root.nested) {
    alert("Protobuf import not successful. Closing");
    return <h1>Protobuf Import Failure. Restart script!</h1>;
  }

  return (
    <div>
      <Dropdown
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
        </div>
      )}
    </div>
  );
};

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
      mode: "no-cors",
      body: data ? data : undefined,
    });

    alert("Response code: " + response.status);

    if (responseMessage) {
      const resp = root.lookupType(`${packageSelected}.${responseMessage}`);
      const responseBody = await (await response.blob()).arrayBuffer();
      const parsedResponse = resp.decode(new Uint8Array(responseBody));
      alert("Response message: " + JSON.stringify(parsedResponse.toJSON()));
    }
  } catch (err) {
    alert(`Error: ${err}. Please try again`);
  }
}
