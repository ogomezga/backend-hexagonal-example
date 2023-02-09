import { RequestHandler } from 'express';
import { Dependencies } from '../../container';
import { Talk } from '../../domain/entities/talk';

export default function makeTalksController({ listAllTalks, scheduleTalk }: Partial<Dependencies>) {
  return {
    listAllTalks: async function (req, res) {
      return res.status(200).json(await listAllTalks());
    } as RequestHandler,
    saveTalk: async function (req, res) {
      return res.status(201).json(await scheduleTalk(new Talk(req.body)));
    } as RequestHandler,
  };
}
