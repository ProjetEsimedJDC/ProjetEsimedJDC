const { Card } = require('../models/models/card.model')
const { createCard, getCards, getCardById} = require('../models/repostories/card-repository')

describe('test card-repository createCard', () => {
    it('should create a card', async () => {
        const body = {
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
            sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
            name: 'Bulbizarre',
            HP: 45,
            attack: 49,
            defense: 49,
            special_attack: 65,
            special_defense: 65,
            speed: 45,
            type_1: 'plante',
            type_2: 'poison',
            apiEvolution_id: 1,
            apiPreEvolution_id : null,
            price:100
        };
        const mockCreate = jest.spyOn(Card, 'create').mockResolvedValueOnce(body);

        await createCard(body);

        expect(mockCreate).toHaveBeenCalledWith(body);
    });
});

describe('testing getCards', () => {
    it('should find all cards', async () => {
        const cards = [
            {
                id_card: '1',
                image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                name: 'Bulbizarre',
                HP: 45,
                attack: 49,
                defense: 49,
                special_attack: 65,
                special_defense: 65,
                speed: 45,
                type_1: 'plante',
                type_2: 'poison',
                apiEvolution_id: 1,
                apiPreEvolution_id : null,
                price:100
            },
            {
                id_card: '2',
                image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
                name: 'Herbizarre',
                HP: 45,
                attack: 49,
                defense: 49,
                special_attack: 65,
                special_defense: 65,
                speed: 45,
                type_1: 'plante',
                type_2: 'poison',
                apiEvolution_id: 1,
                apiPreEvolution_id : 1,
                price:100
            }
        ];
        jest.spyOn(Card, 'findAll').mockResolvedValue(cards);
        const result = await getCards();

        expect(Card.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(cards);
    });
});

describe('testing getCardById', () => {
    it('should find a card by id', async () => {
        const id_card = '1';
        const card = {
            id_card : '1',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
            sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
            name: 'Herbizarre',
            HP: 45,
            attack: 49,
            defense: 49,
            special_attack: 65,
            special_defense: 65,
            speed: 45,
            type_1: 'plante',
            type_2: 'poison',
            apiEvolution_id: 1,
            apiPreEvolution_id : 1,
            price:100
        };
        jest.spyOn(Card, 'findOne').mockResolvedValue(card);
        const result = await getCardById(id_card);

        expect(Card.findOne).toHaveBeenCalledWith({ where: { id_card } });
        expect(result).toEqual(card);
    });
});
