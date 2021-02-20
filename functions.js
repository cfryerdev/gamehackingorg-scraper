pagesUrl = (consoleType, pageNum) => { return `https://gamehacking.org/system/${consoleType}/all/${pageNum}`; };

gameUrl = (gameId) => { return `https://gamehacking.org/game/${gameId}/?name=&format=ar`; };

formatCode = (codeString) => {
    if (codeString == null) { return ""; }
    return space(codeString
        .replace(/\s/g, '')
        .replace(/\n/g, ''))
        .trim();
};

formatTitle = (titleString) => {
    if (titleString == null) { return ""; }
    return titleString
        .replace(/\t/g, '')
        .replace(/\n/g, '');
};

space = (str) => {
    if (!str) { return ""; }
    var v = str.replace(/[^\dA-Z]/g, ''), reg = new RegExp(".{8}", "g");
    return v.replace(reg, (a) => {
        return a + ' ';
    });
};

validateCode = (code) => {

}

module.exports = { pagesUrl, gameUrl, formatCode, formatTitle }