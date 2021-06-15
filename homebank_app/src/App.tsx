import React, { ComponentClass, useEffect } from 'react';
import './App.css';
import 'tailwindcss/dist/tailwind.css'
import {AppHeader} from './ui/components/AppHeader'
import Helmet from 'react-helmet';
import axios from 'axios';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from "../src/ui/pages/Home";
import SignInPage from "../src/ui/pages/SignInPage";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { userState } from './util/AppState';
import { User } from './model/User';
import ApiUrl from './util/ApiUrl';

interface RouteWithTitleProps {
    title: string,
    path: string,
    exact?: boolean
    component: ComponentClass,
}

class RouteWithTitle extends React.Component<RouteWithTitleProps> {
    render() {
        console.log(this.props.title);
        return (
            <>
            <Helmet>
                <title>{this.props.title}</title>
            </Helmet>
            <Route exact={this.props.exact} path={this.props.path} component={this.props.component}/>
            </>
        )
    }
}

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    console.log(token, userId);
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

const Main = () => {
    return (
            <Switch>
                <RouteWithTitle exact title='HomeBank - Flurry' path='/' component={Home}></RouteWithTitle>
                <Route exact path="/signin" component={SignInPage}></Route>
            </Switch>        
    );
}

const apiUrl = ApiUrl.getAPIUrl();

function AppState() {
  const [loggedInUser, setLoggedInUser] = useRecoilState(userState);

  const getUserData = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/api/v1/auth/me`);
        const userData : User = new User(data);
        setLoggedInUser(userData);
        console.log("Results of /api/v1/auth/me", data);
    } catch (err) {
        setLoggedInUser(new User({}));
        console.log(err);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return <div></div>
}

function App() {
  
  return (
    <div className="App">
      <RecoilRoot>
        <AppState></AppState>
        <BrowserRouter>
          <AppHeader/>
          <Main/>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
