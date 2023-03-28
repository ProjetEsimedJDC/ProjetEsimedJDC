const { Game } = require('../models/models/game.model')
const { getAllGame } = require('../models/repostories/game-repository')
describe('testing getAllGame', () => {
    it('should find all games', async () => {
        const games = [
            {
                id_game : 1,
                type : 'room1',
                is_end : true,
            },
            {
                id_game : 2,
                type : 'room2',
                is_end : false,
            }
        ];
        jest.spyOn(Game, 'findAll').mockResolvedValue(games);
        const result = await getAllGame();

        expect(Game.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(games);
    });
});
