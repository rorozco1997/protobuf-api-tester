import React, { FormEvent } from "react";
import { useHistory } from "react-router-dom";
import { PrimaryButton, TextField } from "@fluentui/react";
import { ProtoInfo } from "../common/constants";

interface HomePageProps {
  protoInfo: ProtoInfo;
  setProtoInfo: (protoInfo: ProtoInfo) => void;
}

export const HomePage: React.FunctionComponent<HomePageProps> = ({
  protoInfo,
  setProtoInfo,
}) => {
  const history = useHistory();

  return (
    <div>
      <h1>Provide information</h1>
      <TextField
        label="ProtoPath"
        value={protoInfo.protoPath}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: newValue ? newValue : "",
            pathToMainProtos: protoInfo.pathToMainProtos,
            endpoint: protoInfo.endpoint,
            packageName: protoInfo.packageName,
            requestMessageName: protoInfo.requestMessageName,
            responseMessageName: protoInfo.responseMessageName,
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <TextField
        label="Path to Request/Response Protos"
        value={protoInfo.pathToMainProtos}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: protoInfo.protoPath,
            pathToMainProtos: newValue ? newValue : "",
            endpoint: protoInfo.endpoint,
            packageName: protoInfo.packageName,
            requestMessageName: protoInfo.requestMessageName,
            responseMessageName: protoInfo.responseMessageName,
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <TextField
        label="Endpoint"
        value={protoInfo.endpoint}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: protoInfo.protoPath,
            pathToMainProtos: protoInfo.pathToMainProtos,
            endpoint: newValue ? newValue : "",
            packageName: protoInfo.packageName,
            requestMessageName: protoInfo.requestMessageName,
            responseMessageName: protoInfo.responseMessageName,
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <TextField
        label="Package Name"
        value={protoInfo.packageName}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: protoInfo.protoPath,
            pathToMainProtos: protoInfo.pathToMainProtos,
            endpoint: protoInfo.endpoint,
            packageName: newValue ? newValue : "",
            requestMessageName: protoInfo.requestMessageName,
            responseMessageName: protoInfo.responseMessageName,
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <TextField
        label="Request Message Name (If Applicable)"
        value={protoInfo.requestMessageName}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: protoInfo.protoPath,
            pathToMainProtos: protoInfo.pathToMainProtos,
            endpoint: protoInfo.endpoint,
            packageName: protoInfo.packageName,
            requestMessageName: newValue ? newValue : "",
            responseMessageName: protoInfo.responseMessageName,
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <TextField
        label="Response Message Name (If Applicable)"
        value={protoInfo.responseMessageName}
        onChange={(
          event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
          newValue?: string
        ) => {
          const newProtoInfo: ProtoInfo = {
            protoPath: protoInfo.protoPath,
            pathToMainProtos: protoInfo.pathToMainProtos,
            endpoint: protoInfo.endpoint,
            packageName: protoInfo.packageName,
            requestMessageName: protoInfo.requestMessageName,
            responseMessageName: newValue ? newValue : "",
          };

          setProtoInfo(newProtoInfo);
        }}
      />
      <PrimaryButton
        label="Submit Information"
        onClick={() => {
          if (
            protoInfo.endpoint &&
            protoInfo.pathToMainProtos &&
            protoInfo.protoPath
          ) {
            history.push("/proto-interact");
          }
        }}
      />
    </div>
  );
};
