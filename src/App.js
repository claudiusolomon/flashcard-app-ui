import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";

function App() {

  const [cardSetsInformation, setCardSetsInformation] = useState([]);
  const navigate = useNavigate();

  // This method fetches the flashcards from the database.
  useEffect(() => {
    async function getCardSetsInformation() {
      // TODO for card sets information we should make requests to /cardsets ???
      const response = await fetch(`http://localhost:5000/flashcards`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const cards = await response.json();
      const allCardSets = cards.map(c => c.cardSet)
      const uniqueCardSets = new Set(allCardSets)

      const csInfo = [];

      for (const currentSet of uniqueCardSets) {
        const cardsInCurrentSet = cards.filter(card => card.cardSet === currentSet)
        console.log(cardsInCurrentSet.reduce((acc, cur) => acc + Number(cur.level), 0));
        const averageLevel = cardsInCurrentSet.reduce((acc, cur) => acc + Number(cur.level), 0) / cardsInCurrentSet.length
        csInfo.push({ cardSetName: currentSet, averageLevel: averageLevel, numberOfCards: cardsInCurrentSet.length })
      }

      setCardSetsInformation(csInfo);
    }

    getCardSetsInformation();

  }, [cardSetsInformation.length]);

  const handleCardSetClick = (cardSetName) => () => {
    navigate(`/study/${cardSetName}`);
  }

  const handleAddClick = () => {
    navigate(`/add`);
  }

  return (
    <div className="App">
      {cardSetsInformation.map((csInfo) => {
        return (
          <div key={csInfo.cardSetName}
            onClick={handleCardSetClick(csInfo.cardSetName)}>
            {csInfo.cardSetName} : {csInfo.numberOfCards} cards {csInfo.averageLevel} average level
          </div>
        )
      })}
      <div onClick={handleAddClick}>Add new flashcards</div>
    </div>
  );
}

export default App;
