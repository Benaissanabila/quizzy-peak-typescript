import UserProfile, { AccountType } from '../UserProfile';

describe('UserProfile', () => {
    let userProfile: UserProfile;
    beforeEach(() => {
        userProfile = new UserProfile(
            'jean Dupond',
            'test@gmail.com',
            'password123',
            AccountType.User,
            'John',
            'Doe'
        );
    });

    it('should create a new user profile', () => {
        expect(userProfile).toBeDefined();
        expect(userProfile.username).toBe('jean Dupond');
        expect(userProfile.accountType).toBe(AccountType.User);
        expect(userProfile.firstName).toBe('John');
        expect(userProfile.lastName).toBe('Doe');
        expect(userProfile.isAuthenticated()).toBeFalsy();
    });

    it('should authenticate with valid email and password', () => {
        expect(userProfile.authenticate('test@gmail.com', 'password123')).toBeTruthy();
        expect(userProfile.isAuthenticated()).toBeTruthy();
    });

    it('should not authenticate with invalid email or password', () => {
        expect(userProfile.authenticate('invalid@gmail.com', 'password123')).toBeFalsy();
        expect(userProfile.authenticate('test@gmail.com', 'wrongpassword')).toBeFalsy();
        expect(userProfile.isAuthenticated()).toBeFalsy();
    });

    it('should set and get first name correctly', () => {
        userProfile.firstName = 'Jane';
        expect(userProfile.firstName).toBe('Jane');
    });

    it('should set and get last name correctly', () => {
        userProfile.lastName = 'Smith';
        expect(userProfile.lastName).toBe('Smith');
    });

    it('should throw error when setting invalid first name', () => {
        expect(() => {
            userProfile.firstName = '';
        }).toThrowError('Invalid first name.');
    });

    it('should throw error when setting invalid last name', () => {
        expect(() => {
            userProfile.lastName = '';
        }).toThrowError('Invalid last name.');
    });
});
