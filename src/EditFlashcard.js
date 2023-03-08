import React, { useState } from "react";

function EditFlashcard({ cardToEdit, closeEdit }) {
    const [card, setCard] = useState(cardToEdit);

    function updateCard(value) {
        return setCard((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const updatedFlashcard = { ...card };

        await fetch(`http://localhost:5000/flashcards/${card._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFlashcard),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        setCard({ front: "", back: "", cardSet: "", level: 0 });
        closeEdit();
    }

    return (
        <div>
            <h3>Edit Flashcard</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="front">Front: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="front"
                        size="100"
                        value={card.front}
                        onChange={(e) => updateCard({ front: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="back">Back: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="back"
                        size="100"
                        value={card.back}
                        onChange={(e) => updateCard({ back: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="cardSet">Card set: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="cardSet"
                        value={card.cardSet}
                        onChange={(e) => updateCard({ cardSet: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="cardSet">Level: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="level"
                        value={card.level}
                        onChange={(e) => updateCard({ level: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Submit"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}

export default EditFlashcard;
