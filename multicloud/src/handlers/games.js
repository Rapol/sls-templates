const app = require("../app");
const middlewares = require("../config")();
const gameValidation = require("../middleware/gameValidationMiddleware");
const gameMiddlewares = middlewares.concat(gameValidation());
const gamesService = require("../services/gameService");

module.exports = {
  /**
   * Gets a list of games
   */
  getGameList: app.use(middlewares, (context) => {
    const games = gamesService.getList();
    context.send({ values: games }, 200);
  }),

  /**
   * Gets the metadata for the specified game id
   */
  getGame: app.use(gameMiddlewares, (context) => {
    context.send({ value: context.game }, 200);
  }),

  /**
   * Creates a new game
   */
  postGame: app.use(middlewares, (context) => {
    let game = context.req.body;

    if (!game) {
      return context.send({ message: "Game is required" }, 400);
    }

    try {
      delete game.id;
      game = gamesService.save(game);
    } catch (err) {
      return context.send({ message: err.message }, 409);
    }

    return context.send({ value: game }, 201);
  }),

  /**
   * Updates a game with the specified id
   */
  putGame: app.use(gameMiddlewares, (context) => {
    const game = context.req.body;
    if (!game) {
      return context.send({ message: "Game is required" }, 400);
    }

    const updatedGame = {
      ...context.req.body,
      id: context.req.pathParams.get("gameId")
    }

    gamesService.save(updatedGame);

    return context.send(null, 204);
  }),

  /**
   * Merges an update with the game at the specified id
   */
  patchGame: app.use(gameMiddlewares, (context) => {
    const udpatedGame = {
      ...context.game,
      ...context.req.body,
      id: context.req.pathParams.get("gameId")
    };

    gamesService.save(udpatedGame);

    return context.send(null, 204);
  }),

  /**
   * Delete a game with the specified id
   */
  deleteGame: app.use(gameMiddlewares, (context) => {
    gamesService.remove(context.req.pathParams.get("gameId"));
    context.send(null, 204);
  })
};
