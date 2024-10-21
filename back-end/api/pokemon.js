const express = require("express");
const {
  deletePokemon,
  updateNickname,
  getPokemonById,
} = require("../db/pokemon");
const { requireUser } = require("./utils");
const router = express.Router();

//delete pokemon api/pokemon/delete
router.delete("/delete", requireUser, async (req, res, next) => {
  const { id } = req.body;
  try {
    const deletedPokemon = await deletePokemon(id);
    console.log(deletedPokemon);
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
    const getPokemon = await getPokemonById(id);
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
