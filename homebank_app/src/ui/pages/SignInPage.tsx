import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

const responseGoogle = (response:Object) => {
    console.log(response);
}

function SignInPage() {
    return (
        <div>
            <h1>/signin</h1>
            <GoogleLogin clientId="100265972375-l3fol743purv7qajo9en61in8815ukl2.apps.googleusercontent.com" 
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            buttonText="Sign In with Google"/>
        </div>
    )
}

export default SignInPage;