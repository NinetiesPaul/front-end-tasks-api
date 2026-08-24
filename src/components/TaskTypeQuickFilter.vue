<template>
  <v-btn
    v-for="type in types"
    :key="type"
    class="navBarButton"
    variant="text"
  >
    <router-link
      :to="{ path: '/', query: { tipo: type } }"
      style="color: darkblue; font-weight: bold; text-decoration: none"
    >
      {{ type }}
    </router-link>
  </v-btn>
</template>

<script setup>
const types = ['hotfix', 'feature', 'bugfix']
</script>
