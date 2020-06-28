const tableElement = document.querySelector('table')
const wrapper = document.getElementById('wrapper')
getChatData()
    .then(qwe => {
        new gridjs.Grid({
            columns: ["ID", "Name", "Message", "Time"],
            data: qwe.map(data => {
                data.time = new Date(data.time).toLocaleString()
                return Object.values(data)
            })
          }).render(document.getElementById("wrapper"));          
    })
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

function createTable(tableElement, tableData) {
    const tableBody = document.createElement('tbody')

    tableData.forEach(function (rowData) {
        const row = document.createElement('tr')

        for (const historyData in rowData) {
            const cell = document.createElement('td')
            cell.appendChild(document.createTextNode(rowData[historyData]))
            row.appendChild(cell)
        }

        tableBody.appendChild(row)
    })

    tableElement.appendChild(tableBody)
}
