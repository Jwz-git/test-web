// 表单提交处理
document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // 清除所有错误信息和样式
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
    });
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('show');
    });
    
    // 获取表单数据
    const siteName = document.getElementById('siteName').value.trim();
    const company = document.getElementById('company').value;
    const aiType = document.querySelector('input[name="aiType"]:checked');
    const description = document.getElementById('description').value.trim();
    const url = document.getElementById('url').value.trim();
    const icon = document.getElementById('icon').value.trim();
    const features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(checkbox => checkbox.value);
    
    let isValid = true;
    let firstErrorField = null;
    
    // 显示错误信息的函数
    function showError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorMsg = document.getElementById(fieldId + 'Error');
        const formGroup = field.closest('.form-group');
        
        errorMsg.textContent = errorMessage;
        errorMsg.classList.add('show');
        formGroup.classList.add('error');
        
        isValid = false;
        firstErrorField = firstErrorField || field;
    }
    
    // 验证网站名称
    if (!siteName) {
        showError('siteName', '请输入网站名称');
    }
    
    // 验证所属公司
    if (!company) {
        showError('company', '请选择所属公司');
    }
    
    // 验证AI类型
    if (!aiType) {
        const aiTypeGroup = document.querySelector('input[name="aiType"]').closest('.form-group');
        const errorMsg = document.getElementById('aiTypeError');
        
        errorMsg.textContent = '请选择AI类型';
        errorMsg.classList.add('show');
        aiTypeGroup.classList.add('error');
        
        isValid = false;
        firstErrorField = firstErrorField || document.querySelector('input[name="aiType"]');
    }
    
    // 验证网站简介
    if (!description) {
        showError('description', '请输入网站简介');
    }
    
    // 验证网站链接
    if (!url) {
        showError('url', '请输入网站链接');
    } else {
        // 验证URL格式
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(url)) {
            showError('url', '请输入有效的网站链接');
        }
    }
    
    // 验证图标URL（可选，但如果填写则需要验证格式）
    if (icon) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(icon)) {
            showError('icon', '请输入有效的图标URL');
        }
    }
    
    // 如果验证失败，跳转到第一个错误字段
    if (!isValid) {
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
        return;
    }
    
    // 创建网站数据对象
    const siteData = {
        id: Date.now().toString(), // 生成唯一ID
        siteName,
        company,
        aiType: aiType.value,
        description,
        url,
        icon: icon,
        features,
        createdAt: new Date().toISOString()
    };
    
    // 从localStorage获取现有网站数据
    const sites = JSON.parse(localStorage.getItem('sites') || '[]');
    
    // 添加新网站数据
    sites.push(siteData);
    
    // 保存到localStorage
    localStorage.setItem('sites', JSON.stringify(sites));
    
    alert('网站信息添加成功！');
    
    // 重置表单
    document.getElementById('siteForm').reset();
    
    // 跳转到列表页
    window.location.href = 'list.html';
});

// 取消按钮处理
document.querySelector('.cancel-btn').addEventListener('click', function() {
    if (confirm('确定要取消吗？所有未保存的更改将丢失。')) {
        window.location.href = 'index.html';
    }
});