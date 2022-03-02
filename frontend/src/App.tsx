import './App.scss';
import { useEffect } from 'react';
import { apiFetch } from './api/util';
import { ModelView, DataView } from './views';

export default function App() {
    useEffect(() => {
        apiFetch("/api/healthcheck").then((json) => { console.log(json) })
    }, []);

    return (
        <div className="app">
            <ModelView/>
            <DataView/>
        </div>
);
}
