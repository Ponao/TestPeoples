import React from 'react'
import Login from './Login'
import Register from './Register'

class Auth extends React.Component {
    state = {
        form: 'login'
    }

    changeForm = (form) => {
        this.setState({ form })
    }

    render() {
        return  <>
            { this.state.form === 'login' && <Login changeForm={this.changeForm} /> }
            { this.state.form === 'register' && <Register changeForm={this.changeForm} /> }
        </>
    }
}

export default Auth