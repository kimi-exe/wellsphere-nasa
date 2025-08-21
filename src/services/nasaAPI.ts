// NASA Earthdata and Environmental API Service
export interface SoilData {
  id: string;
  lat: number;
  lng: number;
  type: 'soil';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
  moisture?: number;
  temperature?: number;
  ph?: number;
}

export interface TemperatureData {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
}

export class NASAAPIService {
  private cmrBaseURL = 'https://cmr.earthdata.nasa.gov/search';
  
  async getSoilData(): Promise<SoilData[]> {
    try {
      // For now, we'll use enhanced synthetic data based on NASA patterns
      // In production, you'd integrate with actual NASA Earthdata APIs
      return this.getEnhancedSoilData();
    } catch (error) {
      console.error('Error fetching NASA soil data:', error);
      return this.getEnhancedSoilData();
    }
  }

  async getTemperatureData(): Promise<TemperatureData[]> {
    try {
      // Enhanced temperature data based on satellite patterns
      return this.getEnhancedTemperatureData();
    } catch (error) {
      console.error('Error fetching NASA temperature data:', error);
      return this.getEnhancedTemperatureData();
    }
  }

  private getEnhancedSoilData(): SoilData[] {
    const soilPoints = [
      // Detailed Dhaka Areas - Urban soil degradation patterns
      { lat: 23.7104, lng: 90.4074, region: 'Old Dhaka (Puran Dhaka)', baseph: 6.2 }, // Historic area, acidic from age
      { lat: 23.7461, lng: 90.3742, region: 'Dhanmondi', baseph: 6.8 }, // Residential, moderate pH
      { lat: 23.7387, lng: 90.3938, region: 'Segunbagicha', baseph: 7.0 }, // Government area
      { lat: 23.7806, lng: 90.4147, region: 'Gulshan', baseph: 7.2 }, // Upscale area, better soil management
      { lat: 23.7937, lng: 90.4026, region: 'Banani', baseph: 7.1 }, // Commercial/residential mix
      { lat: 23.8103, lng: 90.4125, region: 'Baridhara', baseph: 7.3 }, // Diplomatic area, well-maintained
      { lat: 23.8075, lng: 90.4286, region: 'Bashundhara R/A', baseph: 7.5 }, // Planned area, newer development
      { lat: 23.8759, lng: 90.3795, region: 'Uttara', baseph: 7.0 }, // Planned city, balanced soil
      { lat: 23.7581, lng: 90.3872, region: 'Farmgate', baseph: 6.5 }, // High traffic, polluted soil
      { lat: 23.7337, lng: 90.4084, region: 'Motijheel', baseph: 6.3 }, // Commercial hub, acidic
      { lat: 23.7806, lng: 90.3881, region: 'Tejgaon', baseph: 6.4 }, // Industrial area, contaminated
      { lat: 23.7389, lng: 90.4008, region: 'Ramna', baseph: 7.8 }, // Park area, well-maintained soil
      { lat: 23.8223, lng: 90.3654, region: 'Mirpur', baseph: 6.7 }, // Mixed residential/commercial
      
      // Extended Dhaka Metro Area
      { lat: 23.7805, lng: 90.3492, region: 'Dhaka Cantonment', baseph: 7.4 },
      { lat: 23.8506, lng: 90.3917, region: 'Airport Area', baseph: 6.9 },
      { lat: 23.6850, lng: 90.3563, region: 'Keraniganj', baseph: 6.8 },
      { lat: 23.8836, lng: 90.3331, region: 'Savar', baseph: 7.1 },
      { lat: 23.9006, lng: 90.3876, region: 'Gazipur', baseph: 7.0 },
      
      // Chittagong Division - Coastal soil salinity
      { lat: 22.3475, lng: 91.8123, region: 'Chittagong Port City', baseph: 8.2 },
      { lat: 22.4569, lng: 91.9694, region: 'Cox Bazar Coast', baseph: 8.5 },
      { lat: 22.2637, lng: 91.7159, region: 'Chittagong Hills', baseph: 6.9 },
      { lat: 22.1455, lng: 91.6597, region: 'Rangamati Hills', baseph: 5.9 },
      { lat: 23.1793, lng: 91.1511, region: 'Comilla Plains', baseph: 7.2 },
      { lat: 22.8456, lng: 91.1115, region: 'Noakhali Delta', baseph: 8.4 },
      
      // Sylhet Division - Tea garden soils and wetlands
      { lat: 24.8949, lng: 91.8687, region: 'Sylhet Tea Gardens', baseph: 5.8 },
      { lat: 24.7471, lng: 91.9398, region: 'Moulvibazar Tea Estate', baseph: 5.5 },
      { lat: 25.1278, lng: 91.8336, region: 'Sunamganj Wetlands', baseph: 7.3 },
      { lat: 24.6331, lng: 91.6869, region: 'Habiganj Hills', baseph: 6.1 },
      
      // Rajshahi Division - Agricultural heartland
      { lat: 24.3745, lng: 88.6042, region: 'Rajshahi Agriculture', baseph: 7.5 },
      { lat: 24.4539, lng: 88.9318, region: 'Bogura Farming', baseph: 7.2 },
      { lat: 25.7439, lng: 89.2752, region: 'Rangpur Agriculture', baseph: 6.8 },
      { lat: 24.8949, lng: 89.3720, region: 'Dinajpur Fields', baseph: 7.3 },
      { lat: 25.1074, lng: 88.2779, region: 'Panchagarh Border', baseph: 7.0 },
      { lat: 24.7471, lng: 89.2754, region: 'Thakurgaon Rural', baseph: 7.1 },
      
      // Khulna Division - Sundarbans and coastal
      { lat: 22.8456, lng: 89.5403, region: 'Khulna Sundarbans', baseph: 8.0 },
      { lat: 22.7010, lng: 90.3535, region: 'Barisal Delta', baseph: 7.8 },
      { lat: 22.3596, lng: 89.1145, region: 'Satkhira Coast', baseph: 8.3 },
      { lat: 22.7010, lng: 89.2535, region: 'Jessore Agriculture', baseph: 7.4 },
      { lat: 23.1634, lng: 89.2182, region: 'Faridpur Plains', baseph: 7.2 },
      { lat: 22.5791, lng: 89.6880, region: 'Bagerhat Mangrove', baseph: 8.1 },
      
      // Mymensingh Division - River basin soils
      { lat: 24.7471, lng: 90.4203, region: 'Mymensingh Agricultural', baseph: 7.0 },
      { lat: 25.0968, lng: 90.1134, region: 'Sherpur Hills', baseph: 6.7 },
      { lat: 24.4539, lng: 90.7814, region: 'Netrokona Wetlands', baseph: 7.5 },
      { lat: 24.8036, lng: 90.6802, region: 'Jamalpur Floodplains', baseph: 7.3 }
    ];

    return soilPoints.map((point, index) => {
      const variation = (Math.random() - 0.5) * 1.5; // ±0.75 pH variation
      const ph = Math.max(4.0, Math.min(9.0, point.baseph + variation));
      const moisture = 20 + Math.random() * 40; // 20-60% moisture
      const temperature = 25 + Math.random() * 15; // 25-40°C soil temp
      
      let severity: 'low' | 'medium' | 'high' | 'critical';
      if (ph < 5.5 || ph > 8.5) severity = 'critical';
      else if (ph < 6.0 || ph > 8.0) severity = 'high';
      else if (ph < 6.5 || ph > 7.5) severity = 'medium';
      else severity = 'low';

      return {
        id: `soil_nasa_${index}`,
        lat: point.lat + (Math.random() - 0.5) * 0.05,
        lng: point.lng + (Math.random() - 0.5) * 0.05,
        type: 'soil' as const,
        severity,
        value: Math.round(ph * 100) / 100,
        description: `${point.region}: pH ${ph.toFixed(2)}, ${moisture.toFixed(1)}% moisture`,
        timestamp: new Date().toISOString(),
        moisture: Math.round(moisture * 10) / 10,
        temperature: Math.round(temperature * 10) / 10,
        ph: Math.round(ph * 100) / 100
      };
    });
  }

  private getEnhancedTemperatureData(): TemperatureData[] {
    const tempPoints = [
      // Detailed Dhaka Heat Island Analysis
      { lat: 23.7104, lng: 90.4074, region: 'Old Dhaka (Puran Dhaka)', basetemp: 41 }, // Dense urban, high heat retention
      { lat: 23.7461, lng: 90.3742, region: 'Dhanmondi', basetemp: 38 }, // Residential with trees, moderate
      { lat: 23.7387, lng: 90.3938, region: 'Segunbagicha', basetemp: 37 }, // Government area, planned
      { lat: 23.7806, lng: 90.4147, region: 'Gulshan', basetemp: 39 }, // Commercial high-rise, heat island
      { lat: 23.7937, lng: 90.4026, region: 'Banani', basetemp: 38 }, // Mixed development
      { lat: 23.8103, lng: 90.4125, region: 'Baridhara', basetemp: 36 }, // Diplomatic area, green spaces
      { lat: 23.8075, lng: 90.4286, region: 'Bashundhara R/A', basetemp: 35 }, // Planned, newer, better ventilation
      { lat: 23.8759, lng: 90.3795, region: 'Uttara', basetemp: 37 }, // Planned city, moderate density
      { lat: 23.7581, lng: 90.3872, region: 'Farmgate', basetemp: 42 }, // Traffic congestion, high pollution
      { lat: 23.7337, lng: 90.4084, region: 'Motijheel', basetemp: 43 }, // Financial district, concrete jungle
      { lat: 23.7806, lng: 90.3881, region: 'Tejgaon', basetemp: 44 }, // Heavy industrial, extreme heat
      { lat: 23.7389, lng: 90.4008, region: 'Ramna', basetemp: 33 }, // Park area, cooler microclimate
      { lat: 23.8223, lng: 90.3654, region: 'Mirpur', basetemp: 40 }, // Dense residential, limited green space
      
      // Extended Dhaka Metro Heat Patterns
      { lat: 23.7805, lng: 90.3492, region: 'Dhaka Cantonment', basetemp: 36 }, // Military area, planned
      { lat: 23.8506, lng: 90.3917, region: 'Hazrat Shahjalal Airport', basetemp: 39 }, // Concrete runways, heat reflection
      { lat: 23.6850, lng: 90.3563, region: 'Keraniganj', basetemp: 38 }, // Industrial suburb
      { lat: 23.8836, lng: 90.3331, region: 'Savar', basetemp: 36 }, // Semi-rural, better ventilation
      { lat: 23.9006, lng: 90.3876, region: 'Gazipur', basetemp: 37 }, // Industrial city
      
      // Major Cities - Urban Heat Islands
      { lat: 22.3475, lng: 91.8123, region: 'Chittagong Port City', basetemp: 36 },
      { lat: 24.3745, lng: 88.6042, region: 'Rajshahi City Center', basetemp: 41 }, // Inland, very hot
      { lat: 24.8949, lng: 91.8687, region: 'Sylhet City', basetemp: 35 },
      { lat: 22.8456, lng: 89.5403, region: 'Khulna City', basetemp: 38 },
      { lat: 24.7471, lng: 90.4203, region: 'Mymensingh City', basetemp: 37 },
      { lat: 23.1793, lng: 91.1511, region: 'Comilla City', basetemp: 39 },
      
      // Coastal Temperature Moderation
      { lat: 22.4569, lng: 91.9694, region: 'Cox Bazar Beach', basetemp: 32 }, // Ocean cooling effect
      { lat: 22.7010, lng: 90.3535, region: 'Barisal Coastal', basetemp: 34 },
      { lat: 22.3596, lng: 89.1145, region: 'Satkhira Coast', basetemp: 35 },
      { lat: 22.1455, lng: 91.6597, region: 'Rangamati Lake', basetemp: 33 }, // Water body cooling
      
      // Industrial Heat Sources
      { lat: 22.2637, lng: 91.7159, region: 'Chittagong Port Industrial', basetemp: 40 },
      { lat: 23.7806, lng: 90.3881, region: 'Tejgaon Industrial', basetemp: 44 },
      { lat: 24.4539, lng: 88.9318, region: 'Bogura Industrial', basetemp: 42 },
      
      // Agricultural Areas - Moderate Temperatures
      { lat: 25.7439, lng: 89.2752, region: 'Rangpur Agricultural', basetemp: 36 },
      { lat: 24.8949, lng: 89.3720, region: 'Dinajpur Farmlands', basetemp: 35 },
      { lat: 22.7010, lng: 89.2535, region: 'Jessore Rice Fields', basetemp: 37 },
      { lat: 23.1634, lng: 89.2182, region: 'Faridpur Plains', basetemp: 38 },
      
      // Hill Areas - Cooler Microclimates
      { lat: 24.6331, lng: 91.6869, region: 'Habiganj Hills', basetemp: 32 },
      { lat: 25.0968, lng: 90.1134, region: 'Sherpur Hills', basetemp: 33 },
      { lat: 22.1455, lng: 91.6597, region: 'Rangamati Hills', basetemp: 31 },
      
      // Wetland Areas - Humidity Moderation
      { lat: 25.1278, lng: 91.8336, region: 'Sunamganj Wetlands', basetemp: 34 },
      { lat: 24.8036, lng: 90.6802, region: 'Jamalpur Floodplains', basetemp: 36 },
      { lat: 22.5791, lng: 89.6880, region: 'Bagerhat Mangrove', basetemp: 33 }
    ];

    return tempPoints.map((point, index) => {
      const variation = (Math.random() - 0.5) * 6; // ±3°C variation
      const temp = point.basetemp + variation;
      
      let severity: 'low' | 'medium' | 'high' | 'critical';
      if (temp > 42) severity = 'critical';
      else if (temp > 39) severity = 'high';
      else if (temp > 36) severity = 'medium';
      else severity = 'low';

      return {
        id: `temp_nasa_${index}`,
        lat: point.lat + (Math.random() - 0.5) * 0.05,
        lng: point.lng + (Math.random() - 0.5) * 0.05,
        type: 'heatwave' as const,
        severity,
        value: Math.round(temp * 10) / 10,
        description: `${point.region}: ${temp.toFixed(1)}°C surface temperature`,
        timestamp: new Date().toISOString()
      };
    });
  }

  // Future method for actual NASA API integration
  async searchEarthdata(params: {
    concept_id?: string;
    temporal?: string;
    spatial?: string;
  }) {
    try {
      const searchParams = new URLSearchParams({
        page_size: '10',
        ...params
      });

      const response = await fetch(`${this.cmrBaseURL}/granules.json?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`NASA CMR API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('NASA Earthdata API error:', error);
      return null;
    }
  }
}

export const nasaAPI = new NASAAPIService();