import React from "react"

import * as PIXI from 'pixi.js'
import Cards from "./Cards";
import {Stage} from '@inlet/react-pixi'
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR_MIPMAP_LINEAR;



class App extends React.Component {
    render() {
        return (
            <Stage>
                <Cards/>
            </Stage>
        )
    }
}

export default App