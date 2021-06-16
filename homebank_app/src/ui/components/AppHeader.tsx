import React from 'react';
import { Link } from "react-router-dom";
import {useRecoilState, useRecoilValue} from 'recoil';
import { User } from '../../model/User';
import {userState, getUserState} from '../../util/AppState';

function AppHeader() {
    const loggedInUser: User = useRecoilValue(getUserState);
    const [user, setLoggedInUser] = useRecoilState(userState);

    function logOut() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      setLoggedInUser(new User({}));
      alert("Signed Out.");
    }
    return <div className="header-2 bg-yellow-300">
    <nav className="bg-white py-2 md:py-4 border-b border-gray-200">
      <div className="container px-4 mx-auto md:flex md:items-center">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-indigo-600">HBF</Link>
        </div>
        <div className="sm:flex md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0" id="navbar-collapse">
            {loggedInUser.id && (
              <div className="mt-2 space-x-6">
                <Link to="/signin" className="text-black text-base">{loggedInUser.name}</Link>
                <button onClick={logOut}>Sign Out</button>
              </div>
            )}
            {!loggedInUser.id && (
              <Link to="/signin" className="text-black text-base">Sign In</Link>
            )}
        </div>
      </div>
    </nav>
  </div>
}

export {AppHeader};
