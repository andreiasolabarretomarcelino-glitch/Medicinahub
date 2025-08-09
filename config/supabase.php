<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

class SupabaseClient {
    private string $url;
    private string $serviceKey;
    private string $anonKey;

    public function __construct() {
        $this->url = rtrim(getenv('SUPABASE_URL') ?: '', '/');
        $this->serviceKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';
        $this->anonKey = getenv('SUPABASE_ANON_KEY') ?: '';
    }

    public function request(string $path, string $method = 'GET', ?array $body = null, ?string $jwt = null): array {
        $ch = curl_init($this->url . $path);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers = [
            'apikey: ' . ($jwt ? $this->anonKey : $this->serviceKey),
            'Authorization: Bearer ' . ($jwt ?: $this->serviceKey),
            'Content-Type: application/json'
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return [$status, $response];
    }

    public function authWithIdToken(string $idToken, string $provider = 'google'): array {
        return $this->request('/auth/v1/token?grant_type=id_token', 'POST', [
            'id_token' => $idToken,
            'provider' => $provider
        ]);
    }

    public function getUser(string $jwt): array {
        return $this->request('/auth/v1/user', 'GET', null, $jwt);
    }
}
