<template>
  <p style="text-align: center">
    <v-select
      v-model="filterContext"
      :items="filterOptions"
      item-title="title"
      item-value="value"
      label="Filter by"
      density="compact"
      variant="outlined"
      hide-details
      style="min-width: 10%; max-width: 12em; display: inline-block; margin-right: 2em"
    />

    <v-text-field
      v-if="filterContext !== 'created_by'"
      v-model="filterParam"
      :label="`Search ${filterContext}`"
      density="compact"
      variant="outlined"
      hide-details
      style="max-width: 18em; display: inline-block"
    />
    <v-select
      v-else
      v-model="filterByUser"
      :items="userOptions"
      item-title="name"
      item-value="id"
      label="Filter by user"
      density="compact"
      variant="outlined"
      hide-details
      clearable
      style="min-width: 10%; max-width: 14em; display: inline-block; margin-right: 2em"
    />
  </p>

  <v-container style="gap: 2em; padding: 1em">
    <div
      v-for="task in filteredTasks"
      :key="task.id"
      class="task-card"
    >
      <span>
        <router-link :to="'/task/view/' + task.id" style="text-decoration: none">
          <b>{{ task.title }}</b>
        </router-link>
      </span>
      <br />
      {{ TypeList[task.type] }}<br />
      {{ StatusList[task.status] }}<br />
      <v-divider />
      <i>Created by <b>{{ task.created_by.name }}</b> on {{ task.created_on }}</i>
      <br />
    </div>

    <v-snackbar v-model="showNotification" location="top right" :timeout="-1">
      <v-alert :type="notificationType" variant="tonal">
        {{ notificationMsg }}
      </v-alert>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ErrorMessages from '../../enums/ErrorMessages'
import StatusList from '../../enums/StatusList'
import TypeList from '../../enums/TypeList'
import { serverHost } from '../../config'

const route = useRoute()

const notificationType = ref('error')
const notificationMsg = ref('')
const showNotification = ref(false)

const tasks = ref([])
const users = ref([])

const filterContext = ref('status')
const filterParam = ref('')
const filterByUser = ref('')

const filterOptions = [
  { title: 'Status', value: 'status' },
  { title: 'Type', value: 'type' },
  { title: 'Created by', value: 'created_by' },
]

const userOptions = computed(() => users.value)

const filterString = computed(() => {
  return route.query.tipo ? '?type=' + route.query.tipo : ''
})

const filteredTasks = computed(() => {
  return tasks.value.filter((filteredTask) => {
    if (filterContext.value !== 'created_by') {
      return String(filteredTask[filterContext.value] || '')
        .toLowerCase()
        .includes(filterParam.value)
    }
    if (filterByUser.value !== '' && filterByUser.value !== null) {
      return String(filteredTask.created_by.id) === String(filterByUser.value)
    }
    return true
  })
})

const handleRequest = () => {
  const token = sessionStorage.getItem('token')

  fetch(serverHost + '/api/task/list' + filterString.value, {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((response) => response.json())
    .then((data) => {
      tasks.value = data.data.tasks

      const ids = []
      const filteredUsers = []
      data.data.tasks.forEach((task) => {
        if (!ids.includes(task.created_by.id)) {
          ids.push(task.created_by.id)
          filteredUsers.push({ id: task.created_by.id, name: task.created_by.name })
        }
      })
      users.value = filteredUsers
    })
    .catch((err) => {
      const message = err.message !== '' ? err.message : ErrorMessages.DEFAULT_ERROR_MSG
      notificationType.value = 'error'
      showNotification.value = true
      notificationMsg.value = message
    })
}

onMounted(() => {
  handleRequest()
})

watch(
  () => route.query.tipo,
  () => {
    handleRequest()
  }
)
</script>
