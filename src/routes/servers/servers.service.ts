import { ObjectId } from "mongodb";
import { Inject, Injectable, forwardRef } from "@nestjs/common";

import { ServiceError } from "@/common/error/catch.service";
import { ServersRepository } from "@/routes/servers/servers.repository";
import { Server, Config, Role } from "@/routes/servers/interfaces/servers.interface";
import { DTOserverCreate, DTOserverUpdate } from "@/routes/servers/dto/server.dto";

@Injectable()
export class ServersService {
  constructor(
    @Inject(forwardRef(() => ServersRepository))
    private readonly serversRepository: ServersRepository
  ) {
  }

  getAllServers() {
    return this.serversRepository.findServers();
  }

  getUserServer(userId: ObjectId) {
    return this.serversRepository.findServers({ $or: [{ members: { $in: [userId] } }, { ownerId: userId }] });
  }

  createServer(serverDTO: DTOserverCreate, userId: ObjectId) {
    const role: Role = {
      name: "Owner"
    };
    const config: Config = {
      roles: Array(role)
    };
    return this.serversRepository.create({
      ownerId: userId,
      createdAt: new Date(),
      iconUrl: serverDTO.iconUrl,
      bannerUrl: serverDTO.bannerUrl,
      name: serverDTO.name,
      isPublic: serverDTO.isPublic,
      _id: new ObjectId(),
      members: [],
      config: config
    });
  }

  updateServer(server: DTOserverUpdate, userId: ObjectId) {
    const members = Array<ObjectId>()
    server.members.forEach(member => members.push(new ObjectId(member)))
    return this.serversRepository.findOneAndUpdate({
      _id: new ObjectId(server._id),
      ownerId: userId
    }, {
      $set: {
        name: server.name,
        isPublic: server.isPublic,
        config: server.config,
        members: members,
        bannerUrl: server.bannerUrl,
        iconUrl: server.iconUrl
      }
    });
  }

  deleteServers(serverId: string, userId: ObjectId) {
    return this.serversRepository.deleteOne({ _id: new ObjectId(serverId), ownerId: userId });
  }

  // Create your own business logic here
  // If the function is async but does not await something, we don't add the modifier async to the function
  // Just keep that in mind

  // If you wanna throw an error manually after a condition, use new ServiceError(type, message);
  // Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

  // If you need a document from another repository in another module, you use the service of that module to get it throught a function.
  // You do not import directly the repository of another module.
}