import { NextRequest, NextResponse } from 'next/server';
import { environmentalDataService } from '../../../services/environmentalDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const refresh = searchParams.get('refresh') === 'true';
    
    console.log(`🌍 API: Fetching environmental data (type: ${type}, refresh: ${refresh})`);
    
    let data;
    
    if (refresh) {
      data = await environmentalDataService.refreshData();
    } else if (type && ['heatwave', 'flood', 'soil', 'earthquake'].includes(type)) {
      data = await environmentalDataService.getDataByType(type as 'heatwave' | 'flood' | 'soil' | 'earthquake');
    } else {
      // Try to get cached data first
      const cached = environmentalDataService.getCachedData();
      if (cached) {
        data = cached;
      } else {
        data = await environmentalDataService.getAllEnvironmentalData();
      }
    }
    
    console.log(`✅ API: Returning ${data.length} environmental data points`);
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      count: data.length,
      cached: !refresh && environmentalDataService.getCachedData() !== null
    });
  } catch (error) {
    console.error('❌ API: Error fetching environmental data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch environmental data',
        data: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}