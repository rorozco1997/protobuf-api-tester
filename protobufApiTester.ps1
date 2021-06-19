Param(
    [string]
    $protoRoot,
    [string[]]
    $pathsToProto
)

npm install

npm run pbjs -- -t json-module -w commonjs -o "$PSScriptRoot/src/protobuf/bundle.js" $pathsToProto

npm start