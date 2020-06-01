const button = document.getElementById("switch")
button.addEventListener('click', switchStatus)
getStatus()
    .then(status => {
        setButtonStatus(button, status)
    })

async function switchStatus () {
    const currentStatus = await getStatus()
    
    await setStatus(!currentStatus)
    setButtonStatus(button, !currentStatus)
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