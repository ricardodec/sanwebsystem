import { TfaTypeRole, Usuario } from '@/src/db/entities/usuario.entity';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { HashingService } from '../common/hashing/hashing.service';
import { UserDto } from './dto/usuario.dto';
import { UserService } from './usuario.service';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<Usuario>;
    let hashingService: HashingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(Usuario),
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
        userRepository = module.get<Repository<Usuario>>(
            getRepositoryToken(Usuario),
        );
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
                senha: 'E1vVtbYgP#',
                nome: 'Teste2',
                email: 'teste2@example.com',
                ativo: true,
            };

            const newUser = {
                login: userDto.login || '',
                dataSenha: new Date(),
                senha: 'HASHDESENHA',
                salt: '',
                name: userDto.nome || '',
                email: userDto.email || '',
                mustPasswordChange: true,
                controller: false,
                tfaActive: false,
                tfaType: TfaTypeRole.NAO_APLICADO,
                tfaKey: null,
                tfaKeyDatetime: null,
                tfaEntryKey: null,
                tfaQrcodeImageUrl: null,
                active: userDto.ativo,
                photo: null,
                photoMimetype: null,
            } as Partial<Usuario>;

            jest.spyOn(hashingService, 'hash').mockResolvedValue({
                passwordHashed: 'HASHDESENHA',
                salt: '',
            });

            // Como o usuário retornado em userRepository.save é necessário em userRepository.save, vamos simular
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(userRepository, 'save').mockReturnValue(newUser as any);

            // Saber se o userRepository.create foi chamado com dados de usuário
            const result = await userService.create(userDto);

            // O hashing service foi chamado com userDta.senha
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(hashingService.hash).toHaveBeenCalledWith(
                userDto.senha || '',
            );

            // Saber se o userRepository.save foi chamado com o usuário criado com o valor gerado em hashingService,hash
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(userRepository.save).toHaveBeenCalledWith(newUser);

            // O resultado do método retorno o novo usuário esperado?
            expect(result).toEqual(newUser);
        });

        it('deve lançar um ConflictException quando login já existe', async () => {
            jest.spyOn(userRepository, 'save').mockRejectedValue(
                new ConflictException('Usuário já existe'),
            );

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await expect(userService.create({} as any)).rejects.toThrow(
                ConflictException,
            );
        });

        it('deve lançar um Exception não previsto', async () => {
            jest.spyOn(userRepository, 'save').mockRejectedValue(
                new Error('Erro ao criar usuário'),
            );

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await expect(userService.create({} as any)).rejects.toThrow(Error);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma pessoa quando encontrada', async () => {
            const salt = await bcrypt.genSalt();
            const passwordHashed = await bcrypt.hash('123456', salt);
            const id = Number(SnowflakeId().generate());

            const userFinded = {
                id: id,
                login: 'teste2',
                dataSenha: new Date(),
                senha: passwordHashed,
                salt: salt,
                nome: 'Teste2',
                email: 'teste2@example.com',
                trocarSenha: true,
                ehControlador: false,
                tfa: false,
                tfaTipo: TfaTypeRole.NAO_APLICADO,
                tfaKey: null,
                tfaKeyDataHora: null,
                tfaEntryKey: null,
                tfaQrcodeImageUrl: null,
                ativo: true,
                foto: null,
                fotoMimetype: null,
            } as Usuario;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(userFinded);

            const result = await userService.findOne(id);

            expect(result).toEqual(userFinded);
        });

        it('retorna null, caso não encontre o usuário', async () => {
            await expect(userService.findOne(0)).rejects.toBeNull();
        });
    });

    describe('findAll', () => {
        it('deve retornar uma lista de usuários', async () => {
            const userList: Usuario[] = [];

            jest.spyOn(userRepository, 'find').mockResolvedValue(userList);

            const result = await userService.findAll();

            expect(result).toBeInstanceOf(typeof Array<Usuario>);
        });
    });
});
