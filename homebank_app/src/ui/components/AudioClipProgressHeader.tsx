import React from 'react';
import AudioClipProgressBar from '../components/AudioClipProgressBar';

class AudioClipProgressHeader extends React.Component {
    render() {
        return (
            <div className="rounded overflow-hidden bg-gray-50 text-center">
                <div className="m-2"></div>
                <AudioClipProgressBar></AudioClipProgressBar>
                <div className="font-bold text-xl mb-2 mt-2">500/1000 Clips Reviewed</div>
            </div>
        );
    }
}

export default AudioClipProgressHeader;