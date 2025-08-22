// Road Quality Assessment Service for Bangladesh
export interface RoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
  surface: 'paved' | 'concrete' | 'asphalt' | 'unpaved' | 'gravel' | 'dirt' | 'unknown';
  highway_type: 'motorway' | 'trunk' | 'primary' | 'secondary' | 'tertiary' | 'residential' | 'service' | 'track' | 'path';
  condition_score: number; // 0-100 scale
  last_updated: string;
  issues: string[];
  traffic_level: 'low' | 'moderate' | 'high' | 'extreme';
  maintenance_status: 'well_maintained' | 'needs_attention' | 'poor_maintenance' | 'abandoned';
  environmental_factors: {
    flood_risk: boolean;
    earthquake_damage: boolean;
    heat_damage: boolean;
    monsoon_affected: boolean;
  };
  width_category: 'narrow' | 'standard' | 'wide';
  accessibility: {
    wheelchair_accessible: boolean;
    vehicle_accessible: boolean;
    emergency_access: boolean;
  };
}

export interface RoadQualityArea {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  roads: RoadSegment[];
  area_name: string;
  total_roads: number;
  quality_distribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    very_poor: number;
  };
}

export class RoadQualityService {
  private cache: Map<string, { data: RoadQualityArea, timestamp: number }> = new Map();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes cache

  // Major Bangladesh road networks with quality assessment
  private bangladeshRoads: RoadSegment[] = [
    // Dhaka Major Roads
    {
      id: 'dhk_001',
      name: 'Dhaka-Chittagong Highway (N1)',
      coordinates: [
        [23.8103, 90.4125], [23.7500, 90.5000], [23.6000, 90.7000], 
        [23.4000, 91.0000], [23.2000, 91.3000], [22.8000, 91.6000], 
        [22.5000, 91.7500], [22.3475, 91.8123]
      ],
      quality: 'good',
      surface: 'asphalt',
      highway_type: 'trunk',
      condition_score: 75,
      last_updated: new Date().toISOString(),
      issues: ['Heavy traffic congestion', 'Some potholes in monsoon areas'],
      traffic_level: 'extreme',
      maintenance_status: 'needs_attention',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: true,
        monsoon_affected: true
      },
      width_category: 'wide',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: true
      }
    },
    {
      id: 'dhk_002', 
      name: 'Dhaka-Sylhet Highway (N2)',
      coordinates: [
        [23.8103, 90.4125], [23.9000, 90.5000], [24.1000, 90.7000],
        [24.3000, 90.9000], [24.5000, 91.2000], [24.7000, 91.5000],
        [24.8949, 91.8687]
      ],
      quality: 'fair',
      surface: 'asphalt',
      highway_type: 'primary',
      condition_score: 65,
      last_updated: new Date().toISOString(),
      issues: ['Seasonal flooding', 'Bridge maintenance needed'],
      traffic_level: 'high',
      maintenance_status: 'needs_attention',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'standard',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: true
      }
    },
    {
      id: 'dhk_003',
      name: 'Dhaka Ring Road',
      coordinates: [
        [23.8500, 90.3500], [23.8700, 90.4000], [23.8500, 90.4500],
        [23.8000, 90.4700], [23.7500, 90.4500], [23.7200, 90.4000],
        [23.7500, 90.3500], [23.8000, 90.3300], [23.8500, 90.3500]
      ],
      quality: 'excellent',
      surface: 'concrete',
      highway_type: 'trunk',
      condition_score: 90,
      last_updated: new Date().toISOString(),
      issues: [],
      traffic_level: 'high',
      maintenance_status: 'well_maintained',
      environmental_factors: {
        flood_risk: false,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: false
      },
      width_category: 'wide',
      accessibility: {
        wheelchair_accessible: true,
        vehicle_accessible: true,
        emergency_access: true
      }
    },
    {
      id: 'dhk_004',
      name: 'Airport Road',
      coordinates: [
        [23.8103, 90.4125], [23.8200, 90.4000], [23.8350, 90.3950],
        [23.8506, 90.3917]
      ],
      quality: 'excellent',
      surface: 'concrete',
      highway_type: 'primary',
      condition_score: 95,
      last_updated: new Date().toISOString(),
      issues: [],
      traffic_level: 'moderate',
      maintenance_status: 'well_maintained',
      environmental_factors: {
        flood_risk: false,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: false
      },
      width_category: 'wide',
      accessibility: {
        wheelchair_accessible: true,
        vehicle_accessible: true,
        emergency_access: true
      }
    },
    {
      id: 'dhk_005',
      name: 'Old Dhaka Streets',
      coordinates: [
        [23.7104, 90.4074], [23.7150, 90.4100], [23.7200, 90.4050],
        [23.7180, 90.4020], [23.7104, 90.4074]
      ],
      quality: 'poor',
      surface: 'asphalt',
      highway_type: 'residential',
      condition_score: 35,
      last_updated: new Date().toISOString(),
      issues: ['Narrow streets', 'Poor drainage', 'Heavy congestion', 'Multiple potholes'],
      traffic_level: 'extreme',
      maintenance_status: 'poor_maintenance',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: true,
        monsoon_affected: true
      },
      width_category: 'narrow',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: false
      }
    },

    // Chittagong Roads
    {
      id: 'ctg_001',
      name: 'Chittagong Port Access Road',
      coordinates: [
        [22.3475, 91.8123], [22.3400, 91.8200], [22.3300, 91.8150],
        [22.3200, 91.8100]
      ],
      quality: 'good',
      surface: 'concrete',
      highway_type: 'trunk',
      condition_score: 80,
      last_updated: new Date().toISOString(),
      issues: ['Heavy truck traffic', 'Salt air corrosion'],
      traffic_level: 'extreme',
      maintenance_status: 'well_maintained',
      environmental_factors: {
        flood_risk: false,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'wide',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: true
      }
    },
    {
      id: 'ctg_002',
      name: 'Cox\'s Bazar Highway',
      coordinates: [
        [22.3475, 91.8123], [22.3000, 91.8500], [22.2500, 91.9000],
        [22.2000, 91.9300], [22.4569, 91.9694]
      ],
      quality: 'fair',
      surface: 'asphalt',
      highway_type: 'primary',
      condition_score: 60,
      last_updated: new Date().toISOString(),
      issues: ['Coastal erosion effects', 'Sand accumulation', 'Monsoon damage'],
      traffic_level: 'high',
      maintenance_status: 'needs_attention',
      environmental_factors: {
        flood_risk: false,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'standard',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: true
      }
    },

    // Northern Bangladesh Roads
    {
      id: 'rjh_001',
      name: 'Rajshahi-Rangpur Highway',
      coordinates: [
        [24.3745, 88.6042], [24.5000, 88.8000], [24.7000, 89.0000],
        [25.0000, 89.1500], [25.7439, 89.2752]
      ],
      quality: 'good',
      surface: 'asphalt',
      highway_type: 'trunk',
      condition_score: 78,
      last_updated: new Date().toISOString(),
      issues: ['Agricultural vehicle damage', 'Seasonal maintenance needed'],
      traffic_level: 'moderate',
      maintenance_status: 'well_maintained',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: true,
        monsoon_affected: true
      },
      width_category: 'standard',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: true
      }
    },

    // Rural/Secondary Roads
    {
      id: 'rur_001',
      name: 'Rural Village Roads (Typical)',
      coordinates: [
        [23.5000, 90.2000], [23.5100, 90.2100], [23.5200, 90.2050],
        [23.5150, 90.2150], [23.5050, 90.2200]
      ],
      quality: 'very_poor',
      surface: 'dirt',
      highway_type: 'track',
      condition_score: 20,
      last_updated: new Date().toISOString(),
      issues: ['Unpaved surface', 'No drainage', 'Impassable in monsoon', 'Very narrow'],
      traffic_level: 'low',
      maintenance_status: 'abandoned',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'narrow',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: false,
        emergency_access: false
      }
    },

    // Sylhet Tea Garden Roads
    {
      id: 'syl_001',
      name: 'Sylhet Tea Garden Access Roads',
      coordinates: [
        [24.8949, 91.8687], [24.9100, 91.8800], [24.9200, 91.8750],
        [24.9300, 91.8900], [24.9150, 91.9000]
      ],
      quality: 'fair',
      surface: 'gravel',
      highway_type: 'service',
      condition_score: 55,
      last_updated: new Date().toISOString(),
      issues: ['Steep grades', 'Seasonal maintenance', 'Limited width'],
      traffic_level: 'low',
      maintenance_status: 'needs_attention',
      environmental_factors: {
        flood_risk: false,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'narrow',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: true,
        emergency_access: false
      }
    },

    // Khulna Sundarbans Roads
    {
      id: 'khl_001',
      name: 'Sundarbans Access Roads',
      coordinates: [
        [22.8456, 89.5403], [22.8200, 89.5600], [22.8000, 89.5800],
        [22.7800, 89.6000], [22.7600, 89.6200]
      ],
      quality: 'poor',
      surface: 'unpaved',
      highway_type: 'track',
      condition_score: 30,
      last_updated: new Date().toISOString(),
      issues: ['Salt water damage', 'Tidal flooding', 'Limited maintenance', 'Ecological restrictions'],
      traffic_level: 'low',
      maintenance_status: 'poor_maintenance',
      environmental_factors: {
        flood_risk: true,
        earthquake_damage: false,
        heat_damage: false,
        monsoon_affected: true
      },
      width_category: 'narrow',
      accessibility: {
        wheelchair_accessible: false,
        vehicle_accessible: false,
        emergency_access: false
      }
    }
  ];

  async getRoadQualityForArea(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<RoadQualityArea> {
    const cacheKey = `${bounds.north}_${bounds.south}_${bounds.east}_${bounds.west}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    // Filter roads within the bounds
    const roadsInArea = this.bangladeshRoads.filter(road => {
      return road.coordinates.some(coord => {
        const [lat, lng] = coord;
        return lat >= bounds.south && lat <= bounds.north &&
               lng >= bounds.west && lng <= bounds.east;
      });
    });

    // Calculate quality distribution
    const distribution = {
      excellent: roadsInArea.filter(r => r.quality === 'excellent').length,
      good: roadsInArea.filter(r => r.quality === 'good').length,
      fair: roadsInArea.filter(r => r.quality === 'fair').length,
      poor: roadsInArea.filter(r => r.quality === 'poor').length,
      very_poor: roadsInArea.filter(r => r.quality === 'very_poor').length
    };

    const result: RoadQualityArea = {
      bounds,
      roads: roadsInArea,
      area_name: this.getAreaName(bounds),
      total_roads: roadsInArea.length,
      quality_distribution: distribution
    };

    // Cache the result
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  async getRoadQualityForCity(cityName: string): Promise<RoadQualityArea> {
    const cityBounds = this.getCityBounds(cityName);
    return this.getRoadQualityForArea(cityBounds);
  }

  private getCityBounds(cityName: string): { north: number; south: number; east: number; west: number } {
    const cityBounds: Record<string, { north: number; south: number; east: number; west: number }> = {
      'Dhaka': { north: 23.9000, south: 23.7000, east: 90.5000, west: 90.3000 },
      'Chittagong': { north: 22.4000, south: 22.3000, east: 91.9000, west: 91.7000 },
      'Sylhet': { north: 24.9500, south: 24.8500, east: 91.9500, west: 91.8000 },
      'Rajshahi': { north: 24.4000, south: 24.3500, east: 88.7000, west: 88.5500 },
      'Khulna': { north: 22.9000, south: 22.8000, east: 89.6000, west: 89.5000 },
      'Barisal': { north: 22.7500, south: 22.6500, east: 90.4000, west: 90.3000 }
    };

    return cityBounds[cityName] || cityBounds['Dhaka'];
  }

  private getAreaName(bounds: { north: number; south: number; east: number; west: number }): string {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;

    // Determine area name based on center coordinates
    if (centerLat > 23.7 && centerLat < 23.9 && centerLng > 90.3 && centerLng < 90.5) {
      return 'Greater Dhaka Area';
    } else if (centerLat > 22.3 && centerLat < 22.4 && centerLng > 91.7 && centerLng < 91.9) {
      return 'Chittagong Metropolitan Area';
    } else if (centerLat > 24.8 && centerLat < 25.0 && centerLng > 91.8 && centerLng < 92.0) {
      return 'Sylhet Region';
    } else if (centerLat > 24.3 && centerLat < 24.4 && centerLng > 88.5 && centerLng < 88.7) {
      return 'Rajshahi Division';
    } else if (centerLat > 22.8 && centerLat < 22.9 && centerLng > 89.5 && centerLng < 89.6) {
      return 'Khulna Region';
    }
    return 'Bangladesh Road Network';
  }

  getQualityColor(quality: RoadSegment['quality']): string {
    switch (quality) {
      case 'excellent': return '#00ff00'; // Bright Green
      case 'good': return '#7fff00';      // Green-Yellow
      case 'fair': return '#ffff00';      // Yellow
      case 'poor': return '#ff7f00';      // Orange
      case 'very_poor': return '#ff0000'; // Red
      default: return '#808080';          // Gray
    }
  }

  getQualityWeight(quality: RoadSegment['quality']): number {
    switch (quality) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'fair': return 3;
      case 'poor': return 2;
      case 'very_poor': return 1;
      default: return 2;
    }
  }

  async searchRoadsByName(query: string): Promise<RoadSegment[]> {
    return this.bangladeshRoads.filter(road =>
      road.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getRoadStatistics(): Promise<{
    totalRoads: number;
    qualityDistribution: Record<string, number>;
    surfaceDistribution: Record<string, number>;
    averageConditionScore: number;
    maintenanceNeeded: number;
  }> {
    const roads = this.bangladeshRoads;
    
    return {
      totalRoads: roads.length,
      qualityDistribution: {
        excellent: roads.filter(r => r.quality === 'excellent').length,
        good: roads.filter(r => r.quality === 'good').length,
        fair: roads.filter(r => r.quality === 'fair').length,
        poor: roads.filter(r => r.quality === 'poor').length,
        very_poor: roads.filter(r => r.quality === 'very_poor').length
      },
      surfaceDistribution: {
        paved: roads.filter(r => r.surface === 'paved' || r.surface === 'asphalt' || r.surface === 'concrete').length,
        unpaved: roads.filter(r => r.surface === 'unpaved' || r.surface === 'dirt' || r.surface === 'gravel').length
      },
      averageConditionScore: roads.reduce((sum, road) => sum + road.condition_score, 0) / roads.length,
      maintenanceNeeded: roads.filter(r => r.maintenance_status === 'needs_attention' || r.maintenance_status === 'poor_maintenance').length
    };
  }
}

export const roadQualityService = new RoadQualityService();