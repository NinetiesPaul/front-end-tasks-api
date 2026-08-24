<template>
  <form
    style="width: 30%; margin: 0 auto; padding-top: 10em"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      id="title"
      v-model="title"
      label="Title"
      variant="outlined"
      density="compact"
      class="mb-2"
    />

    <v-select
      id="type"
      v-model="type"
      :items="typeOptions"
      item-title="title"
      item-value="value"
      label="Type"
      variant="outlined"
      density="compact"
      class="mb-2"
    />

    <v-textarea
      id="description"
      v-model="description"
      label="Description"
      variant="outlined"
      rows="10"
      class="mb-2"
    />

    <v-btn type="submit" color="primary" variant="flat" :disabled="buttonDisabled">
      Create
    </v-btn>
  </form>

  <v-snackbar v-model="showNotification" location="top right" :timeout="-1">
    <v-alert :type="notificationType" variant="tonal">
      {{ notificationMsg }}
    </v-alert>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ErrorMessages from '../../enums/ErrorMessages'
import { serverHost } from '../../config'

const router = useRouter()

const notificationType = ref('error')
const notificationMsg = ref('')
const showNotification = ref(false)
const buttonDisabled = ref(false)

const title = ref(null)
const description = ref(null)
const type = ref(null)

const typeOptions = [
  { title: 'Feature', value: 'feature' },
  { title: 'Bugfix', value: 'bugfix' },
  { title: 'Hotfix', value: 'hotfix' },
]

const buildRequestObject = () => {
  const requestObj = {}

  if (title.value !== null) {
    requestObj.title = title.value
  }

  if (description.value !== null) {
    requestObj.description = description.value
  }

  if (type.value !== null) {
    requestObj.type = type.value
  }

  return JSON.stringify(requestObj)
}

const handleSubmit = async () => {
  const token = sessionStorage.getItem('token')

  try {
    const response = await fetch(serverHost + '/api/task/create', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: buildRequestObject(),
    })
    const data = await response.json()

    if (data.success) {
      router.push('/task/view/' + data.data.id)
    } else {
      let message = ErrorMessages.DEFAULT_ERROR_MSG

      Object.keys(ErrorMessages).forEach((k) => {
        if (data.content === k) {
          message = `${ErrorMessages[k]}`
        }
      })

      notificationType.value = 'error'
      showNotification.value = true
      notificationMsg.value = message
    }
    buttonDisabled.value = false
  } catch (err) {
    const message = err.message !== '' ? err.message : ErrorMessages.DEFAULT_ERROR_MSG
    notificationType.value = 'error'
    showNotification.value = true
    notificationMsg.value = message
    buttonDisabled.value = false
  }
}

const onSubmit = () => {
  buttonDisabled.value = true
  handleSubmit()
}
</script>
