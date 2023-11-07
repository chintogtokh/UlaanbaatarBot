import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Config } from './projects/googlesheets';
// import createCats from 'projects/googlesheets/createCats';

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

app.get('/rungoogle', async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const script = req.query.script
    if (!(typeof script == 'string' && script in Object.keys(Config))) {
        // res.sendStatus(500)
        // return
    }
    res.write("Outputting...\n");

    res.write(`Running ${script}\n`)
    const item = Config["fetchArticles"]
    await item.script(res as Response)

    sendAndSleep(res, 1);
});

app.get('/', async (req, res) => {
    // await createCats()
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    res.write("Thinking...");
    sendAndSleep(res, 1);
});

app.listen(port, () => {
    console.log(port);
});
