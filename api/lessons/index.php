<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../utils/error-handler.php';
require_once __DIR__ . '/../utils/rate-limiter.php';

header('Content-Type: application/json');

if (ENVIRONMENT === 'development') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    $clientIP = $_SERVER['REMOTE_ADDR'];
    $rateLimitKey = 'api:' . $clientIP;
    $rateLimit = RateLimiter::check($rateLimitKey);
    RateLimiter::applyHeaders($rateLimit);
    if ($rateLimit['limited']) {
        include __DIR__ . '/../../error-pages/429.php';
        exit;
    }

    $data = [];
    if ($method === 'GET') {
        $data = $_GET;
    } elseif (in_array($method, ['POST', 'PUT'])) {
        $jsonInput = file_get_contents('php://input');
        if (!empty($jsonInput)) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                ErrorHandler::handleError(400, 'Invalid JSON payload', [
                    'error' => json_last_error_msg()
                ]);
            }
        }
    }

    $data = Security::sanitizeInput($data);

    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    if (empty($token)) {
        ErrorHandler::handleAuthError('Authentication token is required');
    }

    $supabase = SupabaseClient::createFromEnv();
    $user = $supabase->verifyToken($token);
    if (!$user) {
        ErrorHandler::handleAuthError('Invalid or expired token');
    }

    switch ($method) {
        case 'GET':
            [$status, $payload] = $supabase->fetch('lessons');
            http_response_code($status);
            $response = [
                'status' => $status === 200,
                'data' => $payload
            ];
            break;

        case 'POST':
            $required = ['title'];
            $errors = [];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    $errors[$field] = 'This field is required';
                }
            }
            if (!empty($errors)) {
                ErrorHandler::handleValidationError($errors);
            }
            [$status, $payload] = $supabase->insert('lessons', [$data]);
            http_response_code($status);
            $response = [
                'status' => in_array($status, [200, 201]),
                'data' => $payload
            ];
            break;

        case 'PUT':
            if (empty($data['id'])) {
                ErrorHandler::handleValidationError(['id' => 'ID is required for updates']);
            }
            $id = $data['id'];
            unset($data['id']);
            [$status, $payload] = $supabase->update('lessons', $id, $data);
            http_response_code($status);
            $response = [
                'status' => $status === 200,
                'data' => $payload
            ];
            break;

        default:
            ErrorHandler::handleError(405, 'Method Not Allowed');
    }

    echo json_encode($response);
} catch (PDOException $e) {
    ErrorHandler::handleDbError($e);
} catch (Exception $e) {
    ErrorHandler::handleError(500, 'Internal Server Error', [
        'message' => ENVIRONMENT === 'development' ? $e->getMessage() : null
    ]);
}
