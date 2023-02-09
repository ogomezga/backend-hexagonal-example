import { Talk } from '../entities/talk';

export interface TalkRepositoryInterface {
  findAll(): Promise<Talk[]>;
  create(talk: Talk): Promise<Talk>;
}
