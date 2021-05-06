import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AudioClipProgressHeader from '../components/AudioClipProgressHeader';
import UserRatingContainer from './UserRatingContainer';
import Url from '../../util/ApiUrl';

interface AudioClipState {
    error: any,
    isLoaded: boolean,
    audioClips: AudioClip[],
    selectedAudioClip?: AudioClip
    audioURL: string
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
    next_segment_timestamp: number = 0;

    constructor(res: AxiosResponse) {
        let data = res.data;
        if (data["id"])
            this.id = data["id"];
        if (data["next_segment_timestamp"])
            this.next_segment_timestamp = data["next_segment_timestamp"];
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
            audioClips: []
        };
        this.audioPlayer = React.createRef();
    }

    removeFolderPrefix = (fileName: string): string => {
        return fileName.replace("audio/", "");
    }

    setAudioCurrentTime(timeInSeconds: number):void {
        if (this.audioPlayer.current && this.audioPlayer.current.audioEl.current) {
            let audioElement: HTMLAudioElement = this.audioPlayer.current.audioEl.current;
            audioElement.currentTime = timeInSeconds;
        }
    }

    getNextAudioSegment = async () => {
        const apiUrl : String = Url.getAPIUrl();
        try {
            let id : string | undefined = this.state.selectedAudioClip?.name;
            if (id) {
                id = this.removeFolderPrefix(id);
                id = id.replace(".wav", "");
                const res : AxiosResponse = await axios.get(`${apiUrl}/api/v1/audio_segments/${id}`);
                const segmentRes : NextAudioSegmentResponse = new NextAudioSegmentResponse(res);
                this.setAudioCurrentTime(segmentRes.next_segment_timestamp);
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

    handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value) {
            let index = event.currentTarget.selectedIndex - 1;
            if (index < 0) {
                this.setState({
                    selectedAudioClip: undefined
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
            });
        }
    }

    componentDidMount() {
        this.getAudioClips();
    }

    render()  {
        const {error, isLoaded, audioURL, audioClips, selectedAudioClip} = this.state;
        console.log(audioClips);
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } 
        return (
            <div className="rounded overflow-hidden shadow-lg text-center">
                <AudioClipProgressHeader></AudioClipProgressHeader>
                <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">HomeBank Audio Classification</div>
                <h1><b>Currently Selected Clip: {selectedAudioClip?.name}</b></h1>
                <p>{selectedAudioClip?.public_url}</p>
                <select onChange={this.handleOnChange}>
                    {this.mapAudioClips(audioClips)}
                </select>
                <p className="text-gray-700 text-base">
                Listen carefully because you will only get one opportunity to listen.
                You will be asked about the prominence within the clip of the voice 
                of the child wearing the recorder (i.e. the target child) compared to 
                all other sounds, such as other voices, background noise, rustling, etc.
                A target child vocalization may include speech, singing, babble, crying,
                trilling the lips, coughing, grunting, or any other sound produced
                using the throat, lips, and/or tongue.
                Note that the target child in this case is +ageYYMMDD[0:2]+ year(s), +ageYYMMDD[2:4]+ month(s), 
                and +ageYYMMDD[4:6]+ day(s) old.
                </p>
                <ReactAudioPlayer ref={this.audioPlayer} controls className="container mx-auto m-8"src={selectedAudioClip?.public_url}></ReactAudioPlayer>
                <div className="flex h-16 flex-wrap justify-center">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        Previous Clip
                    </button>
                    <UserRatingContainer></UserRatingContainer>
                    <button onClick={this.getNextAudioSegment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex-initial m-2">
                        Next Clip
                    </button>
                </div>
                
            </div>
            </div>
        )
    }
}

export default AudioClipContainer;