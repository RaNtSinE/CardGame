//import libs
import React from "react"
import {Container, Sprite} from '@inlet/react-pixi'
import { default as PIXI_SOUND } from 'pixi-sound'
//import files
import sound from './sound/open.mp3'

//component Card
class Card extends React.Component {
    constructor(props) {
        super(props);

        //a lot of states:
        //backScale is scale for back side of card
        //frontScale is scale for front side of card
        //positionBack is position for back side of card
        //positionFront is position for front side of card
        //didClosed need to close card only one time for one close animation
        //animationFront is state for animation front side of card
        //animationBack is state for animation back side of card
        //animationOpen is state for animation open card
        //animationClose is state for animation close card
        //interactive defines interactive of card
        //current time need to calculate delta of time
        this.state = {
            backScale: {x: 0.8,y: 0.8},
            frontScale: {x: 0, y: 0.8},
            positionBack: {x: 150 * (this.props.xCount - 1) + 120, y: 20 + (this.props.floor - 1) * 140},
            positionFront: {x: 150 * (this.props.xCount - 1) + 120, y: 20 + (this.props.floor - 1) * 140},
            didClosed: false,
            animationFront: false,
            animationBack: false,
            animationOpen: false,
            animationClose: false,
            interactive: this.props.interactive,
            currentTime: Date.now()
        }

        this.handlePickCard = this.handlePickCard.bind(this)
        this.backInteractive = this.backInteractive.bind(this)
        this.removeInteractive = this.removeInteractive.bind(this)
        this.animationOpen = this.animationOpen.bind(this)
        this.animationClose = this.animationClose.bind(this)

        //create sound
        this.sound = PIXI_SOUND.sound.Sound.from({url: sound, volume: 0.3})
    }


    handlePickCard(card, id) {
        if(this.props.onPickCard(card, id))
        {
            this.backInteractive()
            this.setState({
                backScale: {x: 0, y: 0.8},
                interactive: this.props.interactive})
        }

        this.props.checkWin()
    }

    backInteractive() {
        this.props.backInteractive();
        this.setState({backScale: {x: 0.8, y: 0.8},
            positionBack:
                {x: 150 * (this.props.xCount - 1) + 120,
                    y: 20 + (this.props.floor - 1) * 140},
            currentTime: Date.now(),
            animationBack: false,
            animationClose: false
        })
    }

    removeInteractive() {
        this.props.removeInteractive();
    }

    //change states before rendering
    static getDerivedStateFromProps(props, state) {
        if(props.needToClose)
        {
            let posBack
            if (state.backScale.x !== 0.8)
            {
                posBack = 150 * (props.xCount - 1) + 120 + 40
            }
            else
            {
                posBack = 150 * (props.xCount - 1) + 120
            }
            if (!state.didClosed)
            {
                return {
                    positionBack: {x: posBack, y: 20 + (props.floor - 1) * 140},
                    animationClose: true,
                    animationFront: true,
                    didClosed: true,
                    currentTime: Date.now(),
                    interactive: props.interactive
                }
            }
        } else if (props.backScale === 0)
        {
            return {
                backScale: {x: 0, y: 0.8},
                frontScale: {x: 0.8, y: 0.8},
                positionBack: {x: 150 * (props.xCount - 1) + 120 + 40, y: 20 + (props.floor - 1) * 140},
                positionFront: {x: 150 * (props.xCount - 1) + 120, y: 20 + (props.floor - 1) * 140},
                interactive: props.interactive,
                currentTime: Date.now(),
            }
        } else if (props.firstAnimation === true)
        {
            return {
                currentTime: Date.now(),
                animationClose: true,
                animationFront: true
            }
        }
        return {
            interactive: props.interactive
        }
    }

    //method for animation open card
    animationOpen() {
        if(this.state.animationBack === true && this.state.animationOpen === true)
        {
            let current = Date.now(),
                delta = current - this.state.currentTime
                this.setState({backScale: {x: this.state.backScale.x - 0.003 * delta, y: 0.8},
                positionBack:
                    {x: this.state.positionBack.x + 0.15 * delta,
                        y: 20 + (this.props.floor - 1) * 140},
                    currentTime: Date.now(),
                    animationClose: false
            })
            if (this.state.backScale.x <= 0)
            {
                this.setState({backScale: {x: 0, y: 0.8},
                    positionBack:
                        {x: 150 * (this.props.xCount - 1) + 120 + 40,
                            y: 20 + (this.props.floor - 1) * 140},
                    currentTime: Date.now(),
                    animationFront: true,
                    animationBack: false
                })
            }
        }
        if (this.state.animationFront === true && this.state.animationOpen === true)
        {
            let current = Date.now(),
                delta = current - this.state.currentTime
            this.setState({
                frontScale: {x: this.state.frontScale.x + 0.003 * delta, y: 0.8},
                positionFront: {x: this.state.positionFront.x - 0.15 * delta,
                    y: 20 + (this.props.floor - 1) * 140},
                currentTime: Date.now()
            })
            if (this.state.frontScale.x >= 0.8)
            {
                this.setState({
                    frontScale: {x: 0.8, y: 0.8},
                    positionFront: {x: 150 * (this.props.xCount - 1) + 120,
                        y: 20 + (this.props.floor - 1) * 140},
                    currentTime: Date.now(),
                    animationFront: false,
                    animationOpen: false,
                    interactive: true
                })

            }
        }
    }

    //method for animation close card
    animationClose() {
        if(this.state.animationBack === true  && this.state.animationClose === true)
        {
            let current = Date.now(),
                delta = current - this.state.currentTime
            this.setState({backScale: {x: this.state.backScale.x + 0.003 * delta, y: 0.8},
                positionBack:
                    {x: this.state.positionBack.x - 0.15 * delta,
                        y: 20 + (this.props.floor - 1) * 140},
                currentTime: Date.now()
            })
            if (this.state.backScale.x >= 0.8)
            {
                this.setState({backScale: {x: 0.8, y: 0.8},
                    positionBack:
                        {x: 150 * (this.props.xCount - 1) + 120,
                            y: 20 + (this.props.floor - 1) * 140},
                    currentTime: Date.now(),
                    animationBack: false,
                    animationClose: false
                })
                this.backInteractive()
            }
        }
        if (this.state.animationFront === true  && this.state.animationClose === true)
        {
            let current = Date.now(),
                delta = current - this.state.currentTime
            this.setState({
                frontScale: {x: this.state.frontScale.x - 0.003 * delta, y: 0.8},
                positionFront: {x: this.state.positionFront.x + 0.15 * delta,
                    y: 20 + (this.props.floor - 1) * 140},
                currentTime: Date.now()
            })
            if (this.state.frontScale.x <= 0)
            {
                this.setState({
                    frontScale: {x: 0, y: 0.8},
                    positionFront: {x: 150 * (this.props.xCount - 1) + 120 + 40,
                        y: 20 + (this.props.floor - 1) * 140},
                    currentTime: Date.now(),
                    animationFront: false,
                    animationBack: true,
                })
            }
        }
    }


    render() {
        setTimeout(this.animationOpen, 10)
        setTimeout(this.animationClose, 10)

        //render double-sided card first front then back
        return(
            <Container>
                <Sprite image={this.props.card}
                        x={
                            this.state.positionFront.x
                        }
                        y={
                            this.state.positionFront.y
                        }
                        scale={this.state.frontScale} mipmap={true}
                />
                <Sprite image={this.props.back}
                        x={
                            this.state.positionBack.x
                        }
                        y={
                            this.state.positionBack.y
                        }
                        interactive={this.state.interactive}
                        scale={this.state.backScale} mipmap={true}
                        pointerdown={() => {
                            //if click on the card
                            if (this.state.interactive === true && !this.state.animationClose)
                            {
                                this.sound.play();
                                this.setState({animationBack: true, animationOpen: true, currentTime: Date.now(),
                                })
                                if (this.props.countPick === 1 && this.state.interactive === true)
                                {
                                    this.state.interactive=false
                                    this.removeInteractive()
                                    setTimeout(() => {
                                        this.handlePickCard(this.props.card, this.props.id)
                                    },1000)

                                } else {
                                    this.state.interactive=false
                                    this.handlePickCard(this.props.card, this.props.id)
                                }
                                this.setState({didClosed: false})
                            }
                        }}
                >
                </Sprite>
            </Container>
        )
    }
}

export default Card