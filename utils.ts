import { PASSWORDS } from "./data/auth/passwords";

const GET_USER_PASSWORD = (username: string): string => {
    let password: string;
    try {
        password = PASSWORDS[username];
        return password;
    } catch (error) {
        throw new Error(`Failed retrieving password` + 
            ` for username: \`${username}\``);
    }
}

export { GET_USER_PASSWORD };