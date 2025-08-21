import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  try {
    // In a real implementation, this would aggregate data from multiple NASA and other APIs
    // For demo purposes, we'll generate comprehensive analytics based on the location
    
    const generateAnalytics = (location: string) => {
      // Base scores adjusted for different divisions in Bangladesh
      const locationMultipliers: { [key: string]: number } = {
        'Dhaka': 0.85, // Lower due to urban pollution
        'Chattogram (Chittagong)': 0.88, // Industrial port city
        'Barisal': 0.92, // Less industrialized
        'Khulna': 0.87, // Industrial and coastal
        'Mymensingh': 0.91, // Agricultural region
        'Rajshahi': 0.89, // Agricultural with some industry
        'Rangpur': 0.93, // Rural, less polluted
        'Sylhet': 0.94, // Tea gardens, cleaner air
      };

      const multiplier = locationMultipliers[location] || 0.9;
      
      const baseScores = {
        airQuality: Math.round((70 + Math.random() * 20) * multiplier),
        waterQuality: Math.round((75 + Math.random() * 15) * multiplier),
        soilHealth: Math.round((85 + Math.random() * 10) * multiplier),
        climate: Math.round((72 + Math.random() * 18) * multiplier),
        biodiversity: Math.round((77 + Math.random() * 13) * multiplier),
        noise: Math.round((65 + Math.random() * 25) * multiplier)
      };

      const overallScore = Math.round(
        Object.values(baseScores).reduce((sum, score) => sum + score, 0) / 6
      );

      // Determine trends based on scores
      const trends = {
        improving: [] as string[],
        declining: [] as string[],
        stable: [] as string[]
      };

      Object.entries(baseScores).forEach(([key, score]) => {
        if (score > 80) trends.improving.push(key);
        else if (score < 65) trends.declining.push(key);
        else trends.stable.push(key);
      });

      // Risk factors based on location characteristics
      const riskFactors = [
        {
          factor: 'Air Pollution',
          level: baseScores.airQuality < 60 ? 'high' : baseScores.airQuality < 75 ? 'moderate' : 'low',
          impact: Math.round(100 - baseScores.airQuality)
        },
        {
          factor: 'Urban Heat Island',
          level: location === 'Dhaka' ? 'high' : location.includes('Chittagong') ? 'moderate' : 'low',
          impact: location === 'Dhaka' ? 75 : location.includes('Chittagong') ? 50 : 25
        },
        {
          factor: 'Noise Pollution',
          level: baseScores.noise < 60 ? 'high' : baseScores.noise < 75 ? 'moderate' : 'low',
          impact: Math.round(100 - baseScores.noise)
        },
        {
          factor: 'Flood Risk',
          level: ['Barisal', 'Sylhet', 'Rangpur'].includes(location) ? 'high' : 'moderate',
          impact: ['Barisal', 'Sylhet', 'Rangpur'].includes(location) ? 65 : 35
        }
      ];

      return {
        overallScore,
        categoryScores: baseScores,
        trends,
        riskFactors,
        monthlyComparison: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          current: [
            overallScore - 4,
            overallScore - 2,
            overallScore - 5,
            overallScore,
            overallScore + 2,
            overallScore
          ],
          average: [
            overallScore - 6,
            overallScore - 5,
            overallScore - 8,
            overallScore - 3,
            overallScore - 1,
            overallScore - 2
          ]
        }
      };
    };

    const analytics = generateAnalytics(location);

    return NextResponse.json({
      location,
      ...analytics,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { location, dataPoints } = await request.json();
    
    // In a real implementation, this would store user-provided data points
    // and incorporate them into the analytics
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data points received and processed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing analytics data:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}