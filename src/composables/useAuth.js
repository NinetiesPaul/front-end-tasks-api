import { ref } from 'vue'

const loggedIn = ref(!!sessionStorage.getItem('token'))

export function useAuth() {
  const login = (token) => {
    sessionStorage.setItem('token', token)
    loggedIn.value = true
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    loggedIn.value = false
  }

  return { loggedIn, login, logout }
}
