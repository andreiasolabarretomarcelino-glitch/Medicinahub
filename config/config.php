<?php
/**
 * Main Application Configuration
 * 
 * This file contains global settings and environment configuration
 */

// Define environment (development, testing, or production)
define('ENVIRONMENT', getenv('APP_ENV') ?: 'development');

// Debug mode (enable only in development)
define('DEBUG', ENVIRONMENT === 'development');

// Set error display based on environment
if (DEBUG) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
}

// Base paths
define('BASE_PATH', realpath(__DIR__ . '/..'));
define('CONFIG_PATH', BASE_PATH . '/config');
define('API_PATH', BASE_PATH . '/api');
define('CLASSES_PATH', BASE_PATH . '/classes');
define('UPLOADS_PATH', BASE_PATH . '/uploads');
define('LOGS_PATH', BASE_PATH . '/logs');

// URL paths (update these according to your environment)
define('BASE_URL', getenv('APP_URL') ?: 'http://localhost');
define('API_URL', BASE_URL . '/api');
define('UPLOADS_URL', BASE_URL . '/uploads');

// API settings
define('API_RATE_LIMIT', 100); // 100 requests per minute
define('API_RATE_WINDOW', 60); // 1 minute window
define('API_TOKEN_EXPIRY', 86400); // 24 hours

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', ENVIRONMENT === 'production');
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.gc_maxlifetime', 28800); // 8 hours

// Load Supabase configuration
require_once CONFIG_PATH . '/supabase.php';

// Autoload classes
spl_autoload_register(function($className) {
    $classFile = CLASSES_PATH . '/' . $className . '.php';
    if (file_exists($classFile)) {
        require_once $classFile;
        return true;
    }
    return false;
});

// Initialize session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set security headers in production
if (ENVIRONMENT === 'production') {
    require_once CLASSES_PATH . '/Security.php';
    Security::setSecurityHeaders();
    
    // Enforce HTTPS in production
    Security::enforceHttps();
}

// Set timezone
date_default_timezone_set('America/Sao_Paulo');

// Load environment-specific configuration if exists
$envConfigFile = CONFIG_PATH . '/' . ENVIRONMENT . '.php';
if (file_exists($envConfigFile)) {
    require_once $envConfigFile;
}

// Initialize error handler
set_exception_handler(function($exception) {
    if (DEBUG) {
        echo '<h1>Exception</h1>';
        echo '<p>' . $exception->getMessage() . '</p>';
        echo '<pre>' . $exception->getTraceAsString() . '</pre>';
    } else {
        error_log($exception->getMessage() . "\n" . $exception->getTraceAsString());
        header('HTTP/1.1 500 Internal Server Error');
        include BASE_PATH . '/error-pages/500.php';
    }
    exit;
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return;
    }
    
    $errorType = match ($errno) {
        E_ERROR, E_USER_ERROR => 'Fatal Error',
        E_WARNING, E_USER_WARNING => 'Warning',
        E_NOTICE, E_USER_NOTICE => 'Notice',
        E_DEPRECATED, E_USER_DEPRECATED => 'Deprecated',
        default => 'Unknown Error',
    };
    
    if (DEBUG) {
        echo "<h2>$errorType</h2>";
        echo "<p>$errstr in $errfile on line $errline</p>";
    } else {
        error_log("[$errorType] $errstr in $errfile on line $errline");
        if ($errno == E_ERROR || $errno == E_USER_ERROR) {
            header('HTTP/1.1 500 Internal Server Error');
            include BASE_PATH . '/error-pages/500.php';
            exit;
        }
    }
    
    return true;
}); 