const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
// it's better to use the async version I guess
const packageDefinition = loader.loadSync('./1.proto', {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const pkg = grpc.loadPackageDefinition(packageDefinition);
