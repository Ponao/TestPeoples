import React from 'react'
import authApi from '../../Apis/Auth'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/actions/user'
import { bindActionCreators } from 'redux'
import { withCookies } from 'react-cookie'

import { Flex, Button, Form, Input, Typography } from 'antd'
import Title from 'antd/es/typography/Title'

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        isFetching: false,
        errors: [],
    }

    login = () => {
        this.setState({ isFetching: true, errors: [] })

        authApi.login(this.state).then(({ error, user, token, errors }) => {
            if(error) {
                return this.setState({ isFetching: false, errors })
            }

            let expires = new Date()
            expires.setDate(expires.getDate()+365)

            this.props.cookies.set('_token', token, { path: '/' }, expires)
            this.props.userActions.loginUser(user)

            this.setState({ isFetching: false })
        })
    }

    render() {
        return  <>
            <Flex style={{ height: '100vh' }} gap="middle" align="center" justify="center" vertical>
                <Form layout="vertical" style={{ width: '400px' }}>
                    <Title>Login</Title>

                    <Form.Item
                        label="Email"
                        validateStatus={!!this.state.errors.find(err => err.param === 'email') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'email')?.msg}
                    >
                        <Input onChange={(e) => {
                            this.setState({ email: e.target.value })
                        }} className="input-text" value={ this.state.email } type="text" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        validateStatus={!!this.state.errors.find(err => err.param === 'password') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'password')?.msg}
                    >
                        <Input onChange={(e) => {
                            this.setState({ password: e.target.value })
                        }} className="input-text" value={ this.state.password } type="password" />
                    </Form.Item>

                    <Typography.Text type="danger">
                        {this.state.errors.filter(err => err.param === 'all').map((err, i) => {
                            return <p>{ err.msg }</p>
                        })}
                    </Typography.Text>

                    <Button type="primary" onClick={this.login}>
                        { this.state.isFetching && '...' }
                        { !this.state.isFetching && 'Login' }
                    </Button>                    
                </Form>

                <Typography.Text>Don't have an account yet? <a href="#" onClick={(e) => {
                    e.preventDefault()
                    this.props.changeForm('register')
                }}>Register now</a></Typography.Text>
            </Flex>
        </>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    false,
    mapDispatchToProps
)(
    withCookies(
        Login
    )
)