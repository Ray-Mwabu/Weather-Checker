import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = '68a9a96a0d7b3a942756b9ccdb8b025f'; // Replace with your API key

// Proxy weather requests to OpenWeather API
app.get('/weather', async (req, res) => {
    const { lat, lon, q } = req.query;

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

    if (lat && lon) {
        apiUrl += `&lat=${lat}&lon=${lon}`;
    } else if (q) {
        apiUrl += `&q=${q}`;
    } else {
        return res.status(400).json({ message: "Latitude, longitude, or city query is required." });
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ message: "Failed to fetch weather data." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
