// USGS Earthquake API Service
export interface EarthquakeData {
  id: string;
  lat: number;
  lng: number;
  magnitude: number;
  depth: number;
  location: string;
  timestamp: string;
  significance: number;
  tsunami: number;
  felt?: number;
  magType: string;
}

export class EarthquakeAPIService {
  private baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

  async getEarthquakes(options: {
    starttime?: string;
    endtime?: string;
    minmagnitude?: number;
    maxmagnitude?: number;
    minlatitude?: number;
    maxlatitude?: number;
    minlongitude?: number;
    maxlongitude?: number;
    limit?: number;
  } = {}): Promise<EarthquakeData[]> {
    try {
      const params = new URLSearchParams({
        format: 'geojson',
        ...options,
        starttime: options.starttime || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        minmagnitude: (options.minmagnitude || 3.0).toString(),
        limit: (options.limit || 50).toString()
      });

      const response = await fetch(`${this.baseURL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status}`);
      }

      const data = await response.json();

      return data.features.map((feature: any) => ({
        id: feature.id,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        magnitude: feature.properties.mag,
        depth: feature.geometry.coordinates[2],
        location: feature.properties.place || 'Unknown location',
        timestamp: new Date(feature.properties.time).toISOString(),
        significance: feature.properties.sig || 0,
        tsunami: feature.properties.tsunami || 0,
        felt: feature.properties.felt,
        magType: feature.properties.magType || 'unknown'
      }));
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      return [];
    }
  }

  async getEarthquakesForBangladesh(): Promise<EarthquakeData[]> {
    // Get regional earthquakes with expanded coverage
    return this.getEarthquakes({
      minlatitude: 19.0,  // Extended south to include Bay of Bengal
      maxlatitude: 27.0,  // Extended north to include Nepal border
      minlongitude: 87.0, // Extended west to include Indian border
      maxlongitude: 94.0, // Extended east to include Myanmar border
      minmagnitude: 2.0,
      limit: 50           // Increased limit for more data points
    });
  }

  async getGlobalEarthquakes(): Promise<EarthquakeData[]> {
    return this.getEarthquakes({
      minmagnitude: 4.0,
      limit: 100          // Increased for global context
    });
  }

  async getAllRelevantEarthquakes(): Promise<EarthquakeData[]> {
    try {
      // Get both regional and significant global earthquakes
      const [regional, global] = await Promise.all([
        this.getEarthquakesForBangladesh(),
        this.getEarthquakes({
          minmagnitude: 5.5, // Only significant global events
          limit: 30
        })
      ]);

      // Combine and deduplicate
      const combined = [...regional, ...global];
      const unique = combined.filter((eq, index, self) => 
        index === self.findIndex(e => e.id === eq.id)
      );

      return unique.sort((a, b) => b.magnitude - a.magnitude);
    } catch (error) {
      console.error('Error fetching comprehensive earthquake data:', error);
      return this.getEarthquakesForBangladesh(); // Fallback to regional only
    }
  }
}

export const earthquakeAPI = new EarthquakeAPIService();

// Enhanced earthquake monitoring with real-time updates
export class EnhancedEarthquakeMonitor {
  private lastUpdate: Date | null = null;
  private cachedData: EarthquakeData[] = [];
  private updateInterval = 10 * 60 * 1000; // 10 minutes

  async getLatestEarthquakeData(): Promise<EarthquakeData[]> {
    const now = new Date();
    
    // Check if we need to refresh data
    if (!this.lastUpdate || (now.getTime() - this.lastUpdate.getTime()) > this.updateInterval) {
      console.log('🌍 Refreshing earthquake data from USGS...');
      
      try {
        this.cachedData = await earthquakeAPI.getAllRelevantEarthquakes();
        this.lastUpdate = now;
        console.log(`✅ Updated earthquake data: ${this.cachedData.length} events`);
      } catch (error) {
        console.error('❌ Failed to refresh earthquake data:', error);
        // Return cached data if available
        if (this.cachedData.length > 0) {
          return this.cachedData;
        }
        throw error;
      }
    }
    
    return this.cachedData;
  }

  getLastUpdateTime(): Date | null {
    return this.lastUpdate;
  }

  async forceRefresh(): Promise<EarthquakeData[]> {
    this.lastUpdate = null; // Force refresh
    return this.getLatestEarthquakeData();
  }
}

export const enhancedEarthquakeMonitor = new EnhancedEarthquakeMonitor();