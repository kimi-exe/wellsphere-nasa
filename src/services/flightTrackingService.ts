// Real-time Flight Tracking Service using OpenSky Network API
export interface AircraftState {
  icao24: string;           // Unique ICAO 24-bit address of the transponder in hex string representation
  callsign: string | null; // Callsign of the vehicle (8 chars). Can be null if no callsign has been received
  origin_country: string;   // Country name inferred from the ICAO 24-bit address
  time_position: number | null; // Unix timestamp (seconds) for the last position update
  last_contact: number;     // Unix timestamp (seconds) for the last update in general
  longitude: number | null; // WGS-84 longitude in decimal degrees. Can be null
  latitude: number | null;  // WGS-84 latitude in decimal degrees. Can be null
  baro_altitude: number | null; // Barometric altitude in meters. Can be null
  on_ground: boolean;       // Boolean value which indicates if the position was retrieved from a surface position report
  velocity: number | null;  // Velocity over ground in m/s. Can be null
  true_track: number | null; // True track in decimal degrees clockwise from north. Can be null
  vertical_rate: number | null; // Vertical rate in m/s. A positive value indicates that the airplane is climbing
  sensors: number[] | null; // IDs of the receivers which contributed to this state vector
  geo_altitude: number | null; // Geometric altitude in meters. Can be null
  squawk: string | null;    // The transponder code aka Squawk. Can be null
  spi: boolean;             // Whether flight status indicates special purpose indicator
  position_source: number;  // Origin of this state's position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
}

export interface FlightBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FlightStats {
  total: number;
  on_ground: number;
  in_air: number;
  tracked_positions: number;
}

export class FlightTrackingService {
  private static instance: FlightTrackingService;
  private baseUrl = 'https://opensky-network.org/api';
  private lastRequestTime = 0;
  private minRequestInterval = 10000; // 10 seconds for anonymous users
  private cache: Map<string, { data: AircraftState[]; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache
  private useMockData = true; // Flag to force mock data for testing - temporarily enabled for development

  static getInstance(): FlightTrackingService {
    if (!FlightTrackingService.instance) {
      FlightTrackingService.instance = new FlightTrackingService();
    }
    return FlightTrackingService.instance;
  }

  private async makeRequest(endpoint: string, params?: Record<string, any>): Promise<any> {
    // Rate limiting for anonymous users (10 second intervals)
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    console.log(`🛩️ Fetching flight data from: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WellSphere-NASA-FlightTracker/1.0'
        },
        mode: 'cors' // Enable CORS
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('X-Rate-Limit-Retry-After-Seconds');
          console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
          // Return mock data on rate limit
          return this.getMockData();
        }
        console.warn(`HTTP error! status: ${response.status}`);
        // Return mock data on other errors
        return this.getMockData();
      }

      const data = await response.json();
      this.lastRequestTime = Date.now();
      
      // Log rate limit info
      const remaining = response.headers.get('X-Rate-Limit-Remaining');
      if (remaining) {
        console.log(`🔄 API Credits remaining: ${remaining}`);
      }

      return data;
    } catch (error) {
      console.error('Flight tracking API error:', error);
      console.log('🎭 Using mock flight data as fallback');
      // Return mock data on network errors
      return this.getMockData();
    }
  }

  // Mock flight data for development and fallback - GLOBAL COVERAGE
  private getMockData(): any {
    console.log('🌍 Generating comprehensive global flight data');
    
    const mockStates = [
      // === NORTH AMERICA ===
      // United States - Major Routes
      ['n001aa', 'AAL101  ', 'United States', Date.now()/1000-10, Date.now()/1000, -74.0060, 40.7128, 11000, false, 280, 90, 0, null, 11200, '7001', false, 0], // NYC
      ['n002ua', 'UAL201  ', 'United States', Date.now()/1000-15, Date.now()/1000, -118.2437, 34.0522, 9500, false, 260, 270, -2, null, 9700, '7002', false, 0], // LA
      ['n003dl', 'DAL301  ', 'United States', Date.now()/1000-20, Date.now()/1000, -87.6298, 41.8781, 10500, false, 300, 180, 1, null, 10700, '7003', false, 0], // Chicago
      ['n004sw', 'SWA401  ', 'United States', Date.now()/1000-25, Date.now()/1000, -95.3698, 29.7604, 8500, false, 240, 45, 3, null, 8700, '7004', false, 0], // Houston
      ['n005ac', 'ACA501  ', 'Canada', Date.now()/1000-30, Date.now()/1000, -79.3832, 43.6532, 9800, false, 220, 315, -1, null, 10000, '7005', false, 0], // Toronto
      
      // === EUROPE ===
      // Major European Airlines
      ['e001ba', 'BAW101  ', 'United Kingdom', Date.now()/1000-35, Date.now()/1000, -0.1276, 51.5074, 10200, false, 290, 120, 0, null, 10400, '7101', false, 0], // London
      ['e002af', 'AFR201  ', 'France', Date.now()/1000-40, Date.now()/1000, 2.3522, 48.8566, 11500, false, 310, 200, 2, null, 11700, '7102', false, 0], // Paris
      ['e003lh', 'DLH301  ', 'Germany', Date.now()/1000-45, Date.now()/1000, 13.4050, 52.5200, 9900, false, 270, 90, -1, null, 10100, '7103', false, 0], // Berlin
      ['e004kl', 'KLM401  ', 'Netherlands', Date.now()/1000-50, Date.now()/1000, 4.9041, 52.3676, 8800, false, 250, 45, 1, null, 9000, '7104', false, 0], // Amsterdam
      ['e005ib', 'IBE501  ', 'Spain', Date.now()/1000-55, Date.now()/1000, -3.7038, 40.4168, 10800, false, 280, 270, 0, null, 11000, '7105', false, 0], // Madrid
      ['e006az', 'AZA601  ', 'Italy', Date.now()/1000-60, Date.now()/1000, 12.4964, 41.9028, 9400, false, 260, 180, -2, null, 9600, '7106', false, 0], // Rome
      
      // === ASIA-PACIFIC ===
      // Major Asian Airlines
      ['a001ja', 'JAL101  ', 'Japan', Date.now()/1000-65, Date.now()/1000, 139.6503, 35.6762, 11200, false, 320, 270, 1, null, 11400, '7201', false, 0], // Tokyo
      ['a002nh', 'ANA201  ', 'Japan', Date.now()/1000-70, Date.now()/1000, 135.5023, 34.6937, 10500, false, 290, 90, 0, null, 10700, '7202', false, 0], // Osaka
      ['a003ca', 'CCA301  ', 'China', Date.now()/1000-75, Date.now()/1000, 116.4074, 39.9042, 9800, false, 280, 180, -1, null, 10000, '7203', false, 0], // Beijing
      ['a004mu', 'CES401  ', 'China', Date.now()/1000-80, Date.now()/1000, 121.4737, 31.2304, 11000, false, 300, 45, 2, null, 11200, '7204', false, 0], // Shanghai
      ['a005ke', 'KAL501  ', 'South Korea', Date.now()/1000-85, Date.now()/1000, 126.9780, 37.5665, 10200, false, 270, 315, 0, null, 10400, '7205', false, 0], // Seoul
      ['a006sq', 'SIA601  ', 'Singapore', Date.now()/1000-90, Date.now()/1000, 103.8198, 1.3521, 9500, false, 250, 135, -1, null, 9700, '7206', false, 0], // Singapore
      ['a007th', 'THA701  ', 'Thailand', Date.now()/1000-95, Date.now()/1000, 100.5018, 13.7563, 8800, false, 240, 270, 1, null, 9000, '7207', false, 0], // Bangkok
      ['a008ai', 'AIC801  ', 'India', Date.now()/1000-100, Date.now()/1000, 77.1025, 28.7041, 10800, false, 290, 180, 0, null, 11000, '7208', false, 0], // Delhi
      ['a009qf', 'QFA901  ', 'Australia', Date.now()/1000-105, Date.now()/1000, 151.2093, -33.8688, 11500, false, 310, 90, 2, null, 11700, '7209', false, 0], // Sydney
      
      // === MIDDLE EAST ===
      ['m001ek', 'UAE101  ', 'United Arab Emirates', Date.now()/1000-110, Date.now()/1000, 55.2708, 25.2048, 12000, false, 320, 270, 0, null, 12200, '7301', false, 0], // Dubai
      ['m002qr', 'QTR201  ', 'Qatar', Date.now()/1000-115, Date.now()/1000, 51.5310, 25.2760, 11800, false, 310, 180, -1, null, 12000, '7302', false, 0], // Doha
      ['m003ms', 'MSR301  ', 'Egypt', Date.now()/1000-120, Date.now()/1000, 31.4056, 30.0444, 9200, false, 260, 90, 1, null, 9400, '7303', false, 0], // Cairo
      ['m004tk', 'THY401  ', 'Turkey', Date.now()/1000-125, Date.now()/1000, 28.9784, 41.0082, 10500, false, 280, 45, 0, null, 10700, '7304', false, 0], // Istanbul
      
      // === AFRICA ===
      ['f001sa', 'SAA101  ', 'South Africa', Date.now()/1000-130, Date.now()/1000, 28.0473, -26.2041, 9800, false, 250, 180, -1, null, 10000, '7401', false, 0], // Johannesburg
      ['f002et', 'ETH201  ', 'Ethiopia', Date.now()/1000-135, Date.now()/1000, 38.7669, 9.1450, 11200, false, 290, 270, 1, null, 11400, '7402', false, 0], // Addis Ababa
      ['f003ms', 'MSR301  ', 'Egypt', Date.now()/1000-140, Date.now()/1000, 30.0626, 31.2497, 8500, false, 240, 90, 0, null, 8700, '7403', false, 0], // Alexandria
      
      // === SOUTH AMERICA ===
      ['s001la', 'LAN101  ', 'Chile', Date.now()/1000-145, Date.now()/1000, -70.6693, -33.4489, 10200, false, 270, 180, -2, null, 10400, '7501', false, 0], // Santiago
      ['s002ar', 'ARG201  ', 'Argentina', Date.now()/1000-150, Date.now()/1000, -58.3816, -34.6118, 9500, false, 250, 270, 1, null, 9700, '7502', false, 0], // Buenos Aires
      ['s003ta', 'TAM301  ', 'Brazil', Date.now()/1000-155, Date.now()/1000, -46.6333, -23.5505, 11000, false, 290, 90, 0, null, 11200, '7503', false, 0], // São Paulo
      ['s004av', 'AVA401  ', 'Colombia', Date.now()/1000-160, Date.now()/1000, -74.0721, 4.7110, 8800, false, 230, 45, -1, null, 9000, '7504', false, 0], // Bogotá
      
      // === TRANS-OCEANIC FLIGHTS ===
      // Pacific Routes
      ['t001ua', 'UAL901  ', 'United States', Date.now()/1000-165, Date.now()/1000, -155.5828, 19.8968, 12500, false, 340, 270, 0, null, 12700, '7601', false, 0], // Hawaii
      ['t002nz', 'ANZ902  ', 'New Zealand', Date.now()/1000-170, Date.now()/1000, 174.7633, -36.8485, 11800, false, 320, 180, 1, null, 12000, '7602', false, 0], // Auckland
      // Atlantic Routes
      ['t003vs', 'VIR903  ', 'United Kingdom', Date.now()/1000-175, Date.now()/1000, -25.0000, 45.0000, 12000, false, 330, 270, 0, null, 12200, '7603', false, 0], // Mid-Atlantic
      ['t004af', 'AFR904  ', 'France', Date.now()/1000-180, Date.now()/1000, -40.0000, 50.0000, 11500, false, 310, 90, -1, null, 11700, '7604', false, 0], // North Atlantic
      
      // === BANGLADESH & SOUTH ASIA (Original) ===
      ['bd01a1', 'BG101   ', 'Bangladesh', Date.now()/1000-185, Date.now()/1000, 90.4125, 23.8103, 9000, false, 250, 45, 0, null, 9200, '7000', false, 0],
      ['bd02a2', 'US502   ', 'United States', Date.now()/1000-190, Date.now()/1000, 90.3563, 23.6850, 11000, false, 180, 90, 5, null, 11200, '7001', false, 0],
      ['bd03a3', 'QR801   ', 'Qatar', Date.now()/1000-195, Date.now()/1000, 90.2000, 23.7000, 8500, false, 220, 180, -2, null, 8700, '7002', false, 0],
      ['in001', 'AI6E23  ', 'India', Date.now()/1000-200, Date.now()/1000, 77.5946, 12.9716, 9800, false, 260, 135, 1, null, 10000, '7701', false, 0], // Bangalore
      ['pk001', 'PIA101  ', 'Pakistan', Date.now()/1000-205, Date.now()/1000, 67.0011, 24.8607, 10200, false, 270, 270, 0, null, 10400, '7702', false, 0], // Karachi
      ['lk001', 'UL201   ', 'Sri Lanka', Date.now()/1000-210, Date.now()/1000, 79.8612, 6.9271, 8500, false, 240, 180, -1, null, 8700, '7703', false, 0], // Colombo
      
      // === CARGO FLIGHTS ===
      ['c001fx', 'FDX101  ', 'United States', Date.now()/1000-215, Date.now()/1000, -89.9711, 35.0428, 11000, false, 280, 45, 0, null, 11200, '7801', false, 0], // Memphis (FedEx)
      ['c002up', 'UPS201  ', 'United States', Date.now()/1000-220, Date.now()/1000, -85.7585, 38.1970, 10500, false, 270, 270, -1, null, 10700, '7802', false, 0], // Louisville (UPS)
      ['c003qr', 'QTR901C ', 'Qatar', Date.now()/1000-225, Date.now()/1000, 51.6050, 25.2600, 12000, false, 300, 180, 0, null, 12200, '7803', false, 0], // Doha Cargo
      
      // === LOW-COST CARRIERS ===
      ['l001ry', 'RYR101  ', 'Ireland', Date.now()/1000-230, Date.now()/1000, -6.2603, 53.3498, 8800, false, 240, 90, 1, null, 9000, '7901', false, 0], // Dublin (Ryanair)
      ['l002ez', 'EZY201  ', 'United Kingdom', Date.now()/1000-235, Date.now()/1000, -0.4543, 51.4700, 9200, false, 250, 180, 0, null, 9400, '7902', false, 0], // London (EasyJet)
      ['l003wn', 'SWA301  ', 'United States', Date.now()/1000-240, Date.now()/1000, -104.6732, 39.8561, 8500, false, 230, 270, -1, null, 8700, '7903', false, 0], // Denver (Southwest)
      
      // === GROUND AIRCRAFT (Various Airports) ===
      ['g001', 'BAW001G ', 'United Kingdom', Date.now()/1000-245, Date.now()/1000, -0.4614, 51.4700, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Heathrow
      ['g002', 'AAL002G ', 'United States', Date.now()/1000-250, Date.now()/1000, -73.7781, 40.6413, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // JFK
      ['g003', 'AFR003G ', 'France', Date.now()/1000-255, Date.now()/1000, 2.5479, 49.0097, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // CDG
      ['g004', 'DLH004G ', 'Germany', Date.now()/1000-260, Date.now()/1000, 8.5622, 50.0333, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Frankfurt
      ['g005', 'JAL005G ', 'Japan', Date.now()/1000-265, Date.now()/1000, 140.3929, 35.5494, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Haneda
      ['g006', 'SIA006G ', 'Singapore', Date.now()/1000-270, Date.now()/1000, 103.9915, 1.3644, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Changi
      ['g007', 'UAE007G ', 'United Arab Emirates', Date.now()/1000-275, Date.now()/1000, 55.3644, 25.2532, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Dubai
      ['g008', 'BG008G  ', 'Bangladesh', Date.now()/1000-280, Date.now()/1000, 90.4050, 23.8433, 0, true, 0, 0, 0, null, 0, '0000', false, 0], // Dhaka
    ];

    return {
      time: Date.now() / 1000,
      states: mockStates
    };
  }

  private transformStateVector(stateVector: any[]): AircraftState {
    return {
      icao24: stateVector[0] || '',
      callsign: stateVector[1] ? stateVector[1].trim() : null,
      origin_country: stateVector[2] || '',
      time_position: stateVector[3],
      last_contact: stateVector[4] || 0,
      longitude: stateVector[5],
      latitude: stateVector[6],
      baro_altitude: stateVector[7],
      on_ground: stateVector[8] || false,
      velocity: stateVector[9],
      true_track: stateVector[10],
      vertical_rate: stateVector[11],
      sensors: stateVector[12],
      geo_altitude: stateVector[13],
      squawk: stateVector[14],
      spi: stateVector[15] || false,
      position_source: stateVector[16] || 0
    };
  }

  // Enable/disable mock data for testing
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    this.clearCache(); // Clear cache when switching modes
  }

  // Get all current aircraft states
  async getAllAircraft(): Promise<AircraftState[]> {
    const cacheKey = 'all_aircraft';
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      console.log('📋 Using cached flight data');
      return cached.data;
    }

    try {
      let response;
      
      if (this.useMockData) {
        console.log('🎭 Using mock data (forced)');
        response = this.getMockData();
      } else {
        response = await this.makeRequest('/states/all');
      }
      
      if (!response || !response.states) {
        console.log('⚠️ No states in response, using mock data');
        response = this.getMockData();
      }

      const aircraft = response.states
        .filter((state: any[]) => state[6] !== null && state[5] !== null) // Filter out aircraft without position
        .map((state: any[]) => this.transformStateVector(state));

      // Cache the results
      this.cache.set(cacheKey, {
        data: aircraft,
        timestamp: Date.now()
      });

      const source = this.useMockData ? 'Mock Data' : 'OpenSky Network';
      console.log(`✈️ Loaded ${aircraft.length} aircraft from ${source}`);
      return aircraft;
    } catch (error) {
      console.error('Failed to fetch aircraft data:', error);
      // Return cached data if available, even if expired
      if (cached) {
        console.log('📋 Fallback to expired cache data');
        return cached.data;
      }
      console.log('🎭 Fallback to mock data');
      const mockResponse = this.getMockData();
      const mockAircraft = mockResponse.states
        .filter((state: any[]) => state[6] !== null && state[5] !== null)
        .map((state: any[]) => this.transformStateVector(state));
      return mockAircraft;
    }
  }

  // Get aircraft within specific bounds (more efficient for regional tracking)
  async getAircraftInBounds(bounds: FlightBounds): Promise<AircraftState[]> {
    const cacheKey = `bounds_${bounds.north}_${bounds.south}_${bounds.east}_${bounds.west}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest('/states/all', {
        lamin: bounds.south,
        lamax: bounds.north,
        lomin: bounds.west,
        lomax: bounds.east
      });

      if (!response || !response.states) {
        return [];
      }

      const aircraft = response.states
        .filter((state: any[]) => state[6] !== null && state[5] !== null)
        .map((state: any[]) => this.transformStateVector(state));

      this.cache.set(cacheKey, {
        data: aircraft,
        timestamp: Date.now()
      });

      console.log(`🌍 Loaded ${aircraft.length} aircraft in bounds`);
      return aircraft;
    } catch (error) {
      console.error('Failed to fetch bounded aircraft data:', error);
      if (cached) {
        return cached.data;
      }
      return [];
    }
  }

  // Get aircraft statistics
  getFlightStats(aircraft: AircraftState[]): FlightStats {
    return {
      total: aircraft.length,
      on_ground: aircraft.filter(a => a.on_ground).length,
      in_air: aircraft.filter(a => !a.on_ground).length,
      tracked_positions: aircraft.filter(a => a.latitude !== null && a.longitude !== null).length
    };
  }

  // Filter aircraft by altitude (useful for different zoom levels)
  filterByAltitude(aircraft: AircraftState[], minAltitude?: number, maxAltitude?: number): AircraftState[] {
    return aircraft.filter(a => {
      if (a.baro_altitude === null) return true; // Include aircraft without altitude data
      
      let include = true;
      if (minAltitude !== undefined) {
        include = include && a.baro_altitude >= minAltitude;
      }
      if (maxAltitude !== undefined) {
        include = include && a.baro_altitude <= maxAltitude;
      }
      return include;
    });
  }

  // Get aircraft color based on altitude
  getAircraftColor(aircraft: AircraftState): string {
    if (aircraft.on_ground) return '#8B4513'; // Brown for ground
    if (aircraft.baro_altitude === null) return '#FFD700'; // Gold for unknown altitude
    
    const altitude = aircraft.baro_altitude;
    if (altitude < 1000) return '#FF4500';      // Orange Red - Very low
    if (altitude < 3000) return '#FF6347';      // Tomato - Low
    if (altitude < 6000) return '#FFA500';      // Orange - Medium-low
    if (altitude < 10000) return '#FFD700';     // Gold - Medium
    if (altitude < 15000) return '#90EE90';     // Light Green - Medium-high
    if (altitude < 20000) return '#87CEEB';     // Sky Blue - High
    return '#4169E1';                           // Royal Blue - Very high
  }

  // Get aircraft size based on zoom level and type
  getAircraftSize(zoomLevel: number): number {
    if (zoomLevel < 8) return 8;
    if (zoomLevel < 10) return 12;
    if (zoomLevel < 12) return 16;
    return 20;
  }

  // Create airplane icon rotation based on heading
  getAircraftRotation(aircraft: AircraftState): number {
    return aircraft.true_track || 0;
  }

  // Format aircraft info for display
  formatAircraftInfo(aircraft: AircraftState): {
    title: string;
    details: { label: string; value: string }[];
  } {
    const formatSpeed = (velocity: number | null): string => {
      if (velocity === null) return 'Unknown';
      return `${Math.round(velocity * 3.6)} km/h`; // Convert m/s to km/h
    };

    const formatAltitude = (altitude: number | null): string => {
      if (altitude === null) return 'Unknown';
      return `${Math.round(altitude)} m`;
    };

    return {
      title: aircraft.callsign?.trim() || aircraft.icao24,
      details: [
        { label: 'ICAO24', value: aircraft.icao24.toUpperCase() },
        { label: 'Country', value: aircraft.origin_country },
        { label: 'Altitude', value: formatAltitude(aircraft.baro_altitude) },
        { label: 'Speed', value: formatSpeed(aircraft.velocity) },
        { label: 'Heading', value: aircraft.true_track ? `${Math.round(aircraft.true_track)}°` : 'Unknown' },
        { label: 'Status', value: aircraft.on_ground ? 'On Ground' : 'In Flight' },
        { label: 'Squawk', value: aircraft.squawk || 'N/A' }
      ]
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Flight tracking cache cleared');
  }
}

// Singleton instance for global access
export const flightTrackingService = FlightTrackingService.getInstance();