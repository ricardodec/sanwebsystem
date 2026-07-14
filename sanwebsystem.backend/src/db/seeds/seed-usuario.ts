import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { DataSource, Repository } from 'typeorm';
import { HashingService } from '../../common/hashing/hashing.service';
import { HistoricoSenha } from '../entities/historico_senha.entity';
import { TfaTypeRole, Usuario } from '../entities/usuario.entity';

const createUsuario = async (
    usuarioRepository: Repository<Usuario>,
    usuario: Usuario,
    historicoSenhaRepository: Repository<HistoricoSenha>,
): Promise<Usuario> => {
    usuario = await usuarioRepository.save(usuario);

    await historicoSenhaRepository.save({
        ID: Number(SnowflakeId().generate()),
        usuario_ID: usuario.ID,
        dataSenha: usuario.dataSenha,
        senha: usuario.senha,
        usuario: Promise.resolve(usuario),
    } as HistoricoSenha);

    return usuario;
};

export const seedUsuario = async (
    dataSource: DataSource,
    hashingService: HashingService,
): Promise<void> => {
    const usuarioRepository = dataSource.getRepository(Usuario);
    const historicoSenhaRepository = dataSource.getRepository(HistoricoSenha);

    let hash = await hashingService.hash('admin123');

    await createUsuario(
        usuarioRepository,
        {
            ID: Number(SnowflakeId().generate()),
            login: 'admin',
            dataSenha: new Date(),
            senha: hash.passwordHashed,
            nome: 'Administrador',
            email: 'ricardodec@gmail.com',
            trocarSenha: false,
            ehControlador: true,
            tfa: false,
            tfaTipo: TfaTypeRole.NAO_APLICADO,
            tfaKey: null,
            tfaKeyDataHora: null,
            tfaEntryKey: null,
            tfaQrcodeImageUrl: null,
            ativo: true,
            foto: null,
            fotoMimetype: null,
        } as Usuario,
        historicoSenhaRepository,
    );

    hash = await hashingService.hash('user123');

    await createUsuario(
        usuarioRepository,
        {
            ID: Number(SnowflakeId().generate()),
            login: 'ricardodec',
            dataSenha: new Date(),
            senha: hash.passwordHashed,
            nome: 'Ricardo de Castro',
            email: 'ricardo.castro@sanwebsystem.com.br',
            trocarSenha: false,
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
        } as Usuario,
        historicoSenhaRepository,
    );
};
