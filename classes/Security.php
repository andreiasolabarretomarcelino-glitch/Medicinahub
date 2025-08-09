<?php
/**
 * Security Helper Class
 * 
 * Provides security-related utilities for the application
 */

class Security {
    /**
     * Generate a CSRF token and store it in the session
     *
     * @param string $key Optional key to use for different forms
     * @return string CSRF token
     */
    public static function generateCsrfToken($key = 'default') {
        if (!isset($_SESSION['csrf_tokens'])) {
            $_SESSION['csrf_tokens'] = [];
        }
        
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_tokens'][$key] = [
            'token' => $token,
            'time' => time()
        ];
        
        return $token;
    }
    
    /**
     * Verify a CSRF token against the one stored in session
     *
     * @param string $token Token to verify
     * @param string $key Optional key used when generating the token
     * @return bool True if token is valid
     */
    public static function verifyCsrfToken($token, $key = 'default') {
        if (empty($token) || empty($_SESSION['csrf_tokens'][$key])) {
            return false;
        }
        
        $storedToken = $_SESSION['csrf_tokens'][$key];
        
        // Check if token has expired (30 minutes lifetime)
        if (time() - $storedToken['time'] > 1800) {
            unset($_SESSION['csrf_tokens'][$key]);
            return false;
        }
        
        // Verify token
        if (hash_equals($storedToken['token'], $token)) {
            // Remove used token for one-time use
            unset($_SESSION['csrf_tokens'][$key]);
            return true;
        }
        
        return false;
    }
    
    /**
     * Sanitize input to prevent XSS attacks
     *
     * @param mixed $input Data to sanitize
     * @return mixed Sanitized data
     */
    public static function sanitizeInput($input) {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                $input[$key] = self::sanitizeInput($value);
            }
            return $input;
        }
        
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Sanitize output for safe HTML display
     *
     * @param string $output String to sanitize
     * @return string Sanitized string
     */
    public static function sanitizeOutput($output) {
        return htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Validate and sanitize email address
     *
     * @param string $email Email to validate
     * @return string|bool Sanitized email or false if invalid
     */
    public static function validateEmail($email) {
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : false;
    }
    
    /**
     * Hash a password securely
     *
     * @param string $password Password to hash
     * @return string Hashed password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }
    
    /**
     * Verify a password against a hash
     *
     * @param string $password Password to verify
     * @param string $hash Hash to verify against
     * @return bool True if password matches hash
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * Generate a secure random token
     *
     * @param int $length Length of token
     * @return string Random token
     */
    public static function generateToken($length = 32) {
        return bin2hex(random_bytes($length / 2));
    }
    
    /**
     * Check if the current request is using HTTPS
     *
     * @return bool True if HTTPS is being used
     */
    public static function isSecureConnection() {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
            || $_SERVER['SERVER_PORT'] == 443
            || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');
    }
    
    /**
     * Enforce HTTPS by redirecting if not already on it
     *
     * @return void
     */
    public static function enforceHttps() {
        if (!self::isSecureConnection()) {
            $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            header('HTTP/1.1 301 Moved Permanently');
            header('Location: ' . $redirect);
            exit();
        }
    }
    
    /**
     * Set secure headers for better protection
     *
     * @return void
     */
    public static function setSecurityHeaders() {
        // Prevent clickjacking
        header('X-Frame-Options: DENY');
        
        // Enable XSS protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Disable MIME type sniffing
        header('X-Content-Type-Options: nosniff');
        
        // Enforce HTTPS and prevent downgrade attacks
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        
        // Restrict referrer information
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Set basic CSP (can be expanded as needed)
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;");
    }
} 