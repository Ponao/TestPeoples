import React from 'react'
import { withRouter } from 'react-router'
import peopleApi from '../../Apis/People'
import { Button, Card, Flex, List } from 'antd'
import { calculateAge } from '../../Controllers/FunctionsController'
import { EditFilled, LogoutOutlined } from '@ant-design/icons'
import { withCookies } from 'react-cookie'

class People extends React.Component {
    state = {
        users: [],
        isFetching: true
    }

    componentDidMount() {
        peopleApi.get().then(({ error, users, errors }) => {
            if(!error) this.setState({ users, isFetching: false })
        })
    }

    render() {
        return  <div style={{ padding: 16 }}>
            <Flex style={{ marginBottom: 16 }}>
                <Button icon={<EditFilled />} onClick={() => {
                    this.props.history.push('/account')
                }}>Edit profile</Button>

                <Button icon={<LogoutOutlined />} onClick={() => {
                    this.props.cookies.remove('_token')
                    window.location.reload()
                }}>Logout</Button>
            </Flex>

            <List
                grid={{ gutter: 16, column: 'auto' }}
                dataSource={this.state.users}
                loading={this.state.isFetching}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item._id}
                            style={{ width: 240, height: 'max-content' }}
                            cover={<img alt="example" src={`${process.env.REACT_APP_API_URL}/avatars/${item._id}.png`} />}
                        >
                            <h3>{ item.name }</h3>
                            <p>{ calculateAge(new Date(item.birthday)) } years old</p>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    }
}

export default withCookies(withRouter(People))