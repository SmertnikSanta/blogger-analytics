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
            <span>📱 Блогер ${index}</span>
            ${index > 1 ? '<button class="remove-btn" onclick="removeBlogger(this)">✕</button>' : ''}
        </div>
        
        <div class="input-group">
            <label>Имя блогера:</label>
            <input type="text" class="blogger-name" placeholder="Например: Анечка" value="Блогер ${index}">
        </div>
        
        <div class="input-group">
            <label>Подписчики (одно число):</label>
            <input type="number" class="subscribers" min="1" step="1" placeholder="Например: 21000" required>
        </div>
        
        <div class="input-group">
            <label>Просмотры за 10 постов:</label>
            <div class="array-inputs" id="views-${index}">
                ${createArrayInputs('views', index, 'Например: 301110')}
            </div>
            <div class="input-help">Введите до 10 чисел (можно меньше, остальные будут 0)</div>
        </div>
        
        <div class="input-group">
            <label>Лайки за 10 постов:</label>
            <div class="array-inputs" id="likes-${index}">
                ${createArrayInputs('likes', index, 'Например: 906')}
            </div>
            <div class="input-help">Введите до 10 чисел (можно меньше, остальные будут 0)</div>
        </div>
        
        <div class="input-group">
            <label>Комментарии за 10 постов:</label>
            <div class="array-inputs" id="comments-${index}">
                ${createArrayInputs('comments', index, 'Например: 4')}
            </div>
            <div class="input-help">Введите до 10 чисел (можно меньше, остальные будут 0)</div>
        </div>

        <div class="input-group optional">
            <label>Шеры (репосты в stories/telegram) <span class="optional-badge">не обязательно</span>:</label>
            <div class="array-inputs" id="shares-${index}">
                ${createArrayInputs('shares', index, 'Например: 5')}
            </div>
            <div class="input-help">Введите до 10 чисел (можно оставить пустыми если не используется)</div>
        </div>
        
        <div class="input-group">
            <label>Репосты за 10 постов:</label>
            <div class="array-inputs" id="reposts-${index}">
                ${createArrayInputs('reposts', index, 'Например: 6')}
            </div>
            <div class="input-help">Введите до 10 чисел (можно меньше, остальные будут 0)</div>
        </div>
    `;
    
    return form;
}

// Функция для создания 10 полей ввода
function createArrayInputs(type, index, placeholder) {
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

// Функция для сбора данных из формы
function collectBloggerData(form) {
    const index = form.dataset.index;
    const name = form.querySelector('.blogger-name').value || `Блогер ${index}`;
    const subscribers = parseInt(form.querySelector('.subscribers').value) || 0;
    
    // Собираем просмотры
    const views = [];
    for (let i = 0; i < MAX_VALUES; i++) {
        const input = form.querySelector(`.views-${index}[data-index="${i}"]`);
        const value = input ? parseInt(input.value) : 0;
        views.push(isNaN(value) ? 0 : value);
    }
    
    // Собираем лайки
    const likes = [];
    for (let i = 0; i < MAX_VALUES; i++) {
        const input = form.querySelector(`.likes-${index}[data-index="${i}"]`);
        const value = input ? parseInt(input.value) : 0;
        likes.push(isNaN(value) ? 0 : value);
    }
    
    // Собираем комментарии
    const comments = [];
    for (let i = 0; i < MAX_VALUES; i++) {
        const input = form.querySelector(`.comments-${index}[data-index="${i}"]`);
        const value = input ? parseInt(input.value) : 0;
        comments.push(isNaN(value) ? 0 : value);
    }
    
    // Собираем шеры (опционально)
    const shares = [];
    for (let i = 0; i < MAX_VALUES; i++) {
        const input = form.querySelector(`.shares-${index}[data-index="${i}"]`);
        const value = input ? parseInt(input.value) : 0;
        shares.push(isNaN(value) ? 0 : value);
    }
    
    // Собираем репосты
    const reposts = [];
    for (let i = 0; i < MAX_VALUES; i++) {
        const input = form.querySelector(`.reposts-${index}[data-index="${i}"]`);
        const value = input ? parseInt(input.value) : 0;
        reposts.push(isNaN(value) ? 0 : value);
    }
    
    return {
        bloggerId: parseInt(index),
        bloggerName: name,
        subscribers: subscribers,
        views: views,
        likes: likes,
        comments: comments,
        shares: shares,
        reposts: reposts
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

// Функция для обновления счетчика
function updateCounter() {
    document.getElementById('bloggerCount').textContent = bloggerCount;
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

// Функция для расчета и отображения результатов
function calculateAndDisplay() {
    const forms = document.querySelectorAll('.blogger-card');
    const bloggersData = [];
    
    forms.forEach(form => {
        bloggersData.push(collectBloggerData(form));
    });
    
    // Валидация
    const warnings = validateData(bloggersData);
    
    // Отображение результатов
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>📊 РЕЗУЛЬТАТЫ АНАЛИЗА</h2>';
    
    if (warnings.length > 0) {
        resultsDiv.innerHTML += '<div class="warning">⚠️ ' + warnings.join('<br>⚠️ ') + '</div>';
    }
    
    bloggersData.forEach((blogger, index) => {
        const totalViews = sumArray(blogger.views);
        const er = calculateER(blogger);
        const erv = calculateERV(blogger);
        
        // Подсчет шеров для информации
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
    
    // Прокрутка к результатам
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bloggersContainer');
    container.appendChild(createBloggerForm(1));
    
    document.getElementById('addBloggerBtn').addEventListener('click', addBlogger);
    document.getElementById('calculateBtn').addEventListener('click', calculateAndDisplay);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
});

// Делаем функции глобальными для onclick в HTML
window.removeBlogger = removeBlogger;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration.scope);
                
                // Проверка обновлений
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Найдено обновление Service Worker');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Новый Service Worker установлен, показываем уведомление
                            if (confirm('Доступна новая версия приложения. Обновить?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ Ошибка регистрации Service Worker:', error);
            });
    });
    
    // Отслеживание изменений соединения
    window.addEventListener('online', () => {
        console.log('📶 Соединение восстановлено');
        document.getElementById('offlineIndicator').style.display = 'none';
    });
    
    window.addEventListener('offline', () => {
        console.log('📴 Соединение потеряно');
        document.getElementById('offlineIndicator').style.display = 'block';
    });
} else {
    console.log('ℹ️ Service Worker не поддерживается браузером');
}

// Предотвращение случайного закрытия приложения на iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);