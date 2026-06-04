<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/helpers.php';

$config = app_config();
$cpf = normalize_cpf((string) ($_GET['cpf'] ?? ''));
$nonce = (string) ($_GET['nonce'] ?? '');

if ($nonce !== $config['cpf_lookup_nonce'] && $nonce !== $config['checkout_cpf_nonce']) {
    json_response(['found' => false, 'error' => 'Nonce invalido'], 403);
}

if (!is_valid_cpf($cpf)) {
    json_response(['found' => false, 'error' => 'CPF invalido']);
}

$name = lookup_cpf_name($cpf);
if ($name) {
    json_response([
        'found' => true,
        'data' => ['NOME' => $name],
    ]);
}

json_response([
    'found' => false,
    'error' => 'Nao foi possivel consultar este CPF agora',
]);
