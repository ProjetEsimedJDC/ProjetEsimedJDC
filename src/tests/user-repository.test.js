const { User } = require('../models/models/user.model')

const { getUserByEmail, getUserById, getUsers} = require('../models/repostories/user-repository')
describe('testing getUserByEmail', () => {
    it('should find a user by email', async () => {
        const email = 'test@example.com';
        const user = {
            id_user: '1234567890987654321',
            pseudo: 'test',
            email: email,
            password: 'password',
            coins : 1,
            id_card_1 : 1,
            id_card_2 : 2,
            id_card_3 : 3
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(user);
        const result = await getUserByEmail(email);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
        expect(result).toEqual(user);
    });
});

describe('testing getUserById', () => {
    it('should find a user by id', async () => {
        const id_user = '1234567890987654321';
        const user = {
            id_user: id_user,
            pseudo: 'test',
            email: 'test@example.com',
            password: 'password',
            coins : 1,
            id_card_1 : 1,
            id_card_2 : 2,
            id_card_3 : 3
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(user);
        const result = await getUserById(id_user);

        expect(User.findOne).toHaveBeenCalledWith({ where: { id_user } });
        expect(result).toEqual(user);
    });
});

describe('testing getUsers', () => {
    it('should find all users', async () => {
        const users = [
                {
                    id_user: '132434',
                    pseudo: 'test',
                    email: 'test@example.com',
                    password: 'password',
                    coins : 1,
                    id_card_1 : 1,
                    id_card_2 : 2,
                    id_card_3 : 3
                },
                {
                    id_user: '2324343',
                    pseudo: 'test2',
                    email: 'test2@example.com',
                    password: 'password',
                    coins : 1,
                    id_card_1 : 1,
                    id_card_2 : 2,
                    id_card_3 : 3
                }
            ];
        jest.spyOn(User, 'findAll').mockResolvedValue(users);
        const result = await getUsers();

        expect(User.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(users);
    });
});