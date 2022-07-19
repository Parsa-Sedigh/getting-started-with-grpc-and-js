const grpc = require('@grpc/grpc-js');

const client = new EchoSservice('localhost:3000', grpc.crednetials.createInsecure());

/* Because this is a client stream, the response from the server is gonna be 1 response, so we get the callback the same as before: */
const stream = client.echoServerStream({value: 'hello server stream'});

/* attach all the error handles, data handlers and ... and we can consume as many of the response messages as the server is gonna send to us, as we want: */
stream.on('error', console.error);
stream.on('data', console.log);
stream.on('end', () => client.close());

stream.end({value: 'hello client stream'});
