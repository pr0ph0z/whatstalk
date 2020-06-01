function loop () {
    if (!document.getElementById("main")) {
        setTimeout(loop, 1000);
    } else {
        init()
    }
}

function init () {
    const mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log(mutation.target.textContent)
        })
    })
    
    mutationObserver.observe(document.querySelector('#main > header > div>div>span'), {
        attributes: true
    })
}

loop()