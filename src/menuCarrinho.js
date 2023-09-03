//Aqui iremos concentrar toda codificação em relação ao Menu Carrinho
import { catalogo, salvarLocalStorage, lerLocalStorage } from "./utilidades";

const idsProdutoCarrinhoComQtde = lerLocalStorage("carrinho") ?? {};

function abrirCarrinho(){
    document.getElementById("carrinho").classList.add("right-[0px]");
    document.getElementById("carrinho").classList.remove("right-[-360px]");
}

function fecharCarrinho(){
    document.getElementById("carrinho").classList.remove("right-[0px]");
    document.getElementById("carrinho").classList.add("right-[-360px]");
}

function irParaCheckout(){
  if (Object.keys(idsProdutoCarrinhoComQtde).length === 0){
    return;
  }
  window.location.href = "./checkout.html";
}

export function inicializarCarrinho(){
    const botaofecharCarrinho = document.getElementById("fechar-carrinho");
    const botaoabrirCarrinho = document.getElementById("abrir-carrinho");
    const botaoIrParaCheckout = document.getElementById("finalizar-compra")

    botaofecharCarrinho.addEventListener("click",fecharCarrinho)
    botaoabrirCarrinho.addEventListener("click",abrirCarrinho)
    botaoIrParaCheckout.addEventListener("click", irParaCheckout)
}


function removerDoCarrinho(idProduto){ //temos que remover do dicionario e html
   delete idsProdutoCarrinhoComQtde[idProduto];
   salvarLocalStorage("carrinho", idsProdutoCarrinhoComQtde);
   atualizarPrecoCarrinho();
   renderizarProdutosCarrinho();
}

function incrementarQtdeProduto(idProduto){
  idsProdutoCarrinhoComQtde[idProduto]++; //++ incrementa/acrescenta
  salvarLocalStorage("carrinho", idsProdutoCarrinhoComQtde);
  atualizarPrecoCarrinho();
  atualizarInformacaoQtde(idProduto);
}

function decrementarQtdeProduto(idProduto){
  if(idsProdutoCarrinhoComQtde[idProduto] === 1){
    removerDoCarrinho(idProduto);
    return;
  }
  idsProdutoCarrinhoComQtde[idProduto]--; //++ decrementa/reduz
  salvarLocalStorage("carrinho", idsProdutoCarrinhoComQtde);
  atualizarPrecoCarrinho();
  atualizarInformacaoQtde(idProduto);
}

function atualizarInformacaoQtde(idProduto) {
  document.getElementById(`quantidade-${idProduto}`).innerText = idsProdutoCarrinhoComQtde[idProduto];
}

function desenharProdutoNoCarrinho(idProduto){
  const produto = catalogo.find((p) => p.id === idProduto);
  const containerProdutosCarrinho = document.getElementById("produtos-carrinho");

  const elementoArticle = document.createElement("article");//<article></article>
  const articleClasses = ["flex", "bg-slate-100", "rounded-lg", "p-1", "relative"];

  for(const articleClass of articleClasses){
    elementoArticle.classList.add(articleClass);
  }; //<article class="flex bg-slate-100 rounded-lg p-1 relative"></article>

  const cartaoProdutoCarrinho = `<button id="remover-item-${produto.id}" class="absolute top-0 right-2">
    <i class="fa-solid fa-circle-xmark text-slate-500 hover:text-slate-800"></i>
  </button>
  <img src="assets/img/${produto.imagem}.jpg" alt="Carrinho: ${produto.nome}" class="h-24 rounded-lg">
  <div class="p-2 flex flex-col justify-between">
    <p class="text-slate-900 text-sm">${produto.nome}</p>
    <p class="text-slate-400 text-xs">Tamanho: M</p>
    <p class="text-green-700 text-lg">$${produto.preco}</p>
  </div>
  <div class="flex text-slate-950 items-end absolute bottom-0 right-2 text-lg">
    <button id="decrementar-produto-${produto.id}">-</button>
    <p id="quantidade-${produto.id}" class="ml-2">${idsProdutoCarrinhoComQtde[produto.id]}</p>
    <button id="incrementar-produto-${produto.id}" class="ml-2">+</button>
  </div>`;

  elementoArticle.innerHTML = cartaoProdutoCarrinho;
  containerProdutosCarrinho.appendChild(elementoArticle);

  document.getElementById(`decrementar-produto-${produto.id}`).addEventListener("click", () => decrementarQtdeProduto(produto.id));

  document.getElementById(`incrementar-produto-${produto.id}`).addEventListener("click", () => incrementarQtdeProduto(produto.id));

  document.getElementById(`remover-item-${produto.id}`).addEventListener("click", () => removerDoCarrinho(produto.id));
}

export function renderizarProdutosCarrinho(){
  const containerProdutosCarrinho = document.getElementById("produtos-carrinho");
  containerProdutosCarrinho.innerHTML = "";

  for(const idProduto in idsProdutoCarrinhoComQtde){
    desenharProdutoNoCarrinho(idProduto)
  }
}

export function adicionarAoCarrinho(idProduto){
  if (idProduto in idsProdutoCarrinhoComQtde){ //verifica se a chave adicionada existe nas qtdes adicionadas
    incrementarQtdeProduto(idProduto);
    return;
  }
  idsProdutoCarrinhoComQtde[idProduto] = 1;
  salvarLocalStorage("carrinho", idsProdutoCarrinhoComQtde);
  atualizarPrecoCarrinho();
  desenharProdutoNoCarrinho(idProduto);
}

export function atualizarPrecoCarrinho(){
  const precoCarrinho = document.getElementById("preco-total");
  let precoTotalCarrinho = 0;
  for (const idProdutoCarrinho in idsProdutoCarrinhoComQtde) {
    precoTotalCarrinho += catalogo.find(p => p.id === idProdutoCarrinho).preco * idsProdutoCarrinhoComQtde[idProdutoCarrinho];
  }
  precoCarrinho.innerText = `Total: $${precoTotalCarrinho}`;
}