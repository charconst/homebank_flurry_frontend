import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import ApiUrl from '../../util/ApiUrl';

const apiUrl = ApiUrl.getAPIUrl();

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

    useEffect(() => {
        getUserData();
    });

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
            console.log("api/v1/auth/google", data); 
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
            console.log("Results of /api/v1/auth/me", data);
            setFetchError(null);
        } catch (err) {
            setUser(undefined);
            setFetchError(err.message);
            console.log(err);
        }
    }

    return (
        <div>
            {!user && (
                <GoogleLogin clientId="100265972375-l3fol743purv7qajo9en61in8815ukl2.apps.googleusercontent.com" 
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                buttonText="Sign In with Google"
                cookiePolicy={'single_host_origin'}
                />
            )}
            {user && (
                <div className="p-4">
                    
                    <div className="rounded shadow-lg hero container max-w-screen-lg mx-auto pb-10">
                        <img className="mx-auto rounded-full border border-gray-100 shadow-sm" src={user.picture}></img>
                        <h1 className="mx-auto text-lg m-2"><b>{user.name}</b></h1>

                        <div className="w-full h-64 space-y-4 mt-16">
                            <h1 className="text-2xl font-bold">Great! You're all signed in. </h1>
                            <p className="font-light m-4 pb-8">Head back to the home page to get started.</p>
                            <Link to="/" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Get Started</Link>
                        </div>

                        <p className="text-sm m-4 mx-auto">Logged in as: <b>[{user.id}]</b></p>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full m-2" onClick={signOut}>Sign Out</button>
                    </div>
                </div>
            )}
            
            {fetchError && (
                <p style={{color: 'red'}}>{fetchError}</p>
            )}
        </div>
    );
}

export default SignInPage;