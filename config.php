<?php
/**
 * Configuration loader for Global Radio News
 * 
 * This file provides a centralized way to load configuration data
 * from the JSON config file for use in PHP scripts.
 */

class RadioNewsConfig {
    private static $config = null;
    private static $configFile = 'config.json';
    
    /**
     * Load configuration from JSON file
     * 
     * @return array Configuration data
     * @throws Exception If config file cannot be loaded or parsed
     */
    public static function load() {
        if (self::$config === null) {
            $configPath = __DIR__ . '/' . self::$configFile;
            
            if (!file_exists($configPath)) {
                throw new Exception("Configuration file not found: {$configPath}");
            }
            
            $content = file_get_contents($configPath);
            if ($content === false) {
                throw new Exception("Cannot read configuration file: {$configPath}");
            }
            
            $config = json_decode($content, true);
            if ($config === null) {
                throw new Exception("Invalid JSON in configuration file: " . json_last_error_msg());
            }
            
            self::$config = $config;
        }
        
        return self::$config;
    }
    
    /**
     * Get all podcast feeds as a flat array for RSS generation
     * 
     * @return array Array of podcast feeds with country labels
     */
    public static function getPodcastFeeds() {
        $config = self::load();
        $feeds = [];
        
        if (!isset($config['podcasts'])) {
            return $feeds;
        }
        
        $enabledCountries = $config['settings']['enabledCountries']['podcasts'] ?? [];
        
        foreach ($config['podcasts'] as $country => $countryData) {
            // Skip if country is not enabled
            if (!empty($enabledCountries) && !in_array($country, $enabledCountries)) {
                continue;
            }
            
            if (isset($countryData['feeds'])) {
                foreach ($countryData['feeds'] as $feed) {
                    $feeds[$country] = $feed['feedUrl'];
                    // For backwards compatibility, use only the first feed per country
                    break;
                }
            }
        }
        
        return $feeds;
    }
    
    /**
     * Get all podcast feeds with full metadata
     * 
     * @return array Array of podcast feeds with full configuration
     */
    public static function getAllPodcastFeeds() {
        $config = self::load();
        $feeds = [];
        
        if (!isset($config['podcasts'])) {
            return $feeds;
        }
        
        $enabledCountries = $config['settings']['enabledCountries']['podcasts'] ?? [];
        
        foreach ($config['podcasts'] as $country => $countryData) {
            // Skip if country is not enabled
            if (!empty($enabledCountries) && !in_array($country, $enabledCountries)) {
                continue;
            }
            
            if (isset($countryData['feeds'])) {
                $feeds[$country] = [
                    'flag' => $countryData['flag'],
                    'feeds' => $countryData['feeds']
                ];
            }
        }
        
        return $feeds;
    }

    /**
     * Check if a podcast feed requires proxy
     * 
     * @param string $feedId Feed ID to check
     * @return bool True if requires proxy
     */
    public static function feedRequiresProxy($feedId) {
        $podcasts = self::getAllPodcastFeeds();
        
        foreach ($podcasts as $country => $countryData) {
            foreach ($countryData['feeds'] as $feed) {
                if ($feed['id'] === $feedId) {
                    return $feed['requiresProxy'] ?? false;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get all radio stations
     * 
     * @return array Array of radio stations organized by country
     */
    public static function getStations() {
        $config = self::load();
        
        if (!isset($config['stations'])) {
            return [];
        }
        
        $enabledCountries = $config['settings']['enabledCountries']['stations'] ?? [];
        $stations = [];
        
        foreach ($config['stations'] as $country => $countryData) {
            // Skip if country is not enabled
            if (!empty($enabledCountries) && !in_array($country, $enabledCountries)) {
                continue;
            }
            
            $stations[$country] = $countryData;
        }
        
        return $stations;
    }
    
    /**
     * Get application settings
     * 
     * @return array Application settings
     */
    public static function getSettings() {
        $config = self::load();
        return $config['settings'] ?? [];
    }
    
    /**
     * Get a specific setting value
     * 
     * @param string $key Setting key
     * @param mixed $default Default value if setting not found
     * @return mixed Setting value or default
     */
    public static function getSetting($key, $default = null) {
        $settings = self::getSettings();
        return $settings[$key] ?? $default;
    }
    
    /**
     * Check if a country is enabled for stations
     * 
     * @param string $country Country name
     * @return bool True if enabled
     */
    public static function isStationCountryEnabled($country) {
        $enabled = self::getSetting('enabledCountries', []);
        $stationCountries = $enabled['stations'] ?? [];
        return empty($stationCountries) || in_array($country, $stationCountries);
    }
    
    /**
     * Check if a country is enabled for podcasts
     * 
     * @param string $country Country name
     * @return bool True if enabled
     */
    public static function isPodcastCountryEnabled($country) {
        $enabled = self::getSetting('enabledCountries', []);
        $podcastCountries = $enabled['podcasts'] ?? [];
        return empty($podcastCountries) || in_array($country, $podcastCountries);
    }
    
    /**
     * Find a station by ID
     * 
     * @param string $stationId Station ID to find
     * @return array|null Station data or null if not found
     */
    public static function findStationById($stationId) {
        $stations = self::getStations();
        
        foreach ($stations as $country => $countryData) {
            if (isset($countryData['stations'])) {
                foreach ($countryData['stations'] as $station) {
                    if ($station['id'] === $stationId) {
                        return array_merge($station, [
                            'country' => $country,
                            'flag' => $countryData['flag']
                        ]);
                    }
                }
            }
        }
        
        return null;
    }
    
    /**
     * Find a podcast feed by ID
     * 
     * @param string $feedId Feed ID to find
     * @return array|null Feed data or null if not found
     */
    public static function findPodcastById($feedId) {
        $podcasts = self::getAllPodcastFeeds();
        
        foreach ($podcasts as $country => $countryData) {
            foreach ($countryData['feeds'] as $feed) {
                if ($feed['id'] === $feedId) {
                    return array_merge($feed, [
                        'country' => $country,
                        'flag' => $countryData['flag']
                    ]);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Get allowed domains for proxy requests
     * 
     * @return array Array of allowed domain strings
     */
    public static function getAllowedDomains() {
        $settings = self::getSettings();
        return $settings['allowedDomains'] ?? [];
    }
}