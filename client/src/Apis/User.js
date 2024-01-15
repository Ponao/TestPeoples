import { handleError, handleSuccess } from "."
import { getCookie } from "../Controllers/FunctionsController"

let apiUrl = `${process.env.REACT_APP_API_URL}/api/user/`

const api = {
    me: function() {
        return fetch(`${apiUrl}me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('_token')}`
            }
        })
        .then(handleSuccess)
        .catch(e => {
            console.error('User api "me" error:', e)
            return handleError()
        })
    },

    update: function(params) {
        let formData = new FormData()
        formData.append('name', params.name)
        formData.append('password', params.password)
        formData.append('newPassword', params.newPassword)
        formData.append('avatarFile', params.avatarFile)

        return fetch(`${apiUrl}update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getCookie('_token')}`
            },
            body: formData
        })
        .then(handleSuccess)
        .catch(e => {
            console.error('User api "update" error:', e)
            return handleError()
        })
    },
}

export default api