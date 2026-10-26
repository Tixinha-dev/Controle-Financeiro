const indicadorDeEntrada = document.getElementById("i-entrada");
const indicadorDeSaida = document.getElementById("i-saida");
const indicadorTotal = document.getElementById("i-total");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoEntradaInput = document.getElementById("tipo");
const listaDeTransacoes = document.getElementById("lista-de-transacoes");
const mensagemPadrao = document.getElementById("mensagem-padrao");
let modoAtual = "adicionar";
let idSendoEditado = null;

let transacoes =
  JSON.parse(localStorage.getItem("transacoesFinanceiras")) || [];

class Trasacao {
  constructor(descricao, tipo, valor) {
    this.id = Date.now();
    this.descricao = descricao;
    this.tipo = tipo;
    this.valor = valor;
  }
}
class Calculo {
  static atualizarIndicador(tipoAlvo) {
    const indicadores = {
      entrada: indicadorDeEntrada,
      saida: indicadorDeSaida,
      saldoFinal: indicadorTotal,
    };

    const total = transacoes
      .filter((t) => t.tipo === tipoAlvo)
      .map((key) => Number(key.valor))
      .reduce((acc, valor) => acc + valor, 0);

    indicadores[tipoAlvo].textContent = `R$ ${total.toFixed(2)}`;

    if (tipoAlvo === "saldoFinal") {
      const valorEntrada = Number(
        indicadores.entrada.textContent.replace("R$ ", ""),
      );
      const valorSaida = Number(
        indicadores.saida.textContent.replace("R$ ", ""),
      );
      const saldo = valorEntrada - valorSaida;

      indicadores.saldoFinal.textContent = `R$ ${saldo.toFixed(2)}`;
    }
  }
}

class Elemento {
  constructor(tag, textContent = "") {
    const elemento = document.createElement(tag);

    textContent ? (elemento.textContent = textContent) : "";
    
    return elemento
  }
}

function salvarNoLocalStorage() {
  localStorage.setItem("transacoesFinanceiras", JSON.stringify(transacoes));
}

function renderizarTransacao(transacao) {
  const li = new Elemento("li");
  const infoTransacao = new Elemento("div");

  const tituloInfoTransacao = new Elemento("h4", transacao.descricao);
  const tipoDeTransacaoInfo = new Elemento("span", transacao.tipo);

  const areaValorTransacao = new Elemento("div");
  const valorTransacao = new Elemento("span", `R$${Number(transacao.valor).toFixed(2)}`);

  const areaDeManipulacao = new Elemento("div");

  const BtnEditarTransacao = new Elemento("button", "Editar");
  BtnEditarTransacao.addEventListener("click", () => {
    modoAtual = "editar";
    idSendoEditado = transacao.id;

    descricaoInput.value = transacao.descricao;
    valorInput.value = transacao.valor;
    tipoEntradaInput.value = transacao.tipo;

    document.querySelector("button[type='submit']").textContent = "Editar";
  });

  const BtnExcluirTransacao = new Elemento("button", "Excluir");
  BtnExcluirTransacao.classList.add("cor-botao-excluir");
  BtnExcluirTransacao.addEventListener("click", () => {
    excluirTransacao(li, transacao);
  });

  li.className = "estilos-transacao";

  transacao.tipo === "entrada"
    ? li.classList.add("cor-da-borda-de-entrada")
    : li.classList.add("cor-da-borda-de-saida");

  infoTransacao.append(
    tituloInfoTransacao,
    tipoDeTransacaoInfo,
  );
  areaValorTransacao.appendChild(valorTransacao);
  areaDeManipulacao.append(
    BtnEditarTransacao,
    BtnExcluirTransacao,
  );
  li.append(
    infoTransacao,
    areaValorTransacao,
    areaDeManipulacao,
  );
  listaDeTransacoes.appendChild(li);
}

function atualizarEstadoDaMensagemPadrao() {
  transacoes.length === 0
    ? (mensagemPadrao.style.display = "block")
    : (mensagemPadrao.style.display = "none");
}

function editarTransacao() {
  const item = transacoes.find((t) => t.id === idSendoEditado);

  item.descricao = descricaoInput.value;
  item.valor = valorInput.value;
  item.tipo = tipoEntradaInput.value;

  modoAtual = "adicionar";
  idSendoEditado = null;
  document.querySelector("button[type='submit']").textContent = "Adicionar";

  listaDeTransacoes.innerHTML = "";
  transacoes.forEach((t) => renderizarTransacao(t));

  Calculo.atualizarIndicador("entrada");
  Calculo.atualizarIndicador("saida");
  Calculo.atualizarIndicador("saldoFinal");
  salvarNoLocalStorage();
}

function excluirTransacao(li, transacao) {
  li.remove();
  transacoes = transacoes.filter((t) => t.id !== transacao.id);
  atualizarEstadoDaMensagemPadrao();
  Calculo.atualizarIndicador("entrada");
  Calculo.atualizarIndicador("saida");
  Calculo.atualizarIndicador("saldoFinal");
  salvarNoLocalStorage();
}
document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (modoAtual === "adicionar") {
    const novaTransacao = new Trasacao(
      descricaoInput.value,
      tipoEntradaInput.value,
      valorInput.value,
    );
    transacoes.push(novaTransacao);
    renderizarTransacao(novaTransacao);
  } else if (modoAtual === "editar") {
    editarTransacao();
  }
  Calculo.atualizarIndicador("entrada");
  Calculo.atualizarIndicador("saida");
  Calculo.atualizarIndicador("saldoFinal");
  atualizarEstadoDaMensagemPadrao();
  ev.target.reset();
  salvarNoLocalStorage();
});
transacoes.length > 0 ? transacoes.forEach((t) => renderizarTransacao(t)) : "";
Calculo.atualizarIndicador("entrada");
Calculo.atualizarIndicador("saida");
Calculo.atualizarIndicador("saldoFinal");
atualizarEstadoDaMensagemPadrao();