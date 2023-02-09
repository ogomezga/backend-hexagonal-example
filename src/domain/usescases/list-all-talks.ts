import { Dependencies } from '../../container';

export default function makeListAllTalks({ talkRepository }: Partial<Dependencies>) {
  return async function listAllTalks() {
    return talkRepository.findAll();
  };
}
