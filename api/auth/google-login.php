<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../utils/jwt_utils.php';

/**
 * Google OAuth Login Endpoint
 * This endpoint receives a Google ID token, verifies it, and either creates a new user
 * or logs in an existing user based on the email address from Google.
 */

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

// Verify the Google ID token
// Note: In production you should validate this token with Google's API
try {
    // Get the payload from Google ID token
    // This is a simplified version - in production you should use Google's API Client or similar
    $client_id = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google client ID
    $payload = verifyGoogleToken($id_token, $client_id);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid Google token']);
        exit;
    }
    
    // Extract user info from payload
    $google_id = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'] ?? '';
    $email_verified = $payload['email_verified'] ?? false;
    
    // Check if email is verified by Google
    if (!$email_verified) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email not verified by Google']);
        exit;
    }
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if user already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR google_id = ?");
    $stmt->bind_param("ss", $email, $google_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User exists, update Google ID if needed and log them in
        $user = $result->fetch_assoc();
        
        // Update Google ID if it's not set
        if (empty($user['google_id'])) {
            $updateStmt = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ?");
            $updateStmt->bind_param("si", $google_id, $user['id']);
            $updateStmt->execute();
            $updateStmt->close();
        }
        
        // Make sure email is verified
        if (!$user['email_verified']) {
            $verifyStmt = $conn->prepare("UPDATE users SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP WHERE id = ?");
            $verifyStmt->bind_param("i", $user['id']);
            $verifyStmt->execute();
            $verifyStmt->close();
            
            // Update user data
            $user['email_verified'] = 1;
            $user['email_verified_at'] = date('Y-m-d H:i:s');
        }
    } else {
        // Create new user
        $password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT); // Random secure password
        
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, google_id, email_verified, email_verified_at, created_at) 
                               VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
        $stmt->bind_param("ssss", $name, $email, $password, $google_id);
        $stmt->execute();
        
        if ($stmt->affected_rows === 0) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create user']);
            exit;
        }
        
        $userId = $stmt->insert_id;
        $stmt->close();
        
        // Create default user settings
        $settingsStmt = $conn->prepare("INSERT INTO user_settings (user_id) VALUES (?)");
        $settingsStmt->bind_param("i", $userId);
        $settingsStmt->execute();
        $settingsStmt->close();
        
        // Get the new user
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    }
    
    // Clean up user data to return
    unset($user['password']);
    
    // Add role information for frontend
    $user['role'] = $user['is_admin'] ? 'admin' : 'user';
    
    // Generate JWT token
    $token = generateJWT($user);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

/**
 * Verify Google ID token
 * In production, you should use Google's API Client
 * This is a simplified version for illustration
 */
function verifyGoogleToken($id_token, $client_id) {
    // In a real implementation, you would use Google's API client library
    // Example with cURL:
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($id_token);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    if (!$response) {
        return false;
    }
    
    $payload = json_decode($response, true);
    
    // Verify aud (audience) matches your client ID
    if (!isset($payload['aud']) || $payload['aud'] !== $client_id) {
        return false;
    }
    
    // Verify the token is not expired
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
} 