const express = require("express");
const {
  createPokemon,
  deletePokemon,
  updateNickname,
  getPokemonById,
} = require("../db/pokemon");
const { requireUser } = require("./utils");
const router = express.Router();

//create new pokemon post /api/pokemon (team_id, nickname, pokedex_number)
router.post("/", async (req, res, next) => {
  const { team_id, nickname, pokedex_number } = req.body;
  try {
    if (!team_id || !nickname || !pokedex_number) {
      return next({
        name: "MissingRequirements",
        message: "Please provide a team_id, nickname, and pokedex_number",
      });
    }
    const newPokemon = await createPokemon({
      team_id,
      nickname,
      pokedex_number,
    });
    if (!newPokemon) {
      return next({
        name: "PokemonCreationError",
        message: "There was an error creating pokemon, try again later",
      });
    } else {
      res.send({ message: "New pokemon created!", pokemon: newPokemon });
    }
  } catch (err) {
    next(err);
  }
});

//delete pokemon api/pokemon
router.delete("/", requireUser, async (req, res, next) => {
  const { id } = req.body;
  try {
    const deletedPokemon = await deletePokemon({ id });
    if (!deletedPokemon) {
      next({
        name: "PokemonNotFound",
        message: "There was an error deleting pokemon, please try again",
      });
    } else {
      res.send({ message: "Pokemon deleted successfully", deletedPokemon });
    }
  } catch (err) {
    next(err);
  }
});

//change pokemon nickname /api/pokemon/nickname/
router.patch("/nickname", requireUser, async (req, res, next) => {
  const { id, newNickname } = req.body;
  try {
    if (!id || !newNickname) {
      return next({
        name: "MissingRequiredData",
        message: "Must submit a newNickname and id",
      });
    }
    const getPokemon = await getPokemonById({ id });
    if (!getPokemon) {
      return next({
        name: "PokemonNotFound",
        message: "Pokemon by that id was not found",
      });
    } else {
      const updatedNickname = await updateNickname({ id, newNickname });
      res.send({
        message: "Pokemon nickname updated successfully",
        pokemon: updatedNickname,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
