const hostname = 'https://127.0.0.1';
const port = '3000';

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
                menubarHeader: 'Login',
                path: '/login',
            }
        ]
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
                menubarHeader: 'Game request',
                path: '/game-request',
            },
        ]
    }
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
];
export {
    hostname,
    port,
    menubarItems,
    MOCK_ITEMS_TO_DISPLAY,
}