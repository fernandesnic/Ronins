import home from "./componentes/home.js"
import {produtos, adicionarProdutos} from "./componentes/produtos.js"
import {sobre, adicionarJogadores} from "./componentes/sobre.js"
import contato from "./componentes/contato.js"




const main = document.querySelector("#app")

window.addEventListener("hashchange", () =>{
    const hash = location.hash
    console.log(hash)
    switch(hash){
        case "#home":
            main.innerHTML = home()
            break
        case "#sobre":
            main.innerHTML = sobre()
            adicionarJogadores()
            break
        case "#produtos":
            main.innerHTML = produtos()
            adicionarProdutos()
            break
        case "#contato":
            main.innerHTML = contato()
            break
        default:
            console.log("Página não encontrada")
            break
    }
})


