import { Dependencies } from '../../container';
import { Talk } from '../entities/talk';
import { TitleTalkBusinessConflictError } from '../exceptions/title-talk-business-conflict';

const firstRoomAvailable = '1';

const rulesTalksPerDay = {
  1: {
    firstHour: '10:00',
    lastHour: '18:00',
  },
  2: {
    firstHour: '10:00',
    lastHour: '15:00',
  },
};

const assignedRules = {
  firstHour: '00:00',
  lastHour: '00:00',
  duration: 0,
};

export default function makeScheduleTalk({ talkRepository }: Partial<Dependencies>) {
  function isATitleInUse(title: string, scheduledTalks: Talk[]): boolean {
    return scheduledTalks.filter((interatedTalk) => interatedTalk.title === title).length >= 1;
  }

  function setRules(day: number, duration: number) {
    assignedRules.firstHour = rulesTalksPerDay[day].firstHour;
    assignedRules.lastHour = rulesTalksPerDay[day].lastHour;
    assignedRules.duration = duration;
  }

  function checkFirstRoomWithAnAvailableSlotForTheDay(talks: Talk[]): string {
    if (isScheduledTalk(talks.length)) {
      const found = false;
      const room = 1;
      let finalRoom: string;
      return talksAlreadyScheduledCheckRoomAvailability({ talks }, { found, room, finalRoom });
    } else {
      return firstRoomAvailable;
    }
  }

  function isScheduledTalk(scheduledTalks: number): boolean {
    return scheduledTalks !== 0;
  }

  function talksAlreadyScheduledCheckRoomAvailability(params: any, headerVars: any): string {
    if (headerVars.found) {
      return headerVars.finalRoom;
    }

    const talksByRoom = params.talks.filter((interatedTalk: Talk) => interatedTalk.room === headerVars.room.toString());
    if (isRoomExists(talksByRoom) && isAllSlotsOccupied(talksByRoom)) {
      headerVars.room++;
    } else {
      headerVars.found = true;
      headerVars.finalRoom = headerVars.room.toString();
    }
    return talksAlreadyScheduledCheckRoomAvailability(params, headerVars);
  }

  function isRoomExists(talksByRoom: any): boolean {
    return talksByRoom && talksByRoom.length >= 1;
  }

  function isAllSlotsOccupied(talksByRoom: any): boolean {
    const lastsBusytHour = talksByRoom[talksByRoom.length - 1].endHour;
    const remainingTime = calculateRemainingTimeInMinutes(lastsBusytHour);
    if (remainingTime >= assignedRules.duration) {
      return false;
    }
    return true;
  }

  function calculateRemainingTimeInMinutes(lastsBusytHour: string): number {
    const remainingHours = (Number(assignedRules.lastHour.split(':')[0]) - Number(lastsBusytHour.split(':')[0])) * 60;

    return remainingHours - Number(lastsBusytHour.split(':')[1]);
  }

  function getHourAvailable(talksfilteredByRoom: Talk[]): string {
    if (isASlotOccupiedForThisRoom(talksfilteredByRoom.length)) {
      return talksfilteredByRoom[talksfilteredByRoom.length - 1].endHour;
    } else {
      return assignedRules.firstHour;
    }
  }

  function isASlotOccupiedForThisRoom(talksPerRoom: number): boolean {
    return talksPerRoom !== 0;
  }

  function getEndHour(startHour: string): string {
    const hourAndMinutes = startHour.split(':');
    let hour = Number(hourAndMinutes[0]) + Math.floor(assignedRules.duration / 60);
    let minutes = Number(hourAndMinutes[1]) + (assignedRules.duration % 60);

    if (minutes >= 60) {
      hour++;
      minutes = minutes - 60;
    }

    return `${padTo2Digits(hour)}:${padTo2Digits(minutes)}`;
  }

  function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  return async function scheduleTalk(talk: Talk) {
    const existingTalks = await talkRepository.findAll();
    if (isATitleInUse(talk.title, existingTalks)) {
      throw new TitleTalkBusinessConflictError(talk.id);
    }
    const talksFilteredByDay = existingTalks.filter((interatedTalk) => interatedTalk.day === talk.day);
    setRules(talk.day, talk.duration);
    const room = checkFirstRoomWithAnAvailableSlotForTheDay(talksFilteredByDay);
    const talksFilteredByRoom = talksFilteredByDay.filter((interatedTalk) => interatedTalk.room === room);
    const startHour = getHourAvailable(talksFilteredByRoom);
    const endHour = getEndHour(startHour);
    talk.room = room;
    talk.startHour = startHour;
    talk.endHour = endHour;
    return talkRepository.create(talk);
  };
}
