const switchButton = document.getElementById("switch")
const historyButton = document.getElementById("history")
switchButton.addEventListener('click', switchStatus)
historyButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('history.html') })
})

getStatus()
    .then(status => {
        setButtonStatus(switchButton, status)
    })

async function switchStatus () {
    const currentStatus = await getStatus()
    
    await setStatus(!currentStatus)
    setButtonStatus(switchButton, !currentStatus)
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

async function setStatus (status) {
    await (new Promise((resolve, reject) => {
        chrome.storage.local.set({ stalking: status }, (data) => {
            resolve(data)
        })
    }))
}

async function setButtonStatus (button, status) {
    button.innerText = status ? 'Stop Stalking' : 'Start Stalking'
}