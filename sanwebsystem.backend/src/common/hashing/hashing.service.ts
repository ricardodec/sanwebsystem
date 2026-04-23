export abstract class HashingService {
  abstract hash(password: string): Promise<{
    passwordHashed: string;
    salt?: string;
  }>;
  abstract compare(password: string, passwordHashed: string): Promise<boolean>;
}
