var apiUrl = 'https://api.github.com';
var searchButton = document.getElementById('search-button');
var table = document.getElementsByClassName('list-container')[0];
var httpRequest;
var searchFn;
// init
(function init() {
    initAjax();
    httpRequest.onreadystatechange = searchForPhrase(0);
    watchOnEnter();
    watchOnSearchButton();
})();
function searchForPhrase(delay) {
    if (delay === void 0) { delay = 300; }
    var searchPhrase = document.getElementsByClassName('search-input')[0].value;
    if (!searchPhrase) {
        return;
    }
    clearTimeout(searchFn);
    searchFn = setTimeout(function () { return featchRepoList(searchPhrase); }, delay);
}
function watchOnEnter() {
    document.addEventListener('keyup', function (_a) {
        var key = _a.key;
        if (key === 'Enter') {
            searchForPhrase(0);
        }
    });
}
function watchOnSearchButton() {
    searchButton.addEventListener('click', function () { return searchForPhrase(0); });
}
function featchRepoList(searchPhrase) {
    clear();
    getRepoList(searchPhrase)
        .then(function (data) {
        var items = JSON.parse(data).items;
        var header = creatRowWithValues('th', 'No.', 'Name', 'Login', 'Dpwnload url');
        table.appendChild(header);
        items.forEach(function (_a, index) {
            var name = _a.name, downloads_url = _a.downloads_url, login = _a.owner.login;
            var rowElement = creatRowWithValues('tr', index + 1, name, login, downloads_url);
            table.appendChild(rowElement);
        });
    })["catch"](function (error) { return console.error('Promise error: ', error); });
}
function clear() {
    while (table.lastElementChild) {
        table.removeChild(table.lastElementChild);
    }
}
function creatRowWithValues(domElement) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    var row = document.createElement(domElement);
    row.setAttribute('class', 'list-element');
    list.forEach(function (value) {
        var cell = creatCellWith(value);
        row.appendChild(cell);
    });
    return row;
}
function creatCellWith(value) {
    var cell = document.createElement('td');
    cell.innerHTML = value;
    return cell;
}
function getRepoList(searchPhrase) {
    var searchFor = searchPhrase.trim().toLowerCase();
    var params = "?q=" + searchFor + "&type=Repositories";
    return new Promise(function (resolve, reject) {
        httpRequest.addEventListener("load", function () { return resolve(httpRequest.responseText); });
        httpRequest.open('GET', apiUrl + "/search/repositories" + params);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send();
    });
}
function initAjax() {
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    }
}
