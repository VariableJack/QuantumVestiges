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
        title: 'Browse',
        elements: [
            {
                menubarHeader: 'Forums',
                path: '/forums',
            },
            {
                menubarHeader: 'Discord',
                path: 'www.discord.gg/',
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
                path: '/franchise/create',
            },
            {
                menubarHeader: 'Upload Game',
                path: '/game/create',
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

const FORUM_PAGES = {
    SUPPORT: 'SUPPORT',
    BUG_REPORT: 'BUG_REPORT',
    DISCUSSION: 'DISCUSSION',
}

const FORUM_PAGE_ITEMS = {
    [FORUM_PAGES.SUPPORT]: {
        baseTitle: group => `${(group === 'admin' && 'All ') || 'Your'} support requests`,
        submitPageTitle: () => 'Request support',
        submitButtonText: () => 'Request support',
        recentText: () => 'Recent support requests',
        detailedPageTitle: () => 'Support Request',
        allViewUrl: () => '/support',
        createUrl: () => '/support/create',
    },
    [FORUM_PAGES.BUG_REPORT]: {
        baseTitle: group => 'All bug reports',
        submitPageTitle: () => 'Create a bug report',
        submitButtonText: () => 'Submit a bug',
        recentText: () => 'Recent bug reports',
        detailedPageTitle: () => 'Bug reports',
        allViewUrl: () => '/bug-report',
        createUrl: () => '/bug-report/create',
    },
    [FORUM_PAGES.DISCUSSION]: {
        baseTitle: group => 'Discussions',
        submitPageTitle: () => 'Start new discussion',
        submitButtonText: () => 'Post',
        recentText: () => 'Recent discussions',
        detailedPageTitle: () => 'Bug Report',
        allViewUrl: () => '/discussion',
        createUrl: () => '/discussion/create',
    },
}

const DEFAULT_FRANCHISE = { franchiseId: -1, franchiseName: '-' }
const CONNECTION_ERROR_MESSAGE = 'Connection error'

export {
    hostname,
    port,
    menubarItems,
    ADMINISTRATOR_ITEMS,
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    DEFAULT_FRANCHISE,
    CONNECTION_ERROR_MESSAGE,
}
