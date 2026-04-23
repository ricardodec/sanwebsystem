import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from '../auth/dto/token.payload.dto';
import {
    REGEX_EMAIL_PROTOCOL,
    REGEX_PASSWORD_PROTOCOL,
} from '../common/app.constant';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HashingService } from '../common/hashing/hashing.service';
import type { IRegexProtocol } from '../common/regex/regex-protocol';
import { HistoricoSenha } from '../db/entities/historico_senha.entity';
import { TfaTypeRole, Usuario } from '../db/entities/usuario.entity';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(HistoricoSenha)
        private readonly historicoSenhaRepository: Repository<HistoricoSenha>,
        @Inject(REGEX_EMAIL_PROTOCOL)
        private readonly emailRegex: IRegexProtocol,
        @Inject(REGEX_PASSWORD_PROTOCOL)
        private readonly passwordRegex: IRegexProtocol,
        private readonly hashingService: HashingService,
    ) {}

    private getResponse<T>(source: object | null, getTarget: () => T): T {
        const target = getTarget() as object;

        Object.assign(target, source);

        return target as T;
    }

    async findAll(
        paginationDto?: PaginationDto,
    ): Promise<ResponseUsuarioDto[]> {
        const usuarios = await this.usuarioRepository.find({
            take: paginationDto?.limit ?? undefined,
            skip: paginationDto?.offset ?? 0,
            order: { nome: 'ASC' },
        });

        return this.getResponse<ResponseUsuarioDto[]>(usuarios, () => []);
    }

    async findOne(id: number): Promise<ResponseUsuarioDto | null> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: ['historicoSenha', 'parceiroUsuario'],
        });

        return this.getResponse<ResponseUsuarioDto>(
            usuario,
            () => new ResponseUsuarioDto(),
        );
    }

    async create(usuarioDto: UsuarioDto): Promise<ResponseUsuarioDto> {
        const existingUser = await this.usuarioRepository.findOne({
            where: { login: usuarioDto.login },
        });

        if (existingUser) {
            throw new ConflictException('Usuário já existe');
        }

        const hash = await this.hashingService.hash(usuarioDto.senha || '');

        const usuario = await this.usuarioRepository.save({
            id: Number(SnowflakeId().generate()),
            login: usuarioDto.login || '',
            dataSenha: new Date(),
            senha: hash.passwordHashed,
            salt: hash.salt,
            nome: usuarioDto.nome || '',
            email: usuarioDto.email || '',
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
        } as Usuario);

        if (!usuario) {
            throw new Error('Erro ao criar usuário');
        }

        await this.historicoSenhaRepository.save({
            id: Number(SnowflakeId().generate()),
            usuarioId: usuario.id,
            dataSenha: usuario.dataSenha,
            senha: hash.passwordHashed,
            salt: hash.salt,
            usuario: Promise.resolve(usuario),
        } as HistoricoSenha);

        return this.getResponse<ResponseUsuarioDto>(
            usuario,
            () => new ResponseUsuarioDto(),
        );
    }

    async update(usuarioDto: UsuarioDto): Promise<ResponseUsuarioDto | string> {
        const preload: {
            id?: number;
            nome?: string;
            senha?: string;
            salt?: string;
            email?: string;
            ativo?: boolean;
        } = usuarioDto;

        if (usuarioDto.senha) {
            const hash = await this.hashingService.hash(usuarioDto.senha || '');

            preload.senha = hash.passwordHashed;
            preload.salt = hash.salt;
        }

        const usuario = await this.usuarioRepository.preload(preload);

        if (!usuario) {
            return 'Usuário não encontrado';
        }

        const usuarioSaved = await this.usuarioRepository.save(usuario);

        return this.getResponse<ResponseUsuarioDto>(
            usuarioSaved,
            () => new ResponseUsuarioDto(),
        );
    }

    async remove(
        id: number,
        tokenPayLoadDto: TokenPayloadDto,
    ): Promise<string | null> {
        const usuario = await this.usuarioRepository.findOneBy({ id });

        if (!usuario) {
            return 'Usuário não encontrado';
        }

        if (tokenPayLoadDto.sub === usuario.login) {
            return 'Usuário não pode excluir a si mesmo';
        }

        await this.usuarioRepository.remove(usuario);

        return null;
    }

    private getExtension(fileName: string): string {
        return path.extname(fileName).toLowerCase().substring(1);
    }

    async uploadPhoto(file: Express.Multer.File, name: string) {
        if (file.size < 1024) {
            throw new BadRequestException('File too small');
        }

        const fileExtension = this.getExtension(file.originalname);
        const fileName = `${name}.${fileExtension}`;
        const fileFullPath = path.resolve(process.cwd(), 'photos', fileName);

        await fs.writeFile(fileFullPath, file.buffer);

        return {
            fileName,
            fileFullPath,
        };
    }
}
