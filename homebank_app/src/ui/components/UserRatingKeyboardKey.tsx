import React from 'react';
import Url from '../../util/ApiUrl';
import axios, { AxiosResponse } from 'axios';
import AppState from '../../util/AppState';

interface UserRatingKeyboardKeyProps {
    title: string,
}

class UserRatingKeyboardKey extends React.Component<UserRatingKeyboardKeyProps> {
    constructor (props:UserRatingKeyboardKeyProps) {
        super(props);
    }
    
    postUserRating = async () => {
        let title = this.props.title;
        const apiUrl : String = Url.getAPIUrl();
        const clip_id : String = AppState.AppState.gSelectedAudioFileId.toString();
        console.log(clip_id);
        let data = {
            rating: title,
            timestamp_start: AppState.AppState.gSelectedAudioFileTimestampStart
        }
        let res : AxiosResponse = await axios.post(`${apiUrl}/api/v1/audio_rating/${clip_id}`, data);
        
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