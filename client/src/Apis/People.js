import { handleError, handleSuccess } from "."
import { getCookie } from "../Controllers/FunctionsController"

let apiUrl = `${process.env.REACT_APP_API_URL}/api/people/`

const api = {
    get: function() {
        return fetch(`${apiUrl}get`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('_token')}`
            }
        })
        .then(handleSuccess)
        .catch(e => {
            console.error('People api "get" error:', e)
            return handleError()
        })
    },
}

export default api