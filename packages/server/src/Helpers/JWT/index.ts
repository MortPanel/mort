import {sign,verify} from 'jsonwebtoken';

export const signToken = (userId: number) => sign({ id: userId }, process.env.JWT_SECRET as string)
export const verifyToken = (token: string) => verify(token, process.env.JWT_SECRET as string);