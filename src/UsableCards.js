import React from "react"
import {Container, Text} from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import cards from "./loadCards";
import Card from "./Card"
import { default as PIXI_SOUND } from 'pixi-sound'
import prepare from './sound/prepare.mp3'
import start from './sound/start.mp3'
import win from "./sound/win.mp3";

const prepareSound = PIXI_SOUND.sound.Sound.from({url: prepare, volume: 0.1})
const startSound = PIXI_SOUND.sound.Sound.from({url: start, volume: 0.1})
const winSound = PIXI_SOUND.sound.Sound.from({url: win, volume: 0.3})

class UsableCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastPick: null,
            preLastPick: null,
            needToBlock: [null, null],
            needToClose: [null, null],
            lastId: null,
            countPick: 0,
            interactive: true,
            points: 0,
            prepare: true,
            start: true,
            startTime: new Date(),
            timer: "00:00:00",
        }

        this.handlePickCard = this.handlePickCard.bind(this)
        this.backInteractive = this.backInteractive.bind(this)
        this.removeInteractive = this.removeInteractive.bind(this)
        this.checkWin = this.checkWin.bind(this)

        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 22,
            fill: '#FFFFFF'
        })

        this.winStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#FFFFFF'
        })

        this.timerId = null
    }

    tick() {
        let timer = new Date() - this.state.startTime
        let minutes = 0
        let seconds = Math.round(timer / 1000)
        minutes = Math.floor(seconds / 60)


        seconds = seconds - minutes * 60
        if (minutes >= 0 && minutes < 10)
            minutes = "0" + minutes
        if (seconds >= 0 && seconds < 10)
            seconds = "0" + seconds
        let milliseconds = Math.round((timer / 10) % 100)
        if (milliseconds >= 0 && milliseconds < 10)
            milliseconds = "0" + milliseconds
        if (milliseconds > 99)
            milliseconds = 99
        this.setState({
            timer:minutes + ":" + seconds + ":" + milliseconds
        })
    }

    backInteractive() {
        this.setState({interactive: true})
    }

    removeInteractive() {
        this.setState({interactive: false})
    }

    checkWin() {
        if(this.state.points === 8)
        {
            clearInterval(this.timerId);
            winSound.play()
            setTimeout(() => {
                this.state.points = 0
                console.log("win")
                this.props.restart()
                this.setState({
                    lastPick: null,
                    preLastPick: null,
                    needToBlock: [null, null],
                    needToClose: [null, null],
                    countPick: 0,
                    interactive: true,
                    points: 0,
                    prepare: true,
                    timer: "00:00:00"
                })
            }, 5000)
            return true
        }
        return false
    }

    handlePickCard(currentPick, currentId) {
        console.log("this id " + currentId + " " + this.state.currentId + " " + this.state.countPick)
        this.setState({countPick: this.state.countPick + 1})
        if (this.state.countPick === 3)
        {
            this.setState({countPick: 1, needToBlock: [null, null],
                needToClose: [null, null], lastPick: null,
                preLastPick: null,
                block: null,
                close: null,
                currentId: null
            })
        }

        if (this.state.currentId !== currentId){
            this.setState({currentId: currentId})
            console.log(this.state.countPick)

            let lastPick = this.state.lastPick
            this.state.lastPick = currentPick
            this.state.preLastPick = lastPick
            if (this.state.countPick === 2)
            {
                if (this.state.lastPick === lastPick) {

                    this.setState({needToBlock: [lastPick, this.state.lastPick]})
                    this.state.points = this.state.points + 1

                    console.log("points" + this.state.points)
                    return true
                } else if (this.state.lastPick !== lastPick){
                    console.log(this.state.needToClose)
                    this.setState({needToClose: [lastPick, this.state.lastPick]})
                    return false
                }
            }
            console.log(this.state.needToClose)
            return false
        } else {
            this.setState({currentId: currentId})
            this.state.countPick = this.state.countPick - 1
            return true
        }

    }


    render() {

        let floor = 0;
        let xCount = 0;

        const cardDesk = this.props.usableCards.map((card, index) => {
                if (index % 4 === 0)
                {
                    floor++
                    xCount = 0;
                }

                xCount++
                if (this.state.needToClose[0] === card || this.state.needToClose[1] === card)
                {
                    console.log("close")
                    console.log(this.state.needToClose[0])
                    console.log(this.state.needToClose[1])

                    return (
                        <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                              needToClose={true} interactive={this.state.interactive} checkWin={this.checkWin}
                              key={index} card={card} xCount={xCount} countPick={this.state.countPick}
                              floor={floor} back={cards[0]} id={index}
                        />
                    )
                }
                if (this.state.interactive)
                {
                    if (this.state.prepare === true)
                    {
                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={false} removeInteractive={this.removeInteractive} checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false} backScale={0}
                                  countPick={this.state.countPick}
                                  floor={floor} back={card} id={index}
                            />
                        )
                    } else if (this.state.start === true) {
                        console.log("firstAnimation")

                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={true} removeInteractive={this.removeInteractive} checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false}
                                  countPick={this.state.countPick} firstAnimation={true}
                                  floor={floor} back={cards[0]} id={index}
                            />
                        )
                    } else {
                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={true} removeInteractive={this.removeInteractive} checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false}
                                  countPick={this.state.countPick}
                                  floor={floor} back={cards[0]} id={index}
                            />
                        )
                    }
                } else {
                    console.log(this.state.interactive)
                    return (
                        <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                              interactive={false} removeInteractive={this.removeInteractive} checkWin={this.checkWin}
                              key={index} card={card} xCount={xCount} needToClose={false}
                              countPick={this.state.countPick}
                              floor={floor} back={cards[0]} id={index}
                        />
                    )
                }
            }
        )
        if (this.state.prepare === true) {
            prepareSound.play()
            setTimeout(() => {
                this.setState({prepare: false,
                    start: true,
                })
                if (this.state.start === true)
                {
                    this.setState({startTime: new Date()})
                    this.timerId = setInterval(() => this.tick(),10);
                    startSound.play()
                    this.setState({start: false})
                }
            }, 5000)
        }



        if (this.state.points === 8)
        {
            return(
                <Container>
                    {cardDesk}
                    <Text style={this.winStyle} x={320} y={220} text="You WIN"/>
                    <Text style={this.winStyle} x={325} y={270} text={this.state.timer}/>
                </Container>
            )
        }
        return(
            <Container>
                {cardDesk}
                <Text style={this.style} x={10} y={40} text={this.state.timer}/>
            </Container>
        )
    }
}

export default UsableCards


