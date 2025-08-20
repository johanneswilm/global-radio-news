# 📻 Global Radio News

A simple, responsive web application for streaming live news from public radio stations across Germany, Denmark, Norway, Sweden, UK, and US.

## Features

- **Live News Streaming**: Stream the latest news from major public broadcasters
- **Latest News Podcasts**: Access the most recent news programs as on-demand podcasts
- **Multi-Country Support**: Stations from 6 countries and regions
- **Dual Mode Interface**: Toggle between live streams and latest podcasts
- **RSS Feed Integration**: Automatically fetches the latest episodes from news podcasts
- **Responsive Design**: Works seamlessly on desktop computers and Android phones
- **Simple Interface**: Clean, intuitive design focused on ease of use
- **Cross-Browser Compatibility**: Works with modern web browsers
- **Dark Mode Support**: Automatically adapts to user's system preference
- **Keyboard Shortcuts**: Space to play/pause, Escape to stop
- **Auto-Retry**: Automatic reconnection on network issues
- **Volume Control**: Adjustable volume with visual feedback

## Supported Content

### Live Radio Streams

#### 🇩🇪 Germany
- **Deutschlandfunk**: News & Current Affairs

#### 🇩🇰 Denmark
- **DR P1**: News & Talk

#### 🇳🇴 Norway
- **NRK P2**: Culture & News

#### 🇸🇪 Sweden
- **SR P1**: News & Current Affairs

#### 🇬🇧 United Kingdom
- **BBC Radio 4**: News, Current Affairs & Drama

#### 🇺🇸 United States
- **NPR Live**: National Public Radio
- **WNYC AM 820**: New York Public Radio

### Latest News Podcasts

#### 🇩🇪 Germany
- **DLF Nachrichten**: Latest news bulletins from Deutschlandfunk

#### 🇩🇰 Denmark
- **Radioavisen**: Denmark's main radio news program from DR

#### 🇸🇪 Sweden
- **Ekot**: Sweden's main news program from SR

#### 🇬🇧 United Kingdom
- **BBC News Summary**: Latest BBC news summaries

#### 🇺🇸 United States
- **NPR News Now**: Short-form news updates from NPR
- **Up First**: NPR's daily news podcast

## 🚀 Getting Started

### Quick Start (5 Minutes)

1. **Download**: Get the files from the repository
2. **Open**: Double-click `index.html` to open in your browser
3. **Listen**: Click any station button to start streaming news
4. **Explore**: Switch to podcast mode for on-demand episodes

That's it! No installation, no setup, no accounts needed.

### First Time Setup

**For Basic Use (Radio Streams Only):**
- Just open `index.html` - works immediately
- All live radio streams work without any server

**For Full Features (Including Podcasts):**
1. Copy `config.example.json` to `config.json`
2. Edit `config.json` to customize your stations and podcasts
3. For podcast features, serve via local server (see Installation section)

**Customizing Your News Sources:**
1. Open `config.json` in a text editor
2. Add/remove countries in the `enabledCountries` section
3. Customize the `title` and `description` fields
4. Save and refresh your browser

### Understanding the Interface

**Main Controls:**
- **📡 Live Streams**: Real-time radio news from around the world
- **🎧 Latest News**: Recent podcast episodes and news summaries
- **▶️ Play/Pause**: Standard audio controls
- **🔊 Volume**: Adjustable volume slider (remembers your setting)
- **⏹️ Stop**: Completely stops current audio

**Visual Indicators:**
- 🟢 Green dot: Currently playing
- 🔄 Loading spinner: Fetching content
- 🔴 Red indicator: Stream unavailable
- 📅 Timestamp: When podcast was published

## How to Use

### 📡 Live Radio Streams

**Basic Usage:**
1. **Open the App**: Open `index.html` in your web browser
2. **Select Live Mode**: Click the "📡 Live Streams" button (default view)
3. **Choose a Station**: Click on any station button to start streaming immediately
4. **Control Playback**: Use the play/pause and stop buttons
5. **Adjust Volume**: Use the volume slider (remembers your preference)
6. **Switch Stations**: Click any other station - no need to stop current stream

**Pro Tips:**
- Use **keyboard shortcuts**: Space bar for play/pause, Escape to stop
- **Direct links**: Share specific stations using URL parameters like `?station=bbc-radio4`
- **Auto-play**: Use `?station=npr&autoplay=true` to start playing immediately
- **Volume control**: Right-click volume slider for precise control

### 🎧 Latest News Podcasts

**Basic Usage:**
1. **Switch to Podcast Mode**: Click the "🎧 Latest News" button
2. **Wait for Loading**: Episodes automatically load (shows loading indicators)
3. **Browse Episodes**: Scroll through latest episodes from all configured feeds
4. **Play an Episode**: Click the play button next to any episode
5. **Episode Information**: View title, publication date, duration, and description

**Advanced Features:**
- **Episode Details**: Click episode titles to see full descriptions
- **Progress Tracking**: Resume episodes where you left off (in supported browsers)
- **Direct Episode Links**: Use `?podcast=npr-news-now&mode=podcast` for direct access
- **Feed Updates**: Episodes refresh automatically every hour (configurable)

### 🔧 Configuration Scenarios

**Scenario 1: Personal News Dashboard**
Perfect for individuals who want a curated selection of their favorite news sources.

```json
{
  "settings": {
    "title": "My Daily News",
    "enabledCountries": {
      "stations": ["United States", "United Kingdom"],
      "podcasts": ["United States", "United Kingdom"]
    }
  }
}
```

**Scenario 2: Multilingual Newsroom**
Ideal for newsrooms or researchers monitoring international news.

```json
{
  "settings": {
    "title": "Global Newsroom Monitor",
    "enabledCountries": {
      "stations": ["Germany", "France", "Spain", "United Kingdom", "United States"],
      "podcasts": ["Germany", "France", "Spain", "United Kingdom", "United States"]
    },
    "defaultVolume": 60,
    "feedCacheTime": 1800
  }
}
```

**Scenario 3: Regional Focus Setup**
For users interested in specific geographic regions.

```json
{
  "settings": {
    "title": "Nordic News Hub",
    "enabledCountries": {
      "stations": ["Denmark", "Norway", "Sweden"],
      "podcasts": ["Denmark", "Sweden"]
    }
  }
}
```

## 💡 Practical Usage Examples

### Daily News Routine

**Morning Briefing (5-10 minutes):**
1. Open app with bookmark: `?station=npr&volume=70&autoplay=true`
2. Listen to live news while getting ready
3. Switch to podcasts: Click "🎧 Latest News"
4. Play 2-3 recent news summaries from different sources

**International Check-in (Throughout the day):**
1. Bookmark: `?station=bbc-world&volume=50`
2. Quick 5-minute international updates
3. Use keyboard shortcuts (Space = play/pause, Escape = stop)

**Deep Dive Research:**
1. Switch to podcast mode
2. Use country filters to focus on specific regions
3. Play multiple episodes from different sources for comprehensive coverage

### Professional Use Cases

**Newsroom Monitoring:**
```
Setup: Multiple browser tabs with different countries
- Tab 1: ?country=United%20States&station=npr
- Tab 2: ?country=United%20Kingdom&station=bbc-world
- Tab 3: ?country=Germany&station=dlf
```

**Language Learning:**
```
Configuration: Focus on one country for immersion
- Morning: Live radio for authentic speed/accent
- Evening: Podcasts for comprehension practice
- Use volume controls for difficult-to-understand segments
```

**Corporate Communications:**
```
Dashboard Setup: International news monitoring
- Main screen: Live international stream (BBC World Service)
- Secondary: Podcast episodes for detailed analysis
- Low volume (30-40%) for background monitoring
```

### Personal Productivity Integration

**Work Background Audio:**
- Set volume to 20-30% for ambient news
- Use stations with minimal music (pure news/talk)
- Keyboard shortcuts for quick muting during calls

**Exercise/Commute Companion:**
- High-quality podcasts for longer content
- Live streams for variety and real-time updates
- Mobile-optimized interface works great on phones

**Study/Research Sessions:**
- Multiple language sources for international perspective
- Podcast episodes for specific topic deep-dives
- Easy switching between sources for fact-checking

## 📥 Installation & Deployment

### Option 1: Quick Local Setup (No Server Required)
```bash
# Download the project
git clone <repository-url>
cd global-radio-news

# Just open in browser - that's it!
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Local Development Server
```bash
# For enhanced podcast features, use a local server:

# Python (built-in, no PHP required for basic features)
python -m http.server 8000

# PHP (required for full podcast proxy functionality)
php -S localhost:8000

# Node.js (if you prefer)
npx http-server . -p 8000
```

### Option 3: Web Server Deployment

**Requirements:**
- Any web server (Apache, Nginx, etc.)
- PHP 7.0+ (optional, for podcast proxy features)
- HTTPS recommended for best browser compatibility

**Deployment Steps:**
1. Upload all files to your web server
2. Ensure PHP is enabled (for `proxy.php` functionality)
3. Set appropriate file permissions (644 for files, 755 for directories)
4. Configure your web server to serve `.json` files with correct MIME type

**Apache `.htaccess` example:**
```apache
# Enable CORS for audio streaming
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"

# Proper MIME types
AddType application/json .json
AddType audio/mpeg .mp3
AddType audio/mp4 .m4a
```

**Nginx configuration example:**
```nginx
location / {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
}

location ~* \.(json)$ {
    add_header Content-Type application/json;
}
```

## Technical Details

- **Frontend Only**: Pure HTML, CSS, and JavaScript - no backend required*
- **RSS Feed Parsing**: Automatically fetches and parses podcast RSS feeds
- **CORS Handling**: Uses multiple proxy methods to bypass CORS restrictions
- **Audio Streaming**: Uses HTML5 `<audio>` element for cross-browser compatibility
- **Responsive CSS**: Mobile-first design with CSS Grid and Flexbox
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Modern Browser Support**: ES6+ JavaScript features

*Note*: For podcast functionality, a simple PHP proxy (`proxy.php`) is included.

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Optimized for mobile Chrome and Firefox

## Keyboard Shortcuts

- **Space**: Play/Pause current station
- **Escape**: Stop playback and clear selection

## Network Requirements

- **Internet Connection**: Required for streaming live audio
- **Bandwidth**: Approximately 128kbps per stream
- **Protocols**: HTTP/HTTPS audio streaming

## Troubleshooting

### Common Issues

**"Unable to connect to station"**
- Check your internet connection
- Some stations may have geographic restrictions
- Try a different station to test connectivity

**"Please click the play button" (Browser Policy)**
- Modern browsers require user interaction to start audio
- Click the play button instead of relying on auto-play

**"Failed to load episode" (Podcasts)**
- RSS feed may be temporarily unavailable
- Try refreshing the page to reload feeds
- Some podcast feeds may have CORS restrictions

**"Loading..." stuck on podcasts**
- RSS proxy services may be experiencing issues
- Check browser console for specific errors
- Try switching to live streams as alternative

**Audio not playing on mobile**
- Ensure your device is not in silent mode
- Check device volume settings
- Some mobile browsers may block auto-play

### Stream Availability

Note that radio stream URLs may change over time. If a station stops working:

1. Check the station's official website for updated stream URLs
2. Some stations may have geographic restrictions
3. Streams may be temporarily unavailable for maintenance

## Customization

### Adding New Stations

#### Adding New Radio Stations

Edit `index.html` in the live streams section:

```html
<button class="station-btn"
        data-url="STREAM_URL_HERE"
        data-name="Station Name"
        data-country="Country">
    <div class="station-title">Station Name</div>
    <div class="station-desc">Station Description</div>
</button>
```

#### Adding New Podcast Feeds

Edit `index.html` in the podcast section:

```html
<div class="podcast-item" data-feed="RSS_FEED_URL_HERE">
    <div class="podcast-header">
        <div class="podcast-title">Podcast Name</div>
        <div class="podcast-country">Country</div>
    </div>
    <div class="podcast-episode" data-name="Podcast Name">
        <div class="episode-info">
            <div class="episode-title">Loading...</div>
            <div class="episode-meta">
                <span class="episode-date">--</span>
                <span class="episode-duration">--</span>
            </div>
        </div>
        <button class="podcast-play-btn" disabled>▶️</button>
    </div>
</div>
```

### Styling

Modify `style.css` to customize:
- Colors and themes
- Layout and spacing
- Font choices
- Mobile responsiveness

### Functionality

Extend `script.js` to add:
- More audio controls
- Station favorites
- Playback history
- Analytics tracking
- Additional RSS feed sources
- Offline podcast caching
- Custom podcast categories

## Privacy & Legal

- **No Data Collection**: This app doesn't collect or store user data
- **External Streams**: Audio content is streamed directly from broadcaster servers
- **RSS Feeds**: Podcast metadata is fetched from public RSS feeds
- **Copyright**: All audio content belongs to respective broadcasters
- **Geographic Restrictions**: Some streams and podcasts may not be available in all regions
- **CORS Proxies**: Third-party proxy services are used to access RSS feeds (see proxy.php for self-hosted option)


## Global Radio News - Android Widget Guide

This guide explains how to set up a widget on your Android device to access the latest news podcasts from multiple countries without requiring extra interaction.

Many Android RSS widget apps can automatically play audio content from RSS feeds. The combined feed we provide aggregates the latest episodes from all news stations into a single feed, making it perfect for widgets.

### Step 1: Set Up the Combined Feed

1. Deploy the `combined-feed.php` script to your web server
2. Access it via: `https://your-server.com/combined-feed.php`
3. Verify it works by checking that you get an RSS feed with multiple news episodes

### Step 2: Install an RSS Widget App

Install one of these recommended RSS widget apps from Google Play Store:
- **Feedly Widget** - Simple RSS widget with auto-play capabilities
- **RSS Reader Widget** - Customizable widgets for RSS feeds
- **KWGT** - Advanced widget maker with RSS capabilities

### Step 3: Configure the Widget

1. Long press on your home screen and select "Widgets"
2. Find your installed RSS widget app and drag it to your home screen
3. Configure the widget with the URL of your combined feed
4. Set auto-play options if available

### Requirements:
- Tasker app (paid)
- AutoTools plugin (optional, for better widgets)

### Setup:
1. Create a new Tasker Task called "Play All News"
2. Add an HTTP Request action to fetch the combined feed
3. Add Parse XML action to extract audio URLs
4. Add Media Play action for each URL in sequence
5. Create a widget for this task on your home screen

## Option 3: Using the Web App with Android Shortcuts

You can create a direct shortcut to the "Play All" feature:

1. Open the Global Radio News web app in Chrome
2. Switch to the "Latest News" mode
3. Tap the menu (⋮) and select "Add to Home screen"
4. A shortcut will be created that you can tap to access the app
5. For direct "Play All" access, use this URL format:
   `https://your-server.com/radio-news/?mode=podcast&action=playall`

## Troubleshooting

### Widget Not Updating
- Check that background data is enabled for the widget app
- Reduce the refresh interval (every 30-60 minutes is recommended)
- Make sure battery optimization is disabled for the widget app

### Audio Not Playing Automatically
- Some Android versions restrict background audio playback
- Try enabling autoplay permissions for the widget app
- Use a dedicated podcast app that supports RSS import instead

## Compatible Podcast Apps

These podcast apps can import the combined feed and offer better playback controls:

- **Podcast Addict** - Import via URL in the "Add Podcast" menu
- **AntennaPod** - Open "Add Podcast" → "RSS address" and enter the feed URL
- **Pocket Casts** - Use "Add by URL" in the library section

## Configuration File Structure

The configuration is stored in `config.json` with the following structure:

```json
{
  "stations": { ... },
  "podcasts": { ... },
  "settings": { ... }
}
```

## Stations Configuration

Define live radio streams organized by country:

```json
"stations": {
  "Country Name": {
    "flag": "🇺🇸",
    "stations": [
      {
        "id": "unique-station-id",
        "name": "Station Name",
        "description": "Brief description",
        "url": "https://stream-url.com/stream.mp3"
      }
    ]
  }
}
```

### Station Properties

- **id**: Unique identifier for the station (used in URLs)
- **name**: Display name of the station
- **description**: Brief description shown under the station name
- **url**: Direct URL to the audio stream (MP3, AAC, etc.)

## Podcasts Configuration

Define podcast RSS feeds organized by country:

```json
"podcasts": {
  "Country Name": {
    "flag": "🇺🇸",
    "feeds": [
      {
        "id": "unique-podcast-id",
        "name": "Podcast Name",
        "feedUrl": "https://example.com/rss",
        "type": "rss",
        "requiresProxy": false
      }
    ]
  }
}
```

### Podcast Properties

- **id**: Unique identifier for the podcast
- **name**: Display name of the podcast
- **feedUrl**: URL to the RSS feed or API endpoint
- **type**: Feed type - either "rss" (standard RSS/XML) or "json" (for special APIs like DR)
- **requiresProxy**: Boolean indicating if this feed must always use the server-side proxy due to CORS restrictions

## Settings Configuration

Application-wide settings:

```json
"settings": {
  "title": "Global Radio News",
  "description": "Stream the latest news from public radio stations worldwide",
  "defaultVolume": 70,
  "feedCacheTime": 3600,
  "podcastTimeout": 5000,
  "enabledCountries": {
    "stations": ["Germany", "United States", "United Kingdom"],
    "podcasts": ["Germany", "United States", "United Kingdom"]
  }
}
```

### Settings Properties

- **title**: Application title (shown in header and browser title)
- **description**: Application description (shown in header)
- **defaultVolume**: Default volume level (0-100)
- **feedCacheTime**: RSS feed cache time in seconds (for PHP backend)
- **podcastTimeout**: Timeout for podcast feed requests in milliseconds
- **enabledCountries**: Control which countries appear in the interface
  - **stations**: Array of country names to show in live streams
  - **podcasts**: Array of country names to show in podcast section

## 🛠️ Configuration Guide

### Complete Configuration Examples

**Example 1: Minimal Setup (Single Country)**
Perfect for users who only want local news:

```json
{
  "stations": {
    "United States": {
      "flag": "🇺🇸",
      "stations": [
        {
          "id": "npr-news",
          "name": "NPR News",
          "description": "National Public Radio News",
          "url": "https://npr-ice.streamguys1.com/live.mp3"
        }
      ]
    }
  },
  "podcasts": {
    "United States": {
      "flag": "🇺🇸",
      "feeds": [
        {
          "id": "npr-hourly",
          "name": "NPR Hourly News",
          "feedUrl": "https://feeds.npr.org/500005/podcast.xml",
          "type": "rss",
          "requiresProxy": true
        }
      ]
    }
  },
  "settings": {
    "title": "Local News Hub",
    "defaultVolume": 70
  }
}
```

**Example 2: Corporate/Educational Setup**
Suitable for offices or educational institutions:

```json
{
  "stations": {
    "Global Mix": {
      "flag": "🌍",
      "stations": [
        {
          "id": "bbc-world",
          "name": "BBC World Service",
          "description": "International News in English",
          "url": "https://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk"
        },
        {
          "id": "cnn-intl",
          "name": "CNN International",
          "description": "Global News Coverage",
          "url": "https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8"
        }
      ]
    }
  },
  "settings": {
    "title": "Corporate News Monitor",
    "description": "24/7 International News Coverage",
    "defaultVolume": 50,
    "feedCacheTime": 900,
    "enabledCountries": {
      "stations": ["Global Mix"],
      "podcasts": []
    }
  }
}
```

**Example 3: Language Learning Setup**
Great for language learners wanting authentic news content:

```json
{
  "stations": {
    "Germany": {
      "flag": "🇩🇪",
      "stations": [
        {
          "id": "dlf",
          "name": "Deutschlandfunk",
          "description": "German National Radio - Clear Speech",
          "url": "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3"
        }
      ]
    },
    "Spain": {
      "flag": "🇪🇸",
      "stations": [
        {
          "id": "rne",
          "name": "RNE Radio Nacional",
          "description": "Spanish National Radio",
          "url": "https://rtvelivestream.akamaized.net/rtvesec/rne/rne_r1_main.m3u8"
        }
      ]
    }
  },
  "settings": {
    "title": "Language Learning News",
    "description": "Authentic news content for language practice",
    "feedCacheTime": 7200
  }
}
```

### Adding New Content

**Adding a New Radio Station:**

1. Find the stream URL (see "Finding Stream URLs" section below)
2. Add to your `config.json`:

```json
"stations": {
  "Your Country": {
    "flag": "🏳️",
    "stations": [
      {
        "id": "unique-station-id",
        "name": "Station Display Name",
        "description": "Brief description of content",
        "url": "https://stream-url-here.com/stream.mp3"
      }
    ]
  }
}
```

**Adding a New Podcast Feed:**

```json
"podcasts": {
  "Your Country": {
    "flag": "🏳️",
    "feeds": [
      {
        "id": "unique-podcast-id",
        "name": "Podcast Display Name",
        "feedUrl": "https://podcast-rss-feed-url.com/feed.xml",
        "type": "rss",
        "requiresProxy": false
      }
    ]
  }
}
```

### Advanced Configuration Options

**CORS and Proxy Settings:**
Some feeds require proxy due to CORS restrictions:

- **requiresProxy: true** - Always use server proxy (slower, more reliable)
- **requiresProxy: false** - Direct access first, proxy fallback (faster)

```json
{
  "id": "complex-feed",
  "name": "Complex News Feed",
  "feedUrl": "https://secure-api.example.com/feed",
  "type": "json",
  "requiresProxy": true,
  "customHeaders": {
    "User-Agent": "NewsApp/1.0"
  }
}
```

**Performance Optimization:**

```json
"settings": {
  "feedCacheTime": 3600,
  "podcastTimeout": 8000,
  "maxConcurrentStreams": 1,
  "preloadMetadata": false,
  "enableServiceWorker": true
}
```

**Custom Styling Integration:**

```json
"settings": {
  "customCSS": "custom-theme.css",
  "theme": "dark",
  "compactMode": true,
  "showFlags": true,
  "showDescriptions": true
}
```

## 🔗 URL Parameters & Deep Linking

The application supports comprehensive URL parameters for direct linking and automation:

### Basic Parameters
- `?station=station-id` - Auto-select and play a specific station
- `?podcast=podcast-id&mode=podcast` - Auto-select and play a specific podcast episode
- `?mode=podcast` - Switch to podcast mode
- `?mode=live` - Switch to live streams mode (default)

### Advanced Parameters
- `?volume=75` - Set initial volume (0-100)
- `?autoplay=true` - Start playing immediately (requires user interaction first)
- `?country=Germany` - Show only stations/podcasts from specific country
- `?theme=dark` - Set visual theme
- `?compact=true` - Use compact interface mode

### Real-World Examples

**Corporate Dashboard:**
```
https://yoursite.com/index.html?station=bbc-world&volume=40&autoplay=false
```

**Language Learning Bookmark:**
```
https://yoursite.com/index.html?station=dlf&country=Germany&volume=60
```

**Podcast Deep Link:**
```
https://yoursite.com/index.html?podcast=npr-news-now&mode=podcast&autoplay=true
```

**Shared News Link:**
```
https://yoursite.com/index.html?station=france-info&volume=80&theme=light
```

### Creating Bookmarks

You can create bookmarks for different scenarios:

1. **Morning News**: `?station=npr&volume=70&autoplay=true`
2. **International Brief**: `?station=bbc-world&volume=50`
3. **Podcast Catchup**: `?mode=podcast&country=United%20States`

## Finding Stream URLs

### Radio Streams

1. **Radio-Browser.info**: Search for stations and copy stream URLs
2. **Station Websites**: Look for "Listen Live" links
3. **Browser Developer Tools**: Inspect network traffic when playing streams

### Podcast Feeds

1. **Podcast Websites**: Look for RSS feed links
2. **Podcast Directories**: Apple Podcasts, Spotify (may require conversion)
3. **Public Radio APIs**: Some broadcasters provide JSON APIs

## 🔧 Advanced Usage Tips

### Power User Features

**Keyboard Productivity:**
- `Space` - Play/pause current stream
- `Escape` - Stop all audio immediately
- `Tab` - Navigate between interface elements
- `Enter` - Activate selected station/podcast

**URL Automation:**
Create desktop shortcuts or bookmarks for instant access:
```bash
# Morning news routine
"Morning Brief" → ?station=npr&volume=75&autoplay=true

# International update  
"World News" → ?station=bbc-world&volume=60

# Evening podcasts
"Podcast Roundup" → ?mode=podcast&country=United%20States
```

**Multi-Device Synchronization:**
- Use cloud storage for `config.json` to sync settings
- Bookmark URLs work across all devices
- Volume preferences stored in browser localStorage

### Performance Optimization

**For Slow Connections:**
- Reduce `feedCacheTime` for faster podcast loading
- Use `requiresProxy: false` when possible
- Focus on audio-only streams (avoid video streams)

**For Multiple Simultaneous Users:**
- Increase `podcastTimeout` for busy servers
- Use CDN-hosted stream URLs when available
- Consider local caching proxy for corporate use

**Battery Optimization (Mobile):**
- Use WiFi instead of cellular for streaming
- Close other browser tabs to reduce CPU usage
- Lower volume reduces power consumption

## 🧪 Testing & Validation

### Testing Your Configuration

**Step-by-Step Testing Process:**

1. **Backup Original**: Always backup your working `config.json` first
2. **Validate JSON**: Use online JSON validators to check syntax
3. **Test Incrementally**: Add one station/podcast at a time
4. **Check Console**: Open browser developer tools to see error messages
5. **Test Playback**: Verify each new station/podcast actually works

**Using the Test Configuration Tool:**

Open `test-config.html` in your browser for advanced testing:

- **Syntax Validation**: Automatically checks JSON syntax
- **URL Testing**: Validates that stream URLs are accessible
- **Feed Parsing**: Tests podcast RSS feeds
- **Performance Analysis**: Shows loading times and response codes

**Common Testing Commands:**

```bash
# Test JSON syntax
cat config.json | python -m json.tool

# Test stream URLs (requires curl)
curl -I "https://your-stream-url.com/stream.mp3"

# Validate RSS feeds
curl -s "https://your-podcast-feed.com/rss" | head -20
```

### Debugging Common Issues

**Configuration Not Loading:**
- Check JSON syntax with browser console
- Verify file permissions (should be readable)
- Ensure file encoding is UTF-8

**Streams Not Playing:**
- Test URLs directly in browser
- Check for geographic restrictions
- Verify HTTPS/HTTP protocol consistency

**Podcasts Not Loading:**
- Test RSS feed URLs directly
- Check `requiresProxy` setting
- Verify RSS feed format is valid

### Validation Checklist

Before deploying your configuration:

- [ ] JSON syntax is valid
- [ ] All station IDs are unique
- [ ] All podcast IDs are unique  
- [ ] Stream URLs return 200 status codes
- [ ] RSS feeds are accessible
- [ ] Country names match exactly in stations and settings
- [ ] Required proxy settings are configured
- [ ] Volume levels are between 0-100
- [ ] Cache times are reasonable (300-7200 seconds)

## Backup and Version Control

- Keep a backup of your working `config.json`
- Use `config.example.json` as a reference
- Consider version controlling your customizations

## Troubleshooting

### Configuration Not Loading

- Check JSON syntax using a JSON validator
- Ensure `config.json` is in the same directory as `index.html`
- Check browser console for error messages

### Streams Not Playing

- Verify stream URLs are still active
- Check for CORS issues (some streams may require proxy)
- Test stream URLs directly in browser

### Podcasts Not Loading

- Verify RSS feed URLs are accessible
- Check feed format (RSS vs JSON)
- Some feeds may require CORS proxy (`proxy.php`)

## Advanced Configuration

### Custom CORS Proxy

If you need to access feeds that block CORS, modify the proxy URL in the settings or implement your own proxy solution.

### Feed Types

- **RSS**: Standard RSS 2.0 XML feeds
- **JSON**: Special JSON APIs (currently supports DR API format)

### CORS Proxy Behavior

The application handles CORS restrictions intelligently:

1. **requiresProxy: false** (default)
   - Tries direct fetch first (faster)
   - Falls back to proxy if CORS blocked
   - Best for feeds that may or may not have CORS restrictions

2. **requiresProxy: true**
   - Always uses server-side proxy
   - Slower but reliable for feeds with strict CORS policies
   - Required for APIs like DR, SR, and some European broadcasters

### Performance Optimization

- Reduce `podcastTimeout` for faster loading (but may cause timeouts)
- Increase `feedCacheTime` to reduce server load
- Limit `enabledCountries` to reduce initial load time

## ❓ Frequently Asked Questions

### General Usage

**Q: Do I need to install anything to use this app?**
A: No! Just download the files and open `index.html` in your browser. For podcast features, you may want to serve it via a local server, but it's not required for basic radio streaming.

**Q: Why do some stations not work in my country?**
A: Many radio stations have geographic restrictions (geo-blocking). Try using a VPN or look for international versions of the same stations.

**Q: Can I use this on my phone/tablet?**
A: Yes! The interface is fully responsive and optimized for mobile devices. All features work on mobile browsers.

**Q: Does this app collect any personal data?**
A: No. Everything runs locally in your browser. No data is sent to external servers except when fetching audio streams and RSS feeds directly from their sources.

### Configuration & Setup

**Q: How do I add my favorite radio station?**
A: Find the station's streaming URL (see "Finding Stream URLs" section), then add it to your `config.json` file following the examples provided.

**Q: Why don't podcasts work without a server?**
A: Many podcast RSS feeds have CORS (Cross-Origin Resource Sharing) restrictions that prevent direct browser access. The included PHP proxy bypasses this limitation.

**Q: Can I customize the appearance?**
A: Yes! You can modify `style.css` for visual changes, or use the settings in `config.json` to control which countries and features are shown.

**Q: How do I backup my configuration?**
A: Simply copy your `config.json` file. It contains all your custom stations, podcasts, and settings.

### Technical Issues

**Q: A station was working but now it's not. What happened?**
A: Radio stream URLs change frequently. Check the station's website for updated stream URLs, or try finding alternative streams using tools like Radio-Browser.info.

**Q: Podcasts are loading slowly or not at all. How can I fix this?**
A: Try setting `requiresProxy: true` for problematic feeds, increase the `podcastTimeout` value, or check if the RSS feed URL is still valid.

**Q: Can I run this on a web server for multiple users?**
A: Absolutely! Just upload all files to your web server. Make sure PHP is enabled for full podcast functionality.

**Q: The app says "Please click play" instead of auto-playing. Why?**
A: Modern browsers require user interaction before playing audio. This is a security feature. Just click the play button once to enable audio.

### Advanced Usage

**Q: Can I integrate this with other systems?**
A: Yes! The app supports URL parameters for automation, and you can modify the JavaScript files to add custom integrations.

**Q: How do I monitor multiple news sources simultaneously?**
A: Open multiple browser tabs with different URL parameters, or create a custom configuration that includes all your desired sources.

**Q: Can I add video streams, not just audio?**
A: The current version is designed for audio only, but you could modify the code to support video streams using HTML5 video elements.

**Q: Is there a way to schedule automatic playback?**
A: You can use browser automation tools, bookmarks with URL parameters, or create simple HTML pages that auto-redirect with specific parameters.

## Support

For issues with configuration or adding new stations/podcasts, check:

1. Browser developer console for errors
2. Network tab for failed requests
3. Station/podcast provider documentation
4. CORS proxy functionality

Remember to test thoroughly after making configuration changes.

## Contributing

Contributions are welcome! Areas for improvement:

- Additional radio stations and podcast feeds
- Better error handling for RSS parsing
- Offline podcast caching
- Enhanced PWA features
- Accessibility improvements
- Support for more RSS feed formats
- Custom podcast categories and filtering

## License

This project is open source. Please respect the terms of use of individual radio stations when using their streams.

## Acknowledgments

- Thanks to all the public broadcasters for providing free access to news streams
- Inspired by the need for simple, accessible news consumption across language barriers
- Built with modern web standards for maximum compatibility

---

**Note**: Stream URLs and RSS feeds may change over time. This app provides a simple interface to public streams and podcasts but does not guarantee availability. The app uses third-party CORS proxy services for RSS feeds - for production use, consider hosting your own proxy. Please respect the terms of service of individual broadcasters and podcast publishers.

---

For any issues or questions, please open an issue on the GitHub repository.
