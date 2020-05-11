const apiUrl: string = 'https://api.github.com';
const searchButton: HTMLElement = document.getElementById('search-button');
const table: HTMLTableElement = document.getElementsByClassName('list-container')[0] as HTMLTableElement;

let httpRequest: any;
let searchFn: number;

// init
(function init(): void {
    initAjax();

    httpRequest.onreadystatechange = searchForPhrase(0);

    watchOnEnter();
    watchOnSearchButton();
})();

function searchForPhrase(delay = 300): void {
    const searchPhrase: string = (document.getElementsByClassName('search-input')[0] as HTMLInputElement).value;
    
    if (!searchPhrase) {
        return;
    }

    clearTimeout(searchFn);
    searchFn = setTimeout(() => featchRepoList(searchPhrase), delay);
}

function watchOnEnter(): void {
    document.addEventListener('keyup', ({ key }) => {
        if (key === 'Enter') {
            searchForPhrase(0);
        }
    });
}

function watchOnSearchButton(): void {
    searchButton.addEventListener('click', () => searchForPhrase(0))
}

function featchRepoList(searchPhrase: string): void {
    clear();

    getRepoList(searchPhrase)
        .then(
            (data: string) => {
                const { items } = JSON.parse(data);
                const header = creatRowWithValues('th', 'No.', 'Name', 'Login', 'Dpwnload url');
                
                table.appendChild(header);

                items.forEach(({ name, downloads_url, owner: { login }}, index) => {
                    const rowElement = creatRowWithValues('tr', index +1, name, login, downloads_url);

                    table.appendChild(rowElement);
                });
            }
            
        )
        .catch(
            (error: any) => console.error('Promise error: ', error)
        )
}

function clear(): void {
    while (table.lastElementChild) {
        table.removeChild(table.lastElementChild);
      }
}

function creatRowWithValues(domElement: string, ...list: string[]): HTMLElement {
    const row = document.createElement(domElement);
    row.setAttribute('class', 'list-element');

    list.forEach((value) => {
        const cell = creatCellWith(value);

        row.appendChild(cell);
    })

    return row;
}

function creatCellWith(value: string): HTMLTableCellElement {
    const cell: HTMLTableCellElement = document.createElement('td');

    cell.innerHTML = value;

    return cell;
}

function getRepoList(searchPhrase: string): Promise<any> {
    const searchFor: string = searchPhrase.trim().toLowerCase();
    const params: string = `?q=${searchFor}&type=Repositories`

    return new Promise((resolve, reject) => {
        httpRequest.addEventListener("load", () => resolve(httpRequest.responseText));
        httpRequest.open('GET', `${apiUrl}/search/repositories${params}`);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send();
    })
}

function initAjax(): void {
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    }
}
