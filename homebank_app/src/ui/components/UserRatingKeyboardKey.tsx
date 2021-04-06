import React from 'react';

interface UserRatingKeyboardKeyProps {
    title: string,
}

class UserRatingKeyboardKey extends React.Component<UserRatingKeyboardKeyProps> {
    render() {
        return (
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        {this.props.title}
            </button>
        )
    }
}

export default UserRatingKeyboardKey;