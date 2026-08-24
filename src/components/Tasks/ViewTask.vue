<template>
  <div v-if="task.id">
    <table style="width: 100%; border-collapse: collapse">
      <tbody>
        <tr>
          <td style="padding: 8px; vertical-align: top">
            <h2 style="display: inline-block">{{ task.title }}</h2>&nbsp;&nbsp;&nbsp;
            <template v-if="task.status !== 'closed'">
              <v-btn
                :to="'/task/edit/' + task.id"
                style="height: 3.5em; margin-top: -0.6em; background-color: lightskyblue; color: black; font-size: x-small"
                variant="flat"
              >
                Edit
              </v-btn>&nbsp;
              <v-btn
                style="height: 3.5em; margin-top: -0.6em; background-color: lightcoral; color: black; font-size: x-small"
                variant="flat"
                @click="handleCloseTask(task.id)"
              >
                Close
              </v-btn>
            </template>
            <br /><b>Created On:</b> {{ task.created_on }} <b>By</b> {{ createdBy.name }}
            <template v-if="closedBy !== null">
              <br /><b>Closed On:</b> {{ task.closed_on }} <b>By</b> {{ closedBy.name }}
            </template>
            <div class="d-flex ga-2 mt-2">
              <v-chip color="primary" size="small" style="min-width: 10em" class="justify-center">
                {{ StatusList[task.status] }}
              </v-chip>
              <v-chip color="primary" size="small" style="min-width: 10em" class="justify-center">
                {{ TypeList[task.type] }}
              </v-chip>
              <v-chip color="error" size="small" style="min-width: 10em" class="justify-center">
                High
              </v-chip>
            </div>
          </td>
          <td style="padding: 8px; vertical-align: top; width: 18em">
            <v-select
              id="assignee"
              label="Assignee"
              :items="users"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              @update:model-value="handleTaskAssignment"
            />

            <b>Assignees:</b><br />
            <a
              v-for="assignee in assignees"
              :key="assignee.id"
              href="#"
              class="assignee-link"
              @click.prevent="handleTaskUnassignment(assignee.id)"
            >
              {{ assignee.assigned_to.name }}
              <br />
            </a>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px">
            <b>Description:</b><br />
            {{ task.description }}<br />
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px">
            <b>Task History:</b><br />
            <template v-for="(historyEntry, idx) in taskHistory" :key="idx">
              <template v-if="['added_assignee', 'removed_assignee'].includes(historyEntry.field)">
                {{ historyEntry.changed_by.name }} {{ EnumDictionary[historyEntry.field] }} {{ historyEntry.changed_to }} as an assignee
                <br />
              </template>
              <template v-else>
                {{ capitalize(historyEntry.field) }} changed from
                <i>{{ EnumDictionary[historyEntry.changed_from] }}</i>
                to
                <i>{{ EnumDictionary[historyEntry.changed_to] }}</i>
                by {{ historyEntry.changed_by.name }} on {{ historyEntry.changed_on }}
                <br />
              </template>
            </template>
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
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ErrorMessages from '../../enums/ErrorMessages'
import StatusList from '../../enums/StatusList'
import TypeList from '../../enums/TypeList'
import EnumDictionary from '../../enums/EnumDictionary'
import { serverHost } from '../../config'

const route = useRoute()
const token = sessionStorage.getItem('token')

const notificationType = ref('error')
const notificationMsg = ref('')
const showNotification = ref(false)

const task = ref({})
const createdBy = ref({})
const closedBy = ref(null)
const taskHistory = ref([])
const assignees = ref([])
const users = ref([])

const capitalize = (field) => {
  if (!field) return ''
  return field.charAt(0).toUpperCase() + field.slice(1)
}

const showError = (err) => {
  const message = err.message !== '' ? err.message : ErrorMessages.DEFAULT_ERROR_MSG
  notificationType.value = 'error'
  showNotification.value = true
  notificationMsg.value = message
}

const loadTask = () => {
  fetch(serverHost + '/api/task/view/' + route.params.id, {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((response) => response.json())
    .then((data) => {
      task.value = data.data
      createdBy.value = data.data.created_by
      assignees.value = data.data.assignees
      taskHistory.value = data.data.history
      closedBy.value = data.data.closed_by || null
    })
    .catch(showError)
}

const loadUsers = () => {
  fetch(serverHost + '/api/users/list', {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((response) => response.json())
    .then((data) => {
      const currentAssignees = assignees.value.map((assignee) => assignee.assigned_to.name)
      const allUsers = data.data.users
      users.value = allUsers.filter((user) => !currentAssignees.includes(user.name))
    })
    .catch(showError)
}

const handleCloseTask = (taskId) => {
  fetch(serverHost + '/api/task/close/' + taskId, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'PUT',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadTask()
      }
    })
    .catch(showError)
}

const handleTaskAssignment = (userId) => {
  fetch(serverHost + '/api/task/assign/' + task.value.id, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    method: 'POST',
    body: JSON.stringify({ assigned_to: userId }),
  })
    .then((response) => response.json())
    .then(() => {
      loadTask()
    })
    .catch(showError)
}

const handleTaskUnassignment = (assignedId) => {
  fetch(serverHost + '/api/task/unassign/' + assignedId, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => {
      loadTask()
    })
    .catch(showError)
}

onMounted(() => {
  loadTask()
})

watch(assignees, () => {
  loadUsers()
})
</script>
