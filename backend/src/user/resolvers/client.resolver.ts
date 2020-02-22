import { Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from './../../auth/graphql-auth-guard';
import { ClientService } from '../services/client.service';
import { ObjectIDPipe } from './../../common/pipes/object-id.pipe';
import { ObjectID } from 'bson';
import { UserService } from '../user.service';

interface CreateSchema {
  name: string,
  phoneNumber: string
}

interface UpdateSchema {
  id: string,
  name?: string,
  phoneNumber: string
}

@UseGuards(GraphqlAuthGuard)
export class ClientResolver {

  constructor(private readonly clientService: ClientService,
    private readonly userService: UserService) {}

  @Mutation()
  createClient(@Args() data: CreateSchema) {
    return this.userService.findOrCreateClient(data.phoneNumber, data.name);
  }

  @Mutation()
  updateClient(@Args() data: UpdateSchema) {
    return this.clientService.update(new ObjectID(data.id), data.phoneNumber, data.name);
  }

  @Query()
  clients() {
    return this.clientService.index();
  }

  @Query()
  client(@Args('id', new ObjectIDPipe()) id: ObjectID) {
    return this.clientService.get(id);
  }

}
