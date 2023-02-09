import { Properties } from '../../infrastructure/interfaces';

import { v4 as uuidv4 } from 'uuid';
import { convertToString, convertToStringArray, convertToNumber } from '../../infrastructure/convert-safely';

export class Talk {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly speakers: string[];
  public readonly day: number;
  public readonly duration: number;
  public startHour: string;
  public endHour: string;
  public room: string;

  constructor({ id, title, description, speakers, day, duration, startHour, endHour, room }: Properties<Talk>) {
    this.id = convertToString({ value: id, defaultValue: uuidv4() }) as string;
    this.title = convertToString({ value: title }) as string;
    this.description = convertToString({ value: description }) as string;
    this.speakers = convertToStringArray({ value: speakers }) as string[];
    this.day = convertToNumber({ value: day }) as number;
    this.duration = convertToNumber({ value: duration }) as number;
    this.startHour = convertToString({ value: startHour }) as string;
    this.endHour = convertToString({ value: endHour }) as string;
    this.room = convertToString({ value: room }) as string;
  }
}
