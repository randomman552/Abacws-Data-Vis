import './App.scss';
import { ModelView, DataView } from './views';
import { useState } from 'react';
import { HamburgerToggle } from './components';

export default function App() {
    const [hideDataView, setHideDataView] = useState(false)

    return (
        <div className="app">
            <ModelView/>

            
            <HamburgerToggle
                onClick={() => { setHideDataView(!hideDataView) }}
            />
            <DataView
                hidden={hideDataView}
            />
        </div>
);
}
