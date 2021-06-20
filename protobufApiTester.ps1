Param(
    [string]
    $protoRoot,
    [string[]]
    $pathsToProto
)

npm install

npm run pbjs -- --path $protoRoot -t json-module --es6 -w commonjs -o "$PSScriptRoot/src/protobuf/bundle.js" $pathsToProto

npm start