require('dotenv').config();  // הוספת תמיכה ב-dotenv
const express = require('express');
const fs = require('fs');
const cors = require('cors');  // הוספת שורה זו
const app = express();
const port = 3000;

// הוספת middleware לקבלת IP אמיתי
app.set('trust proxy', true);

app.use(cors());  // הוספת תמיכה ב-CORS
app.use(express.json());

// שמירה של המידע על כל מבקר
app.post('/track-visit', (req, res) => {
  // קבלת IP מלא כולל מאחורי פרוקסי
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  
  // יצירת אובייקט תאריך
  const now = new Date();
  
  // פורמט התאריך והשעה בעברית
  const dateOptions = { 
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const hebrewDate = now.toLocaleString('he-IL', dateOptions);

  // יצירת אובייקט עם המידע
  const visitData = {
    ip: ip,
    date: hebrewDate,
    timestamp: now,
    userAgent: req.headers['user-agent']
  };

  console.log('ביקור חדש:', visitData);

  // קריאה וכתיבה לקובץ
  fs.readFile('visitors.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') throw err;
    
    const visitors = data ? JSON.parse(data) : [];
    visitors.push(visitData);

    fs.writeFile('visitors.json', JSON.stringify(visitors, null, 2), 'utf8', (err) => {
      if (err) throw err;
      res.send('נתוני הביקור נשמרו');
    });
  });
});

// התחלת השרת
app.listen(port, () => {
  console.log(`השרת מאזין בכתובת http://localhost:${port}`);
});
