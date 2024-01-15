import React from "react";
// Router
import { Switch, Route, Redirect, withRouter } from "react-router-dom"
import routes from './config'

// Redux
import { connect } from "react-redux"
import * as userActions from "../Redux/actions/user"
import { bindActionCreators } from "redux"
 
// Other functions
import { setTitle } from "../Controllers/FunctionsController"
import { withCookies } from "react-cookie"
import userApi from "../Apis/User"

class AppRouter extends React.Component {
    state = {
        isRender: false
    }

    componentDidMount() {
        this.props.history.listen(() => {
            setTitle(this.props.history.location.pathname, routes)
        })
        
        setTitle(this.props.history.location.pathname, routes)

        let _token = this.props.cookies.get('_token')
        
        if(_token) {
            userApi.me().then(({user, error}) => {
                if(!error) {
                    this.props.userActions.loginUser(user)
                    this.setState({isRender: true})
                } else {
                    this.setState({isRender: true})
                }
            })
        } else {
            this.setState({isRender: true})
        }
    }

    render() {
        return this.state.isRender && (<>
            <Switch>
                {routes.map((route, index) => {
                    switch (route.type) {
                        case 'auth':
                            return <this.AuthRoute
                                key={index}
                                path={route.path}
                                exact={route.exact}
                            >
                                <route.component />
                            </this.AuthRoute>
                        case 'private':
                            return <this.PrivateRoute
                                key={index}
                                path={route.path}
                                exact={route.exact}
                            >
                                <route.component />
                            </this.PrivateRoute>
                        default:
                            return false
                    }            
                })}

                <Route component={() =>
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                } />
            </Switch>
        </>)
    }

    PrivateRoute = ({ children, ...rest }) => {
        return (
            <Route
                {...rest}
                render={() =>
                    this.props.user.isAuth ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                            }}
                        />
                    ) 

                }
            />
        )
    }

    AuthRoute = ({ children, ...rest }) => {
        return (
            <Route
                {...rest}
                render={() =>
                    !this.props.user.isAuth ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/people",
                            }}
                        />
                    )
                }
            />
        )
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
)(withCookies(withRouter(AppRouter)))
