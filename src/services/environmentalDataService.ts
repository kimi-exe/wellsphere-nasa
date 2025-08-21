// Unified Environmental Data Service
import { earthquakeAPI, enhancedEarthquakeMonitor, type EarthquakeData } from './earthquakeAPI';
import { weatherAPI, type WeatherHazardData, type SpaceWeatherData } from './weatherAPI';
import { nasaAPI, type SoilData, type TemperatureData } from './nasaAPI';

export interface EnvironmentalDataPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave' | 'flood' | 'soil' | 'earthquake';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
  source: 'USGS' | 'NASA' | 'NOAA' | 'Synthetic';
  additionalData?: {
    depth?: number;
    magnitude?: number;
    ph?: number;
    moisture?: number;
    temperature?: number;
    significance?: number;
    tsunami?: number;
  };
}

export class EnvironmentalDataService {
  private cache: Map<string, { data: EnvironmentalDataPoint[], timestamp: number }> = new Map();
  private cacheTimeout = 3 * 60 * 1000; // 3 minutes for more frequent updates
  private isLoading = false;

  async getAllEnvironmentalData(): Promise<EnvironmentalDataPoint[]> {
    // Prevent multiple simultaneous loads
    if (this.isLoading) {
      console.log('🔄 Already loading environmental data, waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getCachedData() || [];
    }

    try {
      this.isLoading = true;
      console.log('🌍 Fetching comprehensive environmental data from APIs...');
      
      // Fetch data from all sources in parallel with enhanced coverage
      const [
        earthquakes,
        weatherHazards,
        spaceWeather,
        soilData,
        temperatureData
      ] = await Promise.allSettled([
        enhancedEarthquakeMonitor.getLatestEarthquakeData(),
        weatherAPI.getWeatherHazards(),
        weatherAPI.getSpaceWeatherData(),
        nasaAPI.getSoilData(),
        nasaAPI.getTemperatureData()
      ]);

      const allData: EnvironmentalDataPoint[] = [];

      // Process earthquake data
      if (earthquakes.status === 'fulfilled') {
        const earthquakePoints = earthquakes.value.map(eq => this.convertEarthquakeData(eq));
        allData.push(...earthquakePoints);
        console.log(`📍 Loaded ${earthquakePoints.length} earthquake data points`);
      } else {
        console.warn('⚠️ Failed to fetch earthquake data:', earthquakes.reason);
      }

      // Process weather hazards
      if (weatherHazards.status === 'fulfilled') {
        const weatherPoints = weatherHazards.value.map(weather => this.convertWeatherData(weather));
        allData.push(...weatherPoints);
        console.log(`🌡️ Loaded ${weatherPoints.length} weather hazard data points`);
      }

      // Process soil data
      if (soilData.status === 'fulfilled') {
        const soilPoints = soilData.value.map(soil => this.convertSoilData(soil));
        allData.push(...soilPoints);
        console.log(`🏔️ Loaded ${soilPoints.length} soil data points`);
      }

      // Process temperature data
      if (temperatureData.status === 'fulfilled') {
        const tempPoints = temperatureData.value.map(temp => this.convertTemperatureData(temp));
        allData.push(...tempPoints);
        console.log(`🔥 Loaded ${tempPoints.length} temperature data points`);
      }

      console.log(`✅ Total environmental data points: ${allData.length}`);
      console.log(`📊 Coverage breakdown:`);
      console.log(`  - Earthquakes: ${allData.filter(d => d.type === 'earthquake').length}`);
      console.log(`  - Heatwaves: ${allData.filter(d => d.type === 'heatwave').length}`);
      console.log(`  - Floods: ${allData.filter(d => d.type === 'flood').length}`);
      console.log(`  - Soil: ${allData.filter(d => d.type === 'soil').length}`);
      
      // Cache the results
      this.cache.set('all_data', {
        data: allData,
        timestamp: Date.now()
      });

      return allData;
    } catch (error) {
      console.error('❌ Error fetching environmental data:', error);
      return this.getFallbackData();
    } finally {
      this.isLoading = false;
    }
  }

  async getDataByType(type: 'heatwave' | 'flood' | 'soil' | 'earthquake'): Promise<EnvironmentalDataPoint[]> {
    const allData = await this.getAllEnvironmentalData();
    return allData.filter(point => point.type === type);
  }

  async getDataForRegion(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<EnvironmentalDataPoint[]> {
    const allData = await this.getAllEnvironmentalData();
    return allData.filter(point => 
      point.lat >= bounds.south &&
      point.lat <= bounds.north &&
      point.lng >= bounds.west &&
      point.lng <= bounds.east
    );
  }

  private convertEarthquakeData(eq: EarthquakeData): EnvironmentalDataPoint {
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (eq.magnitude >= 7) severity = 'critical';
    else if (eq.magnitude >= 6) severity = 'high';
    else if (eq.magnitude >= 4) severity = 'medium';
    else severity = 'low';

    return {
      id: `earthquake_${eq.id}`,
      lat: eq.lat,
      lng: eq.lng,
      type: 'earthquake',
      severity,
      value: eq.magnitude,
      description: `${eq.location} - Magnitude ${eq.magnitude} earthquake`,
      timestamp: eq.timestamp,
      source: 'USGS',
      additionalData: {
        depth: eq.depth,
        magnitude: eq.magnitude,
        significance: eq.significance,
        tsunami: eq.tsunami
      }
    };
  }

  private convertWeatherData(weather: WeatherHazardData): EnvironmentalDataPoint {
    return {
      id: `weather_${weather.id}`,
      lat: weather.lat,
      lng: weather.lng,
      type: weather.type,
      severity: weather.severity,
      value: weather.value,
      description: weather.description,
      timestamp: weather.timestamp,
      source: 'NOAA'
    };
  }

  private convertSoilData(soil: SoilData): EnvironmentalDataPoint {
    return {
      id: `soil_${soil.id}`,
      lat: soil.lat,
      lng: soil.lng,
      type: 'soil',
      severity: soil.severity,
      value: soil.value,
      description: soil.description,
      timestamp: soil.timestamp,
      source: 'NASA',
      additionalData: {
        ph: soil.ph,
        moisture: soil.moisture,
        temperature: soil.temperature
      }
    };
  }

  private convertTemperatureData(temp: TemperatureData): EnvironmentalDataPoint {
    return {
      id: `temp_${temp.id}`,
      lat: temp.lat,
      lng: temp.lng,
      type: 'heatwave',
      severity: temp.severity,
      value: temp.value,
      description: temp.description,
      timestamp: temp.timestamp,
      source: 'NASA'
    };
  }

  private getFallbackData(): EnvironmentalDataPoint[] {
    return [
      {
        id: 'fallback_1',
        lat: 23.8103,
        lng: 90.4125,
        type: 'heatwave',
        severity: 'high',
        value: 39.5,
        description: 'Fallback data - High temperature in Dhaka',
        timestamp: new Date().toISOString(),
        source: 'Synthetic'
      },
      {
        id: 'fallback_2',
        lat: 22.3475,
        lng: 91.8123,
        type: 'flood',
        severity: 'medium',
        value: 5.2,
        description: 'Fallback data - Moderate flood risk in Chittagong',
        timestamp: new Date().toISOString(),
        source: 'Synthetic'
      }
    ];
  }

  // Real-time data refresh with enhanced monitoring
  async refreshData(): Promise<EnvironmentalDataPoint[]> {
    console.log('🔄 Force refreshing all environmental data...');
    this.cache.clear();
    
    // Force refresh earthquake data
    try {
      await enhancedEarthquakeMonitor.forceRefresh();
    } catch (error) {
      console.warn('⚠️ Could not force refresh earthquake data:', error);
    }
    
    return this.getAllEnvironmentalData();
  }

  // Get real-time statistics
  getDataStatistics(data: EnvironmentalDataPoint[]): {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    bySource: Record<string, number>;
  } {
    return {
      total: data.length,
      bySeverity: {
        critical: data.filter(d => d.severity === 'critical').length,
        high: data.filter(d => d.severity === 'high').length,
        medium: data.filter(d => d.severity === 'medium').length,
        low: data.filter(d => d.severity === 'low').length
      },
      byType: {
        earthquake: data.filter(d => d.type === 'earthquake').length,
        heatwave: data.filter(d => d.type === 'heatwave').length,
        flood: data.filter(d => d.type === 'flood').length,
        soil: data.filter(d => d.type === 'soil').length
      },
      bySource: {
        USGS: data.filter(d => d.source === 'USGS').length,
        NASA: data.filter(d => d.source === 'NASA').length,
        NOAA: data.filter(d => d.source === 'NOAA').length,
        Synthetic: data.filter(d => d.source === 'Synthetic').length
      }
    };
  }

  // Get cached data if fresh enough
  getCachedData(): EnvironmentalDataPoint[] | null {
    const cached = this.cache.get('all_data');
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      console.log('📋 Using cached environmental data');
      return cached.data;
    }
    return null;
  }
}

export const environmentalDataService = new EnvironmentalDataService();