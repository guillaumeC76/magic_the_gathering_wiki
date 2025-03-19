<template>
  <div class="card-list">
    <h1>Bibliothèque de <i>Magic: The Gathering (FR)</i></h1>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher une carte..."
        @keyup.enter="searchCards"
      />
      <button @click="searchCards">Rechercher</button>
    </div>

    <div v-if="loading" class="loader">Chargement...</div>

    <div class="cards" v-else>
      <router-link
        :to="`/card/${card.id}`"
        class="card"
        v-for="card in cards"
        :key="card.id"
      >
        <h2>{{ card.name }}</h2>
        <p><span>Type :</span> {{ card.type }}</p>
        <p><span>Rareté :</span> {{ card.rarity }}</p>
        <p><span>Extension :</span> {{ card.setName }} ({{ card.set }})</p>
        <p>
          <span>Coût de mana :</span>
          <span v-html="formatManaCost(card.manaCost)"></span>
        </p>
      </router-link>
    </div>

    <div class="pagination" v-if="!searchQuery && !loading">
      <button
        @click="fetchCards(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Précédent
      </button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        @click="fetchCards(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  data() {
    return {
      cards: [],
      currentPage: 1,
      totalPages: 1,
      searchQuery: "",
      loading: false,
    };
  },
  created() {
    this.fetchCards(this.currentPage);
  },
  methods: {
    async fetchCards(page) {
      this.loading = true;
      try {
        const response = await ApiService.getCards(page, 50, "French");

        const filteredCards = response.data.cards
          .filter((card) =>
            card.foreignNames?.some((fn) => fn.language === "French")
          )
          .map((card) => {
            const frVersion = card.foreignNames.find(
              (fn) => fn.language === "French"
            );
            return {
              id: card.id,
              name: frVersion.name,
              text: frVersion.text,
              type: frVersion.type,
              manaCost: card.manaCost,
              rarity: card.rarity,
              set: card.set,
              setName: card.setName,
            };
          });

        this.cards = filteredCards;

        const totalCount = parseInt(response.headers["total-count"], 10);
        this.totalPages = Math.ceil(totalCount / 50);
        this.currentPage = page;
      } catch (error) {
        console.error("Erreur lors du chargement des cartes :", error);
      } finally {
        this.loading = false;
      }
    },

    async searchCards() {
      if (this.searchQuery.length === 0) {
        this.fetchCards(1);
        return;
      }

      this.loading = true;

      try {
        const response = await ApiService.searchCardsByName(
          this.searchQuery,
          "French"
        );

        const filteredCards = response.data.cards
          .filter((card) =>
            card.foreignNames?.some((fn) => fn.language === "French")
          )
          .map((card) => {
            const frVersion = card.foreignNames.find(
              (fn) => fn.language === "French"
            );
            return {
              id: card.id,
              name: frVersion.name,
              text: frVersion.text,
              type: frVersion.type,
              manaCost: card.manaCost,
              rarity: card.rarity,
              set: card.set,
              setName: card.setName,
            };
          });

        this.cards = filteredCards;
      } catch (error) {
        console.error("Erreur lors de la recherche des cartes :", error);
      } finally {
        this.loading = false;
      }
    },

    formatManaCost(manaCost) {
      if (!manaCost) return "N/A";
      return manaCost.replace(/{(.*?)}/g, (match, p1) => {
        const symbol = p1.toLowerCase();
        return `<img src="https://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&size=small&name=${symbol}" alt="${symbol}"/>`;
      });
    },
  },
};
</script>
