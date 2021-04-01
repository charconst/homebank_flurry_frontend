import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>/ default route</h1>
                <ReactAudioPlayer controls src="https://storage.googleapis.com/homebank-public-audio/test.mp3"></ReactAudioPlayer>
                <h2>Instructions</h2>
                <p>
                Listen carefully because you will only get one opportunity to listen.
                You will be asked about the prominence within the clip of the voice 
                of the child wearing the recorder (i.e. the target child) compared to 
                all other sounds, such as other voices, background noise, rustling, etc.
                A target child vocalization may include speech, singing, babble, crying,
                trilling the lips, coughing, grunting, or any other sound produced
                using the throat, lips, and/or tongue.
                Note that the target child in this case is +ageYYMMDD[0:2]+ year(s), +ageYYMMDD[2:4]+ month(s), 
                and +ageYYMMDD[4:6]+ day(s) old.
                Press return to play the sound.
                </p>
            </div>
        )
    }
}

export default Home;