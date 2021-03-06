import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import axios, { AxiosResponse } from 'axios';
import GoogleLogin from 'react-google-login';
import ApiUrl from '../../util/ApiUrl';
import { userState } from '../../util/AppState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { User } from '../../model/User';

const apiUrl = ApiUrl.getAPIUrl();

function SignInPage () {
    const storedJwt = localStorage.getItem('token');
    const storedId = localStorage.getItem('user_id');
    const [jwt, setJwt] = useState(storedJwt || null);
    const [id, setId] = useState(storedId || null);
    const [fetchError, setFetchError] = useState(null);
    const [loggedInUser, setLoggedInUser] = useRecoilState(userState);
    const [isExportFinished, setIsExportFinished] = useState(true);

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
            setLoggedInUser(new User(data));
            console.log("api/v1/auth/google", data); 
        } catch (err) {
            setFetchError(err.message);
        }
    }

    const exportDatabase = async () => {
        try {
            setIsExportFinished(false);
            let res: AxiosResponse = await axios.get(`${apiUrl}/api/v1/export`);
            if (res.status === 200) {
                setIsExportFinished(true);
                alert('Successfully uploaded!');
            }
        } catch(err) {
            alert(err);
            setIsExportFinished(true);
        }
    }

    if (!isExportFinished) {
        return <div className="m-4">Exporting database to Cloud Storage...</div>;
    }

    return (
        <div>
            {!loggedInUser.id && (
                <div>
                    <h1 className="text-4xl m-2">Sign In</h1>
                    <p className="mt-4 font-light">We use the Google OAuth protocol to manage researcher access to this audio classification tool.</p>
                    <p className="m-4"><b>Click</b> the button below to login with Google.</p>
                    <GoogleLogin className="outline-black" clientId="100265972375-l3fol743purv7qajo9en61in8815ukl2.apps.googleusercontent.com" 
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    buttonText="Sign In with Google"
                    cookiePolicy={'single_host_origin'}
                    />
                </div>
                
            )}
            {loggedInUser.id && (
                <div className="p-4">
                    
                    <div className="rounded shadow-lg hero container max-w-screen-lg mx-auto pb-10">
                        <img className="mx-auto rounded-full border border-gray-100 shadow-sm" src={loggedInUser.picture}></img>
                        <h1 className="mx-auto text-lg m-2"><b>{loggedInUser.name}</b></h1>

                        <div className="w-full h-64 space-y-4 mt-16">
                            <h1 className="text-2xl font-bold">Great! You're all signed in. </h1>
                            <p className="font-light m-4 pb-8">Head back to the home page to get started.</p>
                            <Link to="/" className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">Get Started</Link>
                        </div>
                        <p className="text-sm m-4 mx-auto">Logged in as: <b>[{loggedInUser.id}]</b></p>
                        {loggedInUser.is_admin && (
                            <button onClick={exportDatabase}>Export Data</button>
                        )}
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