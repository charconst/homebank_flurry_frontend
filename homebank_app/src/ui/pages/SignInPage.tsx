import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

const apiUrl = "http://localhost:8080";

class UserData {
    creation_timestamp ?: string;
    email ?: string;
    id ?: string;
    name ?: string;
    picture ?: string;

    constructor(jsonObject: any) {
        if (jsonObject && jsonObject["user_data"]) {
            let userData = jsonObject["user_data"]
            this.creation_timestamp = userData["creation_timestamp"];
            this.email = userData["email"];
            this.id = userData["id"];
            this.name = userData["name"];
            this.picture = userData["picture"];
        }
    }
}

function SignInPage () {
    const storedJwt = localStorage.getItem('token');
    const storedId = localStorage.getItem('user_id');
    const [jwt, setJwt] = useState(storedJwt || null);
    const [id, setId] = useState(storedId || null);
    const [user, setUser] = useState<UserData>();
    const [fetchError, setFetchError] = useState(null);

    const responseGoogle = async (googleResponse:any) => {
        console.log(googleResponse);
        const accessToken = googleResponse["tokenId"];
        const userId = googleResponse["profileObj"]["email"];

        try {
            const {data} = await axios.post(`${apiUrl}/api/v1/auth/google`, {token: accessToken});
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user_id', userId);
            setJwt(accessToken);
            setId(userId);
            setFetchError(null);
            console.log(data); 
        } catch (err) {
            setFetchError(err.message);
        }
    }

    const signOut = async () => {
        // TODO invalidate token on server
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setJwt(null);
        setId(null);
        setUser(undefined);
    }
    
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/auth/me`);
            const userData : UserData = new UserData(data);
            setUser(userData);
            console.log(data);
            setFetchError(null);
        } catch (err) {
            setUser(undefined);
            setFetchError(err.message);
        }
    }

    return (
        <div>
            <h1>/signin</h1>
            <GoogleLogin clientId="100265972375-l3fol743purv7qajo9en61in8815ukl2.apps.googleusercontent.com" 
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            buttonText="Sign In with Google"
            cookiePolicy={'single_host_origin'}
            />
            <div className="m-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={getUserData}>My Profile</button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full m-2" onClick={signOut}>Sign Out</button>
            </div>
            
            {fetchError && (
                <p style={{color: 'red'}}>{fetchError}</p>
            )}
            {id && (
                <p className="text-xl m-4">Logged in as: <b>[{id}]</b></p>
            )}
            {user && (
                <div className="">
                    <div className="rounded overflow-hidden shadow-lg text-center flex h-32 justify-center m-8">
                        <div className="flex-col h-16 justify-center m-4 space-x-2">
                            <div className="relative w-16 h-16">
                                <img className="rounded-full border border-gray-100 shadow-sm" src={user.picture}></img>
                            </div>
                            
                            <h1 className="text-lg m-2 relative -inset-x-8"><b>{user.name}</b></h1>
                        </div>

                        <div className="flex-row h-16 justify-center m-4 space-x-2">
                            <p><i>Account Creation Timestamp: </i><b>{user.creation_timestamp}</b></p>
                            <p><i>Email Address: </i><b>{user.email}</b></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignInPage;