//import libs
import React from "react"
import * as PIXI from 'pixi.js'
import {Stage, Text} from '@inlet/react-pixi'
//import component
import Cards from "./Cards";
import cards from "./loadCards";
//change scale mode
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR_MIPMAP_LINEAR;

//component app
class App extends React.Component {
    render() {
        // render stage with component cards
        return (
            <Stage options={{ backgroundColor: 0x012b30 }}>
                <Cards/>
            </Stage>
        )
    }
}

export default App