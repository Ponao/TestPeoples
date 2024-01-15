import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { CookiesProvider } from 'react-cookie'
import {
    BrowserRouter as Router,
} from "react-router-dom"

import store from './Redux/store'
import { Provider } from 'react-redux'

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
)