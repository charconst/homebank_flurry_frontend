import { atom, selector } from "recoil";
import { User } from "../model/User";

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

export {AppState, userState, getUserState}