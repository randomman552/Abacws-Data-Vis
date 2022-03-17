export class DeviceSelectEvent extends CustomEvent<{ deviceName: string }> {
    static TYPE = "graphicsDeviceSelect";

    constructor(deviceName: string) {
        const type = DeviceSelectEvent.TYPE;
        super(type, { detail: { deviceName } });
    }
}

export class LoadEvent extends CustomEvent<{ success: boolean }> {
    static TYPE = "graphicsLoad";

    constructor(success: boolean=true) {
        const type = LoadEvent.TYPE;
        super(type, { detail: { success }});
    }
}

export class FloorSelectEvent extends CustomEvent<{ floor: number }> {
    static TYPE = "graphicsFloorSelect";

    constructor(floor: number) {
        const type = FloorSelectEvent.TYPE;
        super(type, { detail: { floor } });
    }
}
