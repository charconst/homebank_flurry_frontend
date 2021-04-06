import React from 'react';

class AudioClipProgressHeader extends React.Component {
    render() {
        return (
            <div className="rounded overflow-hidden bg-indigo-500 text-center">
                <div className="m-2"></div>
                <div className="font-bold text-xl mb-2">1/1000 Clips Reviewed</div>
            </div>
        );
    }
}

export default AudioClipProgressHeader;