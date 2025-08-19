<?php
/**
 * Simple RSS Proxy for Radio News App
 * Handles CORS issues when fetching RSS feeds from different domains
 */

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the feed URL from query parameter
$feedUrl = $_GET['url'] ?? '';

if (empty($feedUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL parameter is required']);
    exit;
}

// Validate URL
if (!filter_var($feedUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL provided']);
    exit;
}

// Whitelist of allowed domains for security
$allowedDomains = [
    'api.dr.dk',
    'www.deutschlandfunk.de',
    'psapi.nrk.no',
    'api.sr.se',
    'podcasts.files.bbci.co.uk',
    'feeds.npr.org',
    'feeds.simplecast.com',
    'rss.cnn.com',
    'feeds.bbci.co.uk'
];

$urlParts = parse_url($feedUrl);
$domain = $urlParts['host'] ?? '';

if (!in_array($domain, $allowedDomains)) {
    http_response_code(403);
    echo json_encode(['error' => 'Domain not allowed']);
    exit;
}

try {
    // Set up cURL with proper options
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $feedUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_USERAGENT => 'Radio News App RSS Reader/1.0',
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => [
            'Accept: application/rss+xml, application/xml, text/xml, */*',
            'Accept-Language: en-US,en;q=0.9',
            'Cache-Control: no-cache'
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    
    if (curl_errno($ch)) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }
    
    curl_close($ch);

    if ($httpCode !== 200) {
        http_response_code($httpCode);
        echo json_encode(['error' => "HTTP Error: $httpCode"]);
        exit;
    }

    if (empty($response)) {
        http_response_code(204);
        echo json_encode(['error' => 'Empty response from feed']);
        exit;
    }

    // Basic XML validation
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($response);
    
    if ($xml === false) {
        $errors = libxml_get_errors();
        $errorMsg = 'Invalid XML';
        if (!empty($errors)) {
            $errorMsg .= ': ' . $errors[0]->message;
        }
        
        http_response_code(422);
        echo json_encode(['error' => $errorMsg]);
        exit;
    }

    // Set appropriate cache headers
    $cacheTime = 300; // 5 minutes
    header("Cache-Control: public, max-age=$cacheTime");
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $cacheTime) . ' GMT');
    
    // Return the RSS content wrapped in JSON (similar to allorigins.win)
    echo json_encode([
        'contents' => $response,
        'status' => [
            'url' => $feedUrl,
            'content_type' => $contentType,
            'http_code' => $httpCode,
            'response_time' => date('c')
        ]
    ]);

} catch (Exception $e) {
    error_log("RSS Proxy Error for $feedUrl: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch feed: ' . $e->getMessage()]);
}

// Log successful requests (optional)
if (isset($_GET['log']) && $_GET['log'] === '1') {
    error_log("RSS Proxy: Successfully fetched $feedUrl");
}
?>