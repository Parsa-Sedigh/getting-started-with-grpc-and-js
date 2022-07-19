const grpc = require('@grpc/grpc-js');

const client = new EchoService('localhost:3000', grpc.crednetials.createInsecure());

// We can read from and write to this stream:
const stream = client.echoBidiStream({value: 'hello server stream'});

stream.on('error', console.error);
stream.on('data', console.log);
stream.on('end', () => client.close());

stream.write({value: 'hello bidi stream 1'});
stream.end({value: 'hello bidi stream 2'});
