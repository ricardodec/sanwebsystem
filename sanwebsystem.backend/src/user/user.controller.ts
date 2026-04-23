import { SetRoutePolicy } from './../common/decorators/set-route-policy.decorator';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid-pipe';
import { AddHeaderInterceptor } from '../common/interceptors/add-header.interceptor';
import { AuthGuard } from '../auth/guards/auth-guard';
import { TokenPayloadDto } from '../auth/dto/token.payload.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../common/app.constant';
import { DataParam } from '../common/params/data-param.decorator';
import { RoutePolicyGuard } from '../auth/guards/route-policy-guard';
import { RoutePolicyEnum } from '../auth/enum/route.policy.unum';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { ResponseUserDto } from './dto/response-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('user')
@UseGuards(AuthGuard, RoutePolicyGuard)
@UsePipes(ParseUuidPipe)
@UseInterceptors(AddHeaderInterceptor)
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetRoutePolicy(RoutePolicyEnum.userfindAll)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 0,
    description: 'Limite de linhas por página',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Número da página',
  })
  @ApiResponse({
    status: 200,
    description: 'lista de usuários',
    type: [ResponseUserDto],
  })
  async findAll(
    @Query() paginationDto?: PaginationDto,
  ): Promise<ResponseUserDto[]> {
    return await this.userService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<string | ResponseUserDto> {
    const user = await this.userService.findOne(id);

    if (user) return user;

    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Usuário já existe',
    type: ConflictException,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Outro erro ao criar usuário',
    type: Error,
  })
  async create(@Body() userDto: UserDto): Promise<ResponseUserDto> {
    return await this.userService.create(userDto);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id') id: string,
    @Body()
    userDto: UserDto,
  ): Promise<ResponseUserDto | string> {
    const updatedBody = { ...userDto, id };
    const retorno = await this.userService.update(updatedBody);

    if (typeof retorno === 'string') {
      throw new NotFoundException('Erro ao atualizar o usuário');
    }

    return retorno;
  }

  @Put()
  async update(@Body() userDto: UserDto): Promise<ResponseUserDto | string> {
    return await this.userService.update(userDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @DataParam(REQUEST_TOKEN_PAYLOAD_KEY) tokenPayLoadDto: TokenPayloadDto,
  ): Promise<string> {
    return (
      (await this.userService.remove(id, tokenPayLoadDto)) ??
      'Usuário removido com sucesso'
    );
  }

  @Post('photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 10 * (1024 * 1024) }),
        ],
      }),
    )
    file: Express.Multer.File,
    @DataParam(REQUEST_TOKEN_PAYLOAD_KEY) tokenPayLoadDto: TokenPayloadDto,
  ) {
    const { fileName, fileFullPath } = await this.userService.uploadPhoto(
      file,
      tokenPayLoadDto.sub,
    );

    return {
      fileName,
      fileFullPath,
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @Post('photos')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadPhotos(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/png',
        })
        .addMaxSizeValidator({
          maxSize: 10 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const filesReturned: {
      fileName: string;
      fileFullPath: string;
      fieldname: string;
      originalname: string;
      mimetype: string;
      size: number;
    }[] = [];

    for (const file of files) {
      const { fileName, fileFullPath } = await this.userService.uploadPhoto(
        file,
        randomUUID(),
      );

      filesReturned.push({
        fileName,
        fileFullPath,
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    }

    return filesReturned;
  }
}
