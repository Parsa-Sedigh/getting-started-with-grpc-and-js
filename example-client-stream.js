const grpc = require('@grpc/grpc-js');

const client = new EchoSservice('localhost:3000', grpc.crednetials.createInsecure());

/* Because this is a client stream, the response from the server is gonna be 1 response, so we get the callback the same as before: */
const stream = client.echoClientStream({value: 'hello unary'}, (err, response) => {
    if (err) {
        console.error(err);
    } else {
        console.log(response);
    }

    client.close();
});

stream.end({value: 'hello client stream'});
