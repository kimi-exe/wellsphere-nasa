// High-Performance Road Quality Service - Optimized for Speed
export interface FastRoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
  highway_type: string;
  condition_score: number;
  traffic_level: 'low' | 'moderate' | 'high' | 'extreme';
  issues: string[];
  surface: string;
  color: string; // Pre-computed color
  weight: number; // Pre-computed weight
}

export interface CityRoadData {
  city: string;
  bounds: { north: number; south: number; east: number; west: number };
  center: [number, number];
  roads: FastRoadSegment[];
  stats: {
    total: number;
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    very_poor: number;
  };
}

export class FastRoadService {
  private static instance: FastRoadService;
  private roadCache: Map<string, CityRoadData> = new Map();
  
  // Pre-computed road data for instant loading  
  private precomputedData: Record<string, CityRoadData> = {};

  constructor() {
    // Initialize city data
    this.initializeCityData();
  }

  private initializeCityData() {
    const cities = [
      { name: 'Dhaka', center: [23.8103, 90.4125], bounds: { north: 23.95, south: 23.65, east: 90.55, west: 90.25 }, density: 30 },
      { name: 'Chittagong', center: [22.3475, 91.8123], bounds: { north: 22.45, south: 22.25, east: 91.95, west: 91.65 }, density: 25 },
      { name: 'Sylhet', center: [24.8949, 91.8687], bounds: { north: 25.00, south: 24.80, east: 92.00, west: 91.75 }, density: 20 },
      { name: 'Rajshahi', center: [24.3745, 88.6042], bounds: { north: 24.45, south: 24.30, east: 88.75, west: 88.45 }, density: 18 },
      { name: 'Khulna', center: [22.8456, 89.5403], bounds: { north: 22.95, south: 22.75, east: 89.65, west: 89.45 }, density: 15 },
      { name: 'Barisal', center: [22.7010, 90.3535], bounds: { north: 22.80, south: 22.60, east: 90.45, west: 90.25 }, density: 15 }
    ];

    cities.forEach(city => {
      const roads = this.generateOptimizedRoadGrid(city.name, city.center[0], city.center[1], 0.1, city.density);
      
      this.precomputedData[city.name] = {
        city: city.name,
        bounds: city.bounds,
        center: city.center as [number, number],
        roads,
        stats: { total: 0, excellent: 0, good: 0, fair: 0, poor: 0, very_poor: 0 }
      };
      
      this.updateCityStats(city.name);
    });
  }

  static getInstance(): FastRoadService {
    if (!FastRoadService.instance) {
      FastRoadService.instance = new FastRoadService();
    }
    return FastRoadService.instance;
  }

  // Generate optimized road grid for a city - MUCH faster than API calls
  private generateOptimizedRoadGrid(city: string, centerLat: number, centerLng: number, radius: number, density: number): FastRoadSegment[] {
    const roads: FastRoadSegment[] = [];
    const step = radius * 2 / density; // Grid step size
    
    // Create major roads first (highways, trunks)
    this.addMajorRoads(roads, city, centerLat, centerLng, radius);
    
    // Create grid network
    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        const lat = centerLat - radius + (i * step);
        const lng = centerLng - radius + (j * step);
        
        // Add horizontal road
        if (j < density - 1) {
          const road = this.createFastRoad(
            `${city.toLowerCase()}_h_${i}_${j}`,
            `${this.getRoadNameByArea(city, lat, lng)} Street`,
            [[lat, lng], [lat, lng + step]],
            this.determineRoadType(i, j, density),
            city,
            lat,
            lng
          );
          roads.push(road);
        }
        
        // Add vertical road
        if (i < density - 1) {
          const road = this.createFastRoad(
            `${city.toLowerCase()}_v_${i}_${j}`,
            `${this.getRoadNameByArea(city, lat, lng)} Avenue`,
            [[lat, lng], [lat + step, lng]],
            this.determineRoadType(i, j, density),
            city,
            lat,
            lng
          );
          roads.push(road);
        }
      }
    }
    
    return roads;
  }

  private addMajorRoads(roads: FastRoadSegment[], city: string, centerLat: number, centerLng: number, radius: number): void {
    const majorRoads = this.getMajorRoadsForCity(city, centerLat, centerLng, radius);
    roads.push(...majorRoads);
  }

  private getMajorRoadsForCity(city: string, centerLat: number, centerLng: number, radius: number): FastRoadSegment[] {
    const roads: FastRoadSegment[] = [];
    
    switch (city) {
      case 'Dhaka':
        roads.push(
          this.createFastRoad('dhaka_ring', 'Dhaka Ring Road', this.createRingRoad(centerLat, centerLng, 0.08), 'trunk', city, centerLat, centerLng),
          this.createFastRoad('dhaka_airport', 'Airport Road', [[centerLat, centerLng], [centerLat + 0.05, centerLng - 0.03]], 'primary', city, centerLat, centerLng),
          this.createFastRoad('dhaka_chittagong', 'Dhaka-Chittagong Highway', [[centerLat, centerLng], [centerLat - 0.1, centerLng + 0.1]], 'trunk', city, centerLat, centerLng)
        );
        break;
      case 'Chittagong':
        roads.push(
          this.createFastRoad('ctg_port', 'Port Access Road', [[centerLat, centerLng], [centerLat - 0.03, centerLng + 0.02]], 'trunk', city, centerLat, centerLng),
          this.createFastRoad('ctg_coxsbazar', 'Cox\'s Bazar Highway', [[centerLat, centerLng], [centerLat + 0.1, centerLng + 0.08]], 'primary', city, centerLat, centerLng)
        );
        break;
      default:
        roads.push(
          this.createFastRoad(`${city.toLowerCase()}_main`, `${city} Main Road`, [[centerLat - 0.05, centerLng], [centerLat + 0.05, centerLng]], 'primary', city, centerLat, centerLng)
        );
    }
    
    return roads;
  }

  private createRingRoad(centerLat: number, centerLng: number, radius: number): [number, number][] {
    const points: [number, number][] = [];
    const segments = 16;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const lat = centerLat + radius * Math.cos(angle);
      const lng = centerLng + radius * Math.sin(angle);
      points.push([lat, lng]);
    }
    
    return points;
  }

  private createFastRoad(id: string, name: string, coordinates: [number, number][], highway_type: string, city: string, lat: number, lng: number): FastRoadSegment {
    const quality = this.fastQualityAssessment(highway_type, city, lat, lng);
    const condition_score = this.getScoreForQuality(quality);
    
    return {
      id,
      name,
      coordinates,
      quality,
      highway_type,
      condition_score,
      traffic_level: this.getTrafficLevel(highway_type, city),
      issues: this.getIssuesForQuality(quality, highway_type),
      surface: this.getSurfaceForType(highway_type),
      color: this.getColorForQuality(quality),
      weight: this.getWeightForQuality(quality)
    };
  }

  private fastQualityAssessment(highway_type: string, city: string, lat: number, lng: number): FastRoadSegment['quality'] {
    let baseScore = 50;
    
    // Highway type scoring (faster lookup)
    const typeScores: Record<string, number> = {
      'motorway': 85, 'trunk': 80, 'primary': 75, 'secondary': 65, 'tertiary': 55,
      'residential': 45, 'service': 35, 'track': 25, 'path': 20, 'unclassified': 40
    };
    
    baseScore = typeScores[highway_type] || 40;
    
    // City-specific modifiers (pre-computed)
    const cityModifiers: Record<string, number> = {
      'Dhaka': -10, 'Chittagong': -5, 'Sylhet': 0, 'Rajshahi': 5, 'Khulna': 0, 'Barisal': -5
    };
    
    baseScore += cityModifiers[city] || 0;
    
    // Random variation for realism
    baseScore += (Math.random() - 0.5) * 20;
    
    // Convert to quality level
    if (baseScore >= 80) return 'excellent';
    if (baseScore >= 65) return 'good';
    if (baseScore >= 45) return 'fair';
    if (baseScore >= 25) return 'poor';
    return 'very_poor';
  }

  private determineRoadType(i: number, j: number, density: number): string {
    const center = density / 2;
    const distFromCenter = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
    
    if (distFromCenter < density * 0.1) return 'primary';
    if (distFromCenter < density * 0.2) return 'secondary';
    if (distFromCenter < density * 0.4) return 'tertiary';
    return 'residential';
  }

  private getRoadNameByArea(city: string, lat: number, lng: number): string {
    const areas: Record<string, string[]> = {
      'Dhaka': ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Motijheel', 'Ramna', 'Tejgaon'],
      'Chittagong': ['Panchlaish', 'Khulshi', 'Nasirabad', 'Agrabad', 'Kotwali', 'Double Mooring'],
      'Sylhet': ['Zindabazar', 'Lamabazar', 'Chowhatta', 'Bondor Bazar', 'Subidbazar'],
      'Rajshahi': ['New Market', 'Shaheb Bazar', 'Boalia', 'Motihar', 'Rajpara'],
      'Khulna': ['Khalishpur', 'Sonadanga', 'Boyra', 'Doulatpur', 'Khan Jahan Ali'],
      'Barisal': ['Band Road', 'Sadar Road', 'Nathullabad', 'Bogra Road', 'College Road']
    };
    
    const cityAreas = areas[city] || ['Central', 'Main', 'Station', 'Market'];
    return cityAreas[Math.floor(Math.random() * cityAreas.length)];
  }

  private getScoreForQuality(quality: FastRoadSegment['quality']): number {
    const scores = { excellent: 90, good: 75, fair: 55, poor: 35, very_poor: 15 };
    return scores[quality];
  }

  private getTrafficLevel(highway_type: string, city: string): FastRoadSegment['traffic_level'] {
    if (['motorway', 'trunk'].includes(highway_type)) return 'extreme';
    if (['primary', 'secondary'].includes(highway_type)) return 'high';
    if (['tertiary', 'residential'].includes(highway_type)) return 'moderate';
    return 'low';
  }

  private getIssuesForQuality(quality: FastRoadSegment['quality'], highway_type: string): string[] {
    const issueMap: Record<FastRoadSegment['quality'], string[]> = {
      excellent: [],
      good: ['Minor wear'],
      fair: ['Some potholes', 'Needs maintenance'],
      poor: ['Multiple potholes', 'Poor drainage', 'Cracked surface'],
      very_poor: ['Major damage', 'Unsafe conditions', 'Impassable in monsoon']
    };
    
    return issueMap[quality];
  }

  private getSurfaceForType(highway_type: string): string {
    const surfaceMap: Record<string, string> = {
      motorway: 'concrete', trunk: 'asphalt', primary: 'asphalt', secondary: 'asphalt',
      tertiary: 'asphalt', residential: 'paved', service: 'gravel', track: 'dirt', path: 'dirt'
    };
    
    return surfaceMap[highway_type] || 'unknown';
  }

  private getColorForQuality(quality: FastRoadSegment['quality']): string {
    const colors = {
      excellent: '#00ff00', good: '#7fff00', fair: '#ffff00', poor: '#ff7f00', very_poor: '#ff0000'
    };
    return colors[quality];
  }

  private getWeightForQuality(quality: FastRoadSegment['quality']): number {
    const weights = { excellent: 4, good: 3, fair: 3, poor: 2, very_poor: 2 };
    return weights[quality];
  }

  private updateCityStats(city: string): void {
    const cityData = this.precomputedData[city];
    if (!cityData) return;
    
    const stats = { total: 0, excellent: 0, good: 0, fair: 0, poor: 0, very_poor: 0 };
    
    cityData.roads.forEach(road => {
      stats.total++;
      stats[road.quality]++;
    });
    
    cityData.stats = stats;
  }

  // Public API - Instantly fast!
  async getRoadsForCity(cityName: string): Promise<FastRoadSegment[]> {
    // Instant return - no API calls, no processing
    const cityData = this.precomputedData[cityName];
    return cityData ? cityData.roads : [];
  }

  async getCityData(cityName: string): Promise<CityRoadData | null> {
    return this.precomputedData[cityName] || null;
  }

  async getCityStats(cityName: string) {
    const cityData = this.precomputedData[cityName];
    return cityData?.stats || null;
  }

  // Get roads by quality filter - super fast filtering
  getRoadsByQuality(cityName: string, qualities: FastRoadSegment['quality'][]): FastRoadSegment[] {
    const cityData = this.precomputedData[cityName];
    if (!cityData) return [];
    
    return cityData.roads.filter(road => qualities.includes(road.quality));
  }

  // Search roads - fast string matching
  searchRoads(cityName: string, query: string): FastRoadSegment[] {
    const cityData = this.precomputedData[cityName];
    if (!cityData) return [];
    
    const lowerQuery = query.toLowerCase();
    return cityData.roads.filter(road => 
      road.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit results for performance
  }

  // Get available cities
  getAvailableCities(): string[] {
    return Object.keys(this.precomputedData);
  }

  // Get city bounds for map centering
  getCityBounds(cityName: string) {
    return this.precomputedData[cityName]?.bounds || null;
  }

  getCityCenter(cityName: string): [number, number] {
    return this.precomputedData[cityName]?.center || [23.8103, 90.4125];
  }
}

// Singleton instance for global access
export const fastRoadService = FastRoadService.getInstance();