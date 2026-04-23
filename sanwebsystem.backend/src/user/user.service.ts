import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  REGEX_EMAIL_PROTOCOL,
  REGEX_PASSWORD_PROTOCOL,
} from '../common/app.constant';
import type { IRegexProtocol } from '../common/regex/regex-protocol';
import { HashingService } from '../common/hashing/hashing.service';
import { TokenPayloadDto } from '../auth/dto/token.payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ResponseUserDto } from './dto/response-user.dto';
import { TfaTypeRole, User } from '../db/entities/user.entity';
import { PasswordHistory } from '../db/entities/password_history.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordHistory)
    private readonly passwordHistoryRepository: Repository<PasswordHistory>,
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

  async findAll(paginationDto?: PaginationDto): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      take: paginationDto?.limit ?? undefined,
      skip: paginationDto?.offset ?? 0,
      order: { name: 'ASC' },
    });

    return this.getResponse<ResponseUserDto[]>(users, () => []);
  }

  async findOne(id: string): Promise<ResponseUserDto | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['passwordHistories'],
    });

    return this.getResponse<ResponseUserDto>(user, () => new ResponseUserDto());
  }

  async create(userDto: UserDto): Promise<ResponseUserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { login: userDto.login },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe');
    }

    const hash = await this.hashingService.hash(userDto.password || '');

    const user = await this.userRepository.save({
      login: userDto.login || '',
      passwordDatetime: new Date(),
      password: hash.passwordHashed,
      salt: hash.salt,
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
      active: true,
      photo: null,
      photoMimetype: null,
    } as User);

    if (!user) {
      new Error('Erro ao criar usuário');
    }

    return this.getResponse<ResponseUserDto>(user, () => new ResponseUserDto());
  }

  async update(userDto: UserDto): Promise<ResponseUserDto | string> {
    const preload: {
      id?: string;
      name?: string;
      password?: string;
      salt?: string;
      email?: string;
      isActive?: boolean;
    } = userDto;

    if (userDto.password) {
      const hash = await this.hashingService.hash(userDto.password || '');

      preload.password = hash.passwordHashed;
      preload.salt = hash.salt;
    }

    const user = await this.userRepository.preload(preload);

    if (!user) {
      return 'Usuário não encontrado';
    }

    const userSaved = await this.userRepository.save(user);

    return this.getResponse<ResponseUserDto>(
      userSaved,
      () => new ResponseUserDto(),
    );
  }

  async remove(
    id: string,
    tokenPayLoadDto: TokenPayloadDto,
  ): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return 'Usuário não encontrado';
    }

    if (tokenPayLoadDto.sub === user.login) {
      return 'Usuário não pode excluir a si mesmo';
    }

    await this.userRepository.remove(user);

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
