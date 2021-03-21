import React from "react"
import cards from "./loadCards";
import UsableCards from "./UsableCards";
import {Sprite} from '@inlet/react-pixi'
import play from "./sprite/play.png"

class Cards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState: "MainMenu"
        }
        this.restart = this.restart.bind(this)
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getUsableCards(usableCards) {
        for (let i = 1; (i < 9) && (i < cards.length); i++) {
            let r = Math.floor(Math.random() * (cards.length - i)) + i;
            let card = cards[r];
            cards[r] = cards[i];
            cards[i] = card;

            usableCards.push(card);
            usableCards.push(card);
        }
    }

    restart() {
        this.forceUpdate()
    }

    render() {

        let usableCards = []

        this.getUsableCards(usableCards);

        this.shuffle(usableCards);

        if(this.state.gameState === "MainMenu")
        {
            return(
                <Sprite image={play}
                        x={330}
                        y={260}
                        interactive={true}
                        pointerdown={() => {
                            this.setState({gameState: "Game"})
                        }}
                />
            )
        }
        else if(this.state.gameState === "Game")
        {
            return(
                <UsableCards usableCards={usableCards} restart={this.restart}/>
            )
        }
    }
}

export default Cards