import { Talk } from '../../../domain/entities/talk';
import { DeepWriteable, Properties } from '../../../infrastructure/interfaces';

export class TalkBuilder {
  private data: DeepWriteable<Properties<Talk>> = {
    id: 'any-talk-id',
    title: 'any-talk-title',
    description: 'any-talk-description',
    speakers: ['any-talk-speaker1'],
    day: 1,
    duration: 60,
    startHour: '10:00',
    endHour: '11:00',
    room: '1',
  };

  with<K extends keyof Properties<Talk>>(key: K, input: Talk[K]) {
    this.data[key] = input;
    return this;
  }

  public build(): Talk {
    return new Talk(this.data as Talk);
  }
}

// Example
const talk = new TalkBuilder().with('title', 'test-title').build();
