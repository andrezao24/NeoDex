export default function ObterLocalizacao() {

    //função que devolve a posição do utilizador
    const obterPosicao = () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

    return { obterPosicao };
}
