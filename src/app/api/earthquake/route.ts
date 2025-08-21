import { NextRequest, NextResponse } from 'next/server';

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
    // In a real implementation, you would fetch from USGS Earthquake API
    // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=23.8103&longitude=90.4125&maxradiuskm=200&minmagnitude=2.0&limit=10
    
    // For demo purposes, generate realistic earthquake data for Bangladesh region
    const generateEarthquakeData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // Bangladesh typically has low to moderate seismic activity
      const monthlyEvents = months.map(() => Math.floor(Math.random() * 4)); // 0-3 events per month
      const magnitudes = monthlyEvents.map(events => events > 0 ? 2.5 + Math.random() * 1.5 : 0);
      
      return {
        months,
        monthlyEvents,
        averageMagnitude: magnitudes.map(mag => parseFloat(mag.toFixed(1))),
        totalEvents: monthlyEvents.reduce((sum, events) => sum + events, 0),
        maxMagnitude: Math.max(...magnitudes.filter(m => m > 0)),
        trend: 'stable'
      };
    };

    const generateRecentEvents = () => {
      const events = [];
      const eventCount = Math.floor(Math.random() * 4) + 1; // 1-4 recent events
      
      for (let i = 0; i < eventCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const magnitude = 2.5 + Math.random() * 1.5;
        const depth = 10 + Math.random() * 30;
        const distance = 30 + Math.random() * 100;
        
        const locations = [
          'Near Chittagong',
          'Bay of Bengal',
          'Near Sylhet', 
          'Assam Border',
          'Myanmar Border',
          'Near Rangpur'
        ];
        
        events.push({
          id: i + 1,
          magnitude: parseFloat(magnitude.toFixed(1)),
          location: locations[Math.floor(Math.random() * locations.length)],
          depth: parseFloat(depth.toFixed(1)),
          time: new Date(Date.now() - (daysAgo * 86400000)).toISOString(),
          distance: parseFloat(distance.toFixed(1))
        });
      }
      
      return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    };

    const historicalData = generateEarthquakeData();
    const recentEvents = generateRecentEvents();
    
    // Calculate risk based on recent activity and regional factors
    const maxRecentMag = recentEvents.length > 0 ? Math.max(...recentEvents.map(e => e.magnitude)) : 0;
    const riskLevel = maxRecentMag > 4.0 ? 'high' : maxRecentMag > 3.0 ? 'moderate' : 'low';
    const probability = maxRecentMag > 3.5 ? 25 + Math.random() * 15 : 5 + Math.random() * 20;

    const response = {
      location,
      coordinates: { lat, lon },
      historical: historicalData,
      recent: recentEvents,
      risk: {
        level: riskLevel,
        probability: Math.round(probability),
        nextExpected: 'Within 30 days',
        preparedness: 70 + Math.floor(Math.random() * 25) // 70-95%
      },
      alerts: recentEvents.some(e => e.magnitude > 3.2 && 
        (Date.now() - new Date(e.time).getTime()) < 172800000) ? [ // Within 48 hours
        {
          id: 1,
          type: 'info',
          message: `Minor seismic activity detected ${recentEvents[0]?.distance}km from your location`,
          timestamp: recentEvents[0]?.time || new Date().toISOString()
        }
      ] : [],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}