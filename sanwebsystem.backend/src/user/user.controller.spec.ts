import { UserDto } from './dto/user.dto';
import { UserController } from './user.controller';

describe('UserContoller', () => {
  let controller: UserController;

  const userServiceMock = {
    save: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    controller = new UserController(userServiceMock as any);
  });

  it('create - deve user o UserService com o argumento correto', async () => {
    const argument = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(userServiceMock, 'save').mockResolvedValue(expected);

    const result = await controller.create(argument as UserDto);

    expect(userServiceMock.save).toHaveBeenCalledWith(argument);
    expect(result).toEqual(expected);
  });

  describe('findOne', () => {
    it('deve retornar uma pessoa quando encontrada', async () => {
      const argument = '';
      const expected = { anyKey: 'anyValue' };

      jest.spyOn(userServiceMock, 'findOne').mockResolvedValue(expected);

      const result = await controller.findOne(argument);

      expect(userServiceMock.findOne).toHaveBeenCalledWith(argument);
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
