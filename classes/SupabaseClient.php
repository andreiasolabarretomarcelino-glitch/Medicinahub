<?php
/**
 * Minimal Supabase client for server-side requests
 */
class SupabaseClient {
    private string $url;
    private string $serviceKey;

    public function __construct(string $url, string $serviceKey) {
        $this->url = rtrim($url, '/');
        $this->serviceKey = $serviceKey;
    }

    public static function createFromEnv(): self {
        $url = getenv('SUPABASE_URL');
        $key = getenv('SUPABASE_SERVICE_KEY');
        if (empty($url) || empty($key)) {
            throw new Exception('Supabase environment variables not set');
        }
        return new self($url, $key);
    }

    /** Verify an access token with Supabase auth */
    public function verifyToken(string $token) {
        $ch = curl_init("{$this->url}/auth/v1/user");
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
                'apikey: ' . $this->serviceKey
            ],
            CURLOPT_RETURNTRANSFER => true
        ]);
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($status === 200) {
            return json_decode($response, true);
        }
        return false;
    }

    /** Internal request helper for REST API */
    private function request(string $method, string $path, ?array $body = null): array {
        $ch = curl_init("{$this->url}/rest/v1/{$path}");
        $headers = [
            'apikey: ' . $this->serviceKey,
            'Authorization: Bearer ' . $this->serviceKey,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ];
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return [$status, json_decode($response, true)];
    }

    public function fetch(string $table, array $query = []): array {
        $params = http_build_query($query);
        $path = $table . ($params ? '?' . $params : '');
        return $this->request('GET', $path);
    }

    public function insert(string $table, array $data): array {
        return $this->request('POST', $table, $data);
    }

    public function update(string $table, string $id, array $data): array {
        $path = $table . '?id=eq.' . urlencode($id);
        return $this->request('PATCH', $path, $data);
    }
}
