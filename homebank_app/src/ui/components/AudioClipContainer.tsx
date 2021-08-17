import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AudioClipProgressHeader from '../components/AudioClipProgressHeader';
import UserRatingContainer from './UserRatingContainer';
import Url from '../../util/ApiUrl';
import {AppState} from '../../util/AppState';
import { Link } from 'react-router-dom';

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
    current_clip_index:number = 0;

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
        if (data["clip_number"])
            this.current_clip_index = data["clip_number"];
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
    private audioElement: HTMLAudioElement | undefined;
    private timerId:number = -1;
    private startTime:number = -1;
    private clipStartTime:number = -1;

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

    getAudioElement():HTMLAudioElement | undefined  {
        let audioElement: HTMLAudioElement | undefined = undefined;
        if (this.audioPlayer.current && this.audioPlayer.current.audioEl.current) {
            return this.audioPlayer.current.audioEl.current;
        }        
        return audioElement;
    }

    setAudioCurrentTime(timeInSeconds: number):void {
        this.audioElement = this.getAudioElement();
        if (this.audioElement) {
            this.audioElement.currentTime = timeInSeconds;
        }
    }

    playAudio():void {
        let audioElement = this.getAudioElement();
        if (audioElement) {
            const highResolutionTimer = (timestamp:number) => {
                if (this.audioElement) {
                    if (this.startTime === -1) {
                        this.startTime = timestamp;
                    }
                        
                    const elapsed:number = timestamp - this.startTime;
                    console.log(elapsed);

                    let currentTime:number = this.clipStartTime + elapsed/1000;
                    if (currentTime >= this.state.end_timestamp) {
                        this.audioElement.pause();
                        console.log(`Paused clip at ${currentTime}`);
                        window.cancelAnimationFrame(this.timerId);
                        this.timerId = -1;
                        this.startTime = -1;
                    } else {
                        requestAnimationFrame(highResolutionTimer);
                    } 
                }  
            }
            if (this.timerId === -1) {
                this.startTime = -1;
                this.clipStartTime = audioElement.currentTime;
                console.log(`Clip start time: ${this.clipStartTime}`);
                window.cancelAnimationFrame(this.timerId);
                this.timerId = window.requestAnimationFrame(highResolutionTimer);
                audioElement.play();
            }
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
                    AppState.gSelectedAudioFileTimestampStart = segmentRes.current_clip_timestamp;
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
                AppState.gUserHasRatedCurrentClip = false;
                this.setState({
                    end_timestamp: segmentRes.next_segment_end_timestamp,
                    selectedRecordingCurrentClip: segmentRes.current_clip_index,
                    selectedRecordingTotalClips: segmentRes.total_clips
                }, () => {
                    AppState.gSelectedAudioFileTimestampStart = segmentRes.next_segment_start_timestamp;
                    this.setAudioCurrentTime(segmentRes.next_segment_start_timestamp);
                    this.playAudio();
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
                    AppState.gSelectedAudioFileId = "";
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
                AppState.gSelectedAudioFileId = cleanFileName;
                console.log("Clean File Name: ", cleanFileName);
                this.getSelectedAudioFileState();
            });
        }
    }

    replayClip = () => {
        let currentTimestamp: number = AppState.gSelectedAudioFileTimestampStart;
        this.setAudioCurrentTime(currentTimestamp);
        this.playAudio();
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
        let userHasRatedClip: boolean = AppState.gUserHasRatedCurrentClip;
        console.log(audioClips);
        let nextButtonEnabled: boolean = (userHasRatedClip || selectedRecordingCurrentClip == 0);
        if (error) {
            return <div>
                <h1 className="">Sign In to Access This Page</h1>
                <Link to="/signin" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Sign In</Link>
                <p className="mt-2 text-sm align-text-bottom font-light">More Information about why you're seeing this message: [Error: {error.message}]</p>
            </div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } 
        return (
            <div className="rounded overflow-hidden shadow-lg">
                <AudioClipProgressHeader currentClip={selectedRecordingCurrentClip} totalClips={selectedRecordingTotalClips}></AudioClipProgressHeader>
                <div className="px-6 py-4">
                <div className="font-light text-md mb-2 text-green-900">HomeBank Flurry | Audio Classification Tool</div>
                <h1 className="text-2xl mt-4 mb-4 text-green-800"><b>{selectedAudioClip?.name}</b></h1>
                <p className="text-xl m-4">Select which day-long recording you’ll work on:</p>
                <select className="m-4 border-8 border-green-500" onChange={this.handleOnChange}>
                    {this.mapAudioClips(audioClips)}
                </select>
                <div className="bg-green-600 mx-auto justify-items-center px-8 mt-4">
                    <div className="text-white font-light text-center py-8 text-lg break-words">
                    <i>You will be asked about the prominence within the clip of the voice 
                    of the child wearing the recorder (i.e. the target child) compared to 
                    all other sounds, such as other voices, background noise, rustling, etc.
                    A target child vocalization may include speech, singing, babble, crying,
                    trilling the lips, coughing, grunting, or any other sound produced
                    using the throat, lips, and/or tongue.</i>
                    {ageYYMMDD != "" && (
                    <div className="mt-8 text-m font-medium underline text-white">
                        Note that the target child in this case is <b>{ageYYMMDD.slice(0, 2) + " years, "} 
                        {ageYYMMDD.slice(2, 4) + " months, "} 
                        {ageYYMMDD.slice(4, 6) + " days. "}</b>
                    </div>
                )}
                    </div>
                </div>
                
                <div className="bg-green-500 text-2xl font-light py-4 px-32">
                <h2 className="text-white text-3xl underline">Select one of the following options for each audio clip:</h2>
                <div className="text-white m-8"><span className="font-bold">1:</span><span className=""> You heard only the target child's voice.</span></div>
                <div className="text-white m-8"><span className="font-bold">2:</span><span className=""> You heard some background noise or other sound(s) but the infant vocalization is clearly the dominant sound in the clip.</span></div>
                <div className="text-white m-8"><span className="font-bold">3:</span><span className=""> You heard some background noise or other sound(s) and 
                the target child vocalization and the other sound(s) are similar in
                how dominant they are within the clip.</span></div>
                <div className="text-white m-8"><span className="font-bold">4:</span><span className=""> You heard a target child vocalization but it was definitely 
                not the dominant sound in the clip.</span></div>
                <div className="text-white m-8"><span className="font-bold">5:</span><span className=""> There did not appear to be a target child vocalization
                within the clip.</span></div>
                </div>
                <ReactAudioPlayer ref={this.audioPlayer} controls className="container mx-auto m-8"src={selectedAudioClip?.public_url}></ReactAudioPlayer>
                <div className="">
                    {selectedRecordingCurrentClip > 0 && (
                        <div className="flex h-16 flex-wrap justify-center">
                            <button onClick={this.replayClip} className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-8 border border-green-500 hover:border-transparent rounded flex-initial m-2">
                                Replay Clip
                            </button>
                            <UserRatingContainer audioContainer={this}></UserRatingContainer>
                        </div>

                    )}
                    
                    {!nextButtonEnabled && (
                        <button disabled className="bg-green-500 opacity-30 hover:bg-green-700 text-white font-bold py-2 px-8 rounded flex-initial m-2 disabled:opacity-50">
                        Next Clip
                      </button>
                    )}
                    {nextButtonEnabled && (
                        <button onClick={this.getNextAudioSegment} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-8 rounded flex-initial m-2">
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