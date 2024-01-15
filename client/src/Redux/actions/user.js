import { 
    USER_LOGIN,
    USER_LOGOUT,
} from '../constants'

export const loginUser = (user) => (dispatch) => {
    dispatch({
        type: USER_LOGIN,
        payload: { ...user }
    })
}

export const logoutUser = () => (dispatch) => {
    dispatch({
        type: USER_LOGOUT
    })
}