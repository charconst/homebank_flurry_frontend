export default AppHeader;

function AppHeader() {
    return <div className="header-2 bg-yellow-300">
    <nav className="bg-white py-2 md:py-4 border-b border-gray-200">
      <div className="container px-4 mx-auto md:flex md:items-center">
        <div className="flex justify-between items-center">
          <a href="#" className="font-bold text-xl text-indigo-600">HBK</a>
        </div>
        <div className="sm:flex md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0" id="navbar-collapse">
            <button className="py-4 px-4 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out">
              Preferences
            </button>
            <button className="py-4 px-4 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out">
              Sign In
            </button>
        </div>
      </div>
    </nav>
  </div>
  }