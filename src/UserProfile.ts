export enum AccountType {
    Admin,
    User,
}

export default class UserProfile {
    private authenticated: boolean = false;

    private email: string;
    private password: string;
    private _firstName: string;
    private _lastName: string;

    constructor(
        public username: string,
        email: string,
        password: string,
        public accountType: AccountType,
        firstName: string, // This invokes the setter for _firstName
        lastName: string // This invokes the setter for _lastName
    ) {
        this.email = email;
        this.password = password;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    /**
     * Authenticates the user with an email and password.
     *
     * @param {string} email - The email to authenticate with.
     * @param {string} password - The password to authenticate with.
     * @return {boolean} - True if authentication is successful, otherwise false.
     */
    authenticate(email: string, password: string): boolean {
        if (this.email === email && this.password === password) {
            this.authenticated = true;
            return true;
        }
        return false;
    }

    /**
     * Checks if the user is authenticated.
     *
     * @return {boolean} - True if the user is authenticated, otherwise false.
     */
    isAuthenticated(): boolean {
        return this.authenticated;
    }


    /**
     * Sets the first name of the person.
     *
     * @param {string} name - The first name to set.
     * @throws {Error} Throws an error if the provided name is invalid.
     */
    set firstName(name: string) {
        if (!this.validateName(name)) {
            throw new Error("Invalid first name.");
        }
        this._firstName = name;
    }

    /**
     * Retrieves the first name of an object.
     *
     * @returns {string} The first name of the object.
     */
    get firstName(): string {
        return this._firstName;
    }

    /**
     * Sets the last name of a person.
     *
     * @param {string} name - The last name of the person.
     */
    set lastName(name: string) {
        if (!this.validateName(name)) {
            throw new Error("Invalid last name.");
        }
        this._lastName = name;
    }

    /**
     * Retrieves the last name of a person.
     *
     * @returns {string} The last name of the person.
     */
    get lastName(): string {
        return this._lastName;
    }


    /**
     * Validates a given name based on the specified criteria.
     *
     * @param {string} name - The name to be validated.
     * @return {boolean} - True if the name is valid, otherwise false.
     * @private
     */
    private validateName(name: string): boolean {
        const minLength = 1;
        const maxLength = 50;

        return name.length >= minLength && name.length <= maxLength;
    }
}
