import React, { useState, useEffect, useRef } from 'react';
import Profile from "./assets/Profile.jpg";
import Logo from "./assets/Logo.png";
import Background from "./assets/background.jpg";
import {
  Search, Github, Instagram, ChevronDown, MapPin, User, CloudLightning, Wind, Droplets, Thermometer, Cloud, Sun, Moon, WindArrowDown, CloudRainWind,
  Flame,
  CloudSun,  
} from "lucide-react";
import Home from './Home';

const App = () => {
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'clear sky':
        return <Sun size={45} />;
      case 'few clouds':
        return <Cloud size={45} />;
      case 'Rain':
        return <CloudRainWind size={45} />;
        case 'light rain':
        return <CloudRainWind size={45} />;
      case 'Thunderstorm':
        return <WindArrowDown size={45} />;
      case 'smoke':
        return <Flame size={45} />;
        case 'scattered clouds':
        return <Cloud size={45} />;
        
      case 'broken clouds':
        return <Cloud size={45} />;
      case 'snow':
        return <Moon size={45} />;
        case 'haze':
        return <CloudSun size={45} />;
      case 'drizzle':
        return <Droplets size={45} />;
      case 'Mist':
        return <CloudLightning size={45} />;
      default:
        return <CloudLightning size={45} />;
    }
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('C'); 
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      setLocations([]);
    }
  };

  const fetchWeatherData = async (city) => {
    try {
      const apiKey = "6327c1f81c4ffd72eeeca7ab12f161b9" // Store the API key securely in .env file
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.main) {
        setWeatherData({
          city: data.name,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          tempMin: data.main.temp_min,
          tempMax: data.main.temp_max,
          timezone: data.timezone
        });
      } else {
        setWeatherData(null);
        alert("City not found or there was an error fetching data.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching the weather data.");
    }
  };

  const bgStyles = {
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.list) {
          const locationsData = data.list.map(
            (location) => `${location.name}, ${location.sys.country}`
          );
          setLocations(locationsData);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      }
    } else {
      setLocations([]);
    }
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location);
    fetchWeatherData(location);
    setLocations([]);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const convertTemperature = (temp) => {
    if (unit === 'F') {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <nav className="bg-gray-200 md:px-10 z-10 px-2 py-2 fixed w-screen bg-opacity-40 backdrop-blur-lg flex justify-between items-center">
        <div className="flex items-center">
          <img className="w-10 h-10" src={Logo} alt="Logo" />
          <h1 className="font-thin text-xl hidden md:block">Weatherize</h1>
        </div>
        <div ref={searchRef} className="relative flex items-center border shadow-sm shadow-gray-400 p-2 w-auto mx-3 rounded-full bg-gray-300 md:w-auto">
          <Search />
          <input
            className="bg-gray-300 outline-none px-2  w-full"
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {locations.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg z-10">
              <ul>
                {locations.map((location, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="inline mr-2" />
                    {location}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative flex" ref={dropdownRef}>
          <div
            className="flex items-center md:px-4 py-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={Profile} className="w-7 h-7 rounded-full" alt="Profile" />
            <h1 className="ml-2 hidden md:block font-thin text-gray-700">Profiles</h1>
            <ChevronDown
              className={`transition-transform transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-gray-100 border rounded-md shadow-lg z-20">
              <ul className="px-1 py-1">
                <a target='_blank' href="https://github.com/pr4shxnt/Weather-Web-App/fork"><li className="px-3 py-2 rounded-lg flex font-thin items-center gap-2 hover:bg-gray-200 cursor-pointer">
                  <Github />
                  Fork this repo
                </li>
                </a>
                <a target='_blank' href="https://instagram.com/pr4xnt">
                <li className="px-3 py-2 rounded-lg font-thin flex items-center gap-2 hover:bg-gray-200 cursor-pointer">
                  <Instagram />
                  Insta Profile
                </li>
                </a>
                <a target='_blank' href="https://www.prashantadhikari7.com.np">
                <li className="px-3 py-2 rounded-lg font-thin flex items-center gap-2 hover:bg-gray-200 cursor-pointer">
                  <User />
                  Catch UP
                </li>
                </a>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <div style={bgStyles} className="h-screen">
        <div className="pt-16">
          <div className="w-screen h-full flex flex-col justify-evenly md:flex-row">
            {weatherData ? (
              <>
                <div className="bg-slate-600 md:w-[600px] bg-opacity-65 rounded-lg m-4 backdrop-blur-sm px-7 py-7">
                  <h1 className="font-bold text-4xl text-white">{weatherData.city}</h1>
                  <h3 className="font-extralight text-2xl text-white">
                    {convertTemperature(weatherData.temperature).toFixed(1)}°
                  </h3>
                  <p className="font-thin text-white">
                    Feels Like{" "}
                    <span className="font-bold text-slate-300">
                      {convertTemperature(weatherData.feelsLike).toFixed(1)}°
                    </span>
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-none w-full text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-thin"
                      onClick={toggleUnit}
                    >
                      {unit === "C" ? "Switch to °F" : "Switch to °C"}
                    </button>
                    <button onClick={() => { 
                        setSearchQuery('');
                        setLocations([]);
                        setWeatherData(null)}} className="bg-none border-white text-gray-100 hover:text-gray-200 border w-full px-4 py-2 rounded-lg font-thin">
                      Return
                    </button>
                  </div>
                </div>
                <div className="bg-slate-600 md:w-[700px] bg-opacity-65 rounded-lg m-4 backdrop-blur-sm px-7 pb-7">
                <div className="text-xl p-3 flex items-center justify-center text-center font-thin text-white">
  {weatherData?.timezone !== undefined ? (
    `TimeZone: GMT${weatherData.timezone >= 0 ? '+' : ''}${(weatherData.timezone / 3600).toFixed(0)}`
  ) : (
    'Loading TimeZone...'
  )}
</div>
                  <div className="flex flex-col justify-evenly md:flex-row gap-4">
                    
                  </div>
                  
                <div className=" flex flex-col justify-evenly md:flex-row gap-4">
                <h1 className="flex gap-1 w-full text-4xl text-white font-bold">
  <span>{getWeatherIcon(weatherData.condition)}</span>
  <span className="flex flex-col">
    {weatherData.condition}
    <small className="font-thin text-sm">Look Outside</small>
  </span>
</h1>
                    <h1 className='flex gap-1 w-full text-4xl text-white font-bold '><span ><Wind size={45}/></span> <span className='flex flex-col'>Wind <small className='font-thin text-sm'>{weatherData.windSpeed} m/s</small></span></h1>
                </div>

                <div className=" flex flex-col justify-evenly mt-4 md:flex-row gap-4">
                    <h1 className='flex w-full gap-1 text-4xl text-white font-bold '><span ><Droplets size={45}/></span> <span className='flex flex-col'>Humidity <small className='font-thin text-sm'>{weatherData.humidity}%</small></span></h1>
                    <h1 className='flex w-full gap-1 text-3xl text-white font-bold '><span ><Thermometer size={45}/></span> <span className='flex flex-col'>{convertTemperature(weatherData.tempMin).toFixed(1)}° -{" "}
                      {convertTemperature(weatherData.tempMax).toFixed(1)}° <small className='font-thin text-sm'>min - max</small></span></h1>
                </div>
                  
                </div>
              </>
            ) : (
             <Home/>
            )}
          </div>
        </div>

        <div className="h-full bg-slate-900 hidden md:block rounded-t-3xl mt-10 w-full text-white px-8 py-10">
  {/* About Section */}
  <div className="flex flex-wrap justify-between">
    <div className="w-full md:w-1/3 mb-6">
      <h2 className="text-2xl font-semibold mb-4">About Page</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
      Weatherize is a modern and user-friendly web application designed to provide accurate and real-time weather updates for any location. With a sleek and intuitive interface, users can search for their desired location using the search bar and view detailed weather information, including temperature, humidity, wind speed, and current conditions.Stay connected with Weatheriz to stay informed about the latest weather updates, all with ease and precision.      </p>
    </div>

    {/* Navigation Links */}
    <div className="w-full md:w-1/4 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
      <ul className="text-gray-400 text-sm space-y-2">
        <li><a href="#" onClick={() => { 
                        setSearchQuery('');
                        setLocations([]);
                        setWeatherData(null)}} className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Weather Updates</a></li>
        <li><a href="https://github.com/pr4shxnt/Weather-Web-App" className="hover:underline">Repo</a></li>
        <li><a href="https://www.prashantadhikari7.com.np" className="hover:underline">Developer</a></li>
        
      </ul>
    </div>

    {/* Contact Details */}
    <div className="w-full md:w-1/4 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Contact Me</h2>
      <ul className="text-gray-400 text-sm space-y-2">
        <li><span className="font-semibold">Email:</span> prashantadhikareey@gmail.com</li>
        <li><span className="font-semibold">Phone:</span> +977 9742433049</li>
        <li><span className="font-semibold">Address:</span> Balaju, Kathmandu</li>
      </ul>
    </div>
  </div>

  {/* Social Media Links */}
  <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
    <div>
      <h2 className="text-xl font-semibold mb-4">Follow Me</h2>
      <div className="flex space-x-4">
        <a href="x.com/pr4xnt" className="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.3c-.9.4-1.8.6-2.8.8 1-.6 1.8-1.5 2.2-2.7-.9.6-2 .9-3.1 1.2C19.4 2.6 18.1 2 16.7 2c-2.7 0-4.8 2.2-4.8 4.8 0 .4 0 .7.1 1.1-4-.2-7.4-2.1-9.7-5-.4.6-.6 1.4-.6 2.1 0 1.5.7 2.9 1.9 3.7-.7 0-1.3-.2-1.8-.5v.1c0 2.1 1.5 3.9 3.5 4.3-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.9 2.4 3.3 4.4 3.4-1.7 1.4-3.8 2.3-6.1 2.3h-.8c2.2 1.4 4.9 2.2 7.7 2.2 9.3 0 14.4-7.7 14.4-14.4v-.7c1-.7 1.8-1.6 2.5-2.6z" />
          </svg>
        </a>
        <a href="facebook.com/pr4shant.xd" className="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2C6.5 2.2 2 6.7 2 12.2c0 4.4 3.2 8.2 7.4 9.3v-6.6h-2.2v-2.7h2.2V9.6c0-2.1 1.2-3.3 3-3.3.9 0 1.9.2 1.9.2v2.2h-1.3c-1.1 0-1.4.7-1.4 1.3v1.6h2.4l-.4 2.7h-2v6.6c4.2-1.1 7.4-4.9 7.4-9.3 0-5.5-4.5-10-10-10z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/prashant-adhikari-687171310/" className="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.5 0h-21C.7 0 0 .7 0 1.5v21C0 23.3.7 24 1.5 24h21c.8 0 1.5-.7 1.5-1.5v-21c0-.8-.7-1.5-1.5-1.5zM8 20H4V8h4v12zm-2-13.2c-1.2 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm14 13.2h-4v-5.5c0-3.3-4-3-4 0V20h-4V8h4v1.8c1.8-3.3 8-3.6 8 3.2V20z" />
          </svg>
        </a>
      </div>
    </div>

    {/* Bottom Note */}
    <div className="text-gray-400 text-sm">
      © 2024 Weatherize. All rights reserved. | Designed with ❤️ by Prashant.
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default App;
