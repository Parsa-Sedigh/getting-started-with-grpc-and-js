const grpc = require('@grpc/grpc-js');

// pass the host and the port that you want to connect to(because WE are the client):
const client = new EchoSservice('localhost:3000', grpc.crednetials.createInsecure());

client.echoUnary({value: 'hello unary'}, (err, response) => {
    if (err) {
        console.error(err);
    } else {
        console.log(response);
    }

    client.close();
});
