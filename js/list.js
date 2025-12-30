// 从服务器或localStorage加载网站数据并生成卡片
function loadSites() {
    // 模拟API URL
    const apiUrl = 'https://api.example.com/sites';
    
    // 使用AJAX GET请求从服务器获取数据
    get(apiUrl,
        (responseData) => {
            console.log('从服务器获取数据成功:', responseData);
            
            // 将服务器数据保存到localStorage作为缓存
            localStorage.setItem('sites', JSON.stringify(responseData));
            
            // 生成网站卡片
            renderSites(responseData);
        },
        (error) => {
            console.error('从服务器获取数据失败，回退到localStorage:', error);
            
            // 从localStorage获取数据
            let sites = JSON.parse(localStorage.getItem('sites') || '[]');
            
            // 如果localStorage为空，初始化默认数据
            if (sites.length === 0) {
                sites = initializeDefaultSites();
            }
            
            renderSites(sites);
        }
    );
}

// 初始化默认网站数据
function initializeDefaultSites() {
    const defaultSites = [
        {
            id: 'chatgpt-001',
            siteName: 'ChatGPT',
            company: 'openai',
            aiType: '对话AI',
            description: 'OpenAI开发的AI模型。',
            url: 'https://www.chatgpt.com',
            icon: './images/list/ChatGPT-logo.webp',
            features: [],
            launchDate: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'google-test-001',
            siteName: '测试',
            company: 'google',
            aiType: '···',
            description: '···',
            url: '',
            icon: '',
            features: [],
            launchDate: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'microsoft-test-001',
            siteName: '测试',
            company: 'microsoft',
            aiType: '···',
            description: '···',
            url: '',
            icon: '',
            features: [],
            launchDate: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'zijietiaodong-test-001',
            siteName: '测试',
            company: 'zijietiaodong',
            aiType: '···',
            description: '···',
            url: '',
            icon: '',
            features: [],
            launchDate: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'alibaba-test-001',
            siteName: '测试',
            company: 'alibaba',
            aiType: '···',
            description: '···',
            url: '',
            icon: '',
            features: [],
            launchDate: '',
            createdAt: new Date().toISOString()
        }
    ];
    
    // 将默认数据保存到localStorage
    localStorage.setItem('sites', JSON.stringify(defaultSites));
    
    return defaultSites;
}

// 渲染网站卡片
function renderSites(sites) {
    const sitesContainer = document.getElementById('sitesContainer');
    
    // 按公司分组
    const sitesByCompany = sites.reduce((groups, site) => {
        const company = site.company;
        if (!groups[company]) {
            groups[company] = [];
        }
        groups[company].push(site);
        return groups;
    }, {});
    
    // 生成公司部分和网站卡片
    const companies = ['openai', 'google', 'microsoft', 'zijietiaodong', 'alibaba'];
    
    companies.forEach(companyId => {
        const companySection = document.getElementById(companyId);
        if (companySection) {
            // 清空现有卡片
            const existingCards = companySection.querySelectorAll('.web-card');
            existingCards.forEach(card => card.remove());
            
            // 添加网站卡片
            const companySites = sitesByCompany[companyId] || [];
            companySites.forEach(site => {
                const card = createWebCard(site);
                companySection.appendChild(card);
            });
        }
    });
    
    // 数据渲染完成后检查是否有搜索查询
    checkForSearchQuery();
}

// 创建网站卡片
function createWebCard(site) {
    const card = document.createElement('div');
    card.className = 'web-card';
    card.innerHTML = `
        <img class="image" src="${site.icon}" alt="${site.siteName}">
        <div class="web-card-content">
            <h3>${site.siteName}</h3>
            <div class="meta">分类: ${site.aiType}</div>
            <p>${site.description}</p>
            <button class="btn-to-detail" onclick="window.location.href='web_detail.html'">网站介绍</button>
            <button class="btn-to-web" onclick="window.open('${site.url}')">访问网站</button>
        </div>
        <div class="card-actions">
            <button class="btn-edit" onclick="editCard(this)">编辑</button>
            <button class="btn-delete" onclick="deleteCard(this, '${site.id}')">删除</button>
        </div>
    `;
    return card;
}

// 页面加载时的处理
window.addEventListener('DOMContentLoaded', function () {
    // 从服务器或localStorage加载网站数据
    loadSites();
});

// 执行搜索功能
function performSearch(web_name) {
    if (web_name) {
        const normalizedWebName = web_name.toLowerCase();
        // 查找包含指定名称的web-card
        const webCards = document.querySelectorAll('.web-card');
        let targetCard = null;

        webCards.forEach(card => {
            if (card.textContent.toLowerCase().includes(normalizedWebName)) {
                targetCard = card.closest('.web-card');
            }
        });

        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth' });
            // 高亮显示匹配的卡片
            targetCard.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                targetCard.style.backgroundColor = '';
            }, 2000);
        } else {
            alert(`未找到包含"${web_name}"的网站信息`);
        }
    }
}

// 检查URL参数并执行搜索
function checkForSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const web_name = urlParams.get('web_name');
    if (web_name) {
        performSearch(web_name);
    }
}

// 滚动到顶部功能
function scrollToTop() {
    const sitesContainer = document.getElementById('sitesContainer');
    sitesContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

// 监听滚动显示/隐藏回到顶部按钮
window.addEventListener('DOMContentLoaded', function () {
    const sitesContainer = document.getElementById('sitesContainer');
    const backToTopBtn = document.getElementById('backToTop');

    sitesContainer.addEventListener('scroll', function () {
        // 当滚动距离超过300px时显示按钮
        if (sitesContainer.scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
});

// 删除卡片
function deleteCard(button, siteId) {
    if (confirm('确定要删除这个网站信息吗？')) {
        // 从DOM中移除
        const card = button.closest('.web-card');
        if (card) {
            // 如果有siteId，从localStorage中删除
            if (siteId) {
                const sites = JSON.parse(localStorage.getItem('sites') || '[]');
                const updatedSites = sites.filter(site => site.id !== siteId);
                localStorage.setItem('sites', JSON.stringify(updatedSites));
            }
            
            // 删除动画
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';

            // 动画结束后移除元素
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }
}



// 编辑卡片功能
function editCard(button) {
    const card = button.closest('.web-card');
    const content = card.querySelector('.web-card-content');

    const originalContent = content.innerHTML;

    const title = content.querySelector('h3').textContent;
    const category = content.querySelector('.meta').textContent.replace('分类: ', '');
    const description = content.querySelector('p').textContent;

    // 构建编辑表单
    content.innerHTML = `
            <div class="edit-mode">
                <input type="text" class="edit-input" data-field="title" value="${title}">
                <input type="text" class="edit-input" data-field="category" value="${category}">
                <textarea class="edit-input" data-field="description" rows="3">${description}</textarea>
                <div class="edit-actions">
                    <button class="btn-save" onclick="saveEdit(this)">保存</button>
                    <button class="btn-cancel" onclick="cancelEdit(this, '${escape(originalContent)}')">取消</button>
                </div>
            </div>
        `;
}

// 保存编辑
function saveEdit(button) {
    const card = button.closest('.web-card');
    const content = card.querySelector('.web-card-content');

    // 获取编辑后的值
    const title = content.querySelector('[data-field="title"]').value.trim();
    const category = content.querySelector('[data-field="category"]').value.trim();
    const description = content.querySelector('[data-field="description"]').value.trim();

    // 验证输入
    if (!title) {
        alert('网站名称不能为空');
        return;
    }

    if (!category) {
        alert('分类不能为空');
        return;
    }

    // 更新详情页链接
    const detailBtn = content.querySelector('.btn-to-detail');
    const detailUrl = detailBtn ? detailBtn.getAttribute('onclick').match(/"(.*?)"/)[1] : `detail-${title}.html`;

    // 更新访问链接
    const webBtn = content.querySelector('.btn-to-web');
    const webUrl = webBtn ? webBtn.getAttribute('onclick').match(/"(.*?)"/)[1] : `https://www.${title.toLowerCase()}.com`;

    // 恢复显示模式并更新内容
    content.innerHTML = `
        <h3>${title}</h3>
        <div class="meta">分类: ${category}</div>
        <p>${description}</p>
        <button class="btn-to-detail" onclick="window.location.href='${detailUrl}'">网站介绍</button>
        <button class="btn-to-web" onclick="window.open('${webUrl}')">访问网站</button>
    `;

    // 显示保存成功提示
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = '保存成功';
    card.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 1500);
}

// 取消编辑
function cancelEdit(button, originalContent) {
    const content = button.closest('.web-card-content');
    content.innerHTML = unescape(originalContent);
}