window.addEventListener("load", () => {
  const splash = document.getElementById("splash");

  // Pega a cor salva no localStorage (ex: "bg-blue-600")
  const corSalva = localStorage.getItem('BackgroundColor');

  if (corSalva) {
    // Remove cor padrão do splash (exemplo: bg-[rgb(37,99,235)])
    splash.classList.remove('bg-[rgb(37,99,235)]');

    // Remove outras classes bg- (caso tenha)
    splash.classList.forEach(cls => {
      if (cls.startsWith("bg-")) splash.classList.remove(cls);
    });

    // Adiciona a classe da cor (opacidade 100%)
    splash.classList.add(corSalva);
  }

  // Fade out depois de 3 segundos
  setTimeout(() => {
    splash.style.transition = "opacity 700ms ease";
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.style.display = "none";
    }, 700);
  }, 3000);
});


window.addEventListener("DOMContentLoaded", () => {
  const btnConfig = document.getElementById('btn-config');
  const modal = document.getElementById('modal-config');
  const btnClose = document.getElementById('btn-close');
  const btnSalvar = document.getElementById('btn-salvar-unidade');
  const inputUnidade = document.getElementById('input-unidade');
  const nomeUnidade = document.getElementById('nome-unidade');

  btnConfig.addEventListener('click', () => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    inputUnidade.value = localStorage.getItem('nomeUnidade') || '';
    inputUnidade.focus();
  });

  btnClose.addEventListener('click', () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
  });

  btnSalvar.addEventListener('click', () => {
    const nome = inputUnidade.value.trim();
    if (nome) {
      localStorage.setItem('nomeUnidade', nome);
      nomeUnidade.textContent = nome;
      modal.classList.add('opacity-0', 'pointer-events-none');

      // Atualiza a cor do botão salvar imediatamente
      const corSalva = localStorage.getItem('BackgroundColor');
      atualizarCorBotaoSalvar(corSalva);
    } else {
      alert("Por favor, insira o nome da unidade.");
      inputUnidade.focus();
    }
  });

  function verificarNomeUnidade() {
    const nomeSalvo = localStorage.getItem('nomeUnidade');
    if (!nomeSalvo || nomeSalvo.trim() === '') {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      inputUnidade.value = '';
      inputUnidade.focus();
    } else {
      nomeUnidade.textContent = nomeSalvo;
    }
  }

  verificarNomeUnidade();

  // Mapa das cores com opacidade 60% para modal
  const coresRGBA = {
    "bg-red-500": "rgba(239, 68, 68, 0.6)",
    "bg-green-500": "rgba(34, 197, 94, 0.6)",
    "bg-blue-500": "rgba(59, 130, 246, 0.6)",
    "bg-yellow-500": "rgba(234, 179, 8, 0.6)",
    "bg-purple-500": "rgba(139, 92, 246, 0.6)",
    "bg-pink-500": "rgba(236, 72, 153, 0.6)",
    "bg-orange-500": "rgba(249, 115, 22, 0.6)",
    "bg-black": "rgba(0, 0, 0, 0.6)"
  };

  // Função que altera cor do fundo do body (100%) e modal (60%)
  function setBgColor(corClasse) {
    const body = document.body;

    // Remove classes bg- do body
    body.classList.forEach((cls) => {
      if (cls.startsWith("bg-")) body.classList.remove(cls);
    });

    // Remove classes bg- do modal e limpa style backgroundColor
    modal.classList.forEach((cls) => {
      if (cls.startsWith("bg-")) modal.classList.remove(cls);
    });
    modal.style.backgroundColor = ''; // reseta estilo inline

    // Aplica cor ao body via classe (opacidade 100%)
    body.classList.add(corClasse);

    // Aplica cor ao modal via style inline (opacidade 60%)
    if (coresRGBA[corClasse]) {
      modal.style.backgroundColor = coresRGBA[corClasse];
    } else {
      modal.style.backgroundColor = "rgba(0,0,0,0.6)"; // fallback
    }

    // Aplica a cor no span #data (usa Tailwind text color, inferido da cor de fundo)
    const spanData = document.getElementById("data");
    if(spanData){
      // Remove qualquer classe de texto existente com prefixo text-
      spanData.classList.forEach(cls => {
        if(cls.startsWith("text-")) spanData.classList.remove(cls);
      });

      // Mapeamento para cor de texto correspondente
      const coresTexto = {
        "bg-red-500": "text-red-600",
        "bg-green-500": "text-green-600",
        "bg-blue-500": "text-blue-600",
        "bg-yellow-500": "text-yellow-600",
        "bg-purple-500": "text-purple-600",
        "bg-pink-500": "text-pink-600",
        "bg-orange-500": "text-orange-600",
        "bg-black": "text-gray-300" // no preto usa um cinza claro
      };

      const corTexto = coresTexto[corClasse] || "text-blue-600";
      spanData.classList.add(corTexto);
    }

    // Atualiza cor do botão salvar
    atualizarCorBotaoSalvar(corClasse);

    // Salva no localStorage
    localStorage.setItem('BackgroundColor', corClasse);
  }
  window.setBgColor = setBgColor;

  // Função para atualizar cor do botão salvar conforme cor da classe (ex: 'bg-blue-600')
  function atualizarCorBotaoSalvar(corClasse) {
    if (!corClasse) return;
    const btnSalvar = document.getElementById('btn-salvar-unidade');
    if (!btnSalvar) return;

    // Remove classes bg- e hover:bg- do botão
    btnSalvar.classList.forEach(cls => {
      if (cls.startsWith('bg-') || cls.startsWith('hover:bg-')) {
        btnSalvar.classList.remove(cls);
      }
    });

    // Adiciona a nova cor bg- e hover:bg- para o botão
    btnSalvar.classList.add(corClasse);

    // Para hover, substitua o número 600 por 700 no nome da classe para hover
    const hoverClasse = corClasse.replace(/-600$/, '-700');
    btnSalvar.classList.add(`hover:${hoverClasse}`);
  }

  // Aplica cor salva no load: body, modal e botão salvar
  const corSalva = localStorage.getItem('BackgroundColor');
  if (corSalva) {
    document.body.classList.add(corSalva);
    if (coresRGBA[corSalva]) {
      modal.style.backgroundColor = coresRGBA[corSalva];
    }

    // Aplica cor no span #data também na inicialização
    const spanData = document.getElementById("data");
    if(spanData){
      const coresTexto = {
        "bg-red-500": "text-red-600",
        "bg-green-500": "text-green-600",
        "bg-blue-500": "text-blue-600",
        "bg-yellow-500": "text-yellow-600",
        "bg-purple-500": "text-purple-600",
        "bg-pink-500": "text-pink-600",
        "bg-orange-500": "text-orange-600",
        "bg-black": "text-gray-300"
      };
      // Remove classes text- antigas
      spanData.classList.forEach(cls => {
        if(cls.startsWith("text-")) spanData.classList.remove(cls);
      });
      const corTexto = coresTexto[corSalva] || "text-blue-600";
      spanData.classList.add(corTexto);
    }

    // Atualiza cor do botão salvar no load
    atualizarCorBotaoSalvar(corSalva);
  }

  // restante do seu código permanece igual...

  window.toggleChangelog = function () {
    const changelogModal = document.getElementById('changelogModal');
    const isHidden = changelogModal.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden', !isHidden);
  };

  function formatarDataHoje() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
  document.getElementById("data").textContent = formatarDataHoje();

  window.zerar = function () {
    document.querySelectorAll("input[type='number']").forEach((input) => input.value = 0);
    document.getElementById("suporte").value = "";
    localStorage.removeItem("dados");
  };

  window.copiar = function () {
    const data = document.getElementById("data").textContent;
    const nomeUnidadeSalvo = localStorage.getItem('nomeUnidade') || '';
    let texto = `Atendimentos realizados na unidade ${nomeUnidadeSalvo} - ${data}\n\n`;

    const items = Array.from(document.querySelectorAll("#formulario > .grid > div"));
    for (let item of items) {
      const label = item.querySelector("label").textContent.trim().replace(":", "");
      const input = item.querySelector("input[type='number']");
      if (!input) continue;
      texto += `${label}: ${input.value.toString().padStart(2, "0")}\n`;

      if (label === "Cobrança de inadimplentes") {
        const suporteTexto = document.getElementById("suporte").value.trim();
        if (suporteTexto) {
          texto += "Suporte:\n" + suporteTexto.split("\n").map((l) => " " + l).join("\n") + "\n";
        }
      }
    }

    const limpeza = document.querySelector("input[name='limpeza']:checked").value;
    texto += `\nLimpeza da Loja\nSim (${limpeza === "Sim" ? "x" : " "}) Não (${limpeza === "Não" ? "x" : " "})`;

    const area = document.getElementById("resultado");
    if (area) {
      area.value = texto;
      area.select();
      document.execCommand("copy");
    } else {
      navigator.clipboard.writeText(texto).catch(() => alert("Erro ao copiar para área de transferência"));
    }

    showToast();

    baixarArquivo(texto, `Atendimentos realizados na unidade ${nomeUnidadeSalvo} ${new Date().toLocaleDateString('pt-BR').replace(/\//g, '_')}.txt`);
  };

  function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");
    toast.style.animation = "fadeInOut 3s forwards";

    setTimeout(() => {
      toast.classList.add("opacity-0", "pointer-events-none");
      toast.classList.remove("opacity-100");
      toast.style.animation = "";
    }, 3000);
  }

  function baixarArquivo(texto, nomeArquivo) {
    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  function salvarDados() {
    const dados = {};
    document.querySelectorAll("#formulario input[type='number']").forEach((input) => {
      const label = input.previousElementSibling.textContent.trim().replace(":", "");
      dados[label] = input.value;
    });
    dados["Suporte"] = document.getElementById("suporte").value;
    dados["Limpeza"] = document.querySelector("input[name='limpeza']:checked").value;
    localStorage.setItem("dados", JSON.stringify(dados));
  }

  function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dados"));
    if (!dados) return;

    document.querySelectorAll("#formulario input[type='number']").forEach((input) => {
      const label = input.previousElementSibling.textContent.trim().replace(":", "");
      if (dados[label] !== undefined) {
        input.value = dados[label];
      }
    });

    if (dados["Suporte"] !== undefined) {
      document.getElementById("suporte").value = dados["Suporte"];
    }

    if (dados["Limpeza"] !== undefined) {
      const limpeza = dados["Limpeza"];
      document.querySelectorAll('input[name="limpeza"]').forEach((radio) => {
        radio.checked = radio.value === limpeza;
      });
    }
  }

  document.querySelectorAll('#formulario input[type="number"], #suporte, input[name="limpeza"]').forEach((el) => {
    el.addEventListener("input", salvarDados);
    el.addEventListener("change", salvarDados);
  });

  carregarDados();
});

const API_KEY = '9b3cee4a1a7d463c8eb131925251707';

  function atualizarHora() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    document.getElementById('hora').textContent = `${horas}:${minutos}`;
  }

  setInterval(atualizarHora, 1000); // continua a cada segundo, mas só mostra HH:MM
  atualizarHora();

  function buscarClimaUsuario() {
    if (!navigator.geolocation) {
      document.getElementById('local-clima').textContent = 'Geolocalização não suportada';
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=pt`)
        .then(res => res.json())
        .then(data => {
          if (data?.location && data?.current) {
            const local = data.location.name;
            const temp = Math.round(data.current.temp_c);
            document.getElementById('local-clima').textContent = `${local} | ${temp}°C`;
          } else {
            document.getElementById('local-clima').textContent = 'Erro no clima';
          }
        })
        .catch(() => {
          document.getElementById('local-clima').textContent = 'Erro ao carregar clima';
        });
    }, () => {
      document.getElementById('local-clima').textContent = 'Permissão negada';
    });
  }

  buscarClimaUsuario();
  setInterval(buscarClimaUsuario, 60000); // atualiza clima a cada 10 minutos
