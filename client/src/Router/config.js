import React from 'react'

import People from '../Pages/Private/People'
import Auth from '../Pages/Auth'
import EditProfile from '../Pages/Private/EditProfile'

const routes = [
    {
        path: '/',
        exact: true,
        type: 'auth',
        title: 'Auth',
        component: () => <Auth />
    },
    {
        path: '/people',
        exact: false,
        type: 'private',
        title: 'People',
        component: () => <People />
    },
    {
        path: '/account',
        exact: false,
        type: 'private',
        title: 'Edit profile',
        component: () => <EditProfile />
    }
]

export default routes