import React from 'react';

interface UserRatingKeyboardKeyProps {
    title: string,
}

class UserRatingKeyboardKey extends React.Component<UserRatingKeyboardKeyProps> {
    constructor (props:UserRatingKeyboardKeyProps) {
        super(props);
    }
    
    postUserRating = async () => {
        let title = this.props.title;
        const response = await fetch('http://localhost:8080/api/v1/audio_rating/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rating: title,
        })
        });
        console.log(response);
    }
    
    render() {
        return (
            <button onClick={this.postUserRating} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-8 border border-blue-500 hover:border-transparent rounded flex-initial m-2">
                        {this.props.title}
            </button>
        )
    }
}

export default UserRatingKeyboardKey;