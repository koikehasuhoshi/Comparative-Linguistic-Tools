// ==UserScript==
// @name         Extract and Save Table Cell Text with Notification
// @version      0.2
// @description  Extract text from <td class="ant-table-cell"> elements, save them to a text file, and notify user on success.
// @author       You
// @match      https://zhongguoyuyan.cn/*
// @grant GM_download
// @grant GM_notification
// ==/UserScript==

(function() {
    'use strict';
// 定义 showNotification 函数
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '14px';
    notification.innerText = message;

    document.body.appendChild(notification);

    // 自动消失的效果
    setTimeout(() => {
        notification.remove();
    }, 3000); // 3秒后移除通知
}
    // 创建一个对象Myres来保存所有的文本内容
let Myres = {
    content: [],
};

// 提取页面中所有<td class="ant-table-cell">元素的文本内容
function extractAndSaveTextContent() {
    const allTextContents = [];
    const cells = document.querySelectorAll('td.ant-table-cell');

    cells.forEach(cell => {
        const textContent = cell.textContent.trim();
        if (textContent && !Myres.content.includes(textContent)) {
            allTextContents.push(textContent);
        }
    });

    // 将提取到的内容加入到Myres对象中
    if (allTextContents.length > 0) {
        Myres.content = Myres.content.concat(allTextContents);
        showNotification('读取成功！');
    }

    // 在控制台中查看Myres内容
    console.log(Myres); // 直接输出Myres对象，而不是字符串
}

// 调用函数以提取数据并查看Myres
extractAndSaveTextContent();
// 下载文本内容到txt文件
function downloadTextFile() {
    const textToSave = Myres.content.join('\n');
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_text_contents.txt'; // 文件名
    link.click();
}

// 按下回车键触发下载
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        downloadTextFile();
    }
});

    // 使用 MutationObserver 来监控 DOM 更新
    function observeNewElements() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('td.ant-table-cell')) {
                        extractAndSaveTextContent();
                    }
                });

                // 如果现有元素文本内容发生变化，重新提取数据
                mutation.target.querySelectorAll('td.ant-table-cell').forEach(cell => {
                    const textContent = cell.textContent.trim();
                    if (textContent && !Myres.content.includes(textContent)) {
                        Myres.content.push(textContent); // 添加到Myres中
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
// 启动监控DOM变化
observeNewElements();
})();