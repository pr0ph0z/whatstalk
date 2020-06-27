getChatData()
    .then(qwe => console.log(qwe))
const insertButton = document.getElementById('insert')
insertButton.addEventListener('click', insertButtonHandler)

document.getElementById('remove').addEventListener('click', () => chrome.storage.local.clear())

async function insertButtonHandler() {
    await insertChatData({ name: 'asd', message: 'qwe', time: new Date().toDateString() })
}
async function insertChatData({ name, message, time }) {
    const chatData = await getChatData()
    chatData.push({ name, message, time })
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