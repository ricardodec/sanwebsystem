import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioController } from './usuario.controller';

describe('UsuarioController', () => {
    let controller: UsuarioController;

    const userServiceMock = {
        save: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
    };

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        controller = new UsuarioController(userServiceMock as any);
    });

    it('create - deve user o UserService com o argumento correto', async () => {
        const argument = { key: 'value' };
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(userServiceMock, 'save').mockResolvedValue(expected);

        const result = await controller.create(argument as UsuarioDto);

        expect(userServiceMock.save).toHaveBeenCalledWith(argument);
        expect(result).toEqual(expected);
    });

    describe('findOne', () => {
        it('deve retornar uma pessoa quando encontrada', async () => {
            const expected = { anyKey: 'anyValue' };

            jest.spyOn(userServiceMock, 'findOne').mockResolvedValue(expected);

            const result = await controller.findOne(0);

            expect(userServiceMock.findOne).toHaveBeenCalledWith(0);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('deve retornar uma lista de usuários', async () => {
            const expected = { anyKey: 'anyValue' };

            jest.spyOn(userServiceMock, 'findAll').mockResolvedValue(expected);

            const result = await controller.findAll();

            expect(userServiceMock.findAll).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });
});
