import { useState } from "react";
import { apiFetch } from "../../../../api";
import "./QueryPanel.scss"

interface QueryPanelForm {
    queryType: { value: string }
    name: { value: string }
    type: { value: string }
    floor: { value: string }
    has: { value: string }
    from: { value: string }
    to: { value: string }
}

export function QueryPanel() {
    const [hideHas, setHideHas] = useState(true);
    const [hideDateRange, setHideDateRange] = useState(true);

    return (
        <article>
            <form
                className="query-form"
                id="query-form"
                autoComplete="off"
                onReset={() => { setHideHas(true); setHideDateRange(true); }}
                onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target & QueryPanelForm;
                    
                    // Convert datetime entries to unix time strings                    
                    const fromTime = String(new Date(target.from.value).getTime());
                    const toTime = String(new Date(target.to.value).getTime());
                    
                    // Create base url based on the query type
                    const queryType = target.queryType.value;
                    let baseUrl = `${window.location.protocol}${window.location.host}/api/query`;
                    if (queryType !== "info") baseUrl = `${baseUrl}/${queryType}`;
                    
                    // Build URL for query
                    const url = new URL(baseUrl);
                    if (target.name.value) url.searchParams.set("name", target.name.value);
                    if (target.type.value) url.searchParams.set("type", target.type.value);
                    if (target.floor.value) url.searchParams.set("floor", target.floor.value);
                    if (target.has.value) url.searchParams.set("has", target.has.value);
                    if (target.from.value) url.searchParams.set("from", fromTime);
                    if (target.to.value) url.searchParams.set("to", toTime);
                    
                    // Query API and once request is complete, download file
                    const result = await (await apiFetch(url.toString())).body;
                    const blob = new Blob([JSON.stringify(result)], { type: "text/json" });
                    const blobUrl = window.URL.createObjectURL(blob);

                    // Download result as JSON file
                    const a = document.createElement('a');
                    a.download = "query.json";
                    a.href = blobUrl;
                    a.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
                    a.remove();
                }}
            >
                <h2 className="title">Advanced Query</h2>

                {/** Query type */}
                <div className="input-group">
                    <span className="label-container">
                        <label htmlFor="queryType">Query Type:</label>
                    </span>
                    <select 
                        id="queryType"
                        name="queryType"
                        defaultValue="info"
                        onChange={(e) => {
                            const value = e.target.value;
                            setHideHas(value === "info");
                            setHideDateRange(value !== "history")
                        }}
                    >
                        <option>info</option>
                        <option>data</option>
                        <option>history</option>
                    </select>
                </div>

                {/** Name */}
                <div className="input-group">
                    <span className="label-container">
                        <label htmlFor="name">Name:</label>
                    </span>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="sensor1,sensor2"
                    />
                </div>

                {/** Type */}
                <div className="input-group">
                    <span className="label-container">
                        <label htmlFor="type">Type:</label>
                    </span>
                    <input
                        id="type"
                        name="type"
                        type="text"
                        placeholder="lecture,office"
                    />
                </div>

                {/** Floor */}
                <div className="input-group">
                    <span className="label-container">
                        <label htmlFor="floor">Floor:</label>
                    </span>
                    <input
                        id="floor"
                        name="floor"
                        type="text"
                        placeholder="1,2"
                    />
                </div>

                {/** Has */}
                <div className={(hideHas) ? "input-group hidden" : "input-group"}>
                    <span className="label-container">
                        <label htmlFor="has">Has:</label>
                    </span>
                    <input
                        id="has"
                        name="has"
                        type="text"
                        placeholder="temperature,humidity"
                    />
                </div>

                {/** From */}
                <div className={(hideDateRange) ? "input-group hidden" : "input-group"}>
                    <span className="label-container">
                        <label htmlFor="from">From:</label>
                    </span>
                    <input
                        id="from"
                        name="from"
                        type="datetime-local"
                    />
                </div>

                {/** To */}
                <div className={(hideDateRange) ? "input-group hidden" : "input-group"}>
                    <span className="label-container">
                        <label htmlFor="to">To:</label>
                    </span>
                    <input
                        id="to"
                        name="to"
                        type="datetime-local"
                    />
                </div>
                
                <footer className="footer">
                    <input className="button primary" type="submit"/>
                    <input className="button danger" type="reset"/>
                </footer>
            </form>
        </article>
    )
}