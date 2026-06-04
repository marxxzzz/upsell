<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/helpers.php';

$reference = trim((string) ($_GET['reference'] ?? ''));
$nonce = trim((string) ($_GET['nonce'] ?? ''));

if ($reference === '' || $nonce === '') {
    json_response(['success' => false, 'error' => 'Parametros invalidos'], 422);
}

$charges = load_json_file('charges.json');
$charge = $charges[$reference] ?? null;

if (!$is_array($charge) || ($charge['status_nonce'] ?? '') !== $nonce) {
    json_response(['success' => false, 'error' => 'Cobranca nao encontrada'], 404);
}

$paid = !empty($charge['paid']) || time() >= (int) ($charge['paid_after'] ?? 0);
if ($paid && empty($charge['paid'])) {
    $charge['paid'] = true;
    $charges[$reference] = $charge;
    save_json_file('charges.json', $charges);
}

json_response([
    'success' => true,
    'data' => [
        'paid' => $paid,
        'thankYouUrl' => 'checkout.php?paid=1',
    ],
]);
