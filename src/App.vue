<template>
  <v-app>
    <v-main>
      <v-container style="margin-top: 2em">
        <v-container style="display: flex">
          <h2 class="text-h3">
            <router-link to="/" class="taskplanner-title">TaskPlanner</router-link>
          </h2>
        </v-container>

        <v-container class="navbar-bar">
          <MainButton />
          <TaskTypeQuickFilter v-if="loggedIn" />
        </v-container>

        <v-container class="content-area">
          <router-view />
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuth } from './composables/useAuth'
import MainButton from './components/MainButton.vue'
import TaskTypeQuickFilter from './components/TaskTypeQuickFilter.vue'

const { loggedIn } = useAuth()
</script>
