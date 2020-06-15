const textToWatch = ['online', 'typing…']
let observer

function chatClick () {
    if (observer instanceof MutationObserver) {
        observer.disconnect()
    }

    observer = new MutationObserver(function (mutations) {
        mutations.forEach(async function (mutation) {
            const status = await getStatus()
            if (status) {
                if (mutation.type === 'characterData' && textToWatch.includes(mutation.target.textContent)) {
                    console.log(mutation.target.textContent)
                }
            }
        })
    })
    
    // for debugging. will delete later
    observer.observe(document.querySelector('#app > div > div'), {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeFilter: ['one', 'two'],
        attributeOldValue: true,
        characterDataOldValue: true          
    })

    console.log(document.querySelector('#main > header > div>div>span').textContent)
}

function loop () {
    if (!document.querySelector("#side")) {
        setTimeout(loop, 1000);
    } else {
        const chatListElement = document.querySelector('#pane-side > div > div > div')
        chatListElement.addEventListener('click', chatClick)
    }
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

loop()