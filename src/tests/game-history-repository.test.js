const { Game_history } = require('../models/models/game_history.model')
const { getAllGameHistoryByGameId } = require('../models/repostories/game-history-repository')

describe('testing getAllGameHistoryByGameId', () => {
    it('should find a history game by id_game', async () => {
        const id_game = '1';
        const histories_game = [
            {
                id_game_history : '1',
                result : 'win',
                id_user : '1',
                id_game : '1'
            },
            {
                id_game_history : '2',
                result : 'win',
                id_user : '1',
                id_game : '1'
            },
            {
                id_game_history : '3',
                result : 'win',
                id_user : '1',
                id_game : '2'
            }
        ]

        jest.spyOn(Game_history, 'findAll').mockResolvedValue(histories_game);
        const result = await getAllGameHistoryByGameId(id_game);

        expect(Game_history.findAll).toHaveBeenCalledWith({ where: { id_game } });
        expect(result).toEqual(histories_game);
    });
});
