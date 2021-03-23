//import libs
import React from "react"
import {Container, Text} from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import { default as PIXI_SOUND } from 'pixi-sound'
//import components
import Card from "./Card"
//import files
import cards from "./loadCards";
import prepare from './sound/prepare.mp3'
import start from './sound/start.mp3'
import win from "./sound/win.mp3";

//component UsableCards
class UsableCards extends React.Component {
    constructor(props) {
        super(props);
        //creating a lot of states:
        //lastPick and preLastPick needs to compare 2 opened cards
        //needToClose need to check which cards need to close
        //lastId need to check if there was an attempt to open the same card twice
        //countPick need to counting opened cards
        //interactive true need to determine interactivity of all cards
        //point need to counting pairs of card
        //prepare and start is game start states
        //startTime need to calculate time from the start of the game
        //timer is a state which use to show time
        this.state = {
            lastPick: null,
            preLastPick: null,
            needToClose: [null, null],
            lastId: null,
            countPick: 0,
            interactive: true,
            points: 0,
            prepare: true,
            start: true,
            startTime: new Date(),
            timer: "00:00:00",
            lastWidth: this.props.width,
            lastHeight: this.props.height
        }

        this.handlePickCard = this.handlePickCard.bind(this)
        this.backInteractive = this.backInteractive.bind(this)
        this.removeInteractive = this.removeInteractive.bind(this)
        this.checkWin = this.checkWin.bind(this)

        //creating sounds
        this.prepareSound = PIXI_SOUND.sound.Sound.from({url: prepare, volume: 0.1})
        this.startSound = PIXI_SOUND.sound.Sound.from({url: start, volume: 0.1})
        this.winSound = PIXI_SOUND.sound.Sound.from({url: win, volume: 0.3})

        //creating styles for text
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

        //creating timer for setInterval
        this.timerId = null

    }

    //method for calculate time from the start of the game
    tick() {
        let timer = new Date() - this.state.startTime
        let minutes
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

    //method for victory check
    checkWin() {
        //if points = 8, clear timer, play win sound, "nullify" states and restart game
        if(this.state.points === 8)
        {
            clearInterval(this.timerId);
            this.winSound.play()
            setTimeout(() => {
                this.state.points = 0
                this.props.restart()
                this.setState({
                    lastPick: null,
                    preLastPick: null,
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

    //card selection handler
    handlePickCard(currentPick, currentId) {
        this.setState({countPick: this.state.countPick + 1})
        //change countPick 3 on 1 for the only 2 picks exist
        if (this.state.countPick === 3)
        {
            this.setState({
                countPick: 1,
                needToClose: [null, null],
                lastPick: null,
                preLastPick: null,
                currentId: null
            })
        }

        //if choosing another card: compare two cards and determining what to do with them
        if (this.state.currentId !== currentId){
            this.setState({currentId: currentId})

            let lastPick = this.state.lastPick
            this.state.lastPick = currentPick
            this.state.preLastPick = lastPick
            if (this.state.countPick === 2)
            {
                if (this.state.lastPick === lastPick) {
                    this.state.points = this.state.points + 1
                    return true
                } else if (this.state.lastPick !== lastPick){
                    this.setState({needToClose: [lastPick, this.state.lastPick]})
                    return false
                }
            }
            return false
        } else {                                                //if choosing same card
            this.setState({currentId: currentId})
            this.state.countPick = this.state.countPick - 1
            return true
        }

    }

    render() {

        //variables for calculate position cards
        let floor = 0;
        let xCount = 0;

        //creating cardDesk with 16 components Card
        const cardDesk = this.props.usableCards.map((card, index) => {
                if (index % 4 === 0)
                {
                    floor++
                    xCount = 0;
                }

                xCount++
                //closing necessary cards
                if (this.state.needToClose[0] === card || this.state.needToClose[1] === card)
                {

                    return (
                        <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                              needToClose={true} interactive={this.state.interactive}
                              checkWin={this.checkWin}
                              key={index} card={card} xCount={xCount} countPick={this.state.countPick}
                              floor={floor} back={cards[0]} id={index}
                              width={this.props.width} height={this.props.height}
                        />
                    )
                }
                //rendering interactive cards
                if (this.state.interactive)
                {
                    //rendering cards in prepare state
                    if (this.state.prepare === true)
                    {
                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={false} removeInteractive={this.removeInteractive}
                                  checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false} backScale={0}
                                  countPick={this.state.countPick}
                                  floor={floor} back={card} id={index}
                                  width={this.props.width} height={this.props.height}
                            />
                        )
                    } else if (this.state.start === true) {         //rendering cards on start state

                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={true} removeInteractive={this.removeInteractive}
                                  checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false}
                                  countPick={this.state.countPick} firstAnimation={true}
                                  floor={floor} back={cards[0]} id={index}
                                  width={this.props.width} height={this.props.height}
                            />
                        )
                    } else {            //standard rendering interactive cards
                        return (
                            <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                                  interactive={true} removeInteractive={this.removeInteractive}
                                  checkWin={this.checkWin}
                                  key={index} card={card} xCount={xCount} needToClose={false}
                                  countPick={this.state.countPick}
                                  floor={floor} back={cards[0]} id={index}
                                  width={this.props.width} height={this.props.height}
                            />
                        )
                    }
                } else {        //rendering not interactive cards
                    return (
                        <Card onPickCard={this.handlePickCard} backInteractive={this.backInteractive}
                              interactive={false} removeInteractive={this.removeInteractive}
                              checkWin={this.checkWin}
                              key={index} card={card} xCount={xCount} needToClose={false}
                              countPick={this.state.countPick}
                              floor={floor} back={cards[0]} id={index}
                              width={this.props.width} height={this.props.height}
                        />
                    )
                }
            }
        )
        //changing prepare and start states
        if (this.state.prepare === true) {
            if(this.state.lastWidth === this.props.width)
                this.prepareSound.play()
            else
                this.state.lastWidth = this.props.width
            setTimeout(() => {
                this.setState({prepare: false,
                    start: true,
                })
                if (this.state.start === true)
                {
                    this.setState({startTime: new Date()})
                    this.timerId = setInterval(() => this.tick(),10);
                    this.startSound.play()
                    this.setState({start: false})
                }
            }, 5000)
        }

        //game win then rendering cardDesk with victory message
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
        //standard rendering cardDesk and timer
        return(
            <Container>
                {cardDesk}
                <Text style={this.style} x={10} y={40} text={this.state.timer}/>
            </Container>
        )
    }
}

export default UsableCards


