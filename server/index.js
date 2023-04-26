import { createServer, request } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable, Writable, Transform } from "node:stream";
import { TransformStream } from "node:stream/web";

import { setTimeout } from "node:timers/promises";

import byteSize from "byte-size";
import csvtojson from "csvtojson";

const PORT = 3000;
const headers ={
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
}

createServer(async (_req, res) => {

    if(_req.method === 'OPTIONS'){
        res.writeHead(204, headers);
        res.end();
        return;
    }

    let counter = 0;
    const filename = "./data/animeflv.csv";
    const { size } = await stat(filename);
    console.log(`Size: ${byteSize(size)}`);

    try {
        res.writeHead(200, headers);
        const abortController = new AbortController();
        _req.once('close' , _ => {
            console.log("Connection Closed! " , counter);
            abortController.abort();
        })

        await Readable.toWeb(createReadStream(filename))
            .pipeThrough(
                Transform.toWeb(csvtojson())
            )
            .pipeThrough(
                new TransformStream({
                    async transform(jsonLine, controller) {
                        const data = JSON.parse(Buffer.from(jsonLine));
                        const mappedData = JSON.stringify({
                            title: data.title,
                            description: data.description,
                            url: data.url_anime
                        })

                        counter++;
                        await setTimeout(200);
                        controller.enqueue(mappedData.concat("\n"));
                    }
                })
            )
            .pipeTo(
                Writable.toWeb(res),
                { signal : abortController.signal }
            )
    } catch (error) {
        if(!error.message.includes("abort")) return
        console.log(error?.message);
    }


})
    .listen(PORT)
    .on('listening', _ => console.log(`Server is running at ${PORT}`))
    .on('error', error => console.log(error?.message));

// curl -N localhost:3000