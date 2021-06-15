import React from 'react';

interface AudioClipProgressProps {
    totalClips: number,
    currentClip: number
}

class AudioClipProgressHeader extends React.Component<AudioClipProgressProps> {
    render() {
        return (
            <div className="rounded overflow-hidden bg-gray-50 text-center">
                <div className="m-2"></div>
                <div className="font-bold text-xl mb-2 mt-2">{this.props.currentClip} of {this.props.totalClips} Clips Reviewed</div>
            </div>
        );
    }
}

export default AudioClipProgressHeader;