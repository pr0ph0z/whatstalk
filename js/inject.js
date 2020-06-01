function loop () {
    if (!document.getElementById("main")) {
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
                console.log(mutation.target.textContent)
            }
        })
    })
    
    mutationObserver.observe(document.querySelector('#main > header > div>div>span'), {
        attributes: true
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

loop()