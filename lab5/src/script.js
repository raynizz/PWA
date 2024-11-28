document.addEventListener('DOMContentLoaded', function() {
    const navBlock = document.getElementById('nav-block');
    const downRightColumn = document.getElementById('down-right-column');
    const downLeftColumn = document.getElementById('down-left-column');
    const headerLogo = document.querySelector('.header-logo');
    const footerLogo = document.querySelector('.footer-logo');
    const dialog = document.getElementById('dialog');
    const dialogOverlay = document.getElementById('dialog-overlay');
    const colorSelect = document.getElementById('color-select');
    const leftSide = document.querySelector('.left-side');
    const midlSection = document.querySelector('.midl-section');
    let isSwapped = false;
    let tableData = [];
    let currentBlock = null;

    // зберегти початковий контент блоків, де буле форма
    const originalLeftSideContent = leftSide.innerHTML;
    const originalMidlSectionContent = midlSection.innerHTML;

    function swapContent() {
        const tempContent = navBlock.innerHTML;
        navBlock.innerHTML = downRightColumn.innerHTML;
        downRightColumn.innerHTML = tempContent;
        isSwapped = !isSwapped;
        attachEventListeners();
    }

    function attachEventListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // не дати лінці виконати дію по замовчуванню
                swapContent();
            });
        });
    }

    attachEventListeners();

    // площа кола
    function calculateCircleArea(radius) {
        if (radius <= 0 || isNaN(radius)) {
            alert('Введіть додатне число для радіусу');
            return;
        }
        const area = Math.PI * Math.pow(radius, 2);
        const resultElement = document.createElement('p');
        resultElement.textContent = `Площа кола з радіусом ${radius} дорівнює ${area.toFixed(2)}`;
        downLeftColumn.innerHTML = ''; // чистим контент downLeftColumn
        downLeftColumn.appendChild(resultElement);
    }

    // пошук мінімальної цифри в числі
    function findMinDigit(number) {
        const digits = number.toString().replace(/[^0-9]/g, '').split('').map(Number);
        return Math.min(...digits);
    }

    // обробка кліку на лого в хедері
    headerLogo.addEventListener('click', function() {
        const radius = prompt("Введіть радіус:");
        if (radius !== null && radius !== "") {
            calculateCircleArea(parseFloat(radius));
        }
    });

    // обробка події надсилання форми
    document.addEventListener('submit', function(event) {
        if (event.target && event.target.id === 'number-form') {
            event.preventDefault();
            const numberInput = document.getElementById('number');
            const number = parseFloat(numberInput);
            if (!isNaN(number) && number > 0) {
                if (number > Number.MAX_SAFE_INTEGER) {
                    alert('Число занадто велике');
                    return;
                }
                const minDigit = findMinDigit(number);
                alert(`Мінімальна цифра в числі ${number} дорівнює ${minDigit}`);
                document.cookie = `minDigit=${minDigit}; path=/`;
                dialog.style.display = 'none';
                dialogOverlay.style.display = 'none';
            }
        }
    });

    // сховати діалогове вікно при кліку на оверлей
    dialogOverlay.addEventListener('click', function() {
        dialog.style.display = 'none';
        dialogOverlay.style.display = 'none';
    });

    // перевірка кукісів при завантаженні сторінки
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        acc[name] = value;
        return acc;
    }, {});

    if (cookies.minDigit) {
        const userConfirmed = confirm(`Збережена мінімальна цифра: ${cookies.minDigit}. Бажаєте зберегти ці дані?`);
        if (userConfirmed) {
            alert('Дані збережено. Перезавантажте сторінку.');
        } else {
            document.cookie = 'minDigit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            location.reload();
        }
    } else {
        // показати форму в нижньому лівому стовпці, коли клікнуто на лого палі в футері
        footerLogo.addEventListener('click', function() {
            downLeftColumn.innerHTML = ''; // очистить вміст downLeftColumn
            const formHTML = `
                <form id="number-form">
                    <label for="number">Введіть натуральне чисор:</label>
                    <input type="number" id="number" name="number" required>
                    <button type="submit">Підтвердити</button>
                </form>
            `;
            downLeftColumn.innerHTML = formHTML;

            // повторно підключить обробник подій надсилання форми
            const dynamicNumberForm = document.getElementById('number-form');
            dynamicNumberForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const number = parseInt(document.getElementById('number').value);
                if (Number.isInteger(number) && number > 0) {
                    const minDigit = findMinDigit(number);
                    alert(`Мінімальна цифра в числі ${number} дорівнює ${minDigit}`);
                    document.cookie = `minDigit=${minDigit}; path=/`;
                    downLeftColumn.innerHTML = ''; // очистити вміст downLeftColumn
                } else {
                    alert('Введіть натуральне число');
                }
            });
        });
    }

    // вибір кольору для тексту в downRightColumn
    if (colorSelect) {
        colorSelect.addEventListener('change', function() {
            const selectedColor = colorSelect.value;
            downRightColumn.style.color = selectedColor;
            localStorage.setItem('downRightColumnTextColor', selectedColor);
        });

        // підгрузка кольору з локад стореджа
        const savedColor = localStorage.getItem('downRightColumnTextColor');
        if (savedColor) {
            downRightColumn.style.color = savedColor;
            colorSelect.value = savedColor;
        }
    }

    // свторення таблички
    function createTable(cellCount) {
        const table = document.createElement('table');
        if (cellCount % 2 === 0) {
            // для парного числа створюємо дві колонки
            const rows = cellCount / 2;
            for (let i = 0; i < rows; i++) {
                const tr = document.createElement('tr');
                for (let j = 0; j < 2; j++) {
                    const td = document.createElement('td');
                    td.textContent = `Cell ${i * 2 + j + 1}`;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        } else {
            // для непарного числа створюємо одну колонку
            for (let i = 0; i < cellCount; i++) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = `Cell ${i + 1}`;
                tr.appendChild(td);
                table.appendChild(tr);
            }
        }
        return table;
    }

    // функція для обробки події mouseenter
    function handleMouseEnter(event) {
        const target = event.target;
        if (currentBlock && currentBlock !== target) {
            currentBlock.innerHTML = currentBlock === leftSide ? originalLeftSideContent : originalMidlSectionContent;
        }
        currentBlock = target;
        const formHTML = `
            <form id="table-form">
                <label for="cell-count">Введіть кількість комірок:</label>
                <input type="number" id="cell-count" name="cell-count" required>
                <button type="button" id="create-table">Створити таблицю</button>
                <button type="button" id="save-table">Зберігти таблицю</button>
            </form>
        `;
        target.innerHTML = formHTML;

        const createTableButton = document.getElementById('create-table');
        createTableButton.addEventListener('click', function() {
            const cellCount = parseInt(document.getElementById('cell-count').value);
            if (Number.isInteger(cellCount) && cellCount > 0) {
                const table = createTable(cellCount);
                target.querySelector('form').insertAdjacentElement('afterend', table);

                // збереження таблички в локал сторедж
                tableData = [];
                table.querySelectorAll('td').forEach(td => {
                    tableData.push(td.textContent);
                });
                localStorage.setItem('tableData', JSON.stringify(tableData));
            } else {
                alert('Введіть натуральне число');
            }
        });

        const saveTableButton = document.getElementById('save-table');
        saveTableButton.addEventListener('click', function() {
            const table = target.querySelector('table');
            if (table) {
                tableData = [];
                table.querySelectorAll('td').forEach(td => {
                    tableData.push(td.textContent);
                });
                localStorage.setItem('tableData', JSON.stringify(tableData));
                alert('Таблиця збережена в localStorage');
            } else {
                alert('Немає таблиці для збереження');
            }
        });
    }

    // функція для відновлення контенту та переміщення таблиці
    function restoreContentAndMoveTable(target) {
        if (tableData.length > 0) {
            const formHTML = `
                <form id="table-form">
                    <label for="cell-count">Enter number of cells:</label>
                    <input type="number" id="cell-count" name="cell-count" required>
                    <button type="button" id="create-table">Create Table</button>
                    <button type="button" id="save-table">Save Table</button>
                </form>
            `;
            target.innerHTML = formHTML;

            const table = createTable(tableData.length);
            table.querySelectorAll('td').forEach((td, index) => {
                td.textContent = tableData[index];
            });
            target.querySelector('form').insertAdjacentElement('afterend', table);

            // івенти на кнопки форми
            const createTableButton = document.getElementById('create-table');
            createTableButton.addEventListener('click', function() {
                const cellCount = parseInt(document.getElementById('cell-count').value);
                if (Number.isInteger(cellCount) && cellCount > 0) {
                    const table = createTable(cellCount);
                    target.querySelector('form').insertAdjacentElement('afterend', table);

                    // збереження таблички в локал сторедж
                    tableData = [];
                    table.querySelectorAll('td').forEach(td => {
                        tableData.push(td.textContent);
                    });
                    localStorage.setItem('tableData', JSON.stringify(tableData));
                } else {
                    alert('Введіть натуральне число');
                }
            });

            const saveTableButton = document.getElementById('save-table');
            saveTableButton.addEventListener('click', function() {
                const table = target.querySelector('table');
                if (table) {
                    tableData = [];
                    table.querySelectorAll('td').forEach(td => {
                        tableData.push(td.textContent);
                    });
                    localStorage.setItem('tableData', JSON.stringify(tableData));
                    alert('Таблиця збережена в localStorage');
                } else {
                    alert('Немає таблиці для збереження');
                }
            });
        }
    }

    // тригери для лівої та середньої секції
    leftSide.addEventListener('mouseenter', function(event) {
        handleMouseEnter(event);
        restoreContentAndMoveTable(leftSide);
    });

    leftSide.addEventListener('mouseleave', function() {
        if (currentBlock === leftSide) {
            leftSide.innerHTML = originalLeftSideContent; // вернути початкову сторінку
        }
    });

    midlSection.addEventListener('mouseenter', function(event) {
        handleMouseEnter(event);
        restoreContentAndMoveTable(midlSection);
    });

    midlSection.addEventListener('mouseleave', function() {
        if (currentBlock === midlSection) {
            midlSection.innerHTML = originalMidlSectionContent; // вернути початкову сторінку
        }
    });

    // видалити таблчку з localStorage
    localStorage.removeItem('tableData');
});