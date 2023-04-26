const API_URL = "http://localhost:3000";

async function consumeAPI(signal) {
    const response = await fetch(API_URL, {
        signal
    });

    const reader = response.body
        .pipeThrough(
            new TextDecoderStream()
        )
        .pipeThrough(parseNDJSON())

    return reader;
}

function parseNDJSON() {
    return new TransformStream({
        async transform(chunks, controller) {
            for (const item of chunks.split("\n")) {
                if (!item.length) continue
                try {
                    controller.enqueue(JSON.parse(item))
                } catch (error) {
                    // If JSON string is not complete
                    console.warn(item)
                }
            }
        }
    })
}

let counter = 0;
let elementCounter = 0;
function appendToHTML(element) {
    return new WritableStream({
        write({ title, description, url }) {
            const card = `
            <article>
                <div class="text">
                    <h3>[${++counter}] ${title}</h3>
                    <p>${description.slice(0 , 100)}</p>
                    <a href="${url}">here's why</a>
                </div>
            </article>
            `;

            if(++elementCounter > 20){
                element.innerHTML = card;
                elementCounter = 0;
                return
            }

            element.innerHTML += card;
        },
        abort(reason) {
            console.log("Aborted", reason);
        }
    })
}

const [
    start, stop, cards
] = ["start", "stop", "cards"].map(item => document.getElementById(item));


let abortController = new AbortController();

start.addEventListener("click", async () => {
    start.disabled = true;
    stop.disabled = false;
    try {
        const reader = await consumeAPI(abortController.signal);
        await reader.pipeTo(appendToHTML(cards), { signal: abortController.signal })
    } catch (error) {
        start.disabled = false;
        stop.disabled = true;
        if(!error.message.includes("abort")) return
        console.log(error?.message)
    }
})

stop.addEventListener("click", async () => {
    start.disabled = false;
    stop.disabled = true;
    abortController.abort();
    console.log("aborting....")
    abortController = new AbortController();
})