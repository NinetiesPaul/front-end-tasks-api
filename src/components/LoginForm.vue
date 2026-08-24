<template>
  <form
    style="width: 30%; margin: 0 auto; padding-top: 10em"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      id="nome"
      v-model="email"
      label="E-mail"
      variant="outlined"
      density="compact"
      class="mb-2"
    />
    <v-text-field
      id="sobrenome"
      v-model="password"
      label="Password"
      type="password"
      variant="outlined"
      density="compact"
      class="mb-2"
    />
    <v-btn type="submit" color="primary" variant="flat">Login</v-btn>
  </form>

  <v-snackbar
    v-model="showNotification"
    location="top right"
    :timeout="-1"
  >
    <v-alert :type="notificationType" variant="tonal">
      {{ error }}
    </v-alert>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ErrorMessages from '../enums/ErrorMessages'
import { serverHost } from '../config'

const router = useRouter()
const { login } = useAuth()

const error = ref('')
const showNotification = ref(false)
const notificationType = ref('error')
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const response = await fetch(serverHost + '/login', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username: email.value, password: password.value }),
    })
    const data = await response.json()

    if (data.success) {
      login(data.token)
      router.push('/')
    } else {
      notificationType.value = 'error'
      error.value = data.content
      showNotification.value = true
    }
  } catch (err) {
    const message = err.message !== '' ? err.message : ErrorMessages.DEFAULT_ERROR_MSG
    notificationType.value = 'error'
    error.value = message
    showNotification.value = true
  }
}
</script>
