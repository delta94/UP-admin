import axios from 'axios'
import {API_URL, JWT_HEADER_PREFIX} from "../global/constants"
import AuthService from "../auth/authService"

axios.defaults.baseURL = API_URL
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const axiosApi = axios.create({})

export const setAuthHeader = (token) => {
    axiosApi.defaults.headers.common['Authorization'] = JWT_HEADER_PREFIX + token
}

setAuthHeader(AuthService.getToken())

export default axios