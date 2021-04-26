import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      if (token) {
        config.headers.authorization = `${token}`;
        config.headers.userId = `${userId}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

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
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={getUserData}>My Profile</button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={signOut}>Sign Out</button>
            {fetchError && (
                <p style={{color: 'red'}}>{fetchError}</p>
            )}
            {id && (
                <p>Logged In as {id}</p>
            )}
            {user && (
                <div>
                    <div className="rounded overflow-hidden shadow-lg text-center flex h-16 justify-center">
                        <div className="flex h-16 justify-center">
                            <h1 className="text-lg">User: <b>{user.name}</b></h1>
                            <img className="" src={user.picture}></img>
                        </div>

                        <div className="flex h-16 justify-center">
                            <p>Creation Timestamp: {user.creation_timestamp}</p>
                            <p>E-Mail: {user.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignInPage;