// המפתח שלך מה-API של OpenWeatherMap
const apiKey = '36cd78d30f7e2fee994d6926e5716b86';

// פונקציה שמביאה את המידע על מזג האוויר
async function fetchWeatherData(city) {
    // URL של ה-API עם שם העיר והמפתח שלך
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=he&units=metric`;
    
    try {
        // שליחה של בקשה ל-API
        const response = await fetch(url);
        
        // אם הבקשה הצליחה
        if (response.ok) {
            const data = await response.json();
            displayWeather(data);  // מציג את התוצאה
        } else {
            throw new Error('City not found or API request failed');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('לא ניתן להציג את הנתונים, יש לבדוק את שם העיר או את המפתח');
    }
}

// פונקציה להצגת תוצאות מזג האוויר
function displayWeather(data) {
    const weatherIconCode = data.weather[0].icon;  // קוד האייקון
    const weatherDescription = data.weather[0].description;  // תיאור מזג האוויר
    const iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;  // כתובת האייקון

    // הצגת האייקון
    const iconElement = document.getElementById('weatherIcon');
    iconElement.src = iconUrl;
    iconElement.alt = weatherDescription;

    // הצגת שם העיר
    const cityElement = document.getElementById('cityName');
    cityElement.textContent = data.name;  // שם העיר

    // הצגת טמפרטורה
    const tempElement = document.getElementById('temp');
    tempElement.textContent = `${Math.floor(data.main.temp)}°C`;  // עיגול הטמפרטורה

    // הצגת תיאור מזג האוויר
    const descElement = document.getElementById('desc');
    descElement.textContent = weatherDescription;

    // הצגת לחות
    const humidityElement = document.getElementById('humidity');
    humidityElement.textContent = `לחות: ${data.main.humidity}%`;

    // הצגת מהירות רוח
    const windElement = document.getElementById('wind');
    windElement.textContent = `רוח: ${data.wind.speed} קמ"ש`;

    // הצגת התוצאה במסך
    document.getElementById('weatherResult').style.display = 'block';
}

// פונקציה לחיפוש העיר
function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;  // קורא את שם העיר שהוזן
    fetchWeatherData(cityInput);  // מבצע את החיפוש ומביא את הנתונים
}

// מאזין לאירוע של הקשה על מקש Enter במידה והמשתמש לוחץ
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
