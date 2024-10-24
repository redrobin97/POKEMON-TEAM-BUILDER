const express = require("express");
const router = express.Router();
const {
  createPokemonTeam,
  getTeamById,
  deleteTeam,
  updateTeamName,
  getPokemonTeam,
} = require("../db/pokemonTeams");
const { requireUser, requireAdmin } = require("./utils");

//post /api/teams (user_id, team_name)
router.post("/", async (req, res, next) => {
  const { user_id, team_name } = req.body;
  try {
    if (!user_id || !team_name) {
      return next({
        name: "MissingRequirements",
        message: "Please provide both a user_id and a team_name",
      });
    }
    const newTeam = await createPokemonTeam({ user_id, team_name });
    if (!newTeam) {
      return next({
        name: "TeamCreationError",
        message: "There was an error creating pokemon team, try again later",
      });
    } else {
      res.send({ message: "New team created successfully!", Team: newTeam });
    }
  } catch (err) {
    next(err);
  }
});

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
    const teamToDelete = await getTeamById({ id });
    if (!teamToDelete) {
      return next({
        name: "TeamNotFound",
        message: "Team to delete does not exist",
      });
    } else {
      const deletedTeam = await deleteTeam({ id });
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

//update team name /api/teams/name
router.patch("/name", async (req, res, next) => {
  const { id, newTeamName } = req.body;
  try {
    if (!id || !newTeamName) {
      return next({
        name: "MissingRequirements",
        message: "Must provide an id and a newTeamName",
      });
    }
    const teamToUpdate = await getTeamById({ id });
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

//get team GET /api/teams/{id}
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next({
        name: "MissingRequirements",
        message: "Please provide a valid team id",
      });
    }
    const teamToGet = await getTeamById({ id });
    if (!teamToGet) {
      return next({
        name: "TeamNotFound",
        message: "Team to get does not exist",
      });
    } else {
      const team = await getPokemonTeam({ id });
      if (!team) {
        return next({
          name: "ErrorGettingTeam",
          message: "There was an error getting team, please try again later",
        });
      }
      res.send({ message: "Successfully got team!", team: team });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
