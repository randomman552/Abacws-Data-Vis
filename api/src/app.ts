import api from "./api";
import { PORT } from './api/constants';

// Start api
api.listen(PORT, () => {
    console.log(`API is listening on '${PORT}'...`)
});
