const getAPIUrl = () : string => {
    let useDebugURL = false;
    return (useDebugURL) ? 'http://localhost:8080' : 'https://white-hub-307318.wm.r.appspot.com';
};

export default {getAPIUrl};

