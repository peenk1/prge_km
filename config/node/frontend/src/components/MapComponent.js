import React, {useRef, useEffect} from 'react';
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";

function MapComponent(props) {
    const mapRef = useRef(null);

    useGeographic()
    useEffect(
        () => {
            const map = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    })
                ],
                view: new View({
                    center: [21, 52],
                    zoom: 6,
                })

            });
            return () => map.setTarget(null)
        }, [])


    return (
        <div className='mapComponent' ref={mapRef}></div>
    );
}

export default MapComponent;