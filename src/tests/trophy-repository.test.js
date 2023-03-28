const { Trophy } = require('../models/models/trophy.model')
const { getTrophyById } = require('../models/repostories/trophy-repository')
describe('testing getTrophyById', () => {
    it('should find a trophy by id', async () => {
        const id_trophy = '1';
        const trophy = {
            id_trophy : '1',
            name : 'hoenn-1',
            svg : '[binary code]',
            description : 'description trophy'
        };
        jest.spyOn(Trophy, 'findOne').mockResolvedValue(trophy);
        const result = await getTrophyById(id_trophy);

        expect(Trophy.findOne).toHaveBeenCalledWith({ where: { id_trophy } });
        expect(result).toEqual(trophy);
    });
});
