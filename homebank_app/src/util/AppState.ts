import { atom, selector } from "recoil";
import { User } from "../model/User";

const textState = atom({
    key: 'textState',
    default: ''
});

const charCountState = selector({
    key: 'charCountState', // unique ID (with respect to other atoms/selectors)
    get: ({get}) => {
      const text = get(textState);
  
      return text.length;
    },
});

const userState = atom<User>({
    key: 'userState',
    default: new User({})
});

const getUserState = selector({
    key: 'getUserState',
    get: ({get}) => {
        const user = get(userState);
        return user;
    },
});

class AppState {
    static gSelectedAudioFileId: string;
    static gSelectedAudioFileTimestampStart: number;
    static gUserHasRatedCurrentClip: boolean;
}

export {AppState, textState, charCountState, userState, getUserState}