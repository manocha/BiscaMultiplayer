import React from 'react';
import Card from './Card';

import { Row } from 'react-bootstrap';
import { CardGroup } from '../Layout.js';

import '../../assets/Deck.css';

import card_back_img from './img/card_back.png';

const Deck = ({ remainingCards, trumpCard }) => {
  return (
    <CardGroup className="p-2 p-md-4 h-100">
      <Row>
        <div key={`deck-card-row`} id={'deck'} style={{ display: 'grid' }}>
          <div className='grid-trump'>
              <Card
                  cardID={`trump-card`}
                  cardData={trumpCard}
                  enableRotation={true}
              ></Card>
          </div>
          {Array.from({ length: Math.min(remainingCards, 5) }, (_, index) => {
            const offset = 1.5 * (index);
            return (
              <div key={`deck-card-column-${index+1}`} style={{ overflowY: 'visible', overflowX: 'auto', scrollbarWidth: 'none', width: `50%`, marginLeft: `${offset}vw`, gridColumn: '1', gridRow: '1' }}>
                <Card
                  cardID={`deck-card-${index+1}`}
                  cardData={{ image: card_back_img, isVisible: true }}
                />
              </div>
            );
          })}
        </div>
      </Row>
    </CardGroup>
  );
}

export default Deck;