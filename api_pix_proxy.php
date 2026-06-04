<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/helpers.php';

$config = app_config();
$body = read_json_body();

$name = sanitize_name((string) ($body['name'] ?? ''));
$document = normalize_cpf((string) ($body['document'] ?? ''));
$email = trim((string) ($body['email'] ?? ''));
$telephone = preg_replace('/\D/', '', (string) ($body['telephone'] ?? ''));

if (!is_valid_cpf($document) || strlen($name) < 3 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($telephone) < 10) {
    json_response(['success' => false, 'error' => 'Payload invalido'], 422);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

save_customer_to_session([
    'cpf' => $document,
    'nome' => $name,
    'name' => $name,
    'email' => $email,
    'telefone' => $telephone,
]);

$amount = (float) $config['amount'];
$chargeId = 'chg_' . bin2hex(random_bytes(8));
$statusNonce = bin2hex(random_bytes(16));
$brCode = generate_demo_br_code($amount, $chargeId);
$qrDataUri = generate_qr_data_uri($brCode);

$charges = load_json_file('charges.json');
$charges[$chargeId] = [
    'id' => $chargeId,
    'status_nonce' => $statusNonce,
    'document' => $document,
    'name' => $name,
    'email' => $email,
    'telephone' => $telephone,
    'amount' => $amount,
    'br_code' => $brCode,
    'paid' => false,
    'created_at' => time(),
    'paid_after' => time() + (int) $config['demo_pix_paid_after_seconds'],
];
save_json_file('charges.json', $charges);

json_response([
    'success' => true,
    'data' => [
        'id' => $chargeId,
        'status_nonce' => $statusNonce,
        'brCode' => $brCode,
        'pix' => [
            'qr_code' => [
                'data_uri' => $qrDataUri,
            ],
        ],
    ],
]);
