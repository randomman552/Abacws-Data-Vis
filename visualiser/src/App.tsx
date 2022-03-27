import './App.scss';
import { ModelView, DataView } from './views';
import { useState } from 'react';
import { HamburgerToggle } from './components';

export default function App() {
    // Defaults to hiden when window is less than 500px accross
    const [hideDataView, setHideDataView] = useState(window.innerWidth < 500)

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
