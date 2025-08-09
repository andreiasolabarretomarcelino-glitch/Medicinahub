<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/config.php';

// Allow CORS during development
if (ENVIRONMENT === 'development') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get the request data
$data = json_decode(file_get_contents('php://input'), true);

// Check if token exists
if (!isset($data['token']) || empty($data['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token is required']);
    exit;
}

$id_token = $data['token'];

$db = new SupabaseClient();
[$status, $response] = $db->authWithIdToken($id_token, 'google');

if ($status >= 400) {
    http_response_code($status);
    $body = json_decode($response, true);
    $message = $body['error_description'] ?? $body['error'] ?? 'Authentication failed';
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

$session = json_decode($response, true);

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'token' => $session['access_token'],
    'user' => $session['user'] ?? null
]);
