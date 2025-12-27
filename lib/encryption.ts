
import Cryptor from "cryptr";

const CRYPTOR = new Cryptor(process.env.ENCRYPTION_KEY!);

export const encrypt = (text: string) => {
    return CRYPTOR.encrypt(text);
};

export const decrypt = (text: string) => {
    return CRYPTOR.decrypt(text);
};
