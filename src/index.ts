import express, { Response } from 'express';
import dotenv from 'dotenv';
import { Config } from './googlesheets';
import { ConfigType } from './googlesheets/config';
import { createWriteStream } from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT;

var sendAndSleep = (response: Response, counter: number) => {
    if (counter > 10) {
        response.end();
    } else {
        response.write(" ;i=" + counter);
        counter++;
        setTimeout(function () {
            sendAndSleep(response, counter);
        }, 1000)
    };
};

const writer = (res: Response, ...args: any) => {
    res.write(args + "<br/>")
}

app.get('/rungoogle', async (req, res) => {

    var access = createWriteStream('./api.access.log');
    // process.stdout.write = process.stderr.write = res.write as any

    process.stdout.write = process.stderr.write = ((data: any) => {
        res.write(data)
        res.write("<br />")
    }) as any;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const script = req.query.script
    if (!(typeof script == 'string' && Object.keys(Config).includes(script))) {
        res.sendStatus(500)
        return res.end();
    }
    writer(res, "Outputting...");
    writer(res, `Running ${script}\n`)
    const item = Config[script as keyof (ConfigType)]
    await item.script()

    sendAndSleep(res, 1);
});

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write("G'day");
    sendAndSleep(res, 1);
});

app.listen(port, () => {
    console.log(port);
});
