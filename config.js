/**
 * Configuration loader for Global Radio News frontend
 * 
 * This module provides a centralized way to load and access configuration data
 * from the JSON config file for use in the frontend JavaScript.
 */

class RadioNewsConfig {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    /**
     * Load configuration from JSON file
     * 
     * @returns {Promise<Object>} Configuration data
     */
    async load() {
        if (this.loaded && this.config) {
            return this.config;
        }

        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
            }
            
            this.config = await response.json();
            this.loaded = true;
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Return default configuration if loading fails
            this.config = this.getDefaultConfig();
            this.loaded = true;
            return this.config;
        }
    }

    /**
     * Get default configuration (fallback)
     * 
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {
            stations: {
                "Germany": {
                    "flag": "🇩🇪",
                    "stations": [
                        {
                            "id": "dlf",
                            "name": "Deutschlandfunk",
                            "description": "News & Current Affairs",
                            "url": "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3"
                        }
                    ]
                },
                "Denmark": {
                    "flag": "🇩🇰",
                    "stations": [
                        {
                            "id": "dr-p1",
                            "name": "DR P1",
                            "description": "News & Talk",
                            "url": "https://live-icy.dr.dk/A/A03H.mp3"
                        }
                    ]
                },
                "Norway": {
                    "flag": "🇳🇴",
                    "stations": [
                        {
                            "id": "nrk-p2",
                            "name": "NRK P2",
                            "description": "Culture & News",
                            "url": "https://lyd.nrk.no/nrk_radio_p2_mp3_h"
                        }
                    ]
                },
                "Sweden": {
                    "flag": "🇸🇪",
                    "stations": [
                        {
                            "id": "sr-p1",
                            "name": "SR P1",
                            "description": "News & Current Affairs",
                            "url": "https://http-live.sr.se/p1-mp3-192"
                        }
                    ]
                },
                "United Kingdom": {
                    "flag": "🇬🇧",
                    "stations": [
                        {
                            "id": "bbc-radio4",
                            "name": "BBC Radio 4",
                            "description": "News, Current Affairs & Drama",
                            "url": "https://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4fm_mf_p"
                        }
                    ]
                },
                "United States": {
                    "flag": "🇺🇸",
                    "stations": [
                        {
                            "id": "npr",
                            "name": "NPR Live",
                            "description": "National Public Radio",
                            "url": "https://npr-ice.streamguys1.com/live.mp3"
                        },
                        {
                            "id": "wnyc",
                            "name": "WNYC",
                            "description": "New York Public Radio",
                            "url": "https://fm939.wnyc.org/wnycfm"
                        }
                    ]
                }
            },
            podcasts: {
                "Denmark": {
                    "flag": "🇩🇰",
                    "feeds": [
                        {
                            "id": "radioavisen",
                            "name": "Radioavisen",
                            "feedUrl": "https://api.dr.dk/podcasts/v1/feeds/radioavisen",
                            "type": "json",
                            "requiresProxy": true
                        }
                    ]
                },
                "Sweden": {
                    "flag": "🇸🇪",
                    "feeds": [
                        {
                            "id": "ekot",
                            "name": "Ekot",
                            "feedUrl": "https://api.sr.se/api/rss/pod/3795",
                            "type": "rss",
                            "requiresProxy": true
                        }
                    ]
                },
                "Germany": {
                    "flag": "🇩🇪",
                    "feeds": [
                        {
                            "id": "dlf-nachrichten",
                            "name": "DLF Nachrichten",
                            "feedUrl": "https://www.deutschlandfunk.de/nachrichten-108.xml",
                            "type": "rss",
                            "requiresProxy": true
                        }
                    ]
                },
                "United Kingdom": {
                    "flag": "🇬🇧",
                    "feeds": [
                        {
                            "id": "bbc-news-summary",
                            "name": "BBC News Summary",
                            "feedUrl": "https://podcasts.files.bbci.co.uk/p02nq0gn.rss",
                            "type": "rss",
                            "requiresProxy": false
                        }
                    ]
                },
                "United States": {
                    "flag": "🇺🇸",
                    "feeds": [
                        {
                            "id": "npr-news-now",
                            "name": "NPR News Now",
                            "feedUrl": "https://feeds.npr.org/500005/podcast.xml",
                            "type": "rss",
                            "requiresProxy": false
                        },
                        {
                            "id": "up-first",
                            "name": "Up First",
                            "feedUrl": "https://feeds.simplecast.com/54nAGcIl",
                            "type": "rss",
                            "requiresProxy": false
                        }
                    ]
                }
            },
            settings: {
                "title": "Global Radio News",
                "description": "Stream the latest news from public radio stations worldwide",
                "defaultVolume": 70,
                "feedCacheTime": 3600,
                "podcastTimeout": 5000,
                "enabledCountries": {
                    "stations": ["Germany", "Denmark", "Norway", "Sweden", "United Kingdom", "United States"],
                    "podcasts": ["Denmark", "Sweden", "Germany", "United Kingdom", "United States"]
                }
            }
        };
    }

    /**
     * Get all radio stations organized by country
     * 
     * @returns {Object} Stations data
     */
    getStations() {
        if (!this.config) return {};
        
        const enabledCountries = this.config.settings?.enabledCountries?.stations || [];
        const stations = {};
        
        for (const [country, countryData] of Object.entries(this.config.stations || {})) {
            if (enabledCountries.length === 0 || enabledCountries.includes(country)) {
                stations[country] = countryData;
            }
        }
        
        return stations;
    }

    /**
     * Get all podcast feeds organized by country
     * 
     * @returns {Object} Podcast data
     */
    getPodcasts() {
        if (!this.config) return {};
        
        const enabledCountries = this.config.settings?.enabledCountries?.podcasts || [];
        const podcasts = {};
        
        for (const [country, countryData] of Object.entries(this.config.podcasts || {})) {
            if (enabledCountries.length === 0 || enabledCountries.includes(country)) {
                podcasts[country] = countryData;
            }
        }
        
        return podcasts;
    }

    /**
     * Get application settings
     * 
     * @returns {Object} Settings object
     */
    getSettings() {
        return this.config?.settings || {};
    }

    /**
     * Get a specific setting value
     * 
     * @param {string} key Setting key
     * @param {*} defaultValue Default value if setting not found
     * @returns {*} Setting value or default
     */
    getSetting(key, defaultValue = null) {
        return this.config?.settings?.[key] ?? defaultValue;
    }

    /**
     * Find a station by ID
     * 
     * @param {string} stationId Station ID to find
     * @returns {Object|null} Station data with country info or null if not found
     */
    findStationById(stationId) {
        const stations = this.getStations();
        
        for (const [country, countryData] of Object.entries(stations)) {
            if (countryData.stations) {
                for (const station of countryData.stations) {
                    if (station.id === stationId) {
                        return {
                            ...station,
                            country: country,
                            flag: countryData.flag
                        };
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Find a podcast feed by ID
     * 
     * @param {string} feedId Feed ID to find
     * @returns {Object|null} Feed data with country info or null if not found
     */
    findPodcastById(feedId) {
        const podcasts = this.getPodcasts();
        
        for (const [country, countryData] of Object.entries(podcasts)) {
            if (countryData.feeds) {
                for (const feed of countryData.feeds) {
                    if (feed.id === feedId) {
                        return {
                            ...feed,
                            country: country,
                            flag: countryData.flag
                        };
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Check if a country is enabled for stations
     * 
     * @param {string} country Country name
     * @returns {boolean} True if enabled
     */
    isStationCountryEnabled(country) {
        const enabled = this.config?.settings?.enabledCountries?.stations || [];
        return enabled.length === 0 || enabled.includes(country);
    }

    /**
     * Check if a country is enabled for podcasts
     * 
     * @param {string} country Country name
     * @returns {boolean} True if enabled
     */
    isPodcastCountryEnabled(country) {
        const enabled = this.config?.settings?.enabledCountries?.podcasts || [];
        return enabled.length === 0 || enabled.includes(country);
    }

    /**
     * Get the app title from configuration
     * 
     * @returns {string} App title
     */
    getTitle() {
        return this.getSetting('title', 'Global Radio News');
    }

    /**
     * Get the app description from configuration
     * 
     * @returns {string} App description
     */
    getDescription() {
        return this.getSetting('description', 'Stream the latest news from public radio stations worldwide');
    }

    /**
     * Get the default volume setting
     * 
     * @returns {number} Default volume (0-100)
     */
    getDefaultVolume() {
        return this.getSetting('defaultVolume', 70);
    }

    /**
     * Get the podcast timeout setting
     * 
     * @returns {number} Timeout in milliseconds
     */
    getPodcastTimeout() {
        return this.getSetting('podcastTimeout', 5000);
    }
}

// Create a global instance
window.radioConfig = new RadioNewsConfig();