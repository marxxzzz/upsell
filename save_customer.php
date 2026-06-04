<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/helpers.php';

$config = app_config();
$body = read_json_body();

if (($body['nonce'] ?? '') !== $config['customer_flow_nonce']) {
    json_response(['success' => false, 'error' => 'Nonce invalido'], 403);
}

$cpf = normalize_cpf((string) ($body['cpf'] ?? ''));
$nome = sanitize_name((string) ($body['nome'] ?? ''));

if (!is_valid_cpf($cpf) || strlen($nome) < 3) {
    json_response(['success' => false, 'error' => 'Payload invalido'], 422);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$tracking = capture_tracking_params();
if (empty($tracking) && !empty($_SESSION['tracking'])) {
    $tracking = $_SESSION['tracking'];
} elseif (!empty($tracking)) {
    $_SESSION['tracking'] = $tracking;
}

save_customer_to_session([
    'cpf' => $cpf,
    'nome' => $nome,
    'name' => $nome,
    'email' => trim((string) ($body['email'] ?? '')),
    'telefone' => preg_replace('/\D/', '', (string) ($body['telefone'] ?? '')),
]);

json_response(['success' => true]);
