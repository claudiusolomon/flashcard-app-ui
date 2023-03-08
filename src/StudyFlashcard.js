import './StudyFlashcard.css';
import EditFlashcard from './EditFlashcard'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router";

function StudyFlashcard() {

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    let { cardSet } = useParams();

    let currentCard = (cards.length === 0 || currentIndex >= cards.length) ? { front: "No cards available", back: "No cards available", cardSet: "Empty", _id: 0, level: 0 } : cards[currentIndex];

    // This method fetches the flashcards from the database.
    useEffect(() => {

        async function getCards() {

            const response = await fetch(`http://localhost:5000/flashcards/cardSet/${cardSet}`);

            console.log(response)
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const cards = await response.json();

            setCards(cards);
        }

        getCards();

    }, [cardSet]);

    const handleNextClick = async () => {

        if (currentCard._id === 0) return;

        const updatedCard = {
            ...currentCard,
            level: Number(currentCard.level) + 1
        };

        console.log(updatedCard);

        // This will send a post request to update the data in the database.
        await fetch(`http://localhost:5000/flashcards/${currentCard._id}`, {
            method: "PUT",
            body: JSON.stringify(updatedCard),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        setCurrentIndex(currentIndex + 1);
    }

    const handleSkipClick = () => {
        setCurrentIndex(currentIndex + 1);
    }

    const handleBackClick = () => {
        setShowFront(!showFront);
    }

    const handleEditClick = () => {
        setEditMode(!editMode);
    }

    const closeEdit = () => {
        setEditMode(!editMode);
        setCurrentIndex(currentIndex + 1);
    }

    function handleClickExit() {
        navigate("/");
    }

    const formatSideText = (text) => {
        const sentences = text.split('||');
        return (
            <div>
            {
                sentences.map((sentence, index) => <p key={index}>{sentence.trim()}</p>)
            }
            </div>
        )
    }

    return (
        <div className="Card-container">
            <div className="Card">
                <div className="Card-content">
                    <div className="Card-content-main">
                        <div>{showFront ? formatSideText(currentCard.front) : formatSideText(currentCard.back)}</div>
                    </div>
                    <div className="Card-content-info">
                        <p>Card Set: {currentCard.cardSet}</p>
                        <p>ID: {currentCard._id}</p>
                        <p>Level: {currentCard.level}</p>
                        <div className={currentCard.back ? "Green-dot" : "Red-dot"} />
                    </div>
                </div>
                <div className="Card-controls">
                    <div onClick={handleClickExit}>Exit</div>
                    <div onClick={handleEditClick}>Edit</div>
                    <div onClick={handleBackClick}>{showFront ? "Show back" : "Show front"}</div>
                    <div onClick={handleSkipClick}>Skip</div>
                    <div onClick={handleNextClick}>Next</div>
                </div>
            </div>
            {editMode ? <EditFlashcard cardToEdit={currentCard} closeEdit={closeEdit} /> : null}
        </div>
    );
}

export default StudyFlashcard;
