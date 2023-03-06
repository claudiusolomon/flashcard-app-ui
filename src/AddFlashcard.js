import React, { useState } from "react";
import { useNavigate } from "react-router";

function AddFlashcard() {
    const [form, setForm] = useState({
        front: "",
        back: "",
        cardSet: "",
    });
    const navigate = useNavigate();

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newFlashcard = { ...form };
        newFlashcard.level = 0;

        await fetch("http://localhost:5000/flashcards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFlashcard),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        setForm({ front: "", back: "", cardSet: "" });
    }

    function handleClickExit(){
        navigate("/");
    }

    return (
        <div>
            <h3>Create New Flashcard</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="front">Front: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="front"
                        size="100"
                        value={form.front}
                        onChange={(e) => updateForm({ front: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="back">Back: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="back"
                        size="100"
                        value={form.back}
                        onChange={(e) => updateForm({ back: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="cardSet">Card set: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="cardSet"
                        value={form.cardSet}
                        onChange={(e) => updateForm({ cardSet: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Create"
                        className="btn btn-primary"
                    />
                </div>
            </form>
            <button onClick={handleClickExit}>Exit</button>
        </div>
    );
}

export default AddFlashcard;
