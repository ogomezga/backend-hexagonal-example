/* eslint-disable @typescript-eslint/await-thenable */
import { Request, Response } from 'express';
import { Dependencies } from '../../container';
import { Talk } from '../../domain/entities/talk';
import { BaseObject } from '../../infrastructure/interfaces';
import { TalkBuilder } from '../../test/test-helpers/builders/talk-builder';
import { typedStub } from '../../test/test-helpers/typed-stub';
import makeTalksController from './talks-controller';

describe('Talks Controller', () => {
  const stubs = {
    json: typedStub<Response['json']>(),
    status: typedStub<Response['status']>(),
    next: jest.fn(),
    listAllTalks: typedStub<Dependencies['listAllTalks']>(),
    scheduleTalk: typedStub<Dependencies['scheduleTalk']>(),
  };

  const talksController = makeTalksController(stubs);

  describe('listAllTalks', () => {
    let body: BaseObject;
    let res: Partial<Response>;
    let req: Partial<Request>;
    let defaultTalk: Talk;

    beforeEach(() => {
      jest.resetAllMocks();
      body = {};
      req = {
        params: {},
        body: {},
        query: {},
      } as Partial<Request>;
      res = {
        json: stubs.json,
        status: stubs.status,
      } as Partial<Response>;
      stubs.json.mockReturnValue(res as any);
      stubs.status.mockReturnValue(res as any);

      defaultTalk = new TalkBuilder().build();
      stubs.listAllTalks.mockReturnValue(Promise.resolve([defaultTalk]));
    });

    test('flow', async () => {
      await talksController.listAllTalks(req as any, res as any, stubs.next);
      expect(stubs.listAllTalks).toBeCalledTimes(1);
      expect(stubs.status).toBeCalledTimes(1);
      expect(stubs.json).toBeCalledTimes(1);
    });

    test('jsonArgs', async () => {
      await talksController.listAllTalks(req as any, res as any, stubs.next);
      const [jsonArgs] = stubs.json.mock.calls[0];
      expect(jsonArgs).toEqual([defaultTalk]);
    });

    test('status args', async () => {
      await talksController.listAllTalks(req as any, res as any, stubs.next);
      const [statusArgs] = stubs.status.mock.calls[0];
      expect(statusArgs).toEqual(200);
    });
  });

  describe('scheduleTalk', () => {
    let body: BaseObject;
    let res: Partial<Response>;
    let req: Partial<Request>;
    let defaultTalk: Talk;

    beforeEach(() => {
      jest.resetAllMocks();
      body = {};
      req = {
        params: {},
        body: {
          title: 'Test',
          description: 'de insercion',
          speakers: ['Speaker1', 'Speaker2'],
          day: 1,
          duration: 60,
        },
        query: {},
      } as Partial<Request>;
      res = {
        json: stubs.json,
        status: stubs.status,
      } as Partial<Response>;
      stubs.json.mockReturnValue(res as any);
      stubs.status.mockReturnValue(res as any);

      defaultTalk = new TalkBuilder()
        .with('title', 'Test')
        .with('description', 'de insercion')
        .with('speakers', ['Speaker1', 'Speaker2'])
        .with('day', 1)
        .with('duration', 60)
        .build();
      stubs.scheduleTalk.mockReturnValue(Promise.resolve(defaultTalk));
    });

    test('flow', async () => {
      await talksController.saveTalk(req as any, res as any, stubs.next);
      expect(stubs.scheduleTalk).toBeCalledTimes(1);
      expect(stubs.status).toBeCalledTimes(1);
      expect(stubs.json).toBeCalledTimes(1);
    });

    test('jsonArgs', async () => {
      await talksController.saveTalk(req as any, res as any, stubs.next);
      const [jsonArgs] = stubs.json.mock.calls[0];
      expect(jsonArgs).toEqual(defaultTalk);
    });

    test('status args', async () => {
      await talksController.saveTalk(req as any, res as any, stubs.next);
      const [statusArgs] = stubs.status.mock.calls[0];
      expect(statusArgs).toEqual(201);
    });

    test('useCase args', async () => {
      await talksController.saveTalk(req as any, res as any, stubs.next);
      const [scheduleTalkArgs] = stubs.scheduleTalk.mock.calls[0];
      expect(scheduleTalkArgs.title).toEqual(req.body.title);
      expect(scheduleTalkArgs.description).toEqual(req.body.description);
      expect(scheduleTalkArgs.speakers).toEqual(req.body.speakers);
      expect(scheduleTalkArgs.day).toEqual(req.body.day);
      expect(scheduleTalkArgs.duration).toEqual(req.body.duration);
    });
  });
});
