import { handleError, handleSuccess } from "."

let apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/`

const api = {
    login: function(params) {
        return fetch(`${apiUrl}login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })
        .then(handleSuccess)
        .catch(e => {
            console.error('Auth api "login" error:', e)
            return handleError()
        })
    },

    register: function(params) {
        let formData = new FormData()
        formData.append('name', params.name)
        formData.append('password', params.password)
        formData.append('email', params.email)
        formData.append('sex', params.sex)
        formData.append('birthday', params.birthday)
        formData.append('avatarFile', params.avatarFile)

        return fetch(`${apiUrl}register`, {
            method: 'POST',
            body: formData
        })
        .then(handleSuccess)
        .catch(e => {
            console.error('Auth api "register" error:', e)
            return handleError()
        })
    },
}

export default api