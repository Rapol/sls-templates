const gameService = require("../services/gameService");

module.exports = () => async (context, next) => {
  if (!context.req.pathParams.has("gameId")) {
    return context.send({ message: "Game ID is required" }, 400);
  }

  const game = gameService.get(context.req.pathParams.get("gameId"));
  if (!game) {
    return context.send({ message: "Game not found" }, 404);
  }

  context.game = game;

  await next();
}
