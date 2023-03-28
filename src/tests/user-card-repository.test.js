const { User_card } = require('../models/models/user_card.model')
const { getAllUserCardById } = require('../models/repostories/user-card-repository')

describe('testing getAllUserCardById', () => {
    it('should findAll users_card by id_user', async () => {
        const id_user = '1';
        const users_card = [
            {
                id_user_card : '1',
                id_user : '1',
                id_card : '1'
            },
            {
                id_user_card : '2',
                id_user : '1',
                id_card : '2'
            },
            {
                id_user_card : '3',
                id_user : '2',
                id_card : '1'
            }
        ]

        jest.spyOn(User_card, 'findAll').mockResolvedValue(users_card);
        const result = await getAllUserCardById(id_user);

        expect(User_card.findAll).toHaveBeenCalledWith({ where: { id_user } });
        expect(result).toEqual(users_card);
    });
});
