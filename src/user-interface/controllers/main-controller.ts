import { RequestHandler } from 'express';

export default function makeMainController()  {
  return {
    index: async function (req, res) {
      return res.json({ api: 'cats' });
    } as RequestHandler,
  };
};
