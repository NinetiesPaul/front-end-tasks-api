<template>
  <div v-if="task.id">
    <table style="width: 100%; border-collapse: collapse">
      <tbody>
        <tr>
          <td style="padding: 8px">
            <h2 style="display: inline-block">{{ task.title }}</h2>&nbsp;&nbsp;&nbsp;
            <v-btn
              style="height: 2.2em; margin-top: -0.6em; background-color: lightskyblue; color: black; font-size: x-small"
              variant="flat"
              @click="handleUpdate(task.id)"
            >
              Update
            </v-btn>
            <br /><b>Created On:</b> {{ task.created_on }} <b>By</b> {{ createdBy.name }}<br />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px">
            <v-text-field
              id="title"
              v-model="title"
              label="Title"
              variant="outlined"
              density="compact"
              class="mb-2"
            />
            <v-select
              id="status"
              v-model="status"
              :items="statusOptions"
              item-title="title"
              item-value="value"
              label="Status"
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
            />
          </td>
        </tr>
      </tbody>
    </table>

    <v-snackbar v-model="showNotification" location="top right" :timeout="-1">
      <v-alert :type="notificationType" variant="tonal">
        {{ notificationMsg }}
      </v-alert>
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorMessages from '../../enums/ErrorMessages'
import { serverHost } from '../../config'

const router = useRouter()
const route = useRoute()
const token = sessionStorage.getItem('token')

const notificationType = ref('error')
const notificationMsg = ref('')
const showNotification = ref(false)

const task = ref({})
const createdBy = ref({})

const title = ref(null)
const description = ref(null)
const status = ref(null)
const type = ref(null)

const statusOptions = [
  { title: 'Open', value: 'open' },
  { title: 'In Dev', value: 'in_dev' },
  { title: 'Blocked', value: 'blocked' },
  { title: 'In QA', value: 'in_qa' },
]

const typeOptions = [
  { title: 'Feature', value: 'feature' },
  { title: 'Bugfix', value: 'bugfix' },
  { title: 'Hotfix', value: 'hotfix' },
]

const showError = (err) => {
  const message = err.message !== '' ? err.message : ErrorMessages.DEFAULT_ERROR_MSG
  notificationType.value = 'error'
  showNotification.value = true
  notificationMsg.value = message
}

const buildRequestObject = () => {
  const requestObj = {}

  if (title.value !== null) {
    requestObj.title = title.value
  }

  if (description.value !== null) {
    requestObj.description = description.value
  }

  if (status.value !== null) {
    requestObj.status = status.value
  }

  if (type.value !== null) {
    requestObj.type = type.value
  }

  return JSON.stringify(requestObj)
}

const handleUpdate = (taskId) => {
  fetch(serverHost + '/api/task/update/' + taskId, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    method: 'PUT',
    body: buildRequestObject(),
  })
    .then((response) => response.json())
    .then(() => {
      router.push('/task/view/' + taskId)
    })
    .catch(showError)
}

onMounted(() => {
  fetch(serverHost + '/api/task/view/' + route.params.id, {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((response) => response.json())
    .then((data) => {
      task.value = data.data
      createdBy.value = data.data.created_by
      title.value = data.data.title
      description.value = data.data.description
      status.value = data.data.status
      type.value = data.data.type
    })
    .catch(showError)
})
</script>
