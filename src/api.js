import fetch from "node-fetch";

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

//Funcion para obtener datos de la API
const getCryptoData = async (cryptoId) => {
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false`;

  //Haciendo el fetch para tener la info añadiendo headers recomendado desde la API
  const response = await fetch(url, {
    headers: {
      "X-CoinGecko-API-Key": COINGECKO_API_KEY,
    },
  });

  const data = await response.json();
  return data;
};

export { getCryptoData };
