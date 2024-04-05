import Leaderboard from "../Leaderboard"; // Importez votre classe Leaderboard depuis votre fichier source

describe('Leaderboard', () => {
    let leaderboard: Leaderboard;

    beforeEach(() => {
        leaderboard = new Leaderboard();
    });

    describe('getUserScores', () => {
        it('should return leaderboard scores for a specific user', () => {
            leaderboard.addScore('category1', 'user1', 100);
            leaderboard.addScore('category2', 'user1', 90);
            expect(leaderboard.getUserScores('user1')).toEqual([
                { username: 'user1', score: 100, category: 'category1' },
                { username: 'user1', score: 90, category: 'category2' }
            ]);
        });

        it('should return an empty array if user has no scores', () => {
            expect(leaderboard.getUserScores('nonexistent_user')).toEqual([]);
        });
    });


    /*describe('addScore', () => {
        it('should return an empty array for new categories', () => {
            expect(leaderboard).toEqual([]);
        });
        it('should add a new score for a user in a category if no previous score exists',()=>{
            leaderboard.addScore('categoryA','userA',60)
            expect(leaderboard).toEqual([{ category: 'categoryA', username:'userA', score: 60 }]);
        });
    })
/*it('should find the user score if it exists in the category')
        leaderboard.addScore('CategoryA', 'Alice', 90);
        leaderboard.addScore('CategoryA', 'bob', 80));

    });*/
});