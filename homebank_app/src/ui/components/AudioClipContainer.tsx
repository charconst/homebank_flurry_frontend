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
                <div className="flex h-16 flex-wrap justify-center">
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        Prev
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex-initial m-2">
                        Next
                    </button>
                </div>
                
            </div>
            </div>
        )
    }
}

export default AudioClipContainer;