import express from "express";
import api from "./api";
import { PORT, URL_PREFIX } from './api/constants';

const app = express()
app.use(URL_PREFIX, api);

// Start api
app.listen(PORT, () => {
    console.log(`API is listening on '${PORT}'...`)
});
