<template>
    <div class="card-details">
      <router-link to="/" class="back-button">⬅ Retour</router-link>
  
      <div v-if="card" class="info_carte">
        <h2>{{ card.name }}</h2>
        <img :src="card.imageUrl" class="img_carte" alt="Carte Magic" v-if="card.imageUrl" />
        <div class="info_tex_carte">
          <p><span>Type :</span> {{ card.type }}</p>
          <p><span>Rareté :</span> {{ card.rarity }}</p>
          <p><span>Extension :</span> {{ card.setName }} ({{ card.set }})</p>
          <p><span>Coût de mana : </span>
            <span v-html="formatManaCost(card.manaCost)"></span>
          </p>
          <p><span>Description :</span> {{ card.text }}</p>
        </div>
      </div>
  
      <div v-else>
        <p>Chargement des informations...</p>
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from "@/services/ApiService";
  
  export default {
    data() {
      return {
        card: null,
      };
    },
    created() {
      this.fetchCardDetails();
    },
    methods: {
      async fetchCardDetails() {
        try {
          const response = await ApiService.getCardById(this.$route.params.id);
          const card = response.data.card;
          const frVersion =
            card.foreignNames?.find((fn) => fn.language === "French") || card;
  
          this.card = {
            name: frVersion.name || card.name,
            imageUrl: frVersion.imageUrl || card.imageUrl,
            text: frVersion.text || card.text,
            type: frVersion.type || card.type,
            manaCost: card.manaCost,
            rarity: card.rarity,
            set: card.set,
            setName: card.setName,
          };
        } catch (error) {
          console.error("Erreur lors du chargement des détails :", error);
        }
      },
  
      formatManaCost(manaCost) {
        if (!manaCost) return 'N/A';
        return manaCost.replace(/{(.*?)}/g, (match, p1) => {
          const symbol = p1.toLowerCase();
          return `<img src="https://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&size=small&name=${symbol}" alt="${symbol}"/>`;
        });
      },
    },
  };
  </script>
  