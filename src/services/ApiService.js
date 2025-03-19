import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.magicthegathering.io/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default {
  // Récupérer les cartes par page avec pagination et filtrage par langue
  getCards(page = 1, pageSize = 50, language = "French") {
    return apiClient.get("/cards", {
      params: {
        page,
        pageSize,
        language,
      },
    });
  },

  // Récupérer une carte précise par son ID
  getCardById(id) {
    return apiClient.get(`/cards/${id}`);
  },

  searchCardsByName(name, language = "French") {
    return apiClient.get("/cards", {
      params: {
        name,
        language,
        pageSize: 1000, // récupérer jusqu'à 1000 résultats pour être exhaustif
      },
    });
  },
};
