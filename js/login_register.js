// 切换到登录
function switchToLogin() {
    const flipCardInner = document.getElementById('flipCardInner');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    flipCardInner.classList.remove('flip-to-register');
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
}

// 切换到注册
function switchToRegister() {
    const flipCardInner = document.getElementById('flipCardInner');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    flipCardInner.classList.add('flip-to-register');
    loginBtn.classList.remove('active');
    registerBtn.classList.add('active');
}

// 邮箱格式验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 密码强度验证
function validatePasswordStrength(password) {
    // 至少8位，包含字母和数字
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// 显示错误信息
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// 隐藏错误信息
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// 获取所有用户数据
function getAllUsers(callback) {
    if (callback && typeof callback === 'function') {
        const apiUrl = 'https://api.example.com/users';
        
        get(apiUrl,
            (responseData) => {
                console.log('从服务器获取用户数据成功:', responseData);
                // 将服务器数据保存到localStorage作为缓存
                localStorage.setItem('users', JSON.stringify(responseData));
                callback(responseData);
            },
            (error) => {
                console.error('从服务器获取用户数据失败，回退到localStorage:', error);
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                callback(users);
            }
        );
    } else {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }
}

// 保存用户数据到服务器和localStorage
function saveUsers(users, callback = null) {
    localStorage.setItem('users', JSON.stringify(users));
    
    // 如果提供了回调函数，则同步到服务器
    if (callback && typeof callback === 'function') {
        const apiUrl = 'https://api.example.com/users';
        
        post(apiUrl, users,
            (responseData) => {
                console.log('用户数据同步到服务器成功:', responseData);
                callback(null, responseData);
            },
            (error) => {
                console.error('用户数据同步到服务器失败:', error);
                callback(error, users);
            }
        );
    }
}

// 登录
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    let isValid = true;

    hideError('loginEmailError');
    hideError('loginPasswordError');

    if (!email) {
        showError('loginEmailError', '请输入邮箱');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('loginEmailError', '请输入有效的邮箱地址');
        isValid = false;
    }

    if (!password) {
        showError('loginPasswordError', '请输入密码');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    try {
        getAllUsers(function(users) {
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify({ 
                    username: user.username, 
                    email: user.email,
                    id: user.id
                }));
                window.location.href = 'index.html';
            } else {
                showError('loginEmailError', '邮箱或密码错误');
            }
        });
    } catch (error) {
        showError('loginEmailError', '登录失败，请稍后重试');
        console.error('Login error:', error);
    }
}

// 注册
function handleRegister() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    let isValid = true;

    hideError('regUsernameError');
    hideError('regEmailError');
    hideError('regPasswordError');
    hideError('regConfirmPasswordError');

    if (!username) {
        showError('regUsernameError', '请输入用户名');
        isValid = false;
    }

    if (!email) {
        showError('regEmailError', '请输入邮箱');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('regEmailError', '请输入有效的邮箱地址');
        isValid = false;
    }

    if (!password) {
        showError('regPasswordError', '请输入密码');
        isValid = false;
    } else if (!validatePasswordStrength(password)) {
        showError('regPasswordError', '密码至少8位，包含字母和数字');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('regConfirmPasswordError', '请确认密码');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('regConfirmPasswordError', '两次输入的密码不一致');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    try {
        // 从服务器或localStorage获取现有用户数据
        getAllUsers(function(users) {
            // 检查邮箱是否已被注册
            if (users.some(u => u.email === email)) {
                showError('regEmailError', '该邮箱已被注册');
                return;
            }
            
            // 检查用户名是否已被使用
            if (users.some(u => u.username === username)) {
                showError('regUsernameError', '该用户名已被使用');
                return;
            }
            
            // 创建新用户
            const newUser = {
                id: Date.now().toString(), // 生成唯一ID
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            // 添加新用户到数组
            users.push(newUser);
            
            // 保存到服务器和localStorage
            saveUsers(users, function(error, savedData) {
                if (error) {
                    console.error('保存用户数据到服务器失败，但已保存到localStorage:', error);
                }
                
                // 注册成功后切换到登录页面
                alert('注册成功，请登录');
                switchToLogin();
                
                // 清空注册表单
                document.getElementById('regUsername').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regConfirmPassword').value = '';
            });
        });
    } catch (error) {
        showError('regEmailError', '注册失败，请稍后重试');
        console.error('Register error:', error);
    }
}