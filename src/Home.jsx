import React from "react";
import Background from "./assets/background.jpg";
import Logo from "./assets/logo.png";

const Home = () => {
  

  return (
    <div className="h-screen w-screen  flex flex-col items-center justify-start pt-[20vh] ">
      {/* Logo Section */}
      <div className="text-center items-center  mb-8">
        <img src={Logo} alt="Weatherize Logo" className="w-20 h-20 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-500 mt-4">Welcome to Weatherize</h1>
        <p className="text-lg text-gray-500 mt-2">Made By : <span className="text-blue-700 hover:underline hover:text-gray-500 "><a target='_blank' href="https://github.com/pr4shxnt/">Prashant Adhikari</a></span></p>
      </div>

      {/* Search Call-to-Action */}
      <div className="text-center">
        <h2 className="text-2xl px-2 font-medium text-gray-600 mb-4">
          Get real-time weather updates for any city!
        </h2>
        
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-1/2 text-center">
        <p className="text-sm text-gray-950">
          all Rights belong to {" "}
          <a
            href="https://www.prashantadhikari7.com.np/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 "
          >
            www.prashantadhikari7.com.np
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
