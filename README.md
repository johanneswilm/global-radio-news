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

## How to Use

### Live Streams
1. **Open the App**: Open `index.html` in your web browser
2. **Select Live Mode**: Click the "📡 Live Streams" button (default)
3. **Choose a Station**: Click on any station button to start streaming
4. **Control Playback**: Use the play/pause and stop buttons, or keyboard shortcuts
5. **Adjust Volume**: Use the volume slider to adjust audio levels
6. **Switch Stations**: Click any other station to switch streams instantly

### Latest News Podcasts
1. **Switch to Podcast Mode**: Click the "🎧 Latest News" button
2. **Wait for Loading**: The app automatically fetches the latest episodes
3. **Play an Episode**: Click the play button next to any loaded episode
4. **Episode Information**: View episode title, publication date, and duration
5. **Control Playback**: Use the same audio controls as live streams

## Installation

### Option 1: Local Development
```bash
git clone <repository-url>
cd global-radio-news
# Open index.html in your browser or serve via local server
php -S localhost:8000
```

### Option 2: Web Server Deployment
Upload all files to your web server. Some simple PHP server-side processing required.

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

---

For any issues or questions, please open an issue on the GitHub repository.

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
