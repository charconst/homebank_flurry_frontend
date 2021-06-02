import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AudioClipProgressHeader from '../components/AudioClipProgressHeader';
import UserRatingContainer from './UserRatingContainer';
import Url from '../../util/ApiUrl';
import AppState from '../../util/AppState';

interface AudioClipState {
    error: any,
    isLoaded: boolean,
    audioClips: AudioClip[],
    selectedAudioClip?: AudioClip
    audioURL: string,
    end_timestamp: number
    selectedRecordingTotalClips: number,
    selectedRecordingCurrentClip: number
}

class AudioClip {
    name: string = "";
    public_url: string = "";

    constructor(json: any) {
        if (json["name"])
            this.name = json["name"];
        if (json["public_url"])
            this.public_url = json["public_url"];
    }
}

class NextAudioSegmentResponse {
    id: string = "";
    next_segment_start_timestamp: number = 0;
    next_segment_end_timestamp:number = 0;
    total_clips: number = 0;

    constructor(res: AxiosResponse) {
        let data = res.data;
        if (data["id"])
            this.id = data["id"];
        if (data["next_segment_start_timestamp"])
            this.next_segment_start_timestamp = data["next_segment_start_timestamp"];
        if (data["next_segment_end_timestamp"])
            this.next_segment_end_timestamp = data["next_segment_end_timestamp"];
        if (data["total_clips"])
            this.total_clips = data["total_clips"];
    }
}

class GetAudioSegmentResponse {
    id: string = "";
    name: string = "";
    total_clips: number = 0;
    current_clip_number: number = 0;
    current_clip_timestamp: number = 0;
    current_clip_end_timestamp:number = 0;
    constructor(res: AxiosResponse) {
        let data = res.data;
        if (data["id"])
            this.id = data["id"];
        if (data["name"])
            this.name = data["name"];
        if (data["total_clips"])
            this.total_clips = data["total_clips"];
        if (data["current_clip_number"])
            this.current_clip_number = data["current_clip_number"];
        if (data["current_clip_timestamp"])
            this.current_clip_timestamp = data["current_clip_timestamp"];
        if (data["current_clip_end_timestamp"])
            this.current_clip_end_timestamp = data["current_clip_end_timestamp"];
    }
}

class AudioClipContainer extends React.Component<{}, AudioClipState> {
    private audioPlayer: React.RefObject<ReactAudioPlayer>;

    constructor(props:any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            audioURL: "",
            selectedAudioClip: undefined,
            end_timestamp: 0,
            audioClips: [],
            selectedRecordingTotalClips: 0,
            selectedRecordingCurrentClip: 0,
        };
        this.audioPlayer = React.createRef();
    }

    forceUpdate = ():void => {
        this.setState({

        });
    }

    removeFolderPrefix = (fileName: string): string => {
        return fileName.replace("audio/", "");
    }

    setAudioCurrentTime(timeInSeconds: number):void {
        if (this.audioPlayer.current && this.audioPlayer.current.audioEl.current) {
            let audioElement: HTMLAudioElement = this.audioPlayer.current.audioEl.current;
            audioElement.currentTime = timeInSeconds;
            audioElement.ontimeupdate = null;
            audioElement.ontimeupdate = (ev: Event) => {
                if (audioElement.currentTime >= this.state.end_timestamp)
                    audioElement.pause();
            }
            audioElement.play();
        }
    }

    formatSelectedAudioClipName = (name: string) => {
        let res: string = this.removeFolderPrefix(name);
        res = res.replace(".wav", "");
        return res;
    }

    getSelectedAudioFileState = async () => {
        const apiUrl : String = Url.getAPIUrl();
        try {
            let id : string | undefined = this.state.selectedAudioClip?.name;
            if (id) {
                id = this.formatSelectedAudioClipName(id);
                const res : AxiosResponse = await axios.get(`${apiUrl}/api/v1/audio_segments/${id}`);
                const segmentRes : GetAudioSegmentResponse = new GetAudioSegmentResponse(res);

                this.setAudioCurrentTime(segmentRes.current_clip_timestamp);
                this.setState({
                    end_timestamp: segmentRes.current_clip_end_timestamp,
                    selectedRecordingCurrentClip: segmentRes.current_clip_number,
                    selectedRecordingTotalClips: segmentRes.total_clips
                }, () => {
                    AppState.AppState.gSelectedAudioFileTimestampStart = segmentRes.current_clip_timestamp;
                });
            }
        } catch (error) {
            console.log(error);
            this.setState({
                isLoaded: false,
                error
            });
        }
    }

    getNextAudioSegment = async () => {
        const apiUrl : String = Url.getAPIUrl();
        try {
            let id : string | undefined = this.state.selectedAudioClip?.name;
            if (id) {
                id = this.removeFolderPrefix(id);
                id = id.replace(".wav", "");
                const res : AxiosResponse = await axios.post(`${apiUrl}/api/v1/audio_segments/${id}`);
                const segmentRes : NextAudioSegmentResponse = new NextAudioSegmentResponse(res);
                AppState.AppState.gUserHasRatedCurrentClip = false;
                this.setState({
                    end_timestamp: segmentRes.next_segment_end_timestamp
                }, () => {
                    AppState.AppState.gSelectedAudioFileTimestampStart = segmentRes.next_segment_start_timestamp;
                    this.setAudioCurrentTime(segmentRes.next_segment_start_timestamp);
                });
            }
        } catch (error) {
            console.log(error);
            this.setState({
                isLoaded: false,
                error
            });
        } 
    }

    getAudioClips = async () => {
        const apiUrl : String = Url.getAPIUrl();
        try {
            const res : AxiosResponse = await axios.get(`${apiUrl}/api/v1/audio_files`);
            console.log(res.data);

            let audioClips: AudioClip[] = [];
            let arr = res.data["audio_files"];

            for (let i = 0; i < arr.length; i++) {
                let c : AudioClip = new AudioClip(arr[i]);
                audioClips.push(c);
            }
            
            this.setState({
                isLoaded: true,
                audioClips: audioClips
            })
        } catch (error) {
            console.log(error);
            this.setState({
                isLoaded: false,
                error
            });
        }
    }

    mapAudioClips = (audioClips: AudioClip[]) => {
        let optionItems : JSX.Element[] = audioClips.map((a : AudioClip) => {
            return <option key={a.name} value={a.public_url}>{a.name}</option>
        });
        optionItems.unshift(<option key="no_value" value="none">None</option>);
        return optionItems;
    }

    getChildDOB = (audioFilename: string):string => {
        let dob = "";
        // 0054_000603_scrubbed
        let split: string[] = audioFilename.split("_");
        if (split.length >= 2) {
            let yymmdd = split[1];
            return yymmdd;
        }
        return dob;
    }

    handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value) {
            let index = event.currentTarget.selectedIndex - 1;
            if (index < 0) {
                this.setState({
                    selectedAudioClip: undefined
                }, () => {
                    AppState.AppState.gSelectedAudioFileId = "";
                })
                return;
            }
                
            let audioClip = new AudioClip({});
            const a = this.state.audioClips;
            audioClip.name = a[index].name;
            audioClip.public_url = a[index].public_url;
            console.log(index);
            console.log(audioClip);
            this.setState( {
                selectedAudioClip: audioClip
            }, () => {
                let cleanFileName: string = audioClip.name.replace(".wav", "");
                cleanFileName = cleanFileName.replace("audio/", "");
                AppState.AppState.gSelectedAudioFileId = cleanFileName;
                console.log("Clean File Name: ", cleanFileName);
                this.getSelectedAudioFileState();
            });
        }
    }

    replayClip = () => {
        let currentTimestamp: number = AppState.AppState.gSelectedAudioFileTimestampStart;
        this.setAudioCurrentTime(currentTimestamp);
    }

    componentDidMount() {
        this.getAudioClips();
    }

    render()  {
        const {error, isLoaded, audioURL, audioClips, selectedAudioClip, selectedRecordingCurrentClip, selectedRecordingTotalClips} = this.state;
        let ageYYMMDD: string = "";
        if (selectedAudioClip) {
            ageYYMMDD = this.getChildDOB(selectedAudioClip.name);
        } 
        let userHasRatedClip: boolean = AppState.AppState.gUserHasRatedCurrentClip;
        console.log(audioClips);
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } 
        return (
            <div className="rounded overflow-hidden shadow-lg text-center">
                <AudioClipProgressHeader currentClip={selectedRecordingCurrentClip} totalClips={selectedRecordingTotalClips}></AudioClipProgressHeader>
                <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">HomeBank Audio Classification</div>
                <h1><b>Selected Recording {selectedAudioClip?.name}</b></h1>
                <p>{selectedAudioClip?.public_url}</p>
                <select onChange={this.handleOnChange}>
                    {this.mapAudioClips(audioClips)}
                </select>
                <p className="text-gray-700 text-base py-8">
                <i>You will be asked about the prominence within the clip of the voice 
                of the child wearing the recorder (i.e. the target child) compared to 
                all other sounds, such as other voices, background noise, rustling, etc.
                A target child vocalization may include speech, singing, babble, crying,
                trilling the lips, coughing, grunting, or any other sound produced
                using the throat, lips, and/or tongue.
                Note that the target child in this case is {ageYYMMDD.slice(0, 2) + " years(s), "} 
                {ageYYMMDD.slice(2, 4) + " months(s), "} 
                {ageYYMMDD.slice(4, 6) + " days(s). "}</i></p>
                <p className="py-2">Click 1 if you heard only the target child's voice.</p>
                <p className="py-2">Click 2 if you heard some background noise or other sound(s) but the infant vocalization is clearly the dominant sound in the clip.
</p>
                <p className="py-2">Click 3 if you heard some background noise or other sound(s) and 
                the target child vocalization and the other sound(s) are similar in
                how dominant they are within the clip.</p>
                <p className="py-2">Click 4 if you heard a target child vocalization but it was definitely 
                not the dominant sound in the clip.</p>
                <p className="py-2">Click 5 if there did not appear to be a target child vocalization
                within the clip.</p>
                <ReactAudioPlayer ref={this.audioPlayer} controls className="container mx-auto m-8"src={selectedAudioClip?.public_url}></ReactAudioPlayer>
                <div className="flex h-16 flex-wrap justify-center">
                <button onClick={this.replayClip} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        Replay Clip
                    </button>
                    <UserRatingContainer audioContainer={this}></UserRatingContainer>
                    {!userHasRatedClip && (
                        <button disabled className="bg-blue-500 opacity-30 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex-initial m-2 disabled:opacity-50">
                        Next Clip
                      </button>
                    )}
                    {userHasRatedClip && (
                        <button onClick={this.getNextAudioSegment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex-initial m-2">
                        Next Clip
                    </button>
                    )
                    }
                </div>
                
            </div>
            </div>
        )
    }
}

export default AudioClipContainer;