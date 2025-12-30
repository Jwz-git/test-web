// 表单提交处理
document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const siteName = document.getElementById('siteName').value.trim();
    const company = document.getElementById('company').value;
    const aiType = document.querySelector('input[name="aiType"]:checked').value;
    const description = document.getElementById('description').value.trim();
    const url = document.getElementById('url').value.trim();
    const icon = document.getElementById('icon').value.trim();
    const features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(checkbox => checkbox.value);
    
    // 表单验证
    if (!siteName || !company || !aiType || !description || !url) {
        alert('请填写必填字段');
        return;
    }
    
    // 创建网站数据对象
    const siteData = {
        id: Date.now().toString(), // 生成唯一ID
        siteName,
        company,
        aiType,
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