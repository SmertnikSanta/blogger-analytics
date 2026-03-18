// Конфигурация
const MAX_BLOGGERS = 40;
const MAX_VALUES = 10;

// Состояние приложения
let bloggerCount = 1;

// Функция для создания формы блогера
function createBloggerForm(index) {
    const form = document.createElement('div');
    form.className = 'blogger-card';
    form.dataset.index = index;
    
    form.innerHTML = `
        <div class="blogger-header">
            <div class="header-left">
                <span class="toggle-icon" onclick="toggleBlogger(this)">▼</span>
                <span class="blogger-title" id="title-${index}">📱 Блогер ${index}</span>
            </div>
            <div class="header-right">
                <span class="collapse-status">свернуть</span>
                ${index > 1 ? '<button class="remove-btn" onclick="removeBlogger(this)">✕</button>' : ''}
            </div>
        </div>
        
        <div class="blogger-content">
            <div class="input-group">
                <label>Имя блогера:</label>
                <input type="text" class="blogger-name" data-index="${index}" placeholder="Например: Анечка" value="Блогер ${index}" oninput="updateBloggerTitle(this)">
            </div>
            
            <div class="input-group">
                <label>Подписчики (одно число):</label>
                <input type="number" class="subscribers" min="1" step="1" placeholder="Например: 21000" required>
            </div>
            
            <div class="input-group">
                <label>Просмотры за 10 постов:</label>
                <div class="array-inputs" id="views-${index}">
                    ${createArrayInputs('views', index)}
                </div>
                <div class="input-help">Введите до 10 чисел</div>
            </div>
            
            <div class="input-group">
                <label>Лайки за 10 постов:</label>
                <div class="array-inputs" id="likes-${index}">
                    ${createArrayInputs('likes', index)}
                </div>
                <div class="input-help">Введите до 10 чисел</div>
            </div>
            
            <div class="input-group">
                <label>Комментарии за 10 постов:</label>
                <div class="array-inputs" id="comments-${index}">
                    ${createArrayInputs('comments', index)}
                </div>
                <div class="input-help">Введите до 10 чисел</div>
            </div>

            <div class="input-group optional">
                <label>Шеры <span class="optional-badge">не обязательно</span>:</label>
                <div class="array-inputs" id="shares-${index}">
                    ${createArrayInputs('shares', index)}
                </div>
                <div class="input-help">До 10 чисел (можно оставить пустыми)</div>
            </div>
            
            <div class="input-group">
                <label>Репосты за 10 постов:</label>
                <div class="array-inputs" id="reposts-${index}">
                    ${createArrayInputs('reposts', index)}
                </div>
                <div class="input-help">Введите до 10 чисел</div>
            </div>
        </div>
    `;
    
    return form;
}

// Функция для создания 10 полей ввода
function createArrayInputs(type, index) {
    let html = '';
    for (let i = 0; i < MAX_VALUES; i++) {
        html += `
            <div class="array-input">
                <input type="number" class="${type}-${index}" data-index="${i}" 
                       placeholder="${i + 1}" min="0" step="1" value="">
            </div>
        `;
    }
    return html;
}

// НОВАЯ ФУНКЦИЯ: обновление заголовка блогера
function updateBloggerTitle(input) {
    const index = input.dataset.index;
    const title = document.getElementById(`title-${index}`);
    const newName = input.value.trim();
    
    if (newName) {
        title.textContent = `📱 ${newName}`;
    } else {
        title.textContent = `📱 Блогер ${index}`;
    }
}

// Функция для сворачивания/разворачивания блогера
function toggleBlogger(icon) {
    const bloggerCard = icon.closest('.blogger-card');
    const content = bloggerCard.querySelector('.blogger-content');
    const status = bloggerCard.querySelector('.collapse-status');
    
    if (content.style.display === 'none') {
        // Разворачиваем
        content.style.display = 'block';
        icon.textContent = '▼';
        status.textContent = 'свернуть';
    } else {
        // Сворачиваем
        content.style.display = 'none';
        icon.textContent = '▶';
        status.textContent = 'развернуть';
    }
}

// Функция для сворачивания всех блогеров
function collapseAll() {
    const icons = document.querySelectorAll('.toggle-icon');
    icons.forEach(icon => {
        const bloggerCard = icon.closest('.blogger-card');
        const content = bloggerCard.querySelector('.blogger-content');
        const status = bloggerCard.querySelector('.collapse-status');
        
        content.style.display = 'none';
        icon.textContent = '▶';
        status.textContent = 'развернуть';
    });
}

// Функция для разворачивания всех блогеров
function expandAll() {
    const icons = document.querySelectorAll('.toggle-icon');
    icons.forEach(icon => {
        const bloggerCard = icon.closest('.blogger-card');
        const content = bloggerCard.querySelector('.blogger-content');
        const status = bloggerCard.querySelector('.collapse-status');
        
        content.style.display = 'block';
        icon.textContent = '▼';
        status.textContent = 'свернуть';
    });
}

// Функция для добавления блогера
function addBlogger() {
    if (bloggerCount >= MAX_BLOGGERS) {
        alert(`Достигнуто максимальное количество блогеров (${MAX_BLOGGERS})`);
        return;
    }
    
    bloggerCount++;
    const container = document.getElementById('bloggersContainer');
    container.appendChild(createBloggerForm(bloggerCount));
    updateCounter();
}

// Функция для удаления блогера
function removeBlogger(btn) {
    const card = btn.closest('.blogger-card');
    card.remove();
    bloggerCount--;
    updateCounter();
}

// Функция для обновления счетчика
function updateCounter() {
    document.getElementById('bloggerCount').textContent = bloggerCount;
}

// Функция для сбора данных из формы
function collectBloggerData(form) {
    const index = form.dataset.index;
    const nameInput = form.querySelector('.blogger-name');
    const name = nameInput.value.trim() || `Блогер ${index}`;
    const subscribers = parseInt(form.querySelector('.subscribers').value) || 0;
    
    // Функция для сбора массива значений
    const collectArray = (className) => {
        const arr = [];
        for (let i = 0; i < MAX_VALUES; i++) {
            const input = form.querySelector(`.${className}-${index}[data-index="${i}"]`);
            const value = input ? parseInt(input.value) : 0;
            arr.push(isNaN(value) ? 0 : value);
        }
        return arr;
    };
    
    return {
        bloggerId: parseInt(index),
        bloggerName: name,
        subscribers: subscribers,
        views: collectArray('views'),
        likes: collectArray('likes'),
        comments: collectArray('comments'),
        shares: collectArray('shares'),
        reposts: collectArray('reposts')
    };
}

// Функция для суммирования массива
function sumArray(arr) {
    return arr.reduce((sum, val) => sum + (val || 0), 0);
}

// Функция для расчета ER%
function calculateER(data) {
    const totalInteractions = sumArray(data.likes) + sumArray(data.comments) + 
                             sumArray(data.shares) + sumArray(data.reposts);
    return (totalInteractions / (data.subscribers * 10)) * 100;
}

// Функция для расчета ERV
function calculateERV(data) {
    const totalReactions = sumArray(data.likes) + sumArray(data.comments) + 
                          sumArray(data.shares) + sumArray(data.reposts);
    const totalViews = sumArray(data.views);
    return (totalReactions / totalViews) * 100;
}

// Функция для валидации данных
function validateData(bloggersData) {
    const warnings = [];
    
    bloggersData.forEach((blogger, index) => {
        if (!blogger.subscribers || blogger.subscribers <= 0) {
            warnings.push(`Блогер ${index + 1}: не указаны подписчики`);
        }
        
        const totalViews = sumArray(blogger.views);
        if (totalViews === 0) {
            warnings.push(`Блогер ${index + 1}: нет просмотров`);
        }
        
        const hasSomeData = sumArray(blogger.likes) > 0 || 
                           sumArray(blogger.comments) > 0 || 
                           sumArray(blogger.shares) > 0 ||
                           sumArray(blogger.reposts) > 0;
        
        if (!hasSomeData) {
            warnings.push(`Блогер ${index + 1}: нет данных о взаимодействиях`);
        }
    });
    
    return warnings;
}

// Функция для расчета и отображения результатов
function calculateAndDisplay() {
    const forms = document.querySelectorAll('.blogger-card');
    const bloggersData = [];
    
    forms.forEach(form => {
        bloggersData.push(collectBloggerData(form));
    });
    
    const warnings = validateData(bloggersData);
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>📊 РЕЗУЛЬТАТЫ АНАЛИЗА</h2>';
    
    if (warnings.length > 0) {
        resultsDiv.innerHTML += '<div class="warning">⚠️ ' + warnings.join('<br>⚠️ ') + '</div>';
    }
    
    bloggersData.forEach((blogger, index) => {
        const totalViews = sumArray(blogger.views);
        const er = calculateER(blogger);
        const erv = calculateERV(blogger);
        const totalShares = sumArray(blogger.shares);
        
        if (!isNaN(er) && !isNaN(erv) && isFinite(er) && isFinite(erv)) {
            let sharesInfo = '';
            if (totalShares > 0) {
                sharesInfo = `<p>🔄 Шеры: ${totalShares.toLocaleString()}</p>`;
            }
            
            resultsDiv.innerHTML += `
                <div class="result-item">
                    <div class="name">📱 БЛОГЕР ${index + 1}: ${blogger.bloggerName}</div>
                    <p>👥 Подписчики: ${blogger.subscribers.toLocaleString()}</p>
                    <p>👀 Просмотры: ${totalViews.toLocaleString()}</p>
                    ${sharesInfo}
                    <p>📈 ER%: ${er.toFixed(2)}%</p>
                    <p>🔥 ERV: ${erv.toFixed(2)}%</p>
                </div>
            `;
        }
    });
    
    resultsDiv.classList.add('show');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Функция для сброса всех форм
function resetAll() {
    if (confirm('Очистить все данные?')) {
        const container = document.getElementById('bloggersContainer');
        container.innerHTML = '';
        bloggerCount = 1;
        container.appendChild(createBloggerForm(1));
        updateCounter();
        document.getElementById('results').classList.remove('show');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bloggersContainer');
    container.appendChild(createBloggerForm(1));
    
    document.getElementById('addBloggerBtn').addEventListener('click', addBlogger);
    document.getElementById('calculateBtn').addEventListener('click', calculateAndDisplay);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
    document.getElementById('expandAllBtn').addEventListener('click', expandAll);
});

// Делаем функции глобальными
window.removeBlogger = removeBlogger;
window.toggleBlogger = toggleBlogger;
window.collapseAll = collapseAll;
window.expandAll = expandAll;
window.updateBloggerTitle = updateBloggerTitle;
