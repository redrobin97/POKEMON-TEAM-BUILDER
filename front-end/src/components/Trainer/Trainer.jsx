import React from "react";
import TrainerCreation from "./TrainerCreation";
import { useState } from "react";

export default function Trainer() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  //handle name from child
  const handleName = (trainerName) => {
    setName(trainerName);
  };
  const handleGender = (trainerGender) => {
    setGender(trainerGender);
  };
  return (
    <div>
      <TrainerCreation
        getTrainerName={handleName}
        getTrainerGender={handleGender}
      />
      <div>{name}</div>
      <div>{gender}</div>
    </div>
  );
}
