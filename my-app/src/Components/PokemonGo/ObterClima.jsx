export default function ObterClima() {

    //mapeia códigos da API Open-Meteo para estados climáticos usados no Pokémon GO
    const tempoMap = {
        0: "Clear", 1: "Partly Cloudy", 2: "Partly Cloudy", 3: "Overcast",
        45: "Fog", 48: "Fog",
        51: "Rainy", 53: "Rainy", 55: "Rainy",
        61: "Rainy", 63: "Rainy", 65: "Rainy",
        80: "Rainy", 81: "Rainy", 82: "Rainy",
        71: "Snow", 73: "Snow", 75: "Snow",
        95: "Windy", 96: "Windy", 99: "Windy",
    };

    //obtém dados meteorológicos atuais com base na latitude e longitude - passados como parametro
    const obterClima = async (latitude, longitude) => {
        const resposta = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        return await resposta.json();
    };

    //converte o code da API num estado climático do Pokémon GO
    const obterTempo = (code) => tempoMap[code] || "Sunny/Clear";

    //obtém os tipos de Pokémon que recebem boost de acordo com o clima atual
    const obterBoosts = async (tempo) => {
        try {
            const resposta = await fetch(
                "https://pokemon-go1.p.rapidapi.com/weather_boosts.json",
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": "fade928942msh2a167c960dc490dp107673jsn6808591cdbbe",
                        "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
                    },
                }
            );

            //converte a resposta num JSON
            const dados = await resposta.json();

            //retorna os tipos com boost para o clima atual
            return dados[tempo] || [""];

        } catch (err) {
            console.error("Erro", err);
        }
    };

    return { obterClima, obterTempo, obterBoosts };
}
