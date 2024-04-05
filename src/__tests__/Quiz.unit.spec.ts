import UserProfile, { AccountType } from '../UserProfile';
import Quiz from '../Quiz';

describe('Quiz', () => {
    let quiz: Quiz;
    let adminUserProfile: UserProfile;
    let userProfile: UserProfile;

    beforeEach(() => {
        quiz = new Quiz();
        adminUserProfile = new UserProfile(
            'David',
            'David@gmail.com',
            'David123',
            AccountType.Admin,
            'David John',
            'Doe'
        );

        userProfile = new UserProfile(
            'JaneS',
            'jane@gmail.com',
            'password456',
            AccountType.User,
            'Jane',
            'Smith'
        );

    });

    it('doit definir le profil dutilisateur actuel', () => {
        adminUserProfile.authenticate('David@gmail.com', 'David123')
        expect(adminUserProfile.isAuthenticated()).toBe(true);
        quiz.setCurrentUser(adminUserProfile)
        const currentUser = adminUserProfile

        expect(currentUser).toEqual({
            "_firstName": "David John",
            "_lastName": "Doe",
            "accountType": 0,
            "authenticated": true,
            "email": "David@gmail.com",
            "password": "David123",
            "username": "David"
        });
    });
    it('doit definir le profil dutilisateur actuel', () => {
        userProfile.authenticate('jane@gmail.com', 'password456')
        expect(userProfile.isAuthenticated()).toBe(true);
        quiz.setCurrentUser(userProfile)
        const currentUser = userProfile

        expect(currentUser).toEqual({
            "_firstName": "Jane",
            "_lastName": "Smith",
            "accountType": 1,
            "authenticated": true,
            "email": "jane@gmail.com",
            "password": "password456",
            "username": "JaneS"
        });
    });
    it('doit afficher message erreur sans autentification', () => {
        expect(userProfile.isAuthenticated()).toBe(false);
        expect(() => {
            quiz.setCurrentUser(userProfile);
        }).toThrowError('User must be authenticated to start a quiz.');
    });
    it('doit afficher message erreur sans autentification', () => {
        expect(adminUserProfile.isAuthenticated()).toBe(false);
        expect(() => {
            quiz.setCurrentUser(adminUserProfile);
        }).toThrowError('User must be authenticated to start a quiz.');
    });
});


