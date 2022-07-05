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
Protocol buffers are versioned, so this allows you to define which version of the protocol buffers you're using.
Look at 1.proto . We're gonna create an echo server which means whatever the client sends, the server will just send that message back. Nothing useful!

## gRPC and JS
- two primary envs: browser and nodejs
- browser has fundamental limitations regarding gRPC
- might not support http2 at all
- lacks APIs for fine-grained control over HTTP2
- nodejs is a typical backend env

The biggest limitation of browser regarding grpc is being able to specify that you want to use http2. There's no api that's builtin for that and
if you're using an old browser, it might not even be supported at all.
But then you also have to have more precise control over the http2 frames that you're sending out on the network, which browsers just don't 
give you any insight into

## grpc-web
- introduces mandatory proxy(Envoy is the default)
- proxy translates between gRPC-web and gRPC over HTTP2
- `protoc` used to compile protocol buffers to commonjs

The way grpc-web works is you have to introduce an Envoy server into your stack somewhere and the Envoy server serves as a proxy, so you have a browser 
that can communicate over grpc-web which is just a slightly different protocl over http1 using xhr reqs. Your browser will talk to Envoy and then Envoy
will proxy your messages back to NORMAL grpc server.

## the gRPC module
- used to develop both clients and servers
- compiled addon leveraging gRPC C core(so it's a native compiled addon)
- 100+ builds provided
- built using NAN, not N-API(NAN is no longer considered the best way to write native addons)

About #3:
one of the things they do to kinda of ease the pain of using a compile addon, is that they provide pre-builds. So a pre-compiled
version of the module for different OS and different versions of the module and ... .

But there's a big problem with compiled addons(see next section):

## compiled addons

## gRPC in pure JS
- compiled addons should be last resort in node apps
- compiled addons can outperform pure js code
  - need to account for crossing c++ <---> JS boundary: When you keep corssing the JS and C++ boundary a lot, depending on how chatty your
    addon is, it can introduce significant delays to your code.
- can significantly complicate debugging
  - many js developers are not c++ devs
  - few tools for sanctimoniously debugging JS and C++

We wanted to avoid the issues we were having jumping between versions in node. We wanted to avoid a compiled addon. 
So they decided to write a pure JS implementation and they had sth called @grpc/js which by the time they created this, they had moved it under the 
grpc namespace on npm.

## The @grpc/grpc-js module
- currently in beta
- API compatible with `grpc` module
- written in TS
- uses node's http2 module
  - officially supported in node 10.10.0
- required semvr range: ^8.13.0 || >=10.0.
  - recommended running with latest Node 10 LTS

About #2:
It's api is compatible with `grpc` module or library. So you can actually drop it in anywhere you're using `grpc` before. The exception is if you're
using some of the features that aren't supported yet in @grpc/grpc-js .

About #4:
Whenever you go to require or import @grpc/grpc-js , it will do a version check, so you have to be using ^8.13.0 || >=10.0 .
This library has no runtime dependencies other than semvr which is to check the dependency string. So you don't have to worry about 
people slipping viruses into your code.

## Example unary client
TODO: Till 12:30