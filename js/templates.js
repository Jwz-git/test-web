// 模板引擎 - 导航栏模板
function getNavbarTemplate(activeNav = '') {
    return `
        <header>
            <nav class="navbar">
                <ul>
                    <li class="nav-item ${activeNav === 'index' ? 'active' : ''}" onclick="window.location.href='index.html'">首页</li>
                    <li class="nav-item ${activeNav === 'list' ? 'active' : ''}" onclick="window.location.href='list.html'">网站列表</li>
                    <li class="nav-item ${activeNav === 'form' ? 'active' : ''}" onclick="window.location.href='form.html'">添加网站详情</li>
                    <li class="nav-item ${activeNav === 'help' ? 'active' : ''}" onclick="window.location.href='help.html'">帮助</li>
                    <li id="userNav" style="float:right;"></li>
                </ul>
            </nav>
        </header>
    `;
}

// 网站详情页模板
function getDetailPageTemplate(siteData) {
    return `
        ${getNavbarTemplate('detail')}
        <main class="container">
            <header class="site-header">
                <h1>${siteData.name}</h1>
                <div class="meta-info">
                    <span>所属公司: ${siteData.company}</span>
                    <span>分类: ${siteData.category}</span>
                </div>
                <p>${siteData.description}</p>
                <button class="btn-to-web" onclick="window.open('${siteData.url}')">访问网站</button>
            </header>

            <section class="site-content">
                <h2>网站详情</h2>

                <section class="api-section">
                    <h3>调用${siteData.name} API</h3>
                    <section class="form-group">
                        <label for="apiKey">API 密钥 <span class="required">*</span></label>
                        <input type="password" id="apiKey" placeholder="请输入${siteData.company} API密钥（${siteData.apiKeyHint || 'sk-开头'}）" required>
                        <small style="color:#666;">提示：密钥可在${siteData.company}控制台获取</small>
                    </section>

                    <section class="form-group">
                        <label for="prompt">输入内容 <span class="required">*</span></label>
                        <textarea id="prompt" rows="3" placeholder="例如：介绍${siteData.name}的主要功能..." required></textarea>
                    </section>

                    <article class="response-area">
                        <h3>API响应结果：</h3>
                        <pre id="apiResponse" style="color:#9b8e8e;font-size:22px;">等待请求...</pre>
                    </article>

                    <button class="btn" onclick="callChatGPTAPI()">发送请求</button>
                </section>
            </section>
        </main>
    `;
}

// 模板渲染函数
function renderTemplate(template, container) {
    const target = document.querySelector(container);
    if (target) {
        target.innerHTML = template;
    }
}

// 完整页面渲染函数
function renderPage(template) {
    document.body.innerHTML = template;
    // 页面渲染完成后更新导航栏用户信息
    // 使用setTimeout确保DOM完全更新
    setTimeout(() => {
        if (typeof updateUserNav === 'function') {
            updateUserNav();
        }
    }, 100);
}