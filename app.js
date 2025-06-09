//const API_KEY='947305bab9fb38680f295504aa1962fd';
//替换成
import API_KEY from "./config.js";
fetch(`https://xxx?appid=${API_KEY}`)

document.getElementById('search-btn').addEventListener('click',getWeather);

async function getWeather(){
    const city=document.getElementById('city-input').value.trim();

    if(!city){
        alert('请输入城市名称');
        return;
    }

    try{
        //获取地理坐标
        const geoResponse=await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=&appid=${API_KEY}`
        );

        const geoData=await geoResponse.json();

        if(geoData.length==0){
            throw new Error('城市未找到');
        }

        const{lat,lon}=geoData[0];

        //获取天气数据
        const weatherResponse=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${API_KEY}`
        );

        const weatherData=await weatherResponse.json();

        displayWeather(weatherData);
    }catch(error){
        console.error('获取天气失败：',error);
        document.getElementById('weather-result').innerHTML=`
            <div class="error">${error.message||'获取天气信息失败'}</div>
        `;
    }
}

function displayWeather(data){
    const weatherResult=document.getElementById('weather-result');
    const iconCode=data.weather[0].icon;
    const iconUrl=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherResult.innerHTML=`
        <h2>${data.name}的天气</h2>
        <div class="weather-icon">
            <img src="${iconUrl}" alt="${data.weather[0].description}"></img>
            <span>${data.weather[0].description}</span>
        </div>
        <div class="weather-details">
            <p><strong>温度：</strong> ${data.main.temp}°C</p>
            <p><strong>体感：</strong> ${data.main.feels_like}°C</p>
            <p><strong>湿度：</strong> ${data.main.humidity}%</p>
            <p><strong>风速：</strong> ${data.wind.speed} m/s</p>
            <p><strong>气压：</strong> ${data.main.pressure} hPa</p>
        </div>
    `;
}