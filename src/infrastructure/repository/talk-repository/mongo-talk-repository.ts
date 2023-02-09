import { Talk } from '../../../domain/entities/talk';
import { TalkRepositoryInterface } from '../../../domain/repositories/talk-repository';
import { InfrastructureDependencies } from '../../container';
import { adaptResult } from '../../mongo-client';

export default function makeMongoTalkRepository({ mongoClient }: Partial<InfrastructureDependencies>): TalkRepositoryInterface {
  const collectionName = 'talks';
  return {
    async findAll() {
      const dbObjs = await mongoClient.getCollection(collectionName).find({}).toArray();
      return dbObjs.map((d) => restore(d));
    },
    async create(talk: Talk): Promise<Talk> {
      const dbObj = adaptResult(await mongoClient.getCollection(collectionName).insertOne(adapt(talk)));
      return dbObj ? restore(dbObj) : null;
    },
  };
}

export function adapt(input: Talk) {
  return {
    id: input.id,
    day: input.day,
    startHour: input.startHour,
    endHour: input.endHour,
    room: input.room,
    duration: input.duration,
    title: input.title,
    description: input.description,
    speakers: input.speakers,
  };
}

type TalkDto = ReturnType<typeof adapt>;

export function restore(dbInput: TalkDto): Talk {
  return new Talk({
    id: dbInput.id,
    day: dbInput.day,
    startHour: dbInput.startHour,
    endHour: dbInput.endHour,
    room: dbInput.room,
    duration: dbInput.duration,
    title: dbInput.title,
    description: dbInput.description,
    speakers: dbInput.speakers,
  });
}
