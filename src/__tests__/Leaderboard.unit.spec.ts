import Leaderboard from "../Leaderboard";



describe('Leaderboard', () => {
    let leaderboard: Leaderboard;

    beforeEach(() => {
        leaderboard = new Leaderboard();
    });
describe('addScore',()=>{
    it('devrait ajouter un score pour une catégorie et un utilisateur donnés', () => {
        leaderboard.addScore('Math', 'jean', 100);
        const topScores = leaderboard.getTopScoresForCategory('Math', 1);
        expect(topScores.length).toBe(1);
        expect(topScores[0].username).toBe('jean');
        expect(topScores[0].score).toBe(100);
    });

    it('devrait mettre à jour un score si un score plus élevé est ajouté pour le même utilisateur dans la même catégorie', () => {
        leaderboard.addScore('category2', 'marie', 50);
        leaderboard.addScore('category2', 'marie', 70);
        const topScores = leaderboard.getTopScoresForCategory('category2', 1);
        expect(topScores.length).toBe(1);
        expect(topScores[0].username).toBe('marie');
        expect(topScores[0].score).toBe(70);
    });

})
    describe('getUserScores', () => {
       it('devrait retourner les scores de l\'utilisateur spécifié', () => {
                leaderboard = new Leaderboard();
                leaderboard.addScore('Math', 'user1', 100);
                leaderboard.addScore('Math', 'user2', 150);
                leaderboard.addScore('Science', 'user1', 200);
                leaderboard.addScore('Science', 'user3', 120);
                const userScores = leaderboard.getUserScores('user1');
                // On s'attend à ce que les scores de user1 pour les catégories Math et Science soient renvoyés
                expect(userScores.length).toEqual(2);
                expect(userScores).toContainEqual({ username: 'user1', score: 100, category: 'Math' });
           expect(userScores[0].category).toBe(  'Science');
                expect(userScores).toContainEqual({ username: 'user1', score: 200, category: 'Science' });
            });
        it('devrait récupérer les scores du classement pour un utilisateur spécifique', () => {
            leaderboard.addScore('category4', 'user6', 300);
            leaderboard.addScore('category5', 'user6', 250);
            leaderboard.addScore('category6', 'user6', 220);
            const userScores = leaderboard.getUserScores('user6');
            expect(userScores.length).toBe(3);
            expect(userScores[0].category).toBe('category4');
            expect(userScores[0].score).toBe(300);
        });

        });
    describe('getTopScoresForCategory', () => {
        it('devrait récupérer les meilleurs scores pour une catégorie', () => {
            leaderboard.addScore('category3', 'user3', 200);
            leaderboard.addScore('category3', 'user4', 150);
            leaderboard.addScore('category3', 'user5', 120);
            const topScores = leaderboard.getTopScoresForCategory('category3', 2);
            expect(topScores.length).toBe(2);
            expect(topScores[0].username).toBe('user3');
            expect(topScores[0].score).toBe(200);
            expect(topScores[1].username).toBe('user4');
            expect(topScores[1].score).toBe(150);
        });
    });


    it('devrait renvoyer une représentation sous forme de chaîne correcte d\'une entrée du classement', () => {
        const entry = { username: 'user7', score: 400, category: 'category7' };
        const entryString = leaderboard.getEntryString(entry);
        expect(entryString).toBe("user7 has a score of 400 in category 'category7'.");
    });
});





