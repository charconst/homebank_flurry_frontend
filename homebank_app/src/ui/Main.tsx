import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from "../ui/pages/Home";
import SignInPage from "../ui/pages/SignInPage";

const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/signin' component={SignInPage}></Route>
        </Switch>
    );
}

export default Main;