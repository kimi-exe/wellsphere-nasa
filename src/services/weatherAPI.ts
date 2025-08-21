// NOAA and Weather API Service
export interface SpaceWeatherData {
  id: string;
  type: 'space_weather';
  intensity: number;
  timestamp: string;
  description: string;
  lat: number; // Default location for space weather effects
  lng: number;
}

export interface WeatherHazardData {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave' | 'flood';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
}

export class WeatherAPIService {
  private noaaBaseURL = 'https://services.swpc.noaa.gov/json';
  
  async getSpaceWeatherData(): Promise<SpaceWeatherData[]> {
    try {
      const response = await fetch(`${this.noaaBaseURL}/goes/primary/xrays-6-hour.json`);
      
      if (!response.ok) {
        console.warn('NOAA API unavailable, using fallback data');
        return this.getFallbackSpaceWeatherData();
      }

      const data = await response.json();
      
      // Process the latest few readings
      const recentData = data.slice(-10);
      
      return recentData.map((reading: {
        time_tag: string;
        flux?: number;
        observed_flux?: number;
      }, index: number) => ({
        id: `space_weather_${index}`,
        type: 'space_weather' as const,
        intensity: this.calculateSpaceWeatherIntensity(reading),
        timestamp: new Date(reading.time_tag).toISOString(),
        description: this.getSpaceWeatherDescription(reading),
        lat: 23.6850, // Default to Bangladesh center
        lng: 90.3563
      }));
    } catch (error) {
      console.error('Error fetching space weather data:', error);
      return this.getFallbackSpaceWeatherData();
    }
  }

  private calculateSpaceWeatherIntensity(reading: {
    flux?: number;
    observed_flux?: number;
  }): number {
    // Calculate intensity based on flux readings
    const flux1 = reading.flux || 0;
    const flux2 = reading.observed_flux || 0;
    return Math.max(flux1, flux2) * 1000; // Scale for display
  }

  private getSpaceWeatherDescription(reading: {
    flux?: number;
    observed_flux?: number;
  }): string {
    const intensity = this.calculateSpaceWeatherIntensity(reading);
    if (intensity > 100) return 'High solar activity detected';
    if (intensity > 50) return 'Moderate solar activity';
    return 'Normal space weather conditions';
  }

  private getFallbackSpaceWeatherData(): SpaceWeatherData[] {
    return [{
      id: 'space_weather_fallback',
      type: 'space_weather',
      intensity: 45,
      timestamp: new Date().toISOString(),
      description: 'Normal space weather conditions',
      lat: 23.6850,
      lng: 90.3563
    }];
  }

  // Generate comprehensive weather hazard data across Bangladesh
  async getWeatherHazards(): Promise<WeatherHazardData[]> {
    const hazards: WeatherHazardData[] = [];
    
    // Comprehensive heatwave data across all major areas
    const heatwaveLocations = [
      // Detailed Dhaka Areas
      { lat: 23.7104, lng: 90.4074, city: 'Old Dhaka', basetemp: 42 },
      { lat: 23.7461, lng: 90.3742, city: 'Dhanmondi', basetemp: 38 },
      { lat: 23.7387, lng: 90.3938, city: 'Segunbagicha', basetemp: 37 },
      { lat: 23.7806, lng: 90.4147, city: 'Gulshan', basetemp: 39 },
      { lat: 23.7937, lng: 90.4026, city: 'Banani', basetemp: 38 },
      { lat: 23.8103, lng: 90.4125, city: 'Baridhara', basetemp: 36 },
      { lat: 23.8075, lng: 90.4286, city: 'Bashundhara', basetemp: 35 },
      { lat: 23.8759, lng: 90.3795, city: 'Uttara', basetemp: 37 },
      { lat: 23.7581, lng: 90.3872, city: 'Farmgate', basetemp: 42 },
      { lat: 23.7337, lng: 90.4084, city: 'Motijheel', basetemp: 43 },
      { lat: 23.7806, lng: 90.3881, city: 'Tejgaon', basetemp: 44 },
      { lat: 23.7389, lng: 90.4008, city: 'Ramna', basetemp: 33 },
      { lat: 23.8223, lng: 90.3654, city: 'Mirpur', basetemp: 40 },
      
      // Major Cities
      { lat: 22.8456, lng: 89.5403, city: 'Khulna', basetemp: 38 },
      { lat: 24.3745, lng: 88.6042, city: 'Rajshahi', basetemp: 41 },
      { lat: 22.3475, lng: 91.8123, city: 'Chittagong', basetemp: 36 },
      { lat: 24.8949, lng: 91.8687, city: 'Sylhet', basetemp: 35 },
      { lat: 24.7471, lng: 90.4203, city: 'Mymensingh', basetemp: 37 },
      { lat: 23.1793, lng: 91.1511, city: 'Comilla', basetemp: 39 },
      { lat: 25.7439, lng: 89.2752, city: 'Rangpur', basetemp: 36 },
      { lat: 24.4539, lng: 88.9318, city: 'Bogura', basetemp: 38 }
    ];

    heatwaveLocations.forEach((location, index) => {
      const variation = (Math.random() - 0.5) * 4; // ±2°C variation
      const temperature = location.basetemp + variation;
      let severity: 'low' | 'medium' | 'high' | 'critical';
      
      if (temperature > 42) severity = 'critical';
      else if (temperature > 39) severity = 'high';
      else if (temperature > 36) severity = 'medium';
      else severity = 'low';

      hazards.push({
        id: `heatwave_${index}`,
        lat: location.lat + (Math.random() - 0.5) * 0.02,
        lng: location.lng + (Math.random() - 0.5) * 0.02,
        type: 'heatwave',
        severity,
        value: Math.round(temperature * 10) / 10,
        description: `Heat alert in ${location.city} - ${temperature.toFixed(1)}°C surface temperature`,
        timestamp: new Date().toISOString()
      });
    });

    // Comprehensive flood risk data
    const floodLocations = [
      // River flooding areas
      { lat: 22.3475, lng: 91.8123, city: 'Chittagong Port', basevel: 5.2 },
      { lat: 22.7172, lng: 89.6830, city: 'Khulna Coastal', basevel: 6.8 },
      { lat: 24.8949, lng: 91.8687, city: 'Sylhet Haor', basevel: 4.5 },
      { lat: 25.1278, lng: 91.8336, city: 'Sunamganj Wetlands', basevel: 7.2 },
      { lat: 24.8036, lng: 90.6802, city: 'Jamalpur Brahmaputra', basevel: 6.1 },
      { lat: 23.6850, lng: 90.3563, city: 'Dhaka Buriganga', basevel: 4.8 },
      { lat: 22.7010, lng: 90.3535, city: 'Barisal Delta', basevel: 5.9 },
      { lat: 22.4569, lng: 91.9694, city: 'Cox Bazar Coast', basevel: 3.2 },
      { lat: 22.3596, lng: 89.1145, city: 'Satkhira Coast', basevel: 8.1 },
      { lat: 22.5791, lng: 89.6880, city: 'Bagerhat Mangrove', basevel: 7.4 },
      { lat: 23.1634, lng: 89.2182, city: 'Faridpur Padma', basevel: 5.7 },
      { lat: 24.6331, lng: 91.6869, city: 'Habiganj River', basevel: 4.3 },
      { lat: 22.1455, lng: 91.6597, city: 'Rangamati Lake', basevel: 6.5 },
      { lat: 25.0968, lng: 90.1134, city: 'Sherpur Brahmaputra', basevel: 5.8 },
      { lat: 24.4539, lng: 90.7814, city: 'Netrokona Floodplains', basevel: 6.9 }
    ];

    floodLocations.forEach((location, index) => {
      const variation = (Math.random() - 0.5) * 2; // ±1m variation
      const waterLevel = Math.max(2, location.basevel + variation);
      let severity: 'low' | 'medium' | 'high' | 'critical';
      
      if (waterLevel > 8) severity = 'critical';
      else if (waterLevel > 6.5) severity = 'high';
      else if (waterLevel > 4.5) severity = 'medium';
      else severity = 'low';

      hazards.push({
        id: `flood_${index}`,
        lat: location.lat + (Math.random() - 0.5) * 0.02,
        lng: location.lng + (Math.random() - 0.5) * 0.02,
        type: 'flood',
        severity,
        value: Math.round(waterLevel * 10) / 10,
        description: `Flood monitoring at ${location.city} - ${waterLevel.toFixed(1)}m water level`,
        timestamp: new Date().toISOString()
      });
    });

    return hazards;
  }
}

export const weatherAPI = new WeatherAPIService();