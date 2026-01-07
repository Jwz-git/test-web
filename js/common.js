// 汉堡菜单切换
function toggleNavbar() {
    try {
        const navbarMenu = document.getElementById('navbarMenu');
        if (navbarMenu) {
            navbarMenu.classList.toggle('active');
        }
    } catch (error) {
        console.error('Error in toggleNavbar:', error);
    }
}

// 通用导航栏更新
function updateUserNav() {
    try {
        const userNav = document.getElementById('userNav');
        if (!userNav) return;
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentUser) {
            // 已登录状态，显示欢迎信息和登出链接
            userNav.innerHTML = `<span>欢迎, ${currentUser.username}</span>`;
            userNav.onclick = logout;
        } else {
            // 未登录状态，显示登录/注册链接
            const isLoginPage = currentPage === 'login_register.html';
            userNav.className = `nav-item ${isLoginPage ? 'active' : ''}`;
            userNav.onclick = () => window.location.href = 'login_register.html';
            userNav.innerHTML = '登录/注册';
        }
    } catch (error) {
        // 忽略任何错误，避免影响页面渲染
        console.error('Error in updateUserNav:', error);
    }
}

// 更新导航项活跃状态
function updateNavActiveState() {
    try {
        const navItems = document.querySelectorAll('.nav-item');
        const currentPage = window.location.pathname.split('/').pop();
        
        navItems.forEach(item => {
            const onclickAttr = item.getAttribute('onclick');
            if (onclickAttr) {
                const targetPage = onclickAttr.match(/window\.location\.href='([^']+)'/);
                if (targetPage && targetPage[1] === currentPage) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    } catch (error) {
        console.error('Error in updateNavActiveState:', error);
    }
}

// 登出功能
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    updateUserNav();
    window.location.href = 'index.html';
}

// 页面加载时更新导航栏
window.addEventListener('DOMContentLoaded', () => {
    updateUserNav();
    updateNavActiveState();
});

// 滚动到指定公司位置
function scrollToDes(companyId) {
    const section = document.getElementById(companyId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 通用AJAX函数
function ajax(options) {
    const {
        url,
        method = 'GET',
        data = null,
        headers = {},
        success = () => {},
        error = () => {}
    } = options;

    const xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);
    
    // 设置默认请求头
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // 设置自定义请求头
    Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
    });
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            let responseData;
            try {
                responseData = JSON.parse(xhr.responseText);
            } catch (e) {
                responseData = xhr.responseText;
            }
            success(responseData, xhr);
        } else {
            error(new Error(`请求失败: ${xhr.status} ${xhr.statusText}`), xhr);
        }
    };
    
    xhr.onerror = function() {
        error(new Error('网络错误'), xhr);
    };
    
    xhr.ontimeout = function() {
        error(new Error('请求超时'), xhr);
    };
    
    // 发送数据
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    
    return xhr;
}

// 简化的GET请求函数
function get(url, success, error, headers = {}) {
    return ajax({
        url,
        method: 'GET',
        headers,
        success,
        error
    });
}

// 简化的POST请求函数
function post(url, data, success, error, headers = {}) {
    return ajax({
        url,
        method: 'POST',
        data,
        headers,
        success,
        error
    });
}