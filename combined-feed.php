<?php
/**
 * Combined RSS Feed Generator for Global Radio News
 * 
 * This script fetches the latest episode from multiple news podcast feeds
 * and combines them into a single RSS feed. This is particularly useful for:
 * 
 * 1. Android widgets that can display RSS feeds
 * 2. RSS reader apps that can automatically play audio enclosures
 * 3. Podcast apps that support importing RSS feeds
 * 
 * Usage: 
 * - Deploy this PHP file to your server
 * - Access via: https://your-server.com/combined-feed.php
 * - For Android widgets, use the URL in any widget that supports RSS feeds
 */

// Set content type to XML
header('Content-Type: application/rss+xml; charset=utf-8');

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Cache control (update feed every hour)
$cache_time = 3600; // 1 hour
header("Cache-Control: max-age=$cache_time");

// List of RSS feed URLs to combine
$feeds = [
    'Germany' => 'https://www.deutschlandfunk.de/nachrichten-108.xml',
    'Denmark' => 'https://api.dr.dk/podcasts/v1/feeds/radioavisen',
    'Sweden' => 'https://api.sr.se/api/rss/pod/3795',
    'UK' => 'https://podcasts.files.bbci.co.uk/p02nq0gn.rss',
    'USA-NPR' => 'https://feeds.npr.org/500005/podcast.xml',
    'USA-UpFirst' => 'https://feeds.simplecast.com/54nAGcIl'
];

// Initialize the combined feed
$rss = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/"></rss>');

// Create channel element
$channel = $rss->addChild('channel');
$channel->addChild('title', 'Global Radio News - Latest Episodes');
$channel->addChild('link', 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
$channel->addChild('description', 'Combined feed of the latest news episodes from public radio stations worldwide');
$channel->addChild('language', 'en');
$channel->addChild('lastBuildDate', date(DATE_RSS));

// Fetch and combine feeds
$items = [];

foreach ($feeds as $country => $feedUrl) {
    try {
        // Fetch the feed content
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'user_agent' => 'GlobalRadioNews/1.0 (Combined Feed Generator)'
            ]
        ]);
        
        $content = file_get_contents($feedUrl, false, $context);
        
        if ($content === false) {
            error_log("Error fetching feed: $feedUrl");
            continue;
        }
        
        // Try to parse as XML
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($content);
        
        if ($xml === false) {
            // Check if it might be JSON (for DR API)
            if (strpos($feedUrl, 'api.dr.dk') !== false) {
                $json = json_decode($content, true);
                if ($json && isset($json['items']) && !empty($json['items'])) {
                    $latestItem = $json['items'][0];
                    
                    // Create a custom item for DR
                    $item = [
                        'title' => "[{$country}] " . $latestItem['title'],
                        'link' => $latestItem['link'] ?? '',
                        'description' => $latestItem['description'] ?? '',
                        'pubDate' => date(DATE_RSS, strtotime($latestItem['publishTime'])),
                        'enclosure' => [
                            'url' => isset($latestItem['assets']) ? 
                                    array_filter($latestItem['assets'], function($a) { return $a['kind'] === 'Audio'; })[0]['url'] ?? '' : '',
                            'type' => 'audio/mpeg',
                            'length' => '0'
                        ]
                    ];
                    
                    if (!empty($item['enclosure']['url'])) {
                        $items[] = $item;
                    }
                }
            }
            continue;
        }
        
        // Extract the latest item from the feed
        $namespace = $xml->getNamespaces(true);
        
        if (isset($xml->channel) && isset($xml->channel->item)) {
            $latestItem = $xml->channel->item[0];
            
            // Find enclosure
            $enclosure = [
                'url' => '',
                'type' => 'audio/mpeg',
                'length' => '0'
            ];
            
            if (isset($latestItem->enclosure)) {
                $enclosure['url'] = (string)$latestItem->enclosure['url'];
                $enclosure['type'] = (string)$latestItem->enclosure['type'];
                $enclosure['length'] = (string)$latestItem->enclosure['length'];
            } else {
                // Try to find media:content
                if (isset($namespace['media'])) {
                    $media = $latestItem->children($namespace['media']);
                    if (isset($media->content)) {
                        $enclosure['url'] = (string)$media->content['url'];
                        $enclosure['type'] = (string)$media->content['type'];
                        $enclosure['length'] = (string)$media->content['fileSize'];
                    }
                }
            }
            
            // Skip if no audio URL found
            if (empty($enclosure['url'])) {
                continue;
            }
            
            // Create standardized item
            $item = [
                'title' => "[{$country}] " . (string)$latestItem->title,
                'link' => (string)$latestItem->link,
                'description' => (string)$latestItem->description,
                'pubDate' => (string)$latestItem->pubDate,
                'enclosure' => $enclosure
            ];
            
            $items[] = $item;
        }
    } catch (Exception $e) {
        error_log("Error processing feed {$feedUrl}: " . $e->getMessage());
        continue;
    }
}

// Sort items by publication date (newest first)
usort($items, function($a, $b) {
    return strtotime($b['pubDate']) - strtotime($a['pubDate']);
});

// Add items to the combined feed
foreach ($items as $item) {
    $newItem = $channel->addChild('item');
    $newItem->addChild('title', htmlspecialchars($item['title']));
    $newItem->addChild('link', $item['link']);
    $newItem->addChild('description', htmlspecialchars($item['description']));
    $newItem->addChild('pubDate', $item['pubDate']);
    
    $enclosure = $newItem->addChild('enclosure');
    $enclosure->addAttribute('url', $item['enclosure']['url']);
    $enclosure->addAttribute('type', $item['enclosure']['type']);
    $enclosure->addAttribute('length', $item['enclosure']['length']);
    
    // Add guid element
    $guid = $newItem->addChild('guid', $item['enclosure']['url']);
    $guid->addAttribute('isPermaLink', 'false');
}

// Output the combined feed
echo $rss->asXML();
?>