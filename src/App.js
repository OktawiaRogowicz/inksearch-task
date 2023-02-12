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

  function addDefaultSrc(ev) {
    ev.target.src =
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/41d3ac77-2823-4e18-8910-a48de63acf87/d8xl0ja-ca02368b-643f-42f4-9721-f3895e14690d.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQxZDNhYzc3LTI4MjMtNGUxOC04OTEwLWE0OGRlNjNhY2Y4N1wvZDh4bDBqYS1jYTAyMzY4Yi02NDNmLTQyZjQtOTcyMS1mMzg5NWUxNDY5MGQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dUhAjPqt1Rkudg3gHjqPNOQAuaA2wmXZ7T-Lq6L28O8";
  }

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
              onError={addDefaultSrc}
              alt={`pokemon-card-previous`}
              key={`pokemon-card-previous`}
              src={getImgSrc(cards[getPreviousId()].image)}
            />
          </button>
          <button className="card">
            <div className="card-active">
              <img
                onError={addDefaultSrc}
                alt={`pokemon-card-main`}
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
              onError={addDefaultSrc}
              alt={`pokemon-card-next`}
              key={`pokemon-card-next}`}
              src={getImgSrc(cards[getNextId()].image)}
            />
          </button>
        </div>
      )}
    </div>
  );
}
