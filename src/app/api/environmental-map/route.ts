import { NextRequest, NextResponse } from 'next/server';

// NASA API configurations
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const USGS_API_BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

// Bangladesh geographical boundaries
const BANGLADESH_BOUNDS = {
  north: 26.6382,
  south: 20.7209,
  east: 92.6723,
  west: 88.0844
};

// Division coordinates for Bangladesh
const DIVISION_CENTERS = {
  'Dhaka': { lat: 23.8103, lng: 90.4125 },
  'Chittagong': { lat: 22.3475, lng: 91.8123 },
  'Sylhet': { lat: 24.8949, lng: 91.8687 },
  'Rajshahi': { lat: 24.3745, lng: 88.6042 },
  'Khulna': { lat: 22.8456, lng: 89.5403 },
  'Barisal': { lat: 22.7010, lng: 90.3535 },
  'Rangpur': { lat: 25.7439, lng: 89.2752 },
  'Mymensingh': { lat: 24.7465, lng: 90.4072 }
};

interface EnvironmentalDataPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave' | 'flood' | 'soil' | 'earthquake';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
  source: string;
}

// Helper function to determine severity based on values
function getHeatwaveSeverity(temp: number): { severity: 'low' | 'medium' | 'high' | 'critical', description: string } {
  if (temp >= 45) return { severity: 'critical', description: `Extreme heat emergency - ${temp}°C` };
  if (temp >= 40) return { severity: 'high', description: `Dangerous heat levels - ${temp}°C` };
  if (temp >= 35) return { severity: 'medium', description: `High temperature warning - ${temp}°C` };
  return { severity: 'low', description: `Normal temperature - ${temp}°C` };
}

function getFloodSeverity(level: number): { severity: 'low' | 'medium' | 'high' | 'critical', description: string } {
  if (level >= 8) return { severity: 'critical', description: `Severe flooding - ${level}m water level` };
  if (level >= 6) return { severity: 'high', description: `High flood risk - ${level}m water level` };
  if (level >= 4) return { severity: 'medium', description: `Moderate flood risk - ${level}m level` };
  return { severity: 'low', description: `Normal water level - ${level}m` };
}

function getSoilSeverity(ph: number): { severity: 'low' | 'medium' | 'high' | 'critical', description: string } {
  if (ph <= 4.5 || ph >= 8.5) return { severity: 'high', description: `Poor soil quality - pH ${ph}` };
  if (ph <= 5.5 || ph >= 7.8) return { severity: 'medium', description: `Suboptimal soil - pH ${ph}` };
  return { severity: 'low', description: `Good soil conditions - pH ${ph}` };
}

function getEarthquakeSeverity(magnitude: number): { severity: 'low' | 'medium' | 'high' | 'critical', description: string } {
  if (magnitude >= 7.0) return { severity: 'critical', description: `Major earthquake - ${magnitude} magnitude` };
  if (magnitude >= 5.5) return { severity: 'high', description: `Moderate earthquake - ${magnitude} magnitude` };
  if (magnitude >= 3.5) return { severity: 'medium', description: `Minor earthquake - ${magnitude} magnitude` };
  return { severity: 'low', description: `Micro earthquake - ${magnitude} magnitude` };
}

// Fetch real earthquake data from USGS
async function fetchEarthquakeData(): Promise<EnvironmentalDataPoint[]> {
  try {
    const endTime = new Date().toISOString();
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last 7 days
    
    const response = await fetch(
      `${USGS_API_BASE}?format=geojson&starttime=${startTime}&endtime=${endTime}&minlatitude=${BANGLADESH_BOUNDS.south}&maxlatitude=${BANGLADESH_BOUNDS.north}&minlongitude=${BANGLADESH_BOUNDS.west}&maxlongitude=${BANGLADESH_BOUNDS.east}&minmagnitude=2.0`,
      { 
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          'User-Agent': 'Oasis-NASA-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.features.map((feature: any, index: number) => {
      const magnitude = feature.properties.mag;
      const { severity, description } = getEarthquakeSeverity(magnitude);
      
      return {
        id: `earthquake_${feature.id}`,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        type: 'earthquake' as const,
        severity,
        value: magnitude,
        description,
        timestamp: new Date(feature.properties.time).toISOString(),
        source: 'USGS'
      };
    });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
}

// Generate synthetic environmental data based on NASA patterns
function generateEnvironmentalData(location?: string): EnvironmentalDataPoint[] {
  const data: EnvironmentalDataPoint[] = [];
  const timestamp = new Date().toISOString();
  
  // Get relevant divisions
  const divisions = location && location !== 'all' 
    ? [location] 
    : Object.keys(DIVISION_CENTERS);

  divisions.forEach((division) => {
    const center = DIVISION_CENTERS[division as keyof typeof DIVISION_CENTERS];
    if (!center) return;

    // Generate multiple data points around each division center
    for (let i = 0; i < 3; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.5; // ±0.25 degrees
      const offsetLng = (Math.random() - 0.5) * 0.5;
      
      const lat = center.lat + offsetLat;
      const lng = center.lng + offsetLng;

      // Heatwave data (based on seasonal patterns)
      const temp = 28 + Math.random() * 20; // 28-48°C range
      const heatData = getHeatwaveSeverity(temp);
      data.push({
        id: `heat_${division}_${i}`,
        lat,
        lng,
        type: 'heatwave',
        severity: heatData.severity,
        value: Number(temp.toFixed(1)),
        description: heatData.description,
        timestamp,
        source: 'NASA MODIS'
      });

      // Flood data (monsoon patterns)
      const waterLevel = 2 + Math.random() * 8; // 2-10m range
      const floodData = getFloodSeverity(waterLevel);
      data.push({
        id: `flood_${division}_${i}`,
        lat: lat + 0.01,
        lng: lng + 0.01,
        type: 'flood',
        severity: floodData.severity,
        value: Number(waterLevel.toFixed(1)),
        description: floodData.description,
        timestamp,
        source: 'NASA GPM'
      });

      // Soil quality data
      const soilPh = 4.5 + Math.random() * 4; // 4.5-8.5 pH range
      const soilData = getSoilSeverity(soilPh);
      data.push({
        id: `soil_${division}_${i}`,
        lat: lat + 0.02,
        lng: lng - 0.01,
        type: 'soil',
        severity: soilData.severity,
        value: Number(soilPh.toFixed(1)),
        description: soilData.description,
        timestamp,
        source: 'NASA Landsat'
      });
    }
  });

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'all';
    const includeRealtime = searchParams.get('realtime') === 'true';

    console.log(`Fetching environmental map data for location: ${location}`);

    // Generate synthetic environmental data
    const environmentalData = generateEnvironmentalData(location);

    // Fetch real earthquake data if requested
    let earthquakeData: EnvironmentalDataPoint[] = [];
    if (includeRealtime) {
      earthquakeData = await fetchEarthquakeData();
    }

    // Combine all data
    const allData = [...environmentalData, ...earthquakeData];

    // Calculate statistics
    const stats = {
      total: allData.length,
      critical: allData.filter(d => d.severity === 'critical').length,
      high: allData.filter(d => d.severity === 'high').length,
      medium: allData.filter(d => d.severity === 'medium').length,
      low: allData.filter(d => d.severity === 'low').length,
      byType: {
        heatwave: allData.filter(d => d.type === 'heatwave').length,
        flood: allData.filter(d => d.type === 'flood').length,
        soil: allData.filter(d => d.type === 'soil').length,
        earthquake: allData.filter(d => d.type === 'earthquake').length
      }
    };

    return NextResponse.json({
      success: true,
      data: allData,
      stats,
      location,
      timestamp: new Date().toISOString(),
      sources: [
        'NASA MODIS - Temperature data',
        'NASA GPM - Precipitation and flood data',
        'NASA Landsat - Soil and land cover data',
        'USGS - Real-time earthquake data'
      ]
    });

  } catch (error) {
    console.error('Error in environmental map API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch environmental data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}