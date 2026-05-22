const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Convert a file to a Gemini inline data part
 */
function fileToGeminiPart(filePath, mimetype) {
  const data = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: data.toString("base64"),
      mimeType: mimetype,
    },
  };
}

/**
 * Step 1: Extract structured booking data from uploaded documents
 */
async function extractBookingData(files) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const fileParts = files.map((f) => fileToGeminiPart(f.path, f.mimetype));

  const prompt = `You are a travel document parser. Analyze the provided travel documents (flight tickets, hotel bookings, travel tickets, etc.) and extract all relevant information.

Return ONLY a valid JSON object with this structure (no markdown, no explanation, no backticks):
{
  "travelerName": "string or null",
  "flights": [
    {
      "airline": "string",
      "flightNumber": "string",
      "from": "city, country",
      "to": "city, country",
      "departureDate": "YYYY-MM-DD",
      "departureTime": "HH:MM",
      "arrivalDate": "YYYY-MM-DD",
      "arrivalTime": "HH:MM",
      "class": "string",
      "pnr": "string or null"
    }
  ],
  "hotels": [
    {
      "name": "string",
      "city": "string",
      "country": "string",
      "checkIn": "YYYY-MM-DD",
      "checkOut": "YYYY-MM-DD",
      "roomType": "string or null",
      "confirmationNumber": "string or null"
    }
  ],
  "trains": [],
  "buses": [],
  "otherBookings": [],
  "primaryDestination": "main destination city or country",
  "tripStartDate": "YYYY-MM-DD",
  "tripEndDate": "YYYY-MM-DD"
}

Extract as much information as visible. Use null for missing fields.`;

  const result = await model.generateContent([prompt, ...fileParts]);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

/**
 * Step 2: Generate a day-by-day itinerary from extracted data
 */
async function generateItinerary(extractedData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an expert travel planner. Based on the following extracted booking information, generate a detailed, practical, and exciting day-by-day travel itinerary.

BOOKING DATA:
${JSON.stringify(extractedData, null, 2)}

Generate a complete itinerary. Return ONLY a valid JSON object (no markdown, no explanation, no backticks):
{
  "title": "Trip title (e.g. 'Tokyo Adventure' or 'Paris Getaway')",
  "destination": "Primary destination",
  "travelerName": "name or null",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "rawSummary": "A beautiful 3-4 paragraph summary of the entire trip written in an engaging travel-writer style",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Arrival & First Impressions",
      "activities": [
        {
          "time": "10:00",
          "description": "Detailed activity description",
          "location": "Specific place name",
          "type": "flight|hotel|activity|transport|meal|other"
        }
      ],
      "notes": "Helpful tips for the day"
    }
  ]
}

Rules:
- Include ALL booked flights, hotels, trains as fixed activities
- Fill gaps between bookings with curated local recommendations (sightseeing, food, culture)
- Be specific with times, locations, and descriptions
- Make it genuinely useful and exciting
- Include practical tips in notes`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { extractBookingData, generateItinerary };
