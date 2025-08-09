<?php
/**
 * Error Handler Utility
 * 
 * Provides standardized error handling for API endpoints
 */

class ErrorHandler {
    /**
     * Send a standardized error response
     *
     * @param int $status HTTP status code
     * @param string $message Error message
     * @param array $details Additional error details
     * @param string $code Internal error code
     * @return void
     */
    public static function handleError($status = 500, $message = 'Internal Server Error', $details = [], $code = '') {
        http_response_code($status);
        
        $response = [
            'status' => false,
            'error' => [
                'code' => $code ?: "ERR-{$status}",
                'message' => $message
            ]
        ];
        
        if (!empty($details)) {
            $response['error']['details'] = $details;
        }
        
        // Log the error
        self::logError($status, $message, $details, $code);
        
        // Output JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
    /**
     * Log error to file
     *
     * @param int $status HTTP status code
     * @param string $message Error message
     * @param array $details Additional error details
     * @param string $code Internal error code
     * @return void
     */
    private static function logError($status, $message, $details, $code) {
        $logDir = __DIR__ . '/../../logs';
        
        // Create logs directory if it doesn't exist
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . '/api_errors.log';
        $timestamp = date('Y-m-d H:i:s');
        $requestInfo = $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'];
        $userIP = $_SERVER['REMOTE_ADDR'];
        
        // Format the log entry
        $logEntry = "[{$timestamp}] [{$status}] [{$code}] [{$userIP}] [{$requestInfo}] {$message}";
        
        if (!empty($details)) {
            $logEntry .= "\nDetails: " . json_encode($details);
        }
        
        // Add user details if available
        if (isset($_SESSION['user_id'])) {
            $logEntry .= "\nUser ID: " . $_SESSION['user_id'];
        }
        
        $logEntry .= "\n" . str_repeat('-', 80) . "\n";
        
        // Write to log file
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
    
    /**
     * Handle database errors
     *
     * @param PDOException $e PDO Exception
     * @param string $operation Description of what operation was being performed
     * @return void
     */
    public static function handleDbError($e, $operation = 'database operation') {
        $message = "An error occurred during {$operation}";
        $details = [];
        
        // Only include error details in development environment
        if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
            $details = [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }
        
        self::handleError(500, $message, $details, 'DB-ERROR');
    }
    
    /**
     * Handle validation errors
     *
     * @param array $errors List of validation errors
     * @return void
     */
    public static function handleValidationError($errors) {
        self::handleError(400, 'Validation failed', $errors, 'VALIDATION-ERROR');
    }
    
    /**
     * Handle authorization errors
     *
     * @param string $message Authorization error message
     * @return void
     */
    public static function handleAuthError($message = 'Unauthorized access') {
        self::handleError(401, $message, [], 'AUTH-ERROR');
    }
    
    /**
     * Handle not found errors
     *
     * @param string $message Not found error message
     * @param string $resource Resource type that wasn't found
     * @return void
     */
    public static function handleNotFoundError($message = 'Resource not found', $resource = '') {
        $details = !empty($resource) ? ['resource' => $resource] : [];
        self::handleError(404, $message, $details, 'NOT-FOUND');
    }
} 