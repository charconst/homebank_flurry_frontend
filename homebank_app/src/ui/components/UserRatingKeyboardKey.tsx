import React from 'react';

interface UserRatingKeyboardKeyProps {
    title: string,
}

class UserRatingKeyboardKey extends React.Component<UserRatingKeyboardKeyProps> {
    render() {
        return (
            <div className="flex items-center justify-center rounded shadow-sm outline-black w-16 h-16 bg-gray-100">
                <div className="font-semibold">{this.props.title}</div>
            </div>
        )
    }
}

export default UserRatingKeyboardKey;