const { CloudContextBuilder } = require("@multicloud/sls-core");
const { getGameList, getGame, postGame, putGame, patchGame, deleteGame } = require("../handlers/games");
const gameService = require("../services/gameService");
const gamesModel = require("../games.json");

describe("Games REST API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("GET List", () => {
    it("responds with list of games", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .invokeHandler(getGameList);

      expect(context.res).toMatchObject({
        body: { values: gamesModel.games },
        status: 200
      });
    });
  });

  describe("GET Game By Id", () => {
    it("responds with 404 when game is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: "unknown" })
        .invokeHandler(getGame);

      expect(context.res).toMatchObject({
        body: { message: "Game not found" },
        status: 404
      });
    });

    it("responds with game when found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: gamesModel.games[0].id })
        .invokeHandler(getGame);

      expect(context.res).toMatchObject({
        body: { value: gamesModel.games[0] },
        status: 200
      });
    });
  });

  describe("POST Game", () => {
    it("responds with 400 when body is empty", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .invokeHandler(postGame);

      expect(context.res).toMatchObject({
        body: { message: "Game is required" },
        status: 400
      });
    });

    it("responds with 409 when game already exists", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody(gamesModel.games[0])
        .invokeHandler(postGame);

      expect(context.res).toMatchObject({
        body: { message: "Game with same name already exists" },
        status: 409
      });
    });

    it("responds with 201 when game was successfully created", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody({ name: "New Game" })
        .invokeHandler(postGame);

      expect(context.res).toMatchObject({
        body: expect.anything(),
        status: 201
      });
    });
  });

  describe("PUT Game", () => {
    it("responds with 404 when game is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: "unknown" })
        .invokeHandler(putGame);

      expect(context.res).toMatchObject({
        body: { message: "Game not found" },
        status: 404
      });
    });

    it("responds with 204 and updates game successfully", async () => {
      gameService.get = jest.fn(() => gamesModel.games[0]);
      jest.spyOn(gameService, "save");

      const gameToUpdate = {
        ...gamesModel.games[0],
        name: gamesModel.games[0] + ' (Updated)',
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: gameToUpdate.id })
        .withRequestBody(gameToUpdate)
        .invokeHandler(putGame);

      expect(gameService.save).toBeCalledWith(expect.objectContaining(gameToUpdate));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("PATCH Game", () => {
    it("responds with 404 when game is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: "unknown" })
        .invokeHandler(patchGame);

      expect(context.res).toMatchObject({
        body: { message: "Game not found" },
        status: 404
      });
    });

    it("responds with 204 and updates game successfully", async () => {
      gameService.get = jest.fn(() => gamesModel.games[0]);
      jest.spyOn(gameService, "save");

      const partialUpdate = {
        name: "(Updated)",
      };

      const expectedGame = {
        ...gamesModel.games[0],
        name: partialUpdate.name,
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: expectedGame.id })
        .withRequestBody(partialUpdate)
        .invokeHandler(patchGame);

      expect(gameService.save).toBeCalledWith(expect.objectContaining(expectedGame));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("DELETE Game", () => {
    it("responds with 404 when game is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: "unknown" })
        .invokeHandler(deleteGame);

      expect(context.res).toMatchObject({
        body: { message: "Game not found" },
        status: 404
      });
    });

    it("responds with 204 and updates game successfully", async () => {
      gameService.get = jest.fn(() => gamesModel.games[0]);
      jest.spyOn(gameService, "remove");

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ gameId: gamesModel.games[0].id })
        .invokeHandler(deleteGame);

      expect(gameService.remove).toBeCalledWith(gamesModel.games[0].id);
      expect(context.res.status).toEqual(204);
    });
  });
});
