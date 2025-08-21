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
    // Fetch NASA Earth observation data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);

    const earthDataUrl = `https://api.nasa.gov/planetary/earth/temperature?lon=${lon}&lat=${lat}&date=${endDate.toISOString().split('T')[0]}&dim=0.15&api_key=${NASA_API_KEY}`;
    
    // Generate mock historical data with realistic patterns
    const generateHistoricalData = () => {
      const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
      const baseTemp = 32;
      const temperatures = years.map((_, index) => baseTemp + (index * 1.2) + (Math.random() * 2));
      const heatwaveDays = years.map((_, index) => 12 + (index * 6) + Math.floor(Math.random() * 8));
      
      return {
        years,
        maxTemperatures: temperatures.map(t => parseFloat(t.toFixed(1))),
        heatwaveDays,
        trend: 'increasing'
      };
    };

    // Generate current conditions
    const currentTemp = 35 + (Math.random() * 10);
    const heatIndex = currentTemp + 5 + (Math.random() * 5);
    const riskLevel = heatIndex > 40 ? 'high' : heatIndex > 35 ? 'moderate' : 'low';

    const response = {
      location,
      coordinates: { lat, lon },
      historical: generateHistoricalData(),
      current: {
        temperature: parseFloat(currentTemp.toFixed(1)),
        heatIndex: parseFloat(heatIndex.toFixed(1)),
        riskLevel,
        daysInHeatwave: Math.floor(Math.random() * 14) + 1,
        forecast: Array.from({ length: 5 }, () => 
          parseFloat((currentTemp + (Math.random() * 6) - 3).toFixed(1))
        )
      },
      alerts: riskLevel === 'high' ? [
        {
          id: 1,
          type: 'warning',
          message: 'Extreme heat warning in effect for the next 3 days',
          timestamp: new Date().toISOString()
        }
      ] : [],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching heatwave data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}