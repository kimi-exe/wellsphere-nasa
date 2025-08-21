# 🗺️ Google Maps API Setup Guide

## Quick Setup Instructions

### 1. Get Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Create a new project or select an existing one
3. **Enable APIs**: Navigate to "APIs & Services" → "Library"
   - Search for "Maps JavaScript API"
   - Click on it and press "Enable"
4. **Create Credentials**: 
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

### 2. Configure Environment Variables

1. **Open your `.env.local` file** in the project root
2. **Replace the placeholder** with your actual API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. **Save the file**

### 3. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🚀 Alternative: Use Fallback Map

If you don't want to set up Google Maps API right now, you can use the **Fallback Map** which works without any API keys:

1. **Navigate to Environmental Map**: `/dashboard/environmental-map`
2. **Click "Use Fallback Map Instead"** button when Google Maps fails to load
3. **Or use the toggle button** in the left control panel

## ✨ Fallback Map Features

The fallback map provides:
- ✅ **Interactive Bangladesh map** with environmental data points
- ✅ **Red danger zone circles** for high-risk areas
- ✅ **Clickable markers** with detailed information
- ✅ **Layer toggles** for different environmental data types
- ✅ **Color-coded severity levels** (Critical, High, Medium, Low)
- ✅ **Real-time NASA data** integration
- ✅ **No API key required**

## 🔧 Troubleshooting

### Common Issues:

1. **"This page didn't load Google Maps correctly"**
   - Check if your API key is correctly set in `.env.local`
   - Ensure you've enabled "Maps JavaScript API" in Google Cloud Console
   - Restart the development server after changing environment variables

2. **API Key Invalid Error**
   - Verify the API key is copied correctly (no extra spaces)
   - Check if the API key has proper restrictions (if any)
   - Make sure billing is enabled in Google Cloud Console

3. **Quota Exceeded**
   - Google Maps API has usage limits
   - Check your usage in Google Cloud Console
   - Consider using the fallback map for development

### Environment File Location:
```
wellsphere-nasa/
├── .env.local          ← Your environment file should be here
├── .env.local.example  ← Template file
├── src/
└── package.json
```

## 💡 Development Tips

1. **Use Fallback Map for Development**: The fallback map is perfect for development and doesn't require any API keys
2. **Set up Google Maps for Production**: Use Google Maps API for production deployment
3. **Monitor API Usage**: Keep track of your Google Maps API usage in Google Cloud Console

## 🌟 Features Comparison

| Feature | Google Maps | Fallback Map |
|---------|-------------|--------------|
| API Key Required | ✅ Required | ❌ Not Required |
| Interactive Map | ✅ Full Google Maps | ✅ Custom SVG Map |
| Danger Zone Circles | ✅ Yes | ✅ Yes |
| Environmental Data | ✅ Yes | ✅ Yes |
| Clickable Markers | ✅ Yes | ✅ Yes |
| Layer Controls | ✅ Yes | ✅ Yes |
| Real-time Updates | ✅ Yes | ✅ Yes |
| Zoom/Pan | ✅ Full Control | ❌ Fixed View |
| Street View | ✅ Available | ❌ Not Available |
| Satellite View | ✅ Available | ❌ Not Available |

Both options provide the core functionality for the NASA Space Apps Challenge demonstration!

---

**Need Help?** The fallback map is fully functional and perfect for showcasing the environmental monitoring features without any API setup complexity.