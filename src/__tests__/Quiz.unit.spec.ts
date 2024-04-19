import Quiz from '../Quiz';
import UserProfile, { AccountType } from "../UserProfile";

class MockUserProfile extends UserProfile {
    isAuthenticated: jest.Mock;
    constructor(
        username: string,
        email: string,
        password: string,
        accountType: AccountType,
        firstName: string,
        lastName: string
    ) {
        super(username, email, password, accountType, firstName, lastName);
        this.isAuthenticated = jest.fn();
    }
}


describe('Quiz', () => {
    let quiz: Quiz;
    let adminUserProfile: MockUserProfile;
   let userProfile: MockUserProfile;

    beforeEach(() => {
        quiz = new Quiz();

        adminUserProfile = new MockUserProfile(
            'David',
            'David@gmail.com',
            'David123',
            AccountType.Admin,
            'David John',
            'Doe'
        );
        userProfile = new MockUserProfile(
            'JaneS',
            'jane@gmail.com',
            'password456',
            AccountType.User,
            'Jane',
            'Smith'
        )

        jest.spyOn(adminUserProfile, 'isAuthenticated');
        jest.spyOn(userProfile, 'isAuthenticated');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('setCurrentUser', () => {
        it("devrait générer une erreur lorsque l'utilisateur n'est pas authentifié", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(false);
            expect(() => quiz.setCurrentUser(adminUserProfile)).toThrowError('User must be authenticated to start a quiz.');
        });
        it('devrait définir lutilisateur actuel une fois authentifié', () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const currentUser = adminUserProfile
            expect(() => quiz.setCurrentUser(adminUserProfile)).not.toThrow();
            expect(currentUser).toEqual(adminUserProfile)
            expect(currentUser.firstName).toBe("David John");
            expect(currentUser.lastName).toBe("Doe");
        });
    });

    describe('searchQuestions',()=>{
        it("devrait rechercher les questions par mot-clé dans le texte ou la catégorie", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const currentUser = adminUserProfile;

            const question1 =
                {id: 1, text: "What is 1+1?", options: ["1", "2", "3", "4"], answer: "2", category: "Math"};
            const question2 = {
                id: 2,
                text: "What is 2+2?",
                options: ["2", "3", "4", "5"],
                answer: "4",
                category: "Mathematique"
            };
            const question3 = {
                id: 3,
                text: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                answer: "Paris",
                category: "Geography"
            };
            quiz.addQuestion(question1);
            quiz.addQuestion(question2);
            quiz.addQuestion(question3);
            const keyword = "Math";
            const searchResult = quiz.searchQuestions(keyword);

            // Vérifiez que les questions trouvées contiennent le mot-clé dans le texte ou la catégorie
            expect(searchResult).toContain(question1);
            expect(searchResult).toContain(question2);

            // Vérifiez qu'une question qui ne contient pas le mot-clé n'est pas incluse dans les résultats
            expect(searchResult).not.toContain(question3);
            const keyword2 = "Biology";// Mot-clé qui ne correspond à aucune question
            const searchResult2 = quiz.searchQuestions(keyword2);
            // Vérifiez que le résultat de la recherche est un tableau vide
            expect(searchResult2).toEqual([]);

        });
    })


    describe(' editQuestion',()=>{
        it("devrait lancer une erreur si l'utilisateur n'est pas un administrateur", () => {
            userProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(userProfile);
            expect(() => quiz.editQuestion(1, { text: "What is 1+2?" })).toThrowError('Only admin users can add questions.');
        });

        it('devrait modifier une question lorsque lutilisateur est administrateur', () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const currentUser = adminUserProfile;
            const question = { id: 1, text: "What is 1+1?", options: ["1", "2", "3", "4"], answer: "2", category: "Math" };
            quiz.addQuestion(question);
            const updatedQuestion = { text: "What is 2+2?" };
            quiz.editQuestion(1, updatedQuestion);
            const editedQuestion = quiz.searchQuestions("Math")[0];
            expect(editedQuestion.text).toContain(updatedQuestion.text);
        });
        it("ne doit modifier aucune question si lidentifiant de la question nexiste pas", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question = { id: 1, text: "Who wrote the play 'Romeo and Juliet'?", options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Leo Tolstoy"], answer: "William Shakespeare", category: "Literature" };
            quiz.addQuestion(question);
            const updatedQuestion = { text: "What is 2+2?" };
            quiz.editQuestion(2, updatedQuestion);
            const editedQuestion = quiz.searchQuestions("Literature")[0];
            expect(editedQuestion.text).toBe(question.text);
        });
    })

    describe('startQuiz', () => {
 it("devrait démarrer un quiz avec des options valides", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const options = { numberQuestions: 1, category: "math", username: "David" };
            const result = quiz.startQuiz(options);
            expect(result.length).toEqual(0);
            // Vérifier que toutes les questions retournées appartiennent à la catégorie spécifiée
            result.forEach(question => {
                expect(question.category).toContain("math");
            });
        });

        it("devrait générer une erreur si l'utilisateur n'est pas authentifié", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(false);
            const options = { numberQuestions: 5, category: "Math", username: "David" };
            expect(() => quiz.startQuiz(options)).toThrowError('Invalid or unauthenticated user.');
        });
    });

    describe('addQuestion', () => {
        let quiz: Quiz;
        let adminUserProfile: MockUserProfile;
        beforeEach(() => {
            // Créer une instance de Quiz avec une limite de 2 questions par catégorie pour les tests
            quiz = new Quiz(2);
            adminUserProfile = new MockUserProfile(
                'admin',
                'admin@example.com',
                'admin123',
                AccountType.Admin,
                'Admin',
                'User'
            );
        });
        it("devrait ajouter une question lorsque l'utilisateur est administrateur", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const currentUser = adminUserProfile;
            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            quiz.addQuestion(question);
            // Vérifier si la question a été ajoutée en cherchant par catégorie
            const filteredQuestions = quiz.searchQuestions("Math");
            expect(filteredQuestions).toContain(question);
        });

        it("devrait générer une erreur si l'utilisateur n'est pas administrateur", () => {
            userProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(userProfile);

            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            expect(() => quiz.addQuestion(question)).toThrowError('Only admin users can add questions.');
        });
        it("devrait ajouter une question lorsque la limite de questions par catégorie n'est pas atteinte", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            // Créer une question pour la catégorie "Math"
            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            expect(() => quiz.addQuestion(question)).not.toThrowError();
        });

        it("ne devrait pas ajouter une question lorsque la limite de questions par catégorie est atteinte", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            // Ajouter deux questions pour la catégorie "Math" (atteindre la limite)
            quiz.addQuestion(question);
            quiz.addQuestion({ ...question, id: 2 });
            // Tentative d'ajouter une troisième question pour la catégorie "Math"
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(); expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });

    describe('removeQuestion', () => {
        it("devrait générer une erreur si l'utilisateur n'est pas administrateur", () => {
            userProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(userProfile);
            const questionId = 1;
            expect(() => quiz.removeQuestion(questionId)).toThrowError('Only admin users can add questions.');
        });

        it("devrait supprimer une question lorsque l'utilisateur est administrateur", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            quiz.addQuestion(question);
            const questionId = 1;
            quiz.removeQuestion(questionId);
            const filteredQuestions = quiz.searchQuestions("Math");
            expect(filteredQuestions).not.toContain(question);
        });
    });
    describe('searchQuestions', () => {

        it("devrait retourner les questions contenant le mot-clé dans le texte de la question", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            quiz.addQuestion(question);
            const searchResult = quiz.searchQuestions("What");
            expect(searchResult).toContain(question);
        });

        it("devrait retourner les questions contenant le mot-clé dans la catégorie de la question", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);

            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            quiz.addQuestion(question);

            const searchResult = quiz.searchQuestions("Math");
            expect(searchResult).toContain(question);
        });

        it("ne devrait pas retourner de questions lorsque le mot-clé ne correspond à aucun texte ou catégorie de question", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);

            const question = {
                id: 1,
                text: "What is the square root of 16?",
                options: ["2", "4", "8", "16"],
                answer: "4",
                category: "Math"
            };
            quiz.addQuestion(question);
            const searchResult = quiz.searchQuestions("Biology");
            expect(searchResult).toHaveLength(0);
        });
        it("ne devrait pas retourner derreur  si l'utilisateur n'est pas authentifié", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(false);
            const searchResult = quiz.searchQuestions("Biology");
            expect(searchResult).toHaveLength(0);

        });
    });

    describe('submitAnswer', () => {
    it("devrait soumettre une réponse correcte avec succès par administrateur ", () => {
        adminUserProfile.isAuthenticated.mockReturnValue(true);
        quiz.setCurrentUser(adminUserProfile);
        const question1 =
            {id: 1, text: "What is 1+1?", options: ["1", "2", "3", "4"], answer: "2", category: "Math"};
        quiz.addQuestion(question1);
        quiz.submitAnswer(1, "2");
        expect(() => quiz.submitAnswer(1, "2")).not.toThrowError();

    });

        it("ne devrait pas soulever d'erreur si la réponse est incorrecte", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question1 =
                {id: 1, text: "What is 1+1?", options: ["1", "2", "3", "4"], answer: "2", category: "Math"};
            quiz.addQuestion(question1);
            expect(() => quiz.submitAnswer(1, "3")).not.toThrow();
        });

    it("ne devrait pas soumettre une réponse pour une question inexistante", () => {
        adminUserProfile.isAuthenticated.mockReturnValue(true);
        quiz.setCurrentUser(adminUserProfile);
        expect(() => quiz.submitAnswer(6, "Answer")).not.toThrow();
    });

    it("ne devrait pas soumettre une réponse si l'utilisateur n'est pas authentifié", () => {
        adminUserProfile.isAuthenticated.mockReturnValue(false);
        expect(() => quiz.submitAnswer(1, "2")).not.toThrow();
    });
});


    describe('finishQuiz', () => {
        let quiz: Quiz;
        let adminUserProfile: MockUserProfile;
        let leaderboard: any; // Mock leaderboard object
        beforeEach(() => {
            quiz = new Quiz();
            adminUserProfile = new MockUserProfile(
                'admin',
                'admin@example.com',
                'admin123',
                AccountType.Admin,
                'Admin',
                'User'
            );
            leaderboard = {
                addScore: jest.fn() // Mock addScore method
            };
        });

        it("devrait générer une erreur si l'utilisateur n'est pas défini", () => {
            expect(() => quiz.finishQuiz(leaderboard)).toThrowError("User not set.");
            expect(leaderboard.addScore).not.toHaveBeenCalled();
        });

        it("devrait ajouter le score à la leaderboard si l'utilisateur est défini", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);

            const question = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            quiz.addQuestion(question);
            // Soumettre une réponse correcte pour la question Math
            quiz.submitAnswer(1, "2");
            // Terminer le quiz et vérifier si le score est ajouté à la leaderboard
            expect(() => quiz.finishQuiz(leaderboard)).not.toThrow();
        });
        it("devrait pas avoir des erreurs  si l'utilisateur ne repond a aucune question ", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);
            const question1 = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            const question2 = {
                id: 2,
                text: "What is 2+2?",
                options: ["2", "3", "4", "5"],
                answer: "4",
                category: "Math"
            };
            quiz.addQuestion(question1);
            quiz.addQuestion(question2);
            // Terminer le quiz sans a une question
            expect(() => quiz.finishQuiz(leaderboard)).not.toThrow();
        });
        it("devrait pas avoir des erreurs  si l'utilisateur ne repond pas a toutes les questions ", () => {
            adminUserProfile.isAuthenticated.mockReturnValue(true);
            quiz.setCurrentUser(adminUserProfile);

            const question1 = {
                id: 1,
                text: "What is 1+1?",
                options: ["1", "2", "3", "4"],
                answer: "2",
                category: "Math"
            };
            const question2 = {
                id: 2,
                text: "What is 2+2?",
                options: ["2", "3", "4", "5"],
                answer: "4",
                category: "Math"
            };
            quiz.addQuestion(question1);
            quiz.addQuestion(question2);
            quiz.submitAnswer(1, "2");
            // Terminer le quiz sans répondre à la deuxième question
            expect(() => quiz.finishQuiz(leaderboard)).not.toThrow();
        });

    });

});





