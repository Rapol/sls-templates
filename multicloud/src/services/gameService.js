const shortid = require("shortid");
const model = require("../games.json");
const cache = new Map(model.games.map((game) => [game.id, game]));

module.exports = {
  getList: () => {
    return Array.from(cache.values());
  },

  get: (id) => {
    return cache.get(id);
  },

  save: (game) => {
    if (!game.id) {
      game.id = shortid.generate();
      game.created = Date.now();

      const allGames = Array.from(cache.values());
      const existing = allGames.find((p) => p.name === game.name);
      if (existing) {
        throw new Error("Game with same name already exists");
      }
    }

    game.modified = Date.now();
    cache.set(game.id, game);

    return game;
  },

  remove: (id) => {
    cache.delete(id);
  }
}
