<?php
/**
 * API Rate Limiter
 * 
 * Provides rate limiting functionality for API endpoints
 */

class RateLimiter {
    /**
     * Redis connection for storing rate limit data
     * @var Redis|null
     */
    private static $redis = null;
    
    /**
     * Initialize Redis connection
     *
     * @return void
     */
    private static function initRedis() {
        if (self::$redis === null) {
            try {
                self::$redis = new Redis();
                self::$redis->connect(
                    getenv('REDIS_HOST') ?: '127.0.0.1', 
                    getenv('REDIS_PORT') ?: 6379
                );
                
                if (getenv('REDIS_PASSWORD')) {
                    self::$redis->auth(getenv('REDIS_PASSWORD'));
                }
            } catch (Exception $e) {
                error_log('Redis connection error: ' . $e->getMessage());
                self::$redis = null;
            }
        }
    }
    
    /**
     * Check if request exceeds rate limit
     *
     * @param string $key Unique key for the rate limit (e.g., IP, user ID, etc.)
     * @param int $limit Maximum number of requests allowed
     * @param int $window Time window in seconds
     * @return array Status of rate limit check
     */
    public static function check($key, $limit = null, $window = null) {
        // Use default settings if not provided
        $limit = $limit ?: (defined('API_RATE_LIMIT') ? API_RATE_LIMIT : 100);
        $window = $window ?: (defined('API_RATE_WINDOW') ? API_RATE_WINDOW : 60);
        
        $timestamp = time();
        $count = 1;
        $remaining = $limit - 1;
        $reset = $timestamp + $window;
        $retryAfter = 0;
        
        // Try to use Redis for rate limiting if available
        if (class_exists('Redis')) {
            self::initRedis();
            
            if (self::$redis) {
                return self::checkWithRedis($key, $limit, $window, $timestamp);
            }
        }
        
        // Fallback to session-based rate limiting if Redis is not available
        return self::checkWithSession($key, $limit, $window, $timestamp);
    }
    
    /**
     * Check rate limit using Redis
     *
     * @param string $key Unique key for the rate limit
     * @param int $limit Maximum number of requests allowed
     * @param int $window Time window in seconds
     * @param int $timestamp Current timestamp
     * @return array Status of rate limit check
     */
    private static function checkWithRedis($key, $limit, $window, $timestamp) {
        $redisKey = "ratelimit:$key";
        
        // Use Redis sorted set to track requests
        self::$redis->zRemRangeByScore($redisKey, 0, $timestamp - $window);
        
        // Count existing requests in the window
        $count = self::$redis->zCard($redisKey);
        
        // Check if limit exceeded
        if ($count >= $limit) {
            // Get the oldest request time to calculate retry after
            $oldest = self::$redis->zRange($redisKey, 0, 0, true);
            $oldestTime = empty($oldest) ? $timestamp : array_key_first($oldest);
            $retryAfter = $oldestTime + $window - $timestamp;
            
            return [
                'limited' => true,
                'limit' => $limit,
                'remaining' => 0,
                'reset' => $oldestTime + $window,
                'retry_after' => max(1, $retryAfter)
            ];
        }
        
        // Add current request to the sorted set
        self::$redis->zAdd($redisKey, $timestamp, $timestamp . '-' . uniqid());
        
        // Set expiration on the key for cleanup
        self::$redis->expire($redisKey, $window);
        
        // Calculate remaining requests
        $remaining = $limit - ($count + 1);
        
        return [
            'limited' => false,
            'limit' => $limit,
            'remaining' => $remaining,
            'reset' => $timestamp + $window,
            'retry_after' => 0
        ];
    }
    
    /**
     * Check rate limit using session (fallback method)
     *
     * @param string $key Unique key for the rate limit
     * @param int $limit Maximum number of requests allowed
     * @param int $window Time window in seconds
     * @param int $timestamp Current timestamp
     * @return array Status of rate limit check
     */
    private static function checkWithSession($key, $limit, $window, $timestamp) {
        // Ensure session is started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $sessionKey = "ratelimit_$key";
        
        if (!isset($_SESSION[$sessionKey])) {
            $_SESSION[$sessionKey] = [];
        }
        
        // Remove expired timestamps
        $_SESSION[$sessionKey] = array_filter($_SESSION[$sessionKey], function($time) use ($timestamp, $window) {
            return $time >= ($timestamp - $window);
        });
        
        // Count existing requests
        $count = count($_SESSION[$sessionKey]);
        
        // Check if limit exceeded
        if ($count >= $limit) {
            // Calculate retry after based on oldest request
            $oldestTime = empty($_SESSION[$sessionKey]) ? $timestamp : min($_SESSION[$sessionKey]);
            $retryAfter = $oldestTime + $window - $timestamp;
            
            return [
                'limited' => true,
                'limit' => $limit,
                'remaining' => 0,
                'reset' => $oldestTime + $window,
                'retry_after' => max(1, $retryAfter)
            ];
        }
        
        // Add current request
        $_SESSION[$sessionKey][] = $timestamp;
        
        // Calculate remaining requests
        $remaining = $limit - ($count + 1);
        
        return [
            'limited' => false,
            'limit' => $limit,
            'remaining' => $remaining,
            'reset' => $timestamp + $window,
            'retry_after' => 0
        ];
    }
    
    /**
     * Apply rate limit headers to the response
     *
     * @param array $rateLimitData Rate limit status data
     * @return void
     */
    public static function applyHeaders($rateLimitData) {
        header('X-RateLimit-Limit: ' . $rateLimitData['limit']);
        header('X-RateLimit-Remaining: ' . $rateLimitData['remaining']);
        header('X-RateLimit-Reset: ' . $rateLimitData['reset']);
        
        if ($rateLimitData['limited']) {
            header('Retry-After: ' . $rateLimitData['retry_after']);
            header('HTTP/1.1 429 Too Many Requests');
        }
    }
} 