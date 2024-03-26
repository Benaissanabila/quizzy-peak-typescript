/**
 * L'objet Map contient des paires clé-valeur et se souvient de l'ordre d'insertion original des clés.
 * Toute valeur (objets et valeurs primitives) peut être utilisée comme clé ou comme valeur.
 */
export default class Leaderboard {
    /**
     * Ici, nous définissons une propriété privée appelée `scores`. Cette propriété est une Map.
     * Dans une Map, vous pouvez définir des paires clé-valeur. Pour cette propriété `scores`, la clé est une chaîne de caractères (qui est la catégorie du score)
     * et la valeur est un tableau d'objets de type LeaderboardEntry.
     * Par conséquent, pour chaque catégorie, nous pouvons garder un tableau d'entrées de classement, où chaque entrée contient le nom d'utilisateur et le score.
     */
    private scores: Map<string, LeaderboardEntry[]> = new Map();

    /**
     * Adds a score for a given category and username.
     *
     * @param {string} category - The category of the score.
     * @param {string} username - The username for which the score is added.
     * @param {number} score - The score to be added.
     * @returns {void}
     */
    addScore(category: string, username: string, score: number): void {
        // Ici, nous utilisons la méthode `has` de l'objet Map pour vérifier s'il existe une entrée pour cette catégorie.
        if (!this.scores.has(category)) {
            // Sinon, nous l'initialisons avec un tableau vide en utilisant la méthode `set`.
            this.scores.set(category, []);
        }
        // Nous utilisons la méthode `get` de l'objet Map pour obtenir le tableau de scores pour cette catégorie.
        const categoryScores = this.scores.get(category);

        // Nous vérifions si l'utilisateur a déjà un score dans cette catégorie.
        const userScore = categoryScores?.find(entry => entry.username === username);
        if (!userScore || userScore.score < score) {
            if (userScore) {
                // Si c'est le cas, nous mettons à jour le score si le nouveau est plus élevé.
                userScore.score = score;
            } else {
                // Sinon, nous ajoutons le nom d'utilisateur et le nouveau score comme un objet au tableau.
                categoryScores?.push({
                    username: username,
                    score: score
                });
            }
        }
    }

    /**
     * Retrieves the top scores for a given category.
     *
     * @param {string} category - The category for which to retrieve the top scores.
     * @param {number} numberOfEntries - The number of top scores to retrieve.
     * @returns {LeaderboardEntry[]} - An array of LeaderboardEntry objects representing the top scores.
     */
    getTopScoresForCategory(category: string, numberOfEntries: number): LeaderboardEntry[] {
        return (this.scores.get(category) || []).slice(0, numberOfEntries);
    }

    /**
     * Retrieves the leaderboard scores for a specific user.
     *
     * @param {string} username - The username of the user.
     * @return {LeaderboardEntry[]} - An array of leaderboard entries for the user, sorted in descending order by score.
     */
    getUserScores(username: string): LeaderboardEntry[] {
        let userScores: LeaderboardEntry[] = [];

        // La méthode `forEach` de l'objet Map nous permet d'itérer sur toutes les entrées de la Map.
        this.scores.forEach((entries, category) => {
            const userEntry = entries.find((entry: LeaderboardEntry) => entry.username === username);
            if (userEntry) {
                userScores.push({...userEntry, category});
            }
        });

        // Trier les scores de l'utilisateur par score dans un ordre décroissant
        userScores.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

        return userScores;
    }

    /**
     * Returns a string representation of a leaderboard entry.
     *
     * @param {LeaderboardEntry} entry - The leaderboard entry.
     * @return {string} - A string representing the leaderboard entry.
     */
    getEntryString(entry: LeaderboardEntry): string {
        // The category will be included in the string if it's part of the entry
        const categoryString = entry.category ? ` in category '${entry.category}'` : '';
        return `${entry.username} has a score of ${entry.score}${categoryString}.`;
    }
}