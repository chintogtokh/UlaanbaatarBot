import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import chin from '@/projects/runGoogle';
import createCats from './projects/googlesheets/createCats';
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
