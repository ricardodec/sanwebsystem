import { HashingService } from '@/src/common/hashing/hashing.service';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { Faker } from '@faker-js/faker';
import { TfaTypeRole, Usuario } from '../src/db/entities/usuario.entity';

export async function createUsuario(
    faker: Faker,
    hashingService: HashingService,
): Promise<Usuario> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const fullName = faker.person.fullName({
        firstName: firstName,
        lastName: lastName,
    });

    const email = faker.internet
        .email({
            firstName: firstName,
            lastName: lastName,
        })
        .toLowerCase();

    const login = faker.internet
        .username({
            firstName: firstName,
            lastName: lastName,
        })
        .toLowerCase();

    const hash = await hashingService.hash(
        faker.internet.password({ length: 10 }),
    );

    const tfaTipo = faker.helpers.enumValue(TfaTypeRole);

    const usuario: Usuario = {
        id: Number(SnowflakeId().generate()),
        login: login,
        dataSenha: faker.date.recent({ days: 20 }),
        senha: hash.passwordHashed,
        salt: hash.salt,
        nome: fullName,
        email: email,
        trocarSenha: faker.datatype.boolean(0.3),
        ehControlador: faker.datatype.boolean(0.1),
        tfa: tfaTipo !== TfaTypeRole.NAO_APLICADO,
        tfaTipo: tfaTipo,
        tfaKey: null,
        tfaKeyDataHora: null,
        tfaEntryKey: null,
        tfaQrcodeImageUrl: null,
        ativo: faker.datatype.boolean(0.7),
        foto: null,
        fotoMimetype: null,
    };

    return usuario;
}
