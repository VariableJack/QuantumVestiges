import config from '../../configurations/config.json'

const getConfig = key => {
    const env = process.env.NODE_ENV
    return config[env][key]
}

export { getConfig }
