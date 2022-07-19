Video url: [nodejs conf 2019 - Getting Started with gRPC and JavaScript - Colin Ihrig, Joyent](https://www.youtube.com/watch?v=fl9AZieRUaw&ab_channel=node.js)

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
This library has no runtime dependencies other than semver which is to check the dependency string. So you don't have to worry about 
people slipping viruses into your code.

Look at 1-4 example files.

## @grpc/proto-loader:
It's another module that we use to actually load protofiles into your app. The original grpc module, the compiled addon with the C-core, actually supports loading
these things by default in the module itself, but when they moved over the grpc-js, they wanted separate out that functionality(maybe the reason for that
was to create a separate package for protofiles that could be versioned independently without messing with rest of the module). 

This package under the hood uses `protobufjs`

- `@grpc/grpc-js` drops support for loading .proto files
- uses `protobufjs` for handling protocol buffers

Look at 5th file.

If you have a big number that won't fit into a typical JS number, you might want it encode it in string and ... .

## introducing grpc-server-js:
@grpc/grpc-js was great but they wanted to have a mock server because remember the original use case was trying to talk to golang services.
So there is a `grpc-server-js` for grpc with js on server.

- unofficial module warning
- pure js gRPC server implementation
- API compatible with grpc's server
- only production dependency is @grpc/grpc-js
  - shares status constants and metadata class
- lead to several upstream performance improvements


Look at 6-example-server.js .

You can generate the proto types for usage by running: 
`./node_modules/.bin/proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto`

## testing `grpc-server-js`:
The author of `grpc-server-js`, did these:
- ported many grpc tests to ensure compatibility
- added more tests where coverage was missing
- uncovered a handful of significant bugs in @grpc/grpc-js
- ~95% test coverage

## server improvements:
Author was able to go back and make some improvements to the upstream module. The upstream module authors were focused on the client, they didn't have
a server implementation.

V8 doesn't really like the `delete` operator. It changes the shape of the class under the hood and so it causes your code to slow down.

- ignore reserved headers during header parsing
  - saves `delete` operations in client
  - saves extra loop on each request in server
- code simplification/modernization
- drop `loadash`
- ~15-20% improvement in server req/sec
- upstreamed `grpc-server-js` in june 2019

I guess now the module is merged to ``.

The performance difference between the pure js implementation and compiled addon, is that grpc-server-js is slower than grpc addon.

## pain points:
- grpc support in larger system architecture: For example a load balancer doesn't know how to load balance grpc traffic. You can't just use an L4 load balancer,
  you need an L7 that understands grpc. 
- benchmarking grpc vs non-grpc servers: You can't just use a normal http load generator to throw the same traffic at an express server and then also grpc server.
  So it's hard to compare those servers.
- nodejs grpc community seems quiet
- feels more like a google project than a comunity one 
- gRPC-web without envoy would be nice

## future work:
- improve feature parity between grpc-js and the grpc module(interceptors(their version of middleware), more server options)
- continued performance and stability work
- integration of nodejs workers
- gRPC-web in-progress nodejs proxy
- tooling and nodejs ecosystem integration




