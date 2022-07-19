import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EchoServiceClient as _EchoServiceClient, EchoServiceDefinition as _EchoServiceDefinition } from './EchoService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  EchoMessage: MessageTypeDefinition
  EchoService: SubtypeConstructor<typeof grpc.Client, _EchoServiceClient> & { service: _EchoServiceDefinition }
}

