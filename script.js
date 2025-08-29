

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");

  // Pega a cor salva no localStorage (ex: "bg-blue-600")
  const corSalva = localStorage.getItem('BackgroundColor');

  if (corSalva) {
    splash.classList.remove('bg-[rgb(37,99,235)]');
    splash.classList.forEach(cls => {
      if (cls.startsWith("bg-")) splash.classList.remove(cls);
    });
    splash.classList.add(corSalva);
  }

  setTimeout(() => {
    splash.style.transition = "opacity 700ms ease";
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.style.display = "none";
    }, 700);
  }, 3000);
});

window.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.getElementById('btn-salvar-unidade');
  const inputUnidade = document.getElementById('input-unidade');
  const nomeUnidade = document.getElementById('nome-unidade');
  const spanData = document.getElementById("data");

  const coresRGBA = {
    "bg-red-500": "rgba(239, 68, 68, 0.6)",
    "bg-green-500": "rgba(34, 197, 94, 0.6)",
    "bg-blue-500": "rgba(59, 130, 246, 0.6)",
    "bg-yellow-500": "rgba(234, 179, 8, 0.6)",
    "bg-purple-500": "rgba(139, 92, 246, 0.6)",
    "bg-purple-900": "rgba(88, 28, 135, 0.6)",
    "bg-pink-500": "rgba(236, 72, 153, 0.6)",
    "bg-orange-500": "rgba(249, 115, 22, 0.6)",
    "bg-black": "rgba(0, 0, 0, 0.6)"
  };

  const coresTexto = {
    "bg-red-500": "text-red-600",
    "bg-green-500": "text-green-600",
    "bg-blue-500": "text-blue-600",
    "bg-yellow-500": "text-yellow-600",
    "bg-purple-500": "text-purple-600",
    "bg-purple-900": "text-purple-900",
    "bg-pink-500": "text-pink-600",
    "bg-orange-500": "text-orange-600",
    "bg-black": "text-gray-300"
  };

  function setBgColor(corClasse) {
    // Limpa classes existentes no body e aplica a nova
    document.body.className = '';
    document.body.classList.add(corClasse);

    // Atualiza a cor do texto da data
    if (spanData) {
      // Remove todas classes que começam com 'text-'
      spanData.classList.forEach(cls => {
        if (cls.startsWith('text-')) {
          spanData.classList.remove(cls);
        }
      });

      // Adiciona a classe de cor correspondente
      const corTexto = coresTexto[corClasse] || "text-blue-600";
      spanData.classList.add(corTexto);
    }

    // Salva a cor no localStorage
    localStorage.setItem('BackgroundColor', corClasse);

    // Atualiza o estilo do botão salvar
    atualizarCorBotaoSalvar(corClasse);
  }

  window.setBgColor = setBgColor; // função disponível globalmente

  function atualizarCorBotaoSalvar(corClasse) {
    if (!corClasse || !btnSalvar) return;

    const classesParaRemover = [];
    btnSalvar.classList.forEach(cls => {
      if (cls.startsWith('bg-') || cls.startsWith('hover:bg-')) {
        classesParaRemover.push(cls);
      }
    });
    classesParaRemover.forEach(cls => btnSalvar.classList.remove(cls));

    btnSalvar.classList.add(corClasse);
    const hoverClasse = corClasse.replace(/-500$/, '-600');
    btnSalvar.classList.add(`hover:${hoverClasse}`);
  }

  btnSalvar.addEventListener('click', () => {
    const nome = inputUnidade.value.trim();
    if (!nome) {
      mostrarToast("Por favor, insira o nome da unidade.", "erro"); // substituído alert por toast
      inputUnidade.focus();
      return;
    }

    localStorage.setItem('nomeUnidade', nome);
    if (nomeUnidade) nomeUnidade.textContent = nome;

    mostrarToast("Nome da unidade salvo com sucesso!", "sucesso"); // ✅ CORRIGIDO: agora aparece corretamente
    mostrarAba('aba-atendimentos');
  });

  const nomeSalvo = localStorage.getItem('nomeUnidade');
  if (nomeSalvo && nomeUnidade) {
    nomeUnidade.textContent = nomeSalvo;
    inputUnidade.value = nomeSalvo;
  }

  const corSalva = localStorage.getItem('BackgroundColor');
  if (corSalva) {
    setBgColor(corSalva);
  }

  // ✅ Lógica para aplicar cor salva na aba selecionada
  window.mostrarAba = function (abaId) {
    const abas = ['aba-atendimentos', 'aba-caixa', 'aba-log', 'aba-config'];
    const botoes = ['btn-aba-atendimentos', 'btn-aba-caixa', 'btn-aba-log', 'btn-aba-config'];
    const corSalva = localStorage.getItem('BackgroundColor') || 'bg-blue-500';
    const corTexto = corSalva.replace('bg-', 'text-');
    const corBorda = corSalva.replace('bg-', 'border-');

    // Se nomeUnidade não está salvo, só permite ir para aba-config
    const nomeSalvo = localStorage.getItem('nomeUnidade');
    if (!nomeSalvo && abaId !== 'aba-config') {
      mostrarAba('aba-config');
      mostrarToast("Por favor, insira o nome da unidade antes de continuar.", "erro");
      return;
    }

    // Esconde todas as abas
    abas.forEach(id => {
      const aba = document.getElementById(id);
      if (aba) aba.classList.add('hidden');
    });

    // Reseta a cor de todos os botões para cinza padrão
    botoes.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        const classes = Array.from(btn.classList);
        classes.forEach(cls => {
          if (cls.startsWith('text-') || cls.startsWith('border-')) {
            btn.classList.remove(cls);
          }
        });
        btn.classList.add('text-gray-500', 'border-transparent');
      }
    });

    // Exibe a aba selecionada
    const abaSelecionada = document.getElementById(abaId);
    if (abaSelecionada) abaSelecionada.classList.remove('hidden');

    // Aplica a cor salva no botão selecionado
    const btnSelecionado = document.getElementById('btn-' + abaId);
    if (btnSelecionado) {
      btnSelecionado.classList.remove('text-gray-500', 'border-transparent');
      btnSelecionado.classList.add(corTexto, corBorda);
    }
  };

  // Função toast simples
  function mostrarToast(msg, tipo = 'padrao') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.color = 'white';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.zIndex = '9999';
      toast.style.fontSize = '14px';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
    }

    // Define cor de fundo com base no tipo
    if (tipo === 'erro') {
      toast.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'; // vermelho
    } else if (tipo === 'sucesso') {
      toast.style.backgroundColor = 'rgba(34, 197, 94, 0.9)'; // verde
    } else {
      toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // padrão
    }

    toast.textContent = msg;
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }

  // Exibe aba padrão na primeira carga
  mostrarAba('aba-atendimentos');
});






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
  const dados = JSON.parse(localStorage.getItem("dados")) || {};

  let texto = `Atendimentos realizados na unidade ${nomeUnidadeSalvo} - ${data}\n\n`;

  // Para manter a ordem, você pode definir um array com as chaves na ordem que deseja:
  const ordemCampos = [
    "Faturas recebidas",
    "Adesão",
    "Troca de Titularidade",
    "Suspenssão do contrato",
    "Retorno de suspenssão",
    "Cancelamento",
    "Alteração de plano",
    "Alteração de vencimento",
    "Impressão de boletos",
    "Atendimento cliente retido",
    "Cobrança de inadimplentes",
    "Cancelamento Por Inadimplência",
    "Suporte",
    "Contestação de Fatura",
    "Indique um amigo",
    "Confirmação de Pagamento",
    "Faturar Comodato",
    "Regularização",
    "Liberação por confiança",
    "Cadastro de equipamentos na planilha",
    "Análise equipamento substituído",
    "Envio de código pix",
    "Solicitação Aplicativos Kasatech (App's)",
    "Criação de usuário app kasatech",
    "Taxa mudança de endereço",
    "Outras questões financeiras",
    "Pagamento invertido"
  ];

  for (const campo of ordemCampos) {
    if (campo === "Suporte") continue; // Suporte será tratado separado

    let valor = dados[campo];
    if (valor === undefined || valor === null || valor === "") valor = "00";

    texto += `${campo}: ${valor.toString().padStart(2, "0")}\n`;

    if (campo === "Cobrança de inadimplentes") {
      // Adiciona suporte formatado, se houver
      const suporteTexto = dados["Suporte"] || "";
      if (suporteTexto.trim() !== "") {
        texto += "Suporte:\n" + suporteTexto.split("\n").map(l => " " + l).join("\n") + "\n";
      }
    }
  }

  // Adiciona Limpeza da Loja
  const limpeza = dados["Limpeza"] || "Não";
  texto += `\nLimpeza da Loja\nSim (${limpeza === "Sim" ? "x" : " "}) Não (${limpeza === "Não" ? "x" : " "})`;

  // Copia para área de transferência e textarea resultado (se existir)
  const area = document.getElementById("resultado");
  if (area) {
    area.value = texto;
    area.select();
    document.execCommand("copy");
  } else {
    navigator.clipboard.writeText(texto).catch(() => alert("Erro ao copiar para área de transferência"));
  }

  showToast();

  baixarArquivo(texto, `Atendimentos realizados na unidade ${nomeUnidadeSalvo} ${data.replace(/\//g, '_')}.txt`);
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

 window.addEventListener("load", () => {
  carregarLogs();
  ativarLogsAbaAtendimentos();
  ativarLogsAbaCaixa();
});



const API_KEY = '9b3cee4a1a7d463c8eb131925251707';

let mostrarPonto = true;

function atualizarHora() {
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, '0');
  const minutos = agora.getMinutes().toString().padStart(2, '0');

  const separador = mostrarPonto
    ? ':' // visível
    : '<span style="visibility:hidden">:</span>'; // invisível, mas mesma largura

  document.getElementById('hora').innerHTML = `${horas}${separador}${minutos}`;
  mostrarPonto = !mostrarPonto;
}


setInterval(atualizarHora, 1000);
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
setInterval(buscarClimaUsuario, 60000);



function mostrarAba(abaId) {
  const abas = ['aba-atendimentos', 'aba-caixa', 'aba-log', 'aba-config'];
  const botoes = ['btn-aba-atendimentos', 'btn-aba-caixa', 'btn-aba-log', 'btn-aba-config'];

  const corSalva = localStorage.getItem('BackgroundColor') || 'bg-blue-500';

  const corTexto = corSalva.replace('bg-', 'text-');
  const corBorda = corSalva.replace('bg-', 'border-');

  // Esconde todas as abas
  abas.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Desativa todos os botões
  botoes.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      // Remove possíveis cores anteriores
      btn.classList.remove('text-blue-600', 'border-blue-600', corTexto, corBorda);
      btn.classList.remove('text-gray-500', 'border-transparent');
      btn.classList.add('text-gray-500', 'border-transparent');
    }
  });

  // Mostra a aba clicada
  const aba = document.getElementById(abaId);
  if (aba) aba.classList.remove('hidden');

  // Ativa botão correspondente com a cor personalizada
  const btnAtivo = document.getElementById('btn-' + abaId);
  if (btnAtivo) {
    btnAtivo.classList.remove('text-gray-500', 'border-transparent');
    btnAtivo.classList.add(corTexto, corBorda);
  }
}






// Formata valor em moeda BRL
function formatarMoedaBRL(valor) {
  if (!valor) return "";
  valor = valor.toString().replace(/[^\d,.-]/g, "").replace(",", ".");
  let numero = parseFloat(valor);
  if (isNaN(numero)) return "";
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Remove formatação para edição
function limparFormatoMoeda(valor) {
  if (!valor) return "";
  return valor.replace(/[^\d,.-]/g, "").replace(",", ".");
}

// Calcula totais e faturas
function atualizarTotaisEFaturas() {
  const tipos = ['dinheiro', 'credito', 'debito', 'pix'];
  let totalGeral = 0;
  let quantidadeFaturas = 0;

  tipos.forEach(tipo => {
    let inputs = document.querySelectorAll(`input[data-caixa="${tipo}"]`);
    let soma = 0;

    inputs.forEach(input => {
      let val = limparFormatoMoeda(input.value);
      let num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        soma += num;
        quantidadeFaturas++; // conta input preenchido com valor positivo
      }
    });

    // Atualiza total parcial
    let totalSpan = document.getElementById(`total-${tipo}`);
    if (totalSpan) totalSpan.textContent = formatarMoedaBRL(soma.toFixed(2));

    totalGeral += soma;
  });

  // Atualiza total geral
  const totalCaixa = document.getElementById('total-caixa');
  if (totalCaixa) totalCaixa.textContent = formatarMoedaBRL(totalGeral.toFixed(2));

  // Atualiza total faturas (quantidade)
  const totalFaturas = document.getElementById('total-faturas');
  if (totalFaturas) totalFaturas.textContent = quantidadeFaturas.toString().padStart(2, '0');
}

// Aplica máscara e eventos aos inputs moeda
function configurarInputsMoeda() {
  document.querySelectorAll('input.moeda').forEach(input => {
    // Ao focar, limpa formatação para facilitar edição
    input.addEventListener('focus', (e) => {
      let val = e.target.value;
      e.target.value = limparFormatoMoeda(val);
    });

    // Atualiza totais e faturas conforme digita
    input.addEventListener('input', () => {
      atualizarTotaisEFaturas();
    });

    // Ao perder foco, formata valor
    input.addEventListener('blur', (e) => {
      let val = e.target.value;
      if (!val) {
        e.target.value = "";
      } else {
        e.target.value = formatarMoedaBRL(val);
      }
    });

    // Formata inputs já preenchidos ao carregar
    if (input.value) {
      input.value = formatarMoedaBRL(input.value);
    }
  });
}

// Inicializa ao carregar a página
window.addEventListener('load', () => {
  configurarInputsMoeda();
  atualizarTotaisEFaturas();
});


// Função para somar e atualizar totais
function atualizarTotaisCaixa() {
  // Inicializa acumuladores
  const totais = {
    dinheiro: 0,
    credito: 0,
    debito: 0,
    pix: 0
  };

  // Pega todos inputs da caixa com a classe correta
  const inputs = document.querySelectorAll('.moeda');

  inputs.forEach(input => {
    const tipo = input.getAttribute('data-caixa');
    let valorStr = input.value.trim();

    valorStr = valorStr.replace(/R?\$?\s?/g, '').replace(/\./g, '').replace(',', '.');

    const valorNum = parseFloat(valorStr);

    if (!isNaN(valorNum) && valorNum > 0 && totais.hasOwnProperty(tipo.toLowerCase())) {
      totais[tipo.toLowerCase()] += valorNum;
    }
  });

  // Atualiza no DOM
  document.getElementById('total-dinheiro').textContent = formatarMoedaBRL(totais.dinheiro);
  document.getElementById('total-credito').textContent = formatarMoedaBRL(totais.credito);
  document.getElementById('total-debito').textContent = formatarMoedaBRL(totais.debito);
  document.getElementById('total-pix').textContent = formatarMoedaBRL(totais.pix);

  const totalGeral = totais.dinheiro + totais.credito + totais.debito + totais.pix;
  document.getElementById('total-caixa').textContent = formatarMoedaBRL(totalGeral);
}

// Formata enquanto digita
function formatarInputMoeda(event) {
  let input = event.target;
  let valor = input.value.replace(/[^\d,]/g, '');
  const partes = valor.split(',');
  if (partes.length > 2) {
    valor = partes[0] + ',' + partes.slice(1).join('');
  }
  input.value = valor;
}

// Ativa os listeners nos inputs
function ativarListenersCaixa() {
  const inputs = document.querySelectorAll('.moeda');
  inputs.forEach(input => {
    input.addEventListener('input', formatarInputMoeda);
    input.addEventListener('input', atualizarTotaisCaixa);
  });
}

// Quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
  ativarListenersCaixa();
  atualizarTotaisCaixa();
});



// Função para mostrar uma aba específica e esconder as demais
function mostrarAba(idAba) {
  const abas = ['aba-atendimentos', 'aba-caixa', 'aba-log', 'aba-config'];

  abas.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === idAba) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });
}




  // Também atualiza o estilo dos botões
  abas.forEach(id => {
    const btn = document.getElementById('btn-aba-' + id.split('-')[1]);
    if (btn) {
      if (id === idAba) {
        btn.classList.remove('text-gray-500', 'hover:text-blue-600', 'hover:border-blue-600', 'border-transparent');
        btn.classList.add('text-blue-600', 'border-blue-600');
      } else {
        btn.classList.remove('text-blue-600', 'border-blue-600');
        btn.classList.add('text-gray-500', 'hover:text-blue-600', 'hover:border-blue-600', 'border-transparent');
      }
    }
  });



// Função para converter string "R$ 1.234,56" ou "1234,56" em número float 1234.56
function parseValor(valorStr) {
  if (!valorStr) return 0;
  valorStr = valorStr.replace(/[^\d,]/g, "").replace(",", ".");
  const num = parseFloat(valorStr);
  return isNaN(num) ? 0 : num;
}


// Função para formatar número em moeda BRL "R$ XX,XX"
function formatarBRL(valorNum) {
  return valorNum.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


function atualizarTotais() {
  const tipos = ["dinheiro", "credito", "debito", "pix"]; // minúsculo e sem acento
  let totalGeral = 0;

  tipos.forEach((tipo) => {
    const inputs = document.querySelectorAll(`input[data-caixa="${tipo}"]`);
    let soma = 0;

    inputs.forEach((input) => {
      soma += parseValor(input.value);
    });

    const totalElemento = document.getElementById(`total-${tipo}`);
    if (totalElemento) {
      totalElemento.textContent = formatarBRL(soma);
    }

    totalGeral += soma;
  });

  // Atualiza o total geral (caixa)
  const totalCaixa = document.getElementById("total-caixa");
  if (totalCaixa) {
    totalCaixa.textContent = formatarBRL(totalGeral);
  }

  // Conta quantos inputs da aba Caixa estão preenchidos (valor numérico > 0)
  const inputsCaixa = document.querySelectorAll('input[data-caixa]');
let faturasCount = 0;

inputsCaixa.forEach((input) => {
  if (parseValor(input.value) > 0) {
    faturasCount++;
  }
});

const totalFaturas = document.getElementById("total-faturas");
if (totalFaturas) {
  totalFaturas.textContent = faturasCount.toString().padStart(2, '0');
}


}




// Escuta eventos input em todos os inputs com data-caixa e chama atualizarTotais
document.querySelectorAll('input[data-caixa]').forEach((input) => {
  input.addEventListener("input", atualizarTotais);
});

// Atualiza uma vez no carregamento caso tenha valores preenchidos
window.addEventListener("DOMContentLoaded", atualizarTotais);

 function formatarMoeda(valor) {
    const numero = parseFloat(valor.replace(/\D/g, '')) / 100;
    if (isNaN(numero)) return '';
    return 'R$ ' + numero.toFixed(2).replace('.', ',');
  }

  function obterValorNumerico(valor) {
    return parseFloat(valor.replace(/\D/g, '')) / 100 || 0;
  }

  document.querySelectorAll('input.moeda').forEach(input => {
    input.addEventListener('input', () => {
  const raw = input.value.replace(/[^\d]/g, '');
  const valor = (parseInt(raw, 10) / 100).toFixed(2);
  input.value = formatarBRL(parseFloat(valor));
  atualizarTotais(); // dispara soma após formatar
});


    input.addEventListener('keypress', e => {
      if (e.charCode < 48 || e.charCode > 57) e.preventDefault();
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.value = 'R$ 0,00';
      }
    });
  });

  // Exemplo de soma:
  function somarValores() {
    let total = 0;
    document.querySelectorAll('input.moeda').forEach(input => {
      total += obterValorNumerico(input.value);
    });
    console.log('Total:', total.toFixed(2));
  }

 function zerarTodosOsInputs() {
  const abaRelatorios = document.getElementById('aba-caixa');
  abaRelatorios.querySelectorAll('input[data-caixa]').forEach(input => {
    input.value = 'R$ 0,00';
  });
  atualizarTotais(); // Atualiza só os totais dessa aba
}

// Função para exibir logs na área de logs
function carregarLogs() {
  const logArea = document.getElementById("log-alteracoes");
  if (!logArea) return;

  const logs = JSON.parse(localStorage.getItem('logsAlteracoes') || '[]');

  // Limpa a lista antes de popular
  logArea.innerHTML = '';

  logs.forEach(textoLog => {
    const li = document.createElement('li');
    li.textContent = textoLog;
    logArea.appendChild(li);
  });
}

// Função para registrar um novo log e atualizar a lista na tela e no localStorage
function registrarLog(mensagem) {
  const agora = new Date();
  const hora = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const data = agora.toLocaleDateString('pt-BR');
  const textoLog = ` ${data} ás ${hora}: ${mensagem}`;

  // Adiciona no localStorage
  let logs = JSON.parse(localStorage.getItem('logsAlteracoes') || '[]');
  logs.unshift(textoLog);
  logs = logs.slice(0, 100); // Limita a 100 registros
  localStorage.setItem('logsAlteracoes', JSON.stringify(logs));

  // Atualiza exibição imediatamente
  carregarLogs();
}

// Função para limpar logs da tela e localStorage
function limparLogs() {
  localStorage.removeItem('logsAlteracoes');

  // Força limpeza imediata visual
  const logArea = document.getElementById("log-alteracoes");
  if (logArea) logArea.innerHTML = '<li class="text-gray-500 italic">Nenhum log disponível.</li>';
}


// Evento no botão de limpar logs
document.getElementById('btn-limpar-log').addEventListener('click', limparLogs);

// Carrega logs ao iniciar a página
window.addEventListener('load', carregarLogs);




// Escuta alterações nos inputs da aba Atendimentos
function ativarLogsAbaAtendimentos() {
  const inputsAtendimentos = document.querySelectorAll('#formulario input[type="number"]');

  inputsAtendimentos.forEach(input => {
    input.addEventListener('blur', () => {
      const label = input.previousElementSibling?.textContent?.trim().replace(":", "") || "Campo";
      let valor = input.value;

      if (valor && valor !== '0') {
        valor = formatarValorParaLog(valor);
        registrarLog(`${label}: ${valor}`);
      }
    });
  });
}




window.addEventListener('DOMContentLoaded', () => {
  carregarLogs();
  // carregarDadosCaixa();  <-- comente ou remova esta linha
  // ...
});




function formatarValorParaLog(valorStr) {
  // Remove tudo que não é dígito ou vírgula
  let numStr = valorStr.replace(/[^\d,]/g, '').replace(',', '.');

  let num = parseFloat(numStr);
  if (isNaN(num)) num = 0;

  // Formata com 2 casas decimais e retorna com zero à esquerda, ex: 1 vira "01.00"
  // Como você quer tipo "01", vamos usar toFixed(2) e depois remover a parte decimal se for zero
  let valorFormatado = num.toFixed(2);

  // Para exibir como "01" se o número for inteiro e menor que 10
  if (Number.isInteger(num) && num < 10) {
    valorFormatado = '0' + num.toString();
  }

  return valorFormatado;
}


const btnLimparLog = document.getElementById('btn-limpar-log');
if (btnLimparLog) {
  btnLimparLog.addEventListener('click', () => {
    localStorage.removeItem('logsAlteracoes');
    const logArea = document.getElementById('log-alteracoes');
    if (logArea) logArea.innerHTML = '';
  });
}





function zerarTodosOsInputs() {
  // Seleciona todos os inputs da aba Caixa
  const inputs = document.querySelectorAll('#aba-caixa input.moeda');

  inputs.forEach(input => {
    // Zera o valor visual
    input.value = '';

    // Se estiver salvando individualmente (opcional)
    if (input.name) {
      localStorage.removeItem(input.name);
    }
  });

  // Zera os totais visuais
  document.getElementById('total-caixa').textContent = 'R$ 0,00';
  document.getElementById('total-dinheiro').textContent = 'R$ 0,00';
  document.getElementById('total-credito').textContent = 'R$ 0,00';
  document.getElementById('total-debito').textContent = 'R$ 0,00';
  document.getElementById('total-pix').textContent = 'R$ 0,00';
  document.getElementById('total-faturas').textContent = '00';

  // Remove o objeto geral salvo no localStorage
  localStorage.removeItem('dadosCaixa');

  // Feedback (opcional)
  console.log('Todos os valores foram zerados e o localStorage foi limpo.');
}

function atualizarTotalFaturas() {
  const inputsCaixa = document.querySelectorAll('input[data-caixa]');
  let faturasCount = 0;

  inputsCaixa.forEach((input) => {
    if (parseValor(input.value) > 0) {
      faturasCount++;
    }
  });

  const totalFaturas = document.getElementById("total-faturas");
  if (totalFaturas) {
    totalFaturas.textContent = faturasCount.toString().padStart(2, '0');
  }
}

// Associa o evento blur em todos inputs com data-caixa
document.querySelectorAll('input[data-caixa]').forEach(input => {
  input.addEventListener('blur', atualizarTotalFaturas);
});

// Função para abrir a modal do Changelog + ocultar a barra de rolagem body
function toggleChangelog() {
    const modal = document.getElementById('changelogModal');
    if (!modal) return;

    modal.classList.toggle('hidden');

    // Se o modal estiver aberto (sem a classe 'hidden'), bloqueia scroll do body
    if (!modal.classList.contains('hidden')) {
      document.body.style.overflow = 'hidden';
    } else {
      // Caso contrário, libera o scroll normal
      document.body.style.overflow = '';
    }
  }

  // Opcional: fechar modal clicando fora do conteúdo
  const modal = document.getElementById('changelogModal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      toggleChangelog();
    }
  });


  

