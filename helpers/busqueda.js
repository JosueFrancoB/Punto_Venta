const escapeStringRegexp = (string) => {
    if (typeof string !== 'string') {
        return string;
    }
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

const convertArrayInObjectsArray = async (arrayTags = [], regex = RegExp) => {
    const SearchIn = [];
    for (let i = 0; i < arrayTags.length; ++i) {
        let objectSearch = {};
        if (arrayTags[i] !== undefined) objectSearch[arrayTags[i].toString()] = regex;
        SearchIn.push(objectSearch);
    }
    return SearchIn;
}

const diacriticInsensitiveRegExp = async (search = '') => {
    return search.toLowerCase()
        .replace(/[aâäàåá]/g, '[a,â,ä,à,å,á]')
        .replace(/[eêëèé]/g, '[e,ê,ë,è,é]')
        .replace(/[iïîìí]/g, '[i,ï,î,ì,í]')
        .replace(/[oôöòó]/g, '[o,ô,ö,ò,ó]')
        .replace(/[uüûùú]/g, '[u,ü,û,ù,ú]')
        .replace(/[n]/g, '[n,ñ]')
        .replace(/[yÿý]/g, '[y,ÿ,ý]');
}

module.exports = {
    convertArrayInObjectsArray,
    diacriticInsensitiveRegExp,
    escapeStringRegexp
}