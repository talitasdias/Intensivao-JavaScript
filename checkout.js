//import { data } from "autoprefixer";
import { desenharProdutoCarrinhoSimples,lerLocalStorage, apagarDoLocalStorage, salvarLocalStorage } from "./src/utilidades";
import { atualizarPrecoCarrinho } from "./src/menuCarrinho";
//import { isDepsOptimizerEnabled } from "vite";
atualizarPrecoCarrinho();
function desenharProdutosCheckout(){
    const idsProdutoCarrinhoComQtde = lerLocalStorage("carrinho") ?? {};
    for (const idProduto in idsProdutoCarrinhoComQtde){
        desenharProdutoCarrinhoSimples(idProduto, "container-produto-checkout", idsProdutoCarrinhoComQtde[idProduto]);
    }
}

function finalizarCompra(evento){
    evento.preventDefault();//me permite interromper o comportamento padrao do evento submit
    const idsProdutoCarrinhoComQtde = lerLocalStorage("carrinho") ?? {};
    if (Object.keys(idsProdutoCarrinhoComQtde).length === 0){
        return;
    }
    const dataAtual = new Date();
    const pedidoFeito = {
        dataPedido: dataAtual,
        pedido: idsProdutoCarrinhoComQtde
    }
    const historicoDePedidos = lerLocalStorage("historico") ?? [];
    const historicoDePedidosAtualizado = [pedidoFeito, ...historicoDePedidos];

    salvarLocalStorage("historico", historicoDePedidosAtualizado);

    apagarDoLocalStorage("carrinho");

    window.location.href = "./pedidos.html";
}

desenharProdutosCheckout();

document.addEventListener("submit", (evt) => finalizarCompra(evt))