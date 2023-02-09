import { BusinessConflictError } from './base/business-conflict-error';

export class TitleTalkBusinessConflictError extends BusinessConflictError {
  static code = 'title-talk-business-conflic';

  constructor(talkId: string) {
    super({
      code: TitleTalkBusinessConflictError.code,
      message: 'This title is already in use for another talk',
      data: {
        talkId,
      },
    });
  }
}
