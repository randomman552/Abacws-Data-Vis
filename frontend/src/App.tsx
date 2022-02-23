import './App.scss';
import ModelView from './views/ModelView';
import DataView from './views/DataView';

export default function App() {
    return (
        <div className="app">
            <ModelView/>
            <DataView/>
        </div>
);
}
