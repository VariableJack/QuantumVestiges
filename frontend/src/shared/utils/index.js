const getUrl = (urlType) => {
    switch (urlType) {
	    case 'FEATURE_REQUEST':
		    return '/feature-request/';
	    case 'GAME_REQUEST':
		    return '/game-request/';
	    case 'BUG_REPORT':
		    return '/bug-report/';
	    case 'SUPPORT':
		    return '/support/';
		default:
		    return '';
	}
}

export {
    getUrl,
}