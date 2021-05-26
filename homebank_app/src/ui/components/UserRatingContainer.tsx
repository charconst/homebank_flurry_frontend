import React from 'react';
import AudioClipContainer from './AudioClipContainer';
import UserRatingKeyboardKey from './UserRatingKeyboardKey';

interface UserRatingContainerProps {
    audioContainer: AudioClipContainer
}

class UserRatingContainer extends React.Component<UserRatingContainerProps> {
    render() {
        return (
            <div className="flex">
                <UserRatingKeyboardKey audioContainer={this.props.audioContainer} title="1"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey audioContainer={this.props.audioContainer} title="2"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey audioContainer={this.props.audioContainer} title="3"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey audioContainer={this.props.audioContainer} title="4"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey audioContainer={this.props.audioContainer} title="5"></UserRatingKeyboardKey>
            </div>
        )
    }
}

export default UserRatingContainer;