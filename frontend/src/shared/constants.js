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

const FORUM_PAGES = {
	BUG_REPORT: 'BUG_REPORT',
	SUPPORT: 'SUPPORT',
	DISCUSSION: 'DISCUSSION'
}

const FORUM_PAGE_ITEMS = {
	[FORUM_PAGES.BUG_REPORT]: {
		baseTitle: (group) => 'All bug reports',
		submitPageTitle: () => 'Create a bug report',
		submitButtonText: () => 'Submit a bug',
		recentText: () => 'Recent bug reports',
	},
	[FORUM_PAGES.SUPPORT]: {
		baseTitle: (group) => `${group === 'admin' && 'All ' || 'Your'} support requests`,
		submitPageTitle: () => 'Request support',
		submitButtonText: () => 'Request support',
		recentText: () => 'Recent support requests',
	},
	[FORUM_PAGES.DISCUSSION]: {
		baseTitle: (group) => 'Discussions',
		submitPageTitle:() =>  'Start new discussion',
		submitButtonText:() =>  'Post',
		recentText: () => 'Recent discussions',
		
	},
}

export { hostname, port, menubarItems, ADMINISTRATOR_ITEMS, FORUM_PAGES, FORUM_PAGE_ITEMS }
