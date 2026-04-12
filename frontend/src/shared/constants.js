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
            {
                menubarHeader: 'Feature Request',
                path: '/feature-request',
            },
            {
                menubarHeader: 'Game Request',
                path: '/game-request',
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

const MOCK_ITEMS_TO_DISPLAY = [
    {
        title: 'Test',
        id: 12345,
        type: 'FEATURE_REQUEST',
    },
]
export { hostname, port, menubarItems, MOCK_ITEMS_TO_DISPLAY }
