<template>
  <template v-if="loggedIn">
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          class="navBarButton"
          style="float: left"
          variant="text"
        >
          <span class="linkFormatting">Menu</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/task">
          <span class="linkFormatting">Create Task</span>
        </v-list-item>
        <v-list-item to="/logout">
          <span class="linkFormatting">Logout</span>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
  <v-btn v-else class="navBarButton" style="float: left" variant="text">
    <router-link to="/login" style="color: #6f3857; font-weight: bold; text-decoration: none">
      Login
    </router-link>
  </v-btn>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { loggedIn } = useAuth()
</script>
