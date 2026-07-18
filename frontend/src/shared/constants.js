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
                menubarHeader: 'Upload Product',
                path: '/product/create',
            },
        ],
    },
]

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
        detailedPageTitle: () => 'Discussion',
        allViewUrl: () => '/discussion',
        createUrl: () => '/discussion/create',
    },
}

const DEFAULT_FRANCHISE = { franchiseId: -1, franchiseName: '-' }
const CONNECTION_ERROR_MESSAGE = 'Connection error'
const COMMON_LOADING_DESCRIPTION_PREFIX = 'Please wait as the system'
const COMMON_ERROR_TITLE_PREFIX = 'Failed to'
const COMMON_SUCCESS_TITLE_PREFIX = 'Successfully'
const COMMON_SUCCESS_DESCRIPTION_PREFIX = 'The system has successfully'
const FORUM_MESSAGE_TYPES = {
    LOADING: 'LOADING',
    LOADING_ERROR: 'LOADING_ERROR',
    LOADING_ALL: 'LOADING_ALL',
    LOADING_ALL_ERROR: 'LOADING_ALL_ERROR',
    CREATE_THREAD_LOADING: 'CREATE_THREAD_LOADING',
    CREATE_THREAD_ERROR: 'CREATE_THREAD_ERROR',
    CREATE_THREAD_SUCCESS: 'CREATE_THREAD_SUCCESS',
    ADD_COMMENT_LOADING: 'ADD_COMMENT_LOADING',
    ADD_COMMENT_ERROR: 'ADD_COMMENT_ERROR',
    ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
    CLOSE_THREAD_LOADING: 'CLOSE_THREAD_LOADING',
    CLOSE_THREAD_ERROR: 'CLOSE_THREAD_ERROR',
    CLOSE_THREAD_SUCCESS: 'CLOSE_THREAD_SUCCESS',
    REOPEN_THREAD_LOADING: 'REOPEN_THREAD_LOADING',
    REOPEN_THREAD_ERROR: 'REOPEN_THREAD_ERROR',
    REOPEN_THREAD_SUCCESS: 'REOPEN_THREAD_SUCCESS',
}
const FORUM_MESSAGE_PREFIXES = {
    [FORUM_MESSAGE_TYPES.LOADING]: {
        title: 'Fetching ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} retrieves the `,
    },
    [FORUM_MESSAGE_TYPES.LOADING_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} fetch `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.LOADING_ALL]: {
        title: 'Fetching ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} retrieves all `,
    },
    [FORUM_MESSAGE_TYPES.LOADING_ALL_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} fetch all `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING]: {
        title: 'Creating ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} saves the `,
    },
    [FORUM_MESSAGE_TYPES.CREATE_THREAD_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} create new `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS]: {
        title: 'Creating ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} saves the `,
    },
    [FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING]: {
        title: 'Adding comment to ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} saves the comment to the current `,
    },
    [FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} add comment to `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} added comment to `,
        description: 'Your comment has been successfully saved to the ',
    },
    [FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING]: {
        title: 'Closing out the ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} closes out the `,
    },
    [FORUM_MESSAGE_TYPES.CLOSE_THREAD_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} to close out the `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} closed out the `,
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} closed out the `,
    },
    [FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING]: {
        title: 'Reopening the ',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} reopening the `,
    },
    [FORUM_MESSAGE_TYPES.REOPEN_THREAD_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} to close out the `,
        description: '',
    },
    [FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} reopened out the `,
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} reopened out the `,
    },
}
const ACCOUNT_MESSAGE_TYPES = {
    ADD_TO_LOADING: 'ADD_TO_LOADING',
    ADD_TO_ERROR: 'ADD_TO_ERROR',
    ADD_TO_SUCCESS: 'ADD_TO_SUCCESS',
    REMOVE_FROM_LOADING: 'REMOVE_FROM_LOADING',
    REMOVE_FROM_ERROR: 'REMOVE_FROM_ERROR',
    REMOVE_FROM_SUCCESS: 'REMOVE_FROM_SUCCESS',
    CHECKOUT_CART_LOADING: 'CHECKOUT_CART_LOADING',
    CHECKOUT_CART_ERROR: 'CHECKOUT_CART_ERROR',
    CHECKOUT_CART_SUCCESS: 'CHECKOUT_CART_SUCCESS',
    ACCOUNT_LOADING: 'ACCOUNT_LOADING',
    ACCOUNT_LOADING_ERROR: 'ACCOUNT_LOADING_ERROR',
    NOTIFICATION_UPDATE_LOADING: 'NOTIFICATION_UPDATE_LOADING',
    NOTIFICATION_UPDATE_ERROR: 'NOTIFICATION_UPDATE_ERROR',
    NOTIFICATION_UPDATE_SUCCESS: 'NOTIFICATION_UPDATE_SUCCESS',
}
const ACCOUNT_MESSAGES = {
    [ACCOUNT_MESSAGE_TYPES.ADD_TO_LOADING]: {
        title: 'Adding item to order',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} add the item from your order`,
    },
    [ACCOUNT_MESSAGE_TYPES.ADD_TO_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} add item to your order`,
        description: '',
    },
    [ACCOUNT_MESSAGE_TYPES.ADD_TO_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} added item to order`,
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} added the item to your cart`,
    },
    [ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_LOADING]: {
        title: 'Removing item from order',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} removes the item from your order`,
    },
    [ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} remove item from your order`,
        description: '',
    },
    [ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} removed item from order`,
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} removed the item from your order`,
    },
    [ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_LOADING]: {
        title: 'Checking out order...',
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} checks out your order`,
    },
    [ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} check out your order`,
        description: '',
    },
    [ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} checked out your order`,
        description: 'Your Notification Preferences have been successfully updated',
    },
    [ACCOUNT_MESSAGE_TYPES.ACCOUNT_LOADING]: {
        title: 'Loading account',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} loads your account`,
    },
    [ACCOUNT_MESSAGE_TYPES.ACCOUNT_LOADING_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} to load account`,
        description: '',
    },
    [ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_LOADING]: {
        title: 'Updating notification preferences',
        description: `${COMMON_LOADING_DESCRIPTION_PREFIX} updates your notification preferences`,
    },
    [ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_ERROR]: {
        title: `${COMMON_ERROR_TITLE_PREFIX} to update notification preferences`,
        description: '',
    },
    [ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_SUCCESS]: {
        title: `${COMMON_SUCCESS_TITLE_PREFIX} updated notification preferences`,
        description: `${COMMON_SUCCESS_DESCRIPTION_PREFIX} updated notification preferences`,
    },
}

export {
    menubarItems,
    ADMINISTRATOR_ITEMS,
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    DEFAULT_FRANCHISE,
    CONNECTION_ERROR_MESSAGE,
    FORUM_MESSAGE_TYPES,
    FORUM_MESSAGE_PREFIXES,
    ACCOUNT_MESSAGE_TYPES,
    ACCOUNT_MESSAGES,
}
