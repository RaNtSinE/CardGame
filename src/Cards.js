//import libs
import React from "react"
import UsableCards from "./UsableCards";
import {Sprite} from '@inlet/react-pixi'
//import files
import cards from "./loadCards";
import play from "./sprite/play.png"

//component cards
class Cards extends React.Component {
    constructor(props) {
        super(props);

        //create states: gameState for change current game state (now MainMenu or Game) and countWins for counting
        //wins and update this component for reloading game
        this.state = {
            gameState: "MainMenu",
            countWins: 0
        }
        this.restart = this.restart.bind(this)
    }

    //method for shuffle array with cards
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    //method for get 8 usable cards of array with all cards (cards)
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

    //method for restart the game
    restart() {
        this.setState({countWins: this.state.countWins + 1})
    }

    render() {

        //creating array usableCards to transfer it in component UsableCards
        let usableCards = []

        this.getUsableCards(usableCards);

        this.shuffle(usableCards);

        //if gameState is "MainMenu", rendering play button
        if(this.state.gameState === "MainMenu")
        {
            return(
                <Sprite image={play}
                        x={330}
                        y={260}
                        interactive={true}
                        pointerdown={() => {
                            //if click on play button, change gameState to "Game"
                            this.setState({gameState: "Game"})
                        }}
                />
            )
        }
        //if gameState if "Game", rendering component UsableCards which contains the main game logic
        else if(this.state.gameState === "Game")
        {
            return(
                <UsableCards usableCards={usableCards} restart={this.restart}/>
            )
        }
    }
}

export default Cards