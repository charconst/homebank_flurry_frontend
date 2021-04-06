import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import AudioClipContainer from '../components/AudioClipContainer';

class Home extends React.Component {
    render() {
        return (
            <div className="container mx-auto">
                <h1>/ default route</h1>
                <AudioClipContainer></AudioClipContainer>
            </div>
        )
    }
}

export default Home;