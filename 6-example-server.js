const {Server} = require('grpc-server-js');

const server = new Server();

// simple implementation of server:
server.addService(EchoService.service, {
    echoUnary(call, callback) {
        callback(null, call.request);
    },
    echoClientStream(stream, callback) {
        stream.once('data', (data) => callback(null, data));
    },
    echoServerStream(stream) {
        stream.write(stream.request);
        stream.end();
    },
    echoBidiStream(stream) {
        stream.on('data', (data) => stream.write(data));
        stream.on('end', () => stream.end());
    },
});

