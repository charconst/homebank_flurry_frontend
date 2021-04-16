import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import AudioClipProgressHeader from '../components/AudioClipProgressHeader';
import UserRatingContainer from './UserRatingContainer';

interface AudioClipState {
    error: any,
    isLoaded: boolean,
    audioURL: string
}

class AudioClipContainer extends React.Component<{}, AudioClipState> {
    constructor(props:any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            audioURL: ""
        };
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/v1/audio_queue")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    audioURL: result.audioURL
                })
            },
            (error) => {
                console.log(error);
                this.setState({
                    isLoaded: false,
                    error
                })
            }
        )
    }

    render() {
        const {error, isLoaded, audioURL} = this.state;
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
                <ReactAudioPlayer controls className="container mx-auto m-8"src={audioURL}></ReactAudioPlayer>
                <div className="flex h-16 flex-wrap justify-center">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        Previous Clip
                    </button>
                    <UserRatingContainer></UserRatingContainer>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex-initial m-2">
                        Next Clip
                    </button>
                </div>
                
            </div>
            </div>
        )
    }
}

export default AudioClipContainer;