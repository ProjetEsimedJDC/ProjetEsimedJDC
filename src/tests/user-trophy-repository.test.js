const { User_trophy } = require('../models/models/user_trophy.model')
const { findAllByIdUser } = require('../models/repostories/user-trophy-repository')

describe('testing findAllByIdUser', () => {
    it('should findAll users_trophy by id_user', async () => {
        const id_user = '1';
        const users_trophy = [
            {
                id_user_trophy : '1',
                id_user : '1',
                id_trophy : '1'
            },
            {
                id_user_trophy : '2',
                id_user : '1',
                id_trophy : '2'
            },
            {
                id_user_trophy : '3',
                id_user : '2',
                id_trophy : '1'
            }
        ]

        jest.spyOn(User_trophy, 'findAll').mockResolvedValue(users_trophy);
        const result = await findAllByIdUser(id_user);

        expect(User_trophy.findAll).toHaveBeenCalledWith({ where: { id_user } });
        expect(result).toEqual(users_trophy);
    });
});
