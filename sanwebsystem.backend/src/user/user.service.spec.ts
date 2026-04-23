import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { HashingService } from '../common/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TfaTypeRole, User } from '@entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('userService deve estar definido', () => {
    expect(userService).toBeDefined();
  });

  it('userRepository deve estar definido', () => {
    expect(userRepository).toBeDefined();
  });

  it('hashingService deve estar definido', () => {
    expect(hashingService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const userDto: UserDto = {
        login: 'teste2',
        password: 'E1vVtbYgP#',
        name: 'Teste2',
        email: 'teste2@example.com',
        active: true,
      };

      const newUser = {
        login: userDto.login || '',
        passwordDatetime: new Date(),
        password: 'HASHDESENHA',
        salt: '',
        name: userDto.name || '',
        email: userDto.email || '',
        mustPasswordChange: true,
        controller: false,
        tfaActive: false,
        tfaType: TfaTypeRole.NAO_APLICADO,
        tfaKey: null,
        tfaKeyDatetime: null,
        tfaEntryKey: null,
        tfaQrcodeImageUrl: null,
        active: userDto.active,
        photo: null,
        photoMimetype: null,
      } as Partial<User>;

      jest.spyOn(hashingService, 'hash').mockResolvedValue({
        passwordHashed: 'HASHDESENHA',
        salt: '',
      });

      // Como o usuário retornado em userRepository.save é necessário em userRepository.save, vamos simular
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(userRepository, 'save').mockReturnValue(newUser as any);

      // Saber se o userRepository.create foi chamado com dados de usuário
      const result = await userService.create(userDto);

      // O hashing service foi chamado com userDta.password
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(hashingService.hash).toHaveBeenCalledWith(userDto.password || '');

      // Saber se o userRepository.save foi chamado com o usuário criado com o valor gerado em hashingService,hash
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.save).toHaveBeenCalledWith(newUser);

      // O resultado do método retorno o novo usuário esperado?
      expect(result).toEqual(newUser);
    });

    it('deve lançar um ConflictException quando login já existe', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new ConflictException('Usuário já existe'));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await expect(userService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar um Exception não previsto', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Erro ao criar usuário'));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await expect(userService.create({} as any)).rejects.toThrow(Error);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma pessoa quando encontrada', async () => {
      const userId = '79c3a9a4-6f99-464f-a942-d33fcbef86cf';

      const userFinded = {
        id: '79c3a9a4-6f99-464f-a942-d33fcbef86cf',
        login: 'teste2',
        passwordDatetime: new Date(),
        password: 'E1vVtbYgP#',
        salt: '',
        name: 'Teste2',
        email: 'teste2@example.com',
        mustPasswordChange: true,
        controller: false,
        tfaActive: false,
        tfaType: TfaTypeRole.NAO_APLICADO,
        tfaKey: null,
        tfaKeyDatetime: null,
        tfaEntryKey: null,
        tfaQrcodeImageUrl: null,
        active: true,
        photo: null,
        photoMimetype: null,
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userFinded);

      const result = await userService.findOne(userId);

      expect(result).toEqual(userFinded);
    });

    it('retorna null, caso não encontre o usuário', async () => {
      await expect(userService.findOne('')).rejects.toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const userList: User[] = [];

      jest.spyOn(userRepository, 'find').mockResolvedValue(userList);

      const result = await userService.findAll();

      expect(result).toBeInstanceOf(typeof Array<User>);
    });
  });
});
