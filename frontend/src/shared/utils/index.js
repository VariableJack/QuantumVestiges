import { get } from 'lodash'
import config from '../../configurations/config.json'
import { FORUM_PAGES } from '../constants'

const getConfig = key => {
    const env = get(process.env, 'REACT_APP_STAGE', 'local')
    return get(config, [env, key], 'No value')
}

const getUrl = urlType => {
    switch (urlType) {
        case FORM_PAGES.BUG_REPORT:
            return '/bug-report/'
        case FORM_PAGES.SUPPORT:
            return '/support/'
        case FORM_PAGES.DISCUSSION:
            return '/discussion/'
        default:
            return ''
    }
}
const formatTimestamp = timestamp => {
    let date

    if (timestamp instanceof Date) {
        date = timestamp
    } else if (typeof timestamp === 'number') {
        date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp)
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp)
    }

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }

    return new Intl.DateTimeFormat('en-US', dateOptions).format(date)
}

export { getConfig, getUrl, formatTimestamp }
