import './App.scss';
import { ModelView, DataView } from './views';
import { useAPI } from './hooks';

export default function App() {
    const healthcheck = useAPI("/api/healthcheck");
    console.log(healthcheck);

    return (
        <div className="app">
            <ModelView/>
            <DataView/>
        </div>
);
}