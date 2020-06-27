function loop () {
    if (!document.querySelector(".two")) {
        setTimeout(loop, 1000);
    } else {
        init()
    }
}

function init () {
    const mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(async function (mutation) {
            const status = await getStatus()
            if (status) {
                if (mutation.type === 'characterData' && mutation.target.textContent === 'online') {
                    const name = document.querySelectorAll('#main > header > div > div > div > span')[1].textContent
                    await insertChatData({ name: name, message: mutation.target.textContent, time: new Date().toISOString()})
                    console.log(mutation.target.textContent, new Date())
                }
            }
        })
    })
    
    mutationObserver.observe(document.querySelector('#app > div > div'), {
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true          
    })
}

async function getStatus () {
    const currentStatus = await (new Promise((resolve, reject) => {
        chrome.storage.local.get('stalking', (data) => {
            resolve(data)
        })
    }))
    
    if (Object.keys(currentStatus).length === 0) {
        return false
    }

    return currentStatus.stalking
}

async function insertChatData({ name, message, time }) {
    const chatData = await getChatData()
    chatData.push({ id: generateGuid(), name, message, time })
    return (new Promise((resolve, reject) => {
        chrome.storage.local.set({ chat_data: chatData }, (data) => {
            resolve(data)
        })
    }))
}

async function getChatData() {
    const { chat_data: chatData } = await (new Promise((resolve, reject) => {
        chrome.storage.local.get('chat_data', (data) => {
            resolve(data)
        })
    }))

    if (chatData === undefined) {
        return []
    }

    return chatData
}

function generateGuid() {
    const s4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

    return (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());
}

loop()