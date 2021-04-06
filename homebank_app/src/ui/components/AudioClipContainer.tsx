import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

class AudioClipContainer extends React.Component {
    render() {
        return (
            <div className="rounded overflow-hidden shadow-lg text-center">
                <ReactAudioPlayer controls className="container mx-auto"src="https://storage.googleapis.com/homebank-public-audio/test.mp3"></ReactAudioPlayer>
                <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">HomeBank Audio Clip</div>
                <p className="text-gray-700 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
            </div>
            </div>
        )
    }
}

export default AudioClipContainer;