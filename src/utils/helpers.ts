import { createHash } from "crypto";

export const randomString = (length: number) =>{
    return Math.random().toString(36).substring(2,length+2);
}

export const hash = (input: string, options?: { algorithm?: string, digest?: any }): string => {
    if (input == undefined) {
        throw Error("Input is null or undefined.");
    }

    if (input.length === 0) {
        throw Error("Input is empty.");
    }

    return createHash(options?.algorithm ?? 'sha256').update(input, "utf8").digest(options?.digest ?? 'hex');
}