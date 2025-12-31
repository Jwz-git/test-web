// 所有AI服务数据
const AI_SERVICE_DATA = {
    chatgpt: {
        name: "ChatGPT",
        company: "OpenAI",
        category: "对话AI",
        description: "ChatGPT是OpenAI开发的一款强大的对话式AI模型，能够理解并生成自然语言，可用于问答、创作、代码辅助等多种场景。",
        url: "https://www.chatgpt.com",
        apiKeyHint: "sk-开头"
    },
    gemini: {
        name: "Gemini",
        company: "Google",
        category: "对话AI",
        description: "Gemini是Google开发的多模态AI模型，能够理解并生成文本、图像、音频等多种形式的内容，适用于广泛的应用场景。",
        url: "https://gemini.google.com",
        apiKeyHint: "AIza开头"
    },
    claude: {
        name: "Claude",
        company: "Anthropic",
        category: "对话AI",
        description: "Claude是Anthropic开发的AI助手，以其长文本处理能力和安全性著称，可用于复杂任务处理和内容生成。",
        url: "https://claude.ai",
        apiKeyHint: "sk-ant开头"
    }
};

// API配置
const API_CONFIGS = {
    chatgpt: {
        endpoint: "https://api.openai.com/v1/chat/completions",
        model: "gpt-5.2"
    },
    gemini: {
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
        model: "gemini-1.5-pro"
    },
    claude: {
        endpoint: "https://api.anthropic.com/v1/messages",
        model: "claude-3-opus-20240229"
    }
};

// 获取当前服务类型
function getCurrentService() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('service') || 'chatgpt';
}

// 页面初始化，使用模板渲染
function initPage() {
    const service = getCurrentService();
    const serviceData = AI_SERVICE_DATA[service] || AI_SERVICE_DATA.chatgpt;
    const template = getDetailPageTemplate(serviceData);
    renderPage(template);
}

// ChatGPT API调用
async function callChatGPTAPI() {
    const service = getCurrentService();
    const config = API_CONFIGS[service];
    const apiKeyInput = document.getElementById("apiKey");
    const promptInput = document.getElementById("prompt");
    const responseOutput = document.getElementById("apiResponse");

    const apiKey = apiKeyInput.value.trim();
    const userPrompt = promptInput.value.trim();

    if (!apiKey) {
        alert("请输入API密钥");
        return;
    }
    if (!userPrompt) {
        alert("请输入内容");
        return;
    }

    try {
        responseOutput.textContent = "正在请求API...";
        let response, result;

        if (service === 'chatgpt') {
            // ChatGPT API调用
            response = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [{ "role": "user", "content": userPrompt }]
                })
            });
            result = await response.json();
            return result.choices?.[0]?.message?.content || "未获取到有效响应";
        } else if (service === 'gemini') {
            // Gemini API调用
            response = await fetch(`${config.endpoint}?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ "parts": [{ "text": userPrompt }] }]
                })
            });
            result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "未获取到有效响应";
        } else if (service === 'claude') {
            // Claude API调用
            response = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: config.model,
                    max_tokens: 1024,
                    messages: [{ "role": "user", "content": userPrompt }]
                })
            });
            result = await response.json();
            return result.content?.[0]?.text || "未获取到有效响应";
        }
    } catch (error) {
        return `请求出错: ${error.message}`;
    }
}

// 统一API调用入口
async function callAPI() {
    const responseOutput = document.getElementById("apiResponse");
    const result = await callChatGPTAPI();
    responseOutput.textContent = result;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', initPage);