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
    // In a real implementation, you would fetch actual NASA precipitation data
    // For now, we'll generate realistic mock data based on Bangladesh's monsoon patterns
    
    const generateFloodData = () => {
      const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
      const baseEvents = [3, 2, 5, 7, 4, 6]; // Flood events per year
      const baseRainfall = [1200, 1450, 1800, 2100, 1650, 1950]; // Annual rainfall in mm
      
      return {
        years,
        floodEvents: baseEvents,
        annualRainfall: baseRainfall,
        trend: 'increasing'
      };
    };

    // Generate current flood conditions
    const currentRainfall = 45.6 + (Math.random() * 30);
    const waterLevel = 3.5 + (Math.random() * 2);
    const floodProbability = Math.floor(Math.random() * 60) + 10; // 10-70%

    const response = {
      location,
      coordinates: { lat, lon },
      historical: generateFloodData(),
      current: {
        riskLevel: floodProbability > 50 ? 'high' : floodProbability > 25 ? 'moderate' : 'low',
        waterLevel: parseFloat(waterLevel.toFixed(1)),
        rainfall24h: parseFloat(currentRainfall.toFixed(1)),
        floodProbability,
        activeFloods: Math.floor(Math.random() * 4),
        forecast: [
          { day: 'Today', probability: floodProbability, rainfall: currentRainfall },
          { day: 'Tomorrow', probability: Math.min(floodProbability + 7, 85), rainfall: currentRainfall + 16.7 },
          { day: 'Day 3', probability: Math.max(floodProbability - 7, 5), rainfall: currentRainfall - 14.4 },
          { day: 'Day 4', probability: Math.max(floodProbability - 20, 3), rainfall: currentRainfall - 26.9 },
          { day: 'Day 5', probability: Math.max(floodProbability - 13, 7), rainfall: currentRainfall - 20.2 }
        ]
      },
      alerts: floodProbability > 40 ? [
        {
          id: 1,
          type: 'warning',
          message: 'Heavy rainfall expected in the next 48 hours',
          timestamp: new Date().toISOString()
        }
      ] : [],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching flood data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}