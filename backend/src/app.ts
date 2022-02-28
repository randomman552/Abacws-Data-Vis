import api from "./api";
import { PORT } from './constants';

// Start api
api.listen(PORT, () => {
    console.log(`API is listening on '${PORT}'...`)
});
