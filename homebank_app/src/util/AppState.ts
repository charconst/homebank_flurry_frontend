import { atom, selector } from "recoil";

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

class AppState {
    static gSelectedAudioFileId: string;
    static gSelectedAudioFileTimestampStart: number;
    static gUserHasRatedCurrentClip: boolean;
}

export {AppState, textState, charCountState}