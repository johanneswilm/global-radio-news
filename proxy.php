<?php
/**
 * Simple RSS Proxy for Radio News App
 * Handles CORS issues when fetching RSS feeds from different domains
 * Returns original response content with proper CORS protection
 */

// Load configuration
require_once 'config.php';

// Get the current domain for CORS protection
$currentDomain = $_SERVER['HTTP_HOST'] ?? '';
$allowedOrigins = [
    $currentDomain,
    'localhost',
    '127.0.0.1'
];

// Check if request is from allowed origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$isAllowedOrigin = false;

if (!empty($origin)) {
    $originParts = parse_url($origin);
    $originHost = $originParts['host'] ?? '';

    foreach ($allowedOrigins as $allowed) {
        if ($originHost === $allowed || str_ends_with($originHost, '.' . $allowed)) {
            $isAllowedOrigin = true;
            break;
        }
    }
} else {
    // Allow direct access from same server
    $isAllowedOrigin = true;
}

if (!$isAllowedOrigin) {
    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'Access denied: Invalid origin';
    exit;
}

// Set CORS headers for allowed origins
if (!empty($origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Content-Type: text/plain');
    echo 'Method not allowed';
    exit;
}

// Get the feed URL from query parameter
$feedUrl = $_GET['url'] ?? '';

if (empty($feedUrl)) {
    http_response_code(400);
    header('Content-Type: text/plain');
    echo 'URL parameter is required';
    exit;
}

// Validate URL
if (!filter_var($feedUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    header('Content-Type: text/plain');
    echo 'Invalid URL provided';
    exit;
}

// Get allowed domains from configuration
try {
    $allowedDomains = RadioNewsConfig::getAllowedDomains();
} catch (Exception $e) {
    error_log("Failed to load allowed domains from config: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: text/plain');
    echo 'Configuration error';
    exit;
}

// Fallback to empty array if no domains configured
if (empty($allowedDomains)) {
    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'No allowed domains configured';
    exit;
}

$urlParts = parse_url($feedUrl);
$domain = $urlParts['host'] ?? '';

// Allow subdomains of whitelisted domains
$domainAllowed = false;
foreach ($allowedDomains as $allowedDomain) {
    if ($domain === $allowedDomain || str_ends_with($domain, '.' . $allowedDomain)) {
        $domainAllowed = true;
        break;
    }
}

if (!$domainAllowed) {
    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'Domain not allowed: ' . $domain;
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
            'Accept: application/rss+xml, application/xml, text/xml, application/json, */*',
            'Accept-Language: en-US,en;q=0.9',
            'Cache-Control: no-cache'
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $curlError = curl_error($ch);

    curl_close($ch);

    if (!empty($curlError)) {
        throw new Exception('cURL Error: ' . $curlError);
    }

    if ($httpCode !== 200) {
        http_response_code($httpCode);
        header('Content-Type: text/plain');
        echo "HTTP Error: $httpCode";
        exit;
    }

    if (empty($response)) {
        http_response_code(204);
        header('Content-Type: text/plain');
        echo 'Empty response from feed';
        exit;
    }

    // Determine content type and validate if needed
    $responseContentType = $contentType ?: 'application/xml';

    // Basic validation for XML content
    if (strpos($responseContentType, 'xml') !== false || strpos($response, '<?xml') === 0) {
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($response);

        if ($xml === false) {
            $errors = libxml_get_errors();
            $errorMsg = 'Invalid XML';
            if (!empty($errors)) {
                $errorMsg .= ': ' . trim($errors[0]->message);
            }

            http_response_code(422);
            header('Content-Type: text/plain');
            echo $errorMsg;
            exit;
        }
        libxml_clear_errors();

        // Set proper XML content type
        $responseContentType = 'application/xml; charset=utf-8';
    }

    // Validate JSON content
    if (strpos($responseContentType, 'json') !== false || (strpos($response, '{') === 0 || strpos($response, '[') === 0)) {
        $json = json_decode($response);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(422);
            header('Content-Type: text/plain');
            echo 'Invalid JSON: ' . json_last_error_msg();
            exit;
        }

        // Set proper JSON content type
        $responseContentType = 'application/json; charset=utf-8';
    }

    // Set appropriate cache headers
    $cacheTime = 300; // 5 minutes
    header("Cache-Control: public, max-age=$cacheTime");
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $cacheTime) . ' GMT');

    // Set the original content type
    header('Content-Type: ' . $responseContentType);

    // Add custom headers for debugging (optional)
    if (isset($_GET['debug']) && $_GET['debug'] === '1') {
        header('X-Proxy-URL: ' . $feedUrl);
        header('X-Proxy-Status: ' . $httpCode);
        header('X-Proxy-Time: ' . date('c'));
    }

    // Return the original response content
    echo $response;

} catch (Exception $e) {
    error_log("RSS Proxy Error for $feedUrl: " . $e->getMessage());

    http_response_code(500);
    header('Content-Type: text/plain');
    echo 'Failed to fetch feed: ' . $e->getMessage();
}

// Log successful requests (optional)
if (isset($_GET['log']) && $_GET['log'] === '1') {
    error_log("RSS Proxy: Successfully fetched $feedUrl");
}
?>
