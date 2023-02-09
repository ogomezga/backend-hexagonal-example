import express from 'express';
import { Dependencies } from '../../container';
import * as joi from 'joi';
import { handleRoute } from '../../infrastructure/http';
import { validateRequestPayload, ValidationTarget } from '../../infrastructure/middleware/validate-payload';
import { Talk } from '../../domain/entities/talk';

export default function makeTalkRouter({ talksController }: Dependencies) {
  const router = express.Router();

  router.get('/', handleRoute(talksController.listAllTalks));

  router.post(
    '/',
    validateRequestPayload(
      joi.object<Talk>().keys({
        title: joi.string().required(),
        description: joi.string().required(),
        speakers: joi.array().items(joi.string().required()).required(),
        day: joi.number().integer().ruleset.min(1).max(2).rule({ message: 'Only day 1 or 2 admitted' }).required(),
        duration: joi
          .when('day', {
            is: joi.number().valid(1),
            then: joi
              .number()
              .integer()
              .ruleset.min(1)
              .max(480)
              .rule({ message: 'The time for scheduling a talk should be between 1 and 480 minutes.' }),
            otherwise: joi
              .number()
              .integer()
              .ruleset.min(1)
              .max(300)
              .rule({ message: 'The time for scheduling a talk should be between 1 and 300 minutes.' }),
          })
          .required(),
      }),
      ValidationTarget.BODY,
    ),
    handleRoute(talksController.saveTalk),
  );

  return router;
}
