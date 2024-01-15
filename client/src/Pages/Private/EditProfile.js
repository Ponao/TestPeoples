import React from 'react'
import userApi from '../../Apis/User'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/actions/user'
import { bindActionCreators } from 'redux'
import { withCookies } from 'react-cookie'

import { Flex, Button, Form, Input, Typography, Upload } from 'antd'
import Title from 'antd/es/typography/Title'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { PlusOutlined } from '@ant-design/icons'

class EditProfile extends React.Component {
    state = {
        name: this.props.user.name,
        password: '',
        newPassword: '',
        avatarFile: null,
        avatarUrl: `${process.env.REACT_APP_API_URL}/avatars/${this.props.user._id}.png`,
        isFetching: false,
        errors: [],
    }

    save = () => {
        this.setState({ isFetching: true, errors: [] })

        userApi.update({
            name: this.state.name,
            password: this.state.password,
            newPassword: this.state.newPassword,
            avatarFile: this.state.avatarFile
        }).then(({ error, user, errors }) => {
            if(error) {
                return this.setState({ isFetching: false, errors })
            }

            this.props.userActions.loginUser(user)

            this.setState({ isFetching: false })
        })
    }

    selectAvatar = (info) => {
        let file = info.file
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if(!isJpgOrPng) {
            alert('You can only upload JPG/PNG file!')
        }
        const isLt10M = file.size / 1024 / 1024 < 10
        if(!isLt10M) {
            alert('Image must smaller than 2MB!')
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
                    <Title>Edit profile</Title>

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
                        label="Password"
                        validateStatus={!!this.state.errors.find(err => err.param === 'password') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'password')?.msg}
                    >
                        <Input onChange={(e) => {
                            this.setState({ password: e.target.value })
                        }} className="input-text" value={ this.state.password } type="password" />
                    </Form.Item>

                    <Form.Item
                        label="New password"
                        validateStatus={!!this.state.errors.find(err => err.param === 'newPassword') ? 'error' : 'validating'}
                        help={this.state.errors.find(err => err.param === 'newPassword')?.msg}
                    >
                        <Input onChange={(e) => {
                            this.setState({ newPassword: e.target.value })
                        }} className="input-text" value={ this.state.newPassword } type="password" />
                    </Form.Item>

                    <Typography.Text type="danger">
                        {this.state.errors.filter(err => err.param === 'all').map((err, i) => {
                            return <p>{ err.msg }</p>
                        })}
                    </Typography.Text>

                    <Button type="primary" onClick={this.save}>
                        { this.state.isFetching && '...' }
                        { !this.state.isFetching && 'Save' }
                    </Button>

                    <Button style={{ marginLeft: 8 }} onClick={() => {
                        this.props.history.push('/people')
                    }}>
                        Go back to peoples
                    </Button>                  
                </Form>
            </Flex>
        </>
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withCookies(
        withRouter(EditProfile)
    )
)