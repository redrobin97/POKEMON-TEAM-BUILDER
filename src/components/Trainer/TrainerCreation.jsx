import React from "react";
import { useState } from "react";

export default function TrainerCreation({ getTrainerName, getTrainerGender }) {
  const [trainerName, setTrainerName] = useState(``);
  const [trainerGender, setTrainerGender] = useState(``);

  const handleSubmit = (e) => {
    e.preventDefault();
    getTrainerName(trainerName);
    getTrainerGender(trainerGender);
    setTrainerName("");
    setTrainerGender("");
  };

  return (
    <div>
      <div className="trainer-container">
        <label htmlFor="trainerName">
          Trainer name:
          <input
            type="text"
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
          />
        </label>
        <fieldset>
          <legend>Gender</legend>
          <label htmlFor="male">
            Male
            <input
              type="radio"
              value="male"
              name="gender"
              checked={trainerGender === "male"}
              onChange={(e) => {
                setTrainerGender(e.target.value);
              }}
            />
          </label>
          <label htmlFor="female">
            Female
            <input
              type="radio"
              value="female"
              name="gender"
              checked={trainerGender === "female"}
              onChange={(e) => {
                setTrainerGender(e.target.value);
              }}
            />
          </label>
        </fieldset>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
