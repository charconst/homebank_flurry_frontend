import React from 'react';
import UserRatingKeyboardKey from './UserRatingKeyboardKey';

class UserRatingContainer extends React.Component {
    render() {
        return (
            <div className="flex">
                <UserRatingKeyboardKey title="1"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey title="2"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey title="3"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey title="4"></UserRatingKeyboardKey>
                <UserRatingKeyboardKey title="5"></UserRatingKeyboardKey>
            </div>
        )
    }
}

export default UserRatingContainer;