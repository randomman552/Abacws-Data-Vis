import './App.scss';
import ModelView from './views/ModelView';
import DataView from './views/DataView';
import { useEffect } from 'react';
import { apiFetch } from './api/util';

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
