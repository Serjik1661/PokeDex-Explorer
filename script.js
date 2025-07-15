// Получаем элементы DOM
const input = document.getElementById('inputName'); // Поле ввода имени покемона
const bth = document.querySelector('button'); // Кнопка поиска
const pokemons = document.querySelector('.pokeCart'); // Контейнер для покемонов (не используется в текущем коде)
const url = 'https://pokeapi.co/api/v2/pokemon/'; // Базовый URL API покемонов
const displayNoName = document.querySelector('.noName'); // Элемент для отображения сообщения "Покемон не найден"

// Функция для поиска покемона по имени
async function getPokemon(name) {
    try {
        // Запрашиваем список покемонов с API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
        const data = await response.json();
        console.log(data.results); // Выводим список покемонов в консоль

        let result = 0; // Переменная для хранения результата поиска

        // Перебираем всех покемонов в поисках совпадения по имени
        data.results.forEach(element => {
            if(element.name === name) {
                result = name; // Если нашли совпадение, сохраняем имя
            }
            // return здесь не имеет эффекта, так как forEach игнорирует возвращаемые значения
        });

        // Находим индекс покемона в списке и добавляем 1 (так как индексы начинаются с 0)
        const pokemonIndex = data.results.findIndex(element => element.name === result) + 1;

        // Если покемон не найден, показываем сообщение
        if(!result) {
            displayNoName.style.display = 'block';
        }

        console.log(result); // Выводим имя найденного покемона
        console.log(pokemonIndex); // Выводим индекс покемона



        return pokemonIndex; // Возвращаем индекс покемона

    } catch {
        console.error('Error: Не нашли покемона');
    }
}

// Функция для получения подробной информации о покемоне по ID
async function getCartPokemon(id) {
    // Запрашиваем данные покемона по ID
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    const data = await response.json();
    return data; // Возвращаем данные покемона
}

// Основная функция инициализации
async function init() {
    // Получаем ID покемона по введенному имени
    const pokemonId = await getPokemon(input.value.toLowerCase());
    // Получаем подробную информацию о покемоне
    const data = await getCartPokemon(pokemonId);
    // Отображаем информацию о покемоне
    render(data);
}

async function renderCart () {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
        const data = await response.json();

        const cards = document.querySelector('.cards');

        console.log(data.results)
        for (item of data.results) {


            const pokemon = await getPokemon(item.name);
            const pokemonItem = await getCartPokemon(pokemon)
            console.log(pokemonItem.height)

            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemonCard';

            const h2 = document.createElement('h2');
            h2.id = 'cardName';
            h2.textContent = pokemonItem.name;

            const img = document.createElement('img');
            img.src = pokemonItem.sprites.front_default;

            pokemonCard.appendChild(h2);
            pokemonCard.appendChild(img);
            cards.appendChild(pokemonCard);

            pokemonCard.addEventListener('click', () => {
                console.log('Выбран покемон: ', pokemonItem.name);
                console.log('ID покемона', pokemonItem.id);
                render(pokemonItem)
            })
        }
}



renderCart()

// Функция для отображения информации о покемоне
async function render(data) {
    const card = document.querySelector('.card'); // Контейнер карточки покемона
    card.innerHTML = '';
    console.log(data); // Выводим данные покемона в консоль
    // const img = document.querySelector('img'); // Изображение покемона
    const h2 = document.createElement('h2');
    h2.id = 'cardName';

    const img = document.createElement('img');

    // const cardName = document.getElementById('cardName'); // Элемент для имени

    // Заполняем данные карточки
    h2.textContent = `${data.name}`; // Устанавливаем имя
    img.src = `${data.sprites.other.showdown.front_default}`; // Устанавливаем изображение

    card.appendChild(h2);
    card.appendChild(img);

    data.stats.forEach(item => {
        const p = document.createElement('p');
        p.className = 'statName'
        p.textContent = `${item.stat.name}: `;

        const span = document.createElement('span');
        span.className = 'statBase';
        span.textContent = `${item.base_stat}`;

        p.appendChild(span);
        card.appendChild(p);
    })
    displayNoName.style.display = 'none'; // Скрываем сообщение "Не найдено"
    card.style.display = 'flex'; // Показываем карточку
}

// Вешаем обработчик клика на кнопку
bth.addEventListener('click', () => {
    init(); // При клике запускаем процесс поиска и отображения
});
