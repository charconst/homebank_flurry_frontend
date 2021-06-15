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
                <h1 className="mb-2 mt-2 text-4xl"><b>{this.props.currentClip}</b> of {this.props.totalClips} Clips Reviewed</h1>
            </div>
        );
    }
}

export default AudioClipProgressHeader;