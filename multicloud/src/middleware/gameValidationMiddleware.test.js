const { CloudContextBuilder } = require("@multicloud/sls-core");
const gameValidationMiddleware = require("./gameValidationMiddleware")();
const gameService = require("../services/gameService");
const demoModel = require("../games.json");

describe("Game Validation Middleware", () => {
  it("responds with 400 if gameId path param is missing", () => {
    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .build();

    gameValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Game ID is required" },
      status: 400
    });
  });

  it("responds with 404 if gameId is not found", () => {
    gameService.get = jest.fn(() => null);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ gameId: "ABC123" })
      .build();

    gameValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Game not found" },
      status: 404
    });
  });

  it("continues next lifecycle when successfull", () => {
    gameService.get = jest.fn(() => demoModel.games[0]);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ gameId: "ABC123" })
      .build();

    gameValidationMiddleware(context, next);

    expect(next).toBeCalled();
    expect(context.game).toEqual(demoModel.games[0]);
  });
});
