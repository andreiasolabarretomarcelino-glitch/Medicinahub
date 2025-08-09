<?php
/**
 * Secure API Endpoint Template
 * 
 * Use this template as a starting point for creating secure API endpoints
 */

// Include necessary files
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../utils/error-handler.php';
require_once __DIR__ . '/../utils/rate-limiter.php';
require_once __DIR__ . '/../../classes/Security.php';

// Set content type to JSON
header('Content-Type: application/json');

// Allow CORS for development
if (ENVIRONMENT === 'development') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

try {
    // Check request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Apply rate limiting
    $clientIP = $_SERVER['REMOTE_ADDR'];
    $rateLimitKey = 'api:' . $clientIP;
    $rateLimit = RateLimiter::check($rateLimitKey);
    RateLimiter::applyHeaders($rateLimit);
    
    // If rate limit exceeded, exit
    if ($rateLimit['limited']) {
        include __DIR__ . '/../../error-pages/429.php';
        exit;
    }
    
    // Parse request data
    $data = [];
    
    if ($method === 'GET') {
        $data = $_GET;
    } elseif (in_array($method, ['POST', 'PUT', 'DELETE'])) {
        // Get JSON input
        $jsonInput = file_get_contents('php://input');
        
        if (!empty($jsonInput)) {
            $data = json_decode($jsonInput, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                ErrorHandler::handleError(400, 'Invalid JSON payload', [
                    'error' => json_last_error_msg()
                ]);
            }
        } else {
            // Fallback to form data
            $data = $_POST;
        }
    }
    
    // Sanitize all input data to prevent XSS
    $data = Security::sanitizeInput($data);
    
    // Check for required authentication
    $requireAuth = true; // Set to true if endpoint requires authentication
    
    if ($requireAuth) {
        // Get authentication token from header
        $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
        $token = '';
        
        // Extract token from Bearer authentication
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
        
        // Validate token (implement your own token validation logic)
        if (empty($token)) {
            ErrorHandler::handleAuthError('Authentication token is required');
        }

        // Verify token via Supabase and get user details
        $sb = new SupabaseClient();
        [$status, $userResponse] = $sb->getUser($token);
        if ($status >= 400) {
            ErrorHandler::handleAuthError('Invalid or expired token');
        }
        $user = json_decode($userResponse, true);
    }
    
    // Handle different HTTP methods
    switch ($method) {
        case 'GET':
            // Handle GET request (retrieve data)
            $response = [
                'status' => true,
                'message' => 'Data retrieved successfully',
                'data' => []
            ];
            
            // TODO: Implement your GET logic here
            break;
            
        case 'POST':
            // Handle POST request (create data)
            
            // Validate required fields
            $requiredFields = ['field1', 'field2']; // Specify your required fields
            $errors = [];
            
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $errors[$field] = 'This field is required';
                }
            }
            
            if (!empty($errors)) {
                ErrorHandler::handleValidationError($errors);
            }
            
            // TODO: Implement your POST logic here
            
            $response = [
                'status' => true,
                'message' => 'Data created successfully',
                'data' => []
            ];
            break;
            
        case 'PUT':
            // Handle PUT request (update data)
            
            // Validate ID parameter
            if (!isset($data['id']) || empty($data['id'])) {
                ErrorHandler::handleValidationError(['id' => 'ID is required for updates']);
            }
            
            // TODO: Implement your PUT logic here
            
            $response = [
                'status' => true,
                'message' => 'Data updated successfully',
                'data' => []
            ];
            break;
            
        case 'DELETE':
            // Handle DELETE request (delete data)
            
            // Validate ID parameter
            if (!isset($data['id']) || empty($data['id'])) {
                ErrorHandler::handleValidationError(['id' => 'ID is required for deletion']);
            }
            
            // TODO: Implement your DELETE logic here
            
            $response = [
                'status' => true,
                'message' => 'Data deleted successfully'
            ];
            break;
            
        default:
            // Method not allowed
            ErrorHandler::handleError(405, 'Method Not Allowed');
            break;
    }
    
    // Output response
    echo json_encode($response);
    
} catch (PDOException $e) {
    // Handle database errors
    ErrorHandler::handleDbError($e);
} catch (Exception $e) {
    // Handle general errors
    ErrorHandler::handleError(500, 'Internal Server Error', [
        'message' => ENVIRONMENT === 'development' ? $e->getMessage() : null
    ]);
} 