# WellSphere - NASA Space Apps Challenge 2025

**Empowering Cities, Enhancing Health**

WellSphere is an innovative environmental monitoring and analysis platform designed for the 2025 NASA Space Apps Challenge. Our solution demonstrates how urban planners can use NASA Earth observation data to develop smart strategies for city growth that maintain both environmental wellbeing and human quality of life.

## 🌟 Challenge Focus

**Data Pathways to Healthy Cities and Human Settlements**

Climate change brings about new complexities for maintaining the wellbeing of society and the environment in cities. Our platform addresses this challenge by providing comprehensive environmental monitoring, predictive analytics, and actionable insights for sustainable urban development.

## 🚀 Features

### 🏠 User-Friendly Interface
- **Clean Login System**: Location-based registration for Bangladesh's 8 divisions
- **Apple-Inspired Design**: Black, white, and red color scheme with smooth animations
- **Responsive Layout**: Optimized for all device sizes

### 📊 Environmental Monitoring
- **Air Quality Tracking**: Real-time PM2.5, PM10, and AQI monitoring
- **Weather Data**: Temperature, humidity, and climate patterns
- **Water Quality**: pH levels, dissolved oxygen, and contamination tracking
- **Soil Health**: pH, organic matter, and nutrient analysis
- **Noise Pollution**: Decibel level monitoring and urban noise assessment
- **Biodiversity**: Species diversity and ecosystem health tracking

### 🌡️ Specialized Monitoring Pages
1. **Heatwave Monitor**: Historical trends, predictions, and risk mapping
2. **Flood Tracker**: Precipitation analysis and flood risk assessment
3. **Soil Quality**: Comprehensive soil composition and fertility analysis
4. **Earthquake Monitor**: Seismic activity tracking using USGS data
5. **🗺️ Environmental Risk Map**: Interactive Google Maps with NASA data integration
6. **AI Analytics**: Machine learning-powered insights and recommendations
7. **EcoQuest Game**: Interactive environmental education quiz

### 🗺️ Interactive Environmental Map
- **Real-time NASA Data Integration**: Live satellite data from MODIS, GPM, and Landsat
- **Google Maps Integration**: Interactive map interface with custom markers
- **Danger Zone Visualization**: Red circles marking high-risk areas
- **Multi-layer Support**: Toggle between heatwave, flood, soil, and earthquake data
- **USGS Real-time Seismic Data**: Live earthquake monitoring
- **Risk Assessment**: Color-coded severity levels (Critical, High, Medium, Low)
- **Location-based Filtering**: Focus on specific Bangladesh divisions

### 🔔 Smart Notifications
- **Email Alerts**: Automated notifications for environmental hazards
- **Risk Warnings**: Proactive alerts for heatwaves, floods, and air quality issues
- **Personalized Updates**: Location-specific environmental updates

### 🧠 AI-Powered Analytics
- **Predictive Modeling**: Future environmental condition forecasting
- **Correlation Analysis**: Understanding relationships between environmental factors
- **Smart Recommendations**: Data-driven suggestions for urban improvement
- **Risk Assessment**: Comprehensive environmental risk evaluation

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom Apple-inspired design
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Maps**: Google Maps API integration
- **Email**: Nodemailer for notification system

## 🌍 NASA API Integration

Our platform integrates with multiple NASA and external APIs:

- **NASA Earthdata**: Earth observation and satellite imagery
- **NASA POWER**: Weather and climate data
- **USGS Earthquake API**: Real-time seismic activity data
- **NOAA SWPC**: Space weather data
- **ESA Copernicus**: European satellite data

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wellsphere-nasa.git
   cd wellsphere-nasa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your API keys:
   
   **Required for Environmental Map:**
   - Google Maps API Key: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   
   **NASA API Keys:**
   - NASA API Key: `Jv2QqcXN3ZPZRrIXKmjHQM7yqkmwNpMiKB7sNbOj`
   - NASA Earth API Token: `eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ...`
   
   **Google Maps API Setup:**
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select existing one
   3. Enable the "Maps JavaScript API"
   4. Create credentials (API Key)
   5. Add the key to your `.env.local` file as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Using WellSphere

### 1. Registration
- Enter your name, email, and select your Bangladesh division
- The system will customize data and recommendations for your location

### 2. Dashboard Overview
- View real-time environmental metrics for your area
- Quick access to all monitoring systems
- Environmental health score at a glance

### 3. Specialized Monitoring
- Navigate through different environmental categories
- View historical trends and future predictions
- Set up notifications for specific thresholds

### 4. AI Analytics
- Get personalized recommendations for environmental improvement
- Understand correlations between different environmental factors
- Access predictive models for future planning

### 5. Educational Game
- Test your environmental knowledge with EcoQuest
- Learn interesting facts about climate science
- Track your progress and compete with others

## 📱 Design Philosophy

WellSphere follows Apple's design principles:
- **Simplicity**: Clean, uncluttered interface
- **Consistency**: Uniform design language throughout
- **Accessibility**: Intuitive navigation and clear information hierarchy
- **Performance**: Smooth animations and fast loading times

## 🌱 Environmental Impact

Our platform helps cities:
- **Reduce Carbon Footprint**: Through data-driven urban planning
- **Improve Air Quality**: By identifying pollution sources and solutions
- **Enhance Water Management**: Through predictive flood and drought monitoring
- **Preserve Biodiversity**: By tracking ecosystem health
- **Build Climate Resilience**: Through comprehensive risk assessment

## 🎯 Target Audience

- **Urban Planners**: Data-driven insights for sustainable development
- **Government Officials**: Environmental policy decision support
- **Environmental Scientists**: Comprehensive monitoring tools
- **Citizens**: Personal environmental awareness and education
- **Researchers**: Access to aggregated environmental data

## 🏆 NASA Space Apps Challenge 2025

WellSphere was created for the NASA Space Apps Challenge 2025, focusing on "Data Pathways to Healthy Cities and Human Settlements." Our solution demonstrates the power of NASA Earth observation data in creating sustainable, healthy urban environments.

## 👥 Team WellSphere

**Motto**: "Empowering Cities, Enhancing Health"

---

**Built with 🌍 for a sustainable future**

*WellSphere - Where environmental data meets urban innovation*
