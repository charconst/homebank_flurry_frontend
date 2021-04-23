import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

const responseGoogle = (googleResponse:Object) => {
    console.log(googleResponse);
}

class SignInPage extends React.Component {
    render() {
        return (
            <div>
                <h1>/signin</h1>
                <GoogleLogin clientId="100265972375-l3fol743purv7qajo9en61in8815ukl2.apps.googleusercontent.com" 
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                buttonText="Sign In with Google"
                cookiePolicy={'single_host_origin'}
                />
            </div>
        )
    }
}

export default SignInPage;