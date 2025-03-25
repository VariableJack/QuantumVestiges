const hostname = 'http://127.0.0.1';
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
            }
        ]
    },
    {
        title: 'Games',
        elements: [
            {
                menubarHeader: 'Trading Card Game',
                path: '/',
            },
            {
                menubarHeader: 'RPGs',
                path: '/contact-us',
            },
            {
                menubarHeader: 'Others',
                path: '/about-us',
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
export {
    hostname,
    port,
    menubarItems,
}