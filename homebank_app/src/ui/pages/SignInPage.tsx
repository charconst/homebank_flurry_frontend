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

function SignInPage () {
    const storedJwt = localStorage.getItem('token');
    const storedId = localStorage.getItem('user_id');
    const [jwt, setJwt] = useState(storedJwt || null);
    const [id, setId] = useState(storedId || null);
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
    
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/auth/me`);
            console.log(data);
            setFetchError(null);
        } catch (err) {
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
            <button onClick={getUserData}>My Profile</button>
            {fetchError && (
                <p style={{color: 'red'}}>{fetchError}</p>
            )}
        </div>
    );
}

export default SignInPage;