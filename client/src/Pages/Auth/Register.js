import React from 'react'
import authApi from '../../Apis/Auth'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/actions/user'
import { bindActionCreators } from 'redux'
import { withCookies } from 'react-cookie'

import { Flex, Button, Form, Input, Typography, DatePicker, Select, Upload } from 'antd'
import Title from 'antd/es/typography/Title'
import { PlusOutlined } from '@ant-design/icons'

class Register extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        birthday: '',
        sex: '',
        avatarFile: null,
        avatarUrl: '',
        isFetching: false,
        errors: [],
    }

    register = () => {
        this.setState({ isFetching: true, errors: [] })

        authApi.register({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            birthday: this.state.birthday,
            sex: this.state.sex,
            avatarFile: this.state.avatarFile
        }).then(({ error, user, token, errors }) => {
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

    selectAvatar = (info) => {
        let file = info.file
        const isJpgOrPng = file.type === 'image/png'
        if(!isJpgOrPng) {
            alert('You can only upload PNG file!')
        }
        const isLt10M = file.size / 1024 / 1024 < 10
        if(!isLt10M) {
            alert('Image must smaller than 10MB!')
        }
        if(!isJpgOrPng || !isLt10M) return

        this.setState({ avatarFile: file.originFileObj })
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            this.setState({ avatarUrl: reader.result })
        })
        reader.readAsDataURL(file.originFileObj)
    }

    render() {
        return  <>
            <Flex style={{ height: '100vh' }} gap="middle" align="center" justify="center" vertical>
                <Form layout="vertical" style={{ width: '400px' }}>
                    <Title>Register</Title>

                    <Form.Item
                        label="Avatar"
                        validateStatus={!!this.state.errors.find(err => err.param === 'avatarFile') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'avatarFile')?.msg}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={this.selectAvatar}
                        >
                            {this.state.avatarUrl ? (
                                <img
                                    src={this.state.avatarUrl}
                                    alt="avatar"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            ) : (
                                <button style={{
                                    border: 0,
                                    background: 'none',
                                }}>
                                    <div
                                        style={{
                                        marginTop: 8,
                                        }}
                                    >
                                        <PlusOutlined />
                                    </div>
                                </button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        validateStatus={!!this.state.errors.find(err => err.param === 'name') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'name')?.msg}
                    >
                        <Input onChange={(e) => {
                            this.setState({ name: e.target.value })
                        }} className="input-text" value={ this.state.name } type="text" />
                    </Form.Item>

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

                    <Form.Item
                        label="Birthday"
                        validateStatus={!!this.state.errors.find(err => err.param === 'birthday') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'birthday')?.msg}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            onChange={(date, dateString) => this.setState({ birthday: dateString })} 
                            disabledDate={d => !d || !d.isBefore(new Date())} 
                        />
                    </Form.Item>

                    <Form.Item
                        label="Sex"
                        validateStatus={!!this.state.errors.find(err => err.param === 'sex') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'sex')?.msg}
                    >
                        <Select
                            style={{ width: '100%' }}
                            value={this.state.sex}
                            onChange={(value) => this.setState({ sex: value })}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' }
                            ]}
                        />
                    </Form.Item>

                    

                    <Typography.Text type="danger">
                        {this.state.errors.filter(err => err.param === 'all').map((err, i) => {
                            return <p>{ err.msg }</p>
                        })}
                    </Typography.Text>

                    <Button type="primary" onClick={this.register}>
                        { this.state.isFetching && '...' }
                        { !this.state.isFetching && 'Register' }
                    </Button>                    
                </Form>

                <Typography.Text>Already have an account? <a href="#" onClick={(e) => {
                    e.preventDefault()
                    this.props.changeForm('login')
                }}>Login now</a></Typography.Text>
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
        Register
    )
)