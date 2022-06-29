Video url: https://www.youtube.com/watch?v=fl9AZieRUaw&ab_channel=node.js

The thing that makes grpc unique is that it leverages HTTP2, so HTTP1 is not gonna be an option.

## introduction to gRPC
- a high performance universal RPC framework
- leverages http2 and protocol buffers

Protocol buffers is the way you serialize data so think of it as sth like JSON except it's a more compact binary representation.

## features
- 4 RPC types(unary, client streaming, server streaming and bi-directional or bidi streaming): The streaming apis like client side, basically means
  the client is gonna send a stream of messages to the server. The server will respond with one response. Server-side streaming is the client will send
  one req and the server will respond with stream of response. Bi-directional is for both ways and unary is just a fancy word for a single req, single
  response, kinda what you would think of with a normal HTTP req.
- metadata: A fancy way of talking about the http2 headers. gRPC kinda strips out some of the http2 headers and uses what they call metadata, as a way to
  send information about rpc back and forth. One of the things you can use for that is authentication which is built-in. So you can kind of 
  roll your own authentication. It also has built-in support for google authentication.
- authentication
- deadlines and cancellation: This just means that either side of the rpc(the client or the server) is able to timeout or cancel the request at any point.
- compression: This is supported out of the box.
- load balancing: Other http frameworks doesn't have this, but grpc has it builtin. grpc has a builtin load balancer in the client where you can give it a list of 
  servers and then it will actually balance between those when it's sending it's req.
- automatically generated boilerplate: It can generate documentation, a it can generate a client for you, so you don't have to use the gRPC directly.

## Protocol buffers
Protocol buffers are verisoned, so this allows you to define which version of the protocol buffers you're using.



