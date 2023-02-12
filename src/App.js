import React, { useEffect, useState } from "react";
import "./styles.css";

const API_URL = `https://api.tcgdex.net/v2/en/cards`;
const NUMBER_OF_CARDS = 10;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getImgSrc(image) {
  return `${image}/high.webp`;
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [mainCardId, setMainCardId] = useState(0);
  const [cardDetails, setCardDetails] = useState(null);

  const getCard = (card) => {
    setCards((arr) => [...arr, card]);
  };

  const getCards = (cards) => {
    const cardsCounter = cards.length;
    for (let i = 0; i < NUMBER_OF_CARDS; i++) {
      const cardId = getRandomInt(cardsCounter);
      getCard(cards[cardId]);
    }
  };

  const getPreviousId = () => {
    if (mainCardId <= 0) return NUMBER_OF_CARDS - 1;
    return mainCardId - 1;
  };

  const getNextId = () => {
    if (mainCardId >= NUMBER_OF_CARDS - 1) return 0;
    return mainCardId + 1;
  };

  const showPrevious = () => {
    setMainCardId(getPreviousId());
  };

  const showNext = () => {
    setMainCardId(getNextId());
  };

  function showCardDetails() {
    if (cards && cards.length > 0)
      fetch(`${API_URL}/${cards[mainCardId].id}`)
        .then((res) => res.json())
        .then((cardDetails) => {
          setCardDetails(cardDetails);
        });
  }

  const shuffleCards = () => {
    setCards([]);
    fetch(API_URL)
      .then((res) => res.json())
      .then((cards) => {
        getCards(cards);
      });
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    showCardDetails();
  }, [cards, mainCardId]);

  return (
    <div className="App">
      <div className="heading">
        <h1 className="title">Pokemon cards</h1>
        <button onClick={shuffleCards} className="subtitle">
          click here to shuffle
        </button>
      </div>
      <button onClick={showPrevious} className="arrow arrow-left">{`<`}</button>
      <button onClick={showNext} className="arrow arrow-right">
        {`>`}
      </button>
      {cards && cards.length > 0 && (
        <div className="cards">
          <button onClick={showPrevious} className="card card-margin">
            <img
              key={`pokemon-card-previous`}
              src={getImgSrc(cards[getPreviousId()].image)}
            />
          </button>
          <button className="card">
            <div className="card-active">
              <img
                key={`pokemon-card-main`}
                src={getImgSrc(cards[mainCardId].image)}
              />
            </div>
            {cardDetails && (
              <div className="card-details">
                <div className="card-details-heading">
                  <p className="card-name">
                    {cardDetails.name}
                    {cardDetails.hp && `, ${cardDetails.hp}HP`}
                  </p>
                </div>
                <p className="card-rarity">{cardDetails.rarity}</p>
              </div>
            )}
          </button>
          <button onClick={showNext} className="card card-margin">
            <img
              key={`pokemon-card-next}`}
              src={getImgSrc(cards[getNextId()].image)}
            />
          </button>
        </div>
      )}
    </div>
  );
}
