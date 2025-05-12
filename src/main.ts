import {API_URL,API_KEY} from "./API.ts";

interface Movie {
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
}

function createSearchInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите название фильма...';
    input.id = 'search-input';
    return input;
}

function createResultsContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'results-container';
    return container;
}

function createMovieCard(movie: Movie): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const poster = document.createElement('img');
    poster.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
    poster.alt = movie.Title;

    const title = document.createElement('h3');
    title.textContent = movie.Title;

    const year = document.createElement('p');
    year.textContent = `Год: ${movie.Year}`;

    const type = document.createElement('p');
    type.textContent = `Тип: ${movie.Type}`;

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(year);
    card.appendChild(type);

    return card;
}

async function fetchMovies(query: string): Promise<Movie[]> {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();
    return data.Search || [];
}

function debounce(func: (...args: any[]) => void, delay: number) {
    let timeout: number | undefined;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), delay);
    };
}

function setupLiveSearch(input: HTMLInputElement, resultsContainer: HTMLDivElement) {
    const handleSearch = async () => {
        const query = input.value.trim();
        resultsContainer.innerHTML = '';

        if (query.length >= 4) {
            const movies = await fetchMovies(query);
            movies.forEach((movie) => {
                const card = createMovieCard(movie);
                resultsContainer.appendChild(card);
            });
        }
    };

    const debouncedSearch = debounce(handleSearch, 500);

    input.addEventListener('input', () => {
        if (input.value.trim().length >= 4) {
            debouncedSearch();
        } else {
            resultsContainer.innerHTML = '';
        }
    });
}

function initApp() {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    const searchInput = createSearchInput();
    const resultsContainer = createResultsContainer();

    app.appendChild(searchInput);
    app.appendChild(resultsContainer);

    setupLiveSearch(searchInput, resultsContainer);
}

initApp();