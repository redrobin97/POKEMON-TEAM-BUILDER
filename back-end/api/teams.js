const express = require("express");
const router = express.Router();
const {
  createPokemonTeam,
  getTeamById,
  deleteTeam,
  updateTeamName,
} = require("../db/pokemonTeams");
const { requireUser, requireAdmin } = require("./utils");

//TODO
// /pokemon_teams
//     team_id pk
//     user_id fk
//     team_name
//     timestamp
// -change teamname o

// /delete /api/teams
router.delete("/", async (req, res, next) => {
  const { id } = req.body;
  try {
    if (!id) {
      return next({
        name: "MissingRequirements",
        message: "Need to provide team id to delete team",
      });
    }
    const teamToDelete = await getTeamById(id);
    if (!teamToDelete) {
      return next({
        name: "TeamNotFound",
        message: "Team to delete does not exist",
      });
    } else {
      const deletedTeam = deleteTeam(id);
      if (!deletedTeam) {
        return next({
          name: "DeletionError",
          message: "There was an issue deleting team, try again later",
        });
      }
      res.send({ message: "Team deleted successfully", team: teamToDelete });
    }
  } catch (err) {
    next(err);
  }
});

//update team name /api/teams
router.patch("/", async (req, res, next) => {
  const { id, newTeamName } = req.body;
  try {
    if (!id || !newTeamName) {
      return next({
        name: "MissingRequirements",
        message: "Must provide an id and a newTeamName",
      });
    }
    const teamToUpdate = await getTeamById(id);
    if (!teamToUpdate) {
      return next({
        name: "TeamNotFound",
        message: "Team to update does not exist",
      });
    } else {
      const updatedTeam = await updateTeamName({ id, newTeamName });
      if (!updatedTeam) {
        return next({
          name: "ErrorUpdatingName",
          message: "There was an error updating name, try again later",
        });
      }
      res.send({ message: "Team name updated!", newName: newTeamName });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
