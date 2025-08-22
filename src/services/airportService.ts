export interface Airport {
  id: string;
  name: string;
  iataCode: string;
  icaoCode: string;
  latitude: number;
  longitude: number;
  city: string;
  type: 'international' | 'domestic' | 'stol';
  dangerZoneRadius: number; // in meters
  description: string;
}

export const bangladeshAirports: Airport[] = [
  {
    id: 'dac',
    name: 'Hazrat Shahjalal International Airport',
    iataCode: 'DAC',
    icaoCode: 'VGHS',
    latitude: 23.8433,
    longitude: 90.3978,
    city: 'Dhaka',
    type: 'international',
    dangerZoneRadius: 8000, // 8km radius for international airport
    description: 'Main international airport of Bangladesh, handling 90% of international traffic. High noise pollution and air pollution from frequent flights.'
  },
  {
    id: 'cgp',
    name: 'Shah Amanat International Airport',
    iataCode: 'CGP',
    icaoCode: 'VGEG',
    latitude: 22.2496,
    longitude: 91.8133,
    city: 'Chittagong',
    type: 'international',
    dangerZoneRadius: 6000, // 6km radius for smaller international airport
    description: 'Second largest international airport. Noise pollution from aircraft operations and proximity to industrial areas.'
  },
  {
    id: 'zyl',
    name: 'Osmani International Airport',
    iataCode: 'ZYL',
    icaoCode: 'VGSY',
    latitude: 24.9633,
    longitude: 91.8736,
    city: 'Sylhet',
    type: 'international',
    dangerZoneRadius: 5000, // 5km radius for smaller international airport
    description: 'Third largest international airport. High UK passenger traffic creates significant noise pollution in surrounding areas.'
  },
  {
    id: 'cxb',
    name: 'Cox\'s Bazar Airport',
    iataCode: 'CXB',
    icaoCode: 'VGCB',
    latitude: 21.4519,
    longitude: 91.9636,
    city: 'Cox\'s Bazar',
    type: 'domestic',
    dangerZoneRadius: 4000, // 4km radius for domestic airport
    description: 'Tourist destination airport being upgraded to international. Increasing flight operations pose environmental risks.'
  },
  {
    id: 'jsj',
    name: 'Jessore Airport',
    iataCode: 'JSR',
    icaoCode: 'VGJR',
    latitude: 23.1838,
    longitude: 89.1608,
    city: 'Jessore',
    type: 'domestic',
    dangerZoneRadius: 3500, // 3.5km radius for domestic airport
    description: 'Domestic airport with military operations. Noise pollution affects nearby residential areas.'
  },
  {
    id: 'rjh',
    name: 'Shah Makhdum Airport',
    iataCode: 'RJH',
    icaoCode: 'VGRJ',
    latitude: 24.4372,
    longitude: 88.6158,
    city: 'Rajshahi',
    type: 'domestic',
    dangerZoneRadius: 3000, // 3km radius for smaller domestic airport
    description: 'Regional domestic airport. Limited operations but still creates noise pollution for surrounding communities.'
  },
  {
    id: 'brg',
    name: 'Barisal Airport',
    iataCode: 'BZL',
    icaoCode: 'VGBR',
    latitude: 22.8010,
    longitude: 90.3012,
    city: 'Barisal',
    type: 'domestic',
    dangerZoneRadius: 2500, // 2.5km radius for small domestic airport
    description: 'Small domestic airport serving southern Bangladesh. Environmental impact from fuel emissions and noise.'
  },
  {
    id: 'isl',
    name: 'Ishwardi Airport',
    iataCode: 'ISP',
    icaoCode: 'VGIS',
    latitude: 24.1525,
    longitude: 89.0494,
    city: 'Ishwardi',
    type: 'stol',
    dangerZoneRadius: 2000, // 2km radius for STOL port
    description: 'STOL port with limited operations. Potential safety risks due to short runway operations.'
  }
];

export function getAirportById(id: string): Airport | undefined {
  return bangladeshAirports.find(airport => airport.id === id);
}

export function getAirportsByType(type: Airport['type']): Airport[] {
  return bangladeshAirports.filter(airport => airport.type === type);
}

export function getAirportsNearLocation(lat: number, lng: number, radiusKm: number = 50): Airport[] {
  return bangladeshAirports.filter(airport => {
    const distance = calculateDistance(lat, lng, airport.latitude, airport.longitude);
    return distance <= radiusKm;
  });
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function isLocationInDangerZone(lat: number, lng: number): { inDangerZone: boolean; nearestAirport?: Airport; distance?: number } {
  let nearestAirport: Airport | undefined;
  let minDistance = Infinity;
  
  for (const airport of bangladeshAirports) {
    const distance = calculateDistance(lat, lng, airport.latitude, airport.longitude) * 1000; // Convert to meters
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestAirport = airport;
    }
    
    if (distance <= airport.dangerZoneRadius) {
      return {
        inDangerZone: true,
        nearestAirport: airport,
        distance: distance
      };
    }
  }
  
  return {
    inDangerZone: false,
    nearestAirport,
    distance: minDistance
  };
}