import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = 'Jv2QqcXN3ZPZRrIXKmjHQM7yqkmwNpMiKB7sNbOj';

const locationCoordinates: { [key: string]: { lat: number; lon: number } } = {
  'Dhaka': { lat: 23.8103, lon: 90.4125 },
  'Chattogram (Chittagong)': { lat: 22.3475, lon: 91.8123 },
  'Barisal': { lat: 22.7022, lon: 90.3696 },
  'Khulna': { lat: 22.8456, lon: 89.5403 },
  'Mymensingh': { lat: 24.7471, lon: 90.4203 },
  'Rajshahi': { lat: 24.3745, lon: 88.6042 },
  'Rangpur': { lat: 25.7439, lon: 89.2752 },
  'Sylhet': { lat: 24.8949, lon: 91.8687 }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location || !locationCoordinates[location]) {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
  }

  const { lat, lon } = locationCoordinates[location];

  try {
    // In a real implementation, you would use NASA GLDAS or other soil data APIs
    // For demo purposes, we'll generate realistic soil data for Bangladesh
    
    const generateSoilData = () => {
      const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
      const basePh = 6.8;
      const baseOrganic = 3.2;
      
      return {
        years,
        phLevels: years.map((_, i) => parseFloat((basePh + (Math.random() * 0.4) - 0.2).toFixed(1))),
        organicMatter: years.map((_, i) => parseFloat((baseOrganic + (Math.random() * 0.6) - 0.3).toFixed(1))),
        nitrogen: years.map(() => 40 + Math.floor(Math.random() * 15)),
        phosphorus: years.map(() => 20 + Math.floor(Math.random() * 15)),
        potassium: years.map(() => 170 + Math.floor(Math.random() * 25))
      };
    };

    // Current soil conditions based on Bangladesh's typical soil characteristics
    const currentPh = 6.8 + (Math.random() * 0.4) - 0.2;
    const currentOrganic = 3.2 + (Math.random() * 0.6) - 0.3;
    const currentNitrogen = 40 + Math.floor(Math.random() * 15);
    const currentPhosphorus = 20 + Math.floor(Math.random() * 15);
    const currentPotassium = 170 + Math.floor(Math.random() * 25);
    const currentMoisture = 20 + Math.random() * 15;
    const currentTemp = 16 + Math.random() * 8;

    // Calculate health score based on multiple factors
    const phScore = currentPh >= 6.0 && currentPh <= 7.5 ? 100 : Math.max(0, 100 - Math.abs(6.75 - currentPh) * 40);
    const organicScore = Math.min(100, (currentOrganic / 4) * 100);
    const nutrientScore = Math.min(100, ((currentNitrogen + currentPhosphorus + currentPotassium/4) / 100) * 100);
    const healthScore = Math.round((phScore + organicScore + nutrientScore) / 3);

    const response = {
      location,
      coordinates: { lat, lon },
      historical: generateSoilData(),
      current: {
        ph: parseFloat(currentPh.toFixed(1)),
        organicMatter: parseFloat(currentOrganic.toFixed(1)),
        nitrogen: currentNitrogen,
        phosphorus: currentPhosphorus,
        potassium: currentPotassium,
        moisture: parseFloat(currentMoisture.toFixed(1)),
        temperature: parseFloat(currentTemp.toFixed(1)),
        fertility: healthScore > 80 ? 'high' : healthScore > 60 ? 'moderate' : 'low',
        healthScore
      },
      composition: {
        sand: 35 + Math.floor(Math.random() * 15), // Bangladesh typically has varied soil composition
        clay: 25 + Math.floor(Math.random() * 15),
        silt: 30 + Math.floor(Math.random() * 15)
      },
      alerts: [
        {
          id: 1,
          type: 'info',
          message: healthScore > 75 
            ? 'Soil fertility levels are optimal for current season'
            : 'Consider soil improvement measures for better crop yields',
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching soil data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}