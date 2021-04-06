import React from 'react';
import AudioClipProgressBar from '../components/AudioClipProgressBar';

class AudioClipProgressHeader extends React.Component {
    render() {
        return (
            <div className="rounded overflow-hidden bg-indigo-500 text-center">
                <div className="m-2"></div>
                <div className="font-bold text-xl mb-2">500/1000 Clips Reviewed</div>
                <AudioClipProgressBar></AudioClipProgressBar>
            </div>
        );
    }
}

export default AudioClipProgressHeader;