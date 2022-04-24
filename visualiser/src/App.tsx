import './App.scss';
import { ModelView, DataView } from './views';
import { useEffect, useState } from 'react';
import { HamburgerToggle } from './components';
import { DeviceSelectEvent } from './three';

export default function App() {
    // Defaults to hiden when window is less than 500px accross
    const [hideDataView, setHideDataView] = useState(window.innerWidth < 500)

    // Register event listener to show the data panel when a device is selected
    useEffect(() => {
        function deviceSelectedListener() {
            setHideDataView(false);
        }

        window.addEventListener(DeviceSelectEvent.TYPE, deviceSelectedListener);

        // Cleanup function
        return () => { window.removeEventListener(DeviceSelectEvent.TYPE, deviceSelectedListener); };
    }, []);

    return (
        <div className="app">
            <ModelView/>

            
            <HamburgerToggle
                onClick={() => { setHideDataView(!hideDataView) }}
                close={!hideDataView}
            />
            <DataView
                hidden={hideDataView}
            />
        </div>
);
}
