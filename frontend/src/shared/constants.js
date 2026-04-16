const hostname = 'https://localhost'
const port = '3000'

const menubarItems = [
    {
        title: 'Website info',
        elements: [
            {
                menubarHeader: 'Home',
                path: '/',
            },
            {
                menubarHeader: 'Contact us',
                path: '/contact-us',
            },
            {
                menubarHeader: 'About us',
                path: '/about-us',
            },
            {
                menubarHeader: 'Account',
                path: '/account',
            },
        ],
    },
    {
        title: 'Support & New Feature Request',
        elements: [
            {
                menubarHeader: 'Bug report',
                path: '/bug-report',
            },
            {
                menubarHeader: 'Support',
                path: '/support',
            },
        ],
    },
]
const ADMINISTRATOR_ITEMS = [
    {
        title: 'Administrator',
        elements: [
            {
                menubarHeader: 'Create new franchise',
                path: '/',
            },
            {
                menubarHeader: 'Upload Game',
                path: '/',
            },
        ],
    },
]
/*
{
    menubarHeader: '',
    path: '/',
},
*/

export { hostname, port, menubarItems, ADMINISTRATOR_ITEMS, }
