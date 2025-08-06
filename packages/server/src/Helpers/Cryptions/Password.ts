const bcrypt = require('bcrypt');

export default function CryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function ComparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}