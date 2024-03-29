import React, {useState} from "react";
import axios from "axios";
import "../styles/ContentOneDay.css";
import iconSunset from "../images/sunset.png";
import iconSunrise from "../images/sunrise.png";
// import { api } from "../api";

function ContentOneDay(props) {
    // console.log(`Hello from ContentOneDay==: ${props.usedCoordinates} : ${props.usedCoordinates.lat} - ${props.usedCoordinates.lon}`)
    let [city, updateCity] = useState(null);

    let [temp_feelsLike, updateTemp_feelsLike] = useState(null);
    let [humidity, updateHumidity] = useState(null);
    let [temperature, updateTemperature] = useState(null);
    let [pressure, updatePressure] = useState(null);

    let [sunrise, updateSunrise] = useState(null);
    let [sunset, updateSunset] = useState(null);

    let [weather_common, updateWeather_common] = useState(null);
    let [weather_icon, updateWeather_icon] = useState(null);
    
    let [wind_speed, updateWind_speed] = useState(null);


    let coordinates = {};
    window.navigator.geolocation.getCurrentPosition(success)
    
    function success(position){
        coordinates = {"lat": position.coords.latitude, "long": position.coords.longitude}        
    };

    setTimeout(()=>{
        let lat = props.usedCoordinates == "EMPTY" || props.usedCoordinates == "" ? coordinates.lat : props.usedCoordinates.lat
        let long = props.usedCoordinates == "EMPTY" || props.usedCoordinates == "" ? coordinates.long : props.usedCoordinates.lon
        // console.log(`coordinates: ${lat}, ${long}`)

        const apiKey = props.api;
        
        // set it under ONE DAY Forecast click function
        axios({
            method: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`,
            headers: {
                "Content-Type": "application/json",
            }  
        }).then((response) => {
            // console.log(response.data)
            let data = response.data;

            city = data.name
            
            temp_feelsLike = data.main.feels_like.toFixed(0)
            humidity = data.main.humidity + "%"
            temperature = data.main.temp.toFixed(0)
            pressure = (data.main.pressure * 0.75006375541921).toFixed(0) + " mm"

            let hourSR = new Date(data.sys.sunrise * 1000).getHours()
            let minuteSR = new Date(data.sys.sunrise * 1000).getMinutes()
            let hourSS = new Date(data.sys.sunset * 1000).getHours()
            let minuteSS = new Date(data.sys.sunset * 1000).getMinutes()

            sunrise = (hourSR < 10 ? `0${hourSR}` : hourSR) + ":" + (minuteSR < 10 ? `0${minuteSR}` : minuteSR)
            sunset = (hourSS < 10 ? `0${hourSS}` : hourSS) + ":" + (minuteSS < 10 ? `0${minuteSS}` : minuteSS)

            weather_common = data.weather[0].description
            weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            
            wind_speed = data.wind.speed + " m/sec";

        }).catch((error)=> {
            console.log(error)
            document.getElementsByClassName("inner-content")[0].innerHTML = "<p>Oops! Something has gone wrong! <br> Refresh page or try later.</p>"
        })
    }, 2000)
    
    setTimeout(()=> {
        // console.log("Some variables updated")
        updateCity(city);
        updateTemp_feelsLike(temp_feelsLike);
        updateHumidity(humidity);
        updateTemperature(temperature);
        updatePressure(pressure);
        updateSunrise(sunrise);
        updateSunset(sunset);
        updateWeather_common(weather_common);
        updateWeather_icon(weather_icon);
        updateWind_speed(wind_speed)
    },3000)
    
    
    
    return (
        <>  
            <div className="inner-content">
                <img className="sunset-icon" src={iconSunset}/>
                <img className="sunrise-icon" src={iconSunrise}/>
                <img className="weather-icon" src={weather_icon} alt="weather-icon"/>
                <p className="temperature">{temperature}</p>
                
                <ul className="list1">
                    <li><p className="humidity">Humidity: {humidity}</p></li>
                    <li><p className="wind-speed">Wind speed: {wind_speed}</p></li>
                    <li><p className="pressure">Atmospheric pressure: {pressure}</p></li>
                </ul>

                <p className="city"><b>{city}</b></p>
                
                <ul className="list2">
                    <li><p className="description">{weather_common}</p></li>
                    <li><p className="feels-like">Feels like <b>{temp_feelsLike}</b></p></li>
                </ul>
                
                <p className="sunrise">Sunrise at {sunrise}</p>
                <p className="sunset">Sunset at {sunset}</p>
               
            </div>
        </>
    );
}

export default ContentOneDay;