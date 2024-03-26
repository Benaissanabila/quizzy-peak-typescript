import Leaderboard from "./Leaderboard";
import UserProfile, {AccountType} from "./UserProfile";

export default class Quiz {
    private questions: Question[] = [];
    private currentUser?: UserProfile;
    private currentScore: number = 0;
    private questionLimitPerCategory: number;

    /**
     * Constructor for the Quiz class.
     *
     * @param {number} questionLimitPerCategory - The maximum number of questions allowed per category.
     */
    constructor(questionLimitPerCategory: number = 10) {
        this.questionLimitPerCategory = questionLimitPerCategory;
    }

    /**
     * Sets the current user profile for the quiz.
     *
     * @param {UserProfile} userProfile - The user profile to set as the current user.
     * @return {void}
     */
    setCurrentUser(userProfile: UserProfile): void {
        if (userProfile.isAuthenticated()) {
            this.currentUser = userProfile;
        } else {
            throw new Error('User must be authenticated to start a quiz.');
        }
    }

    /**
     * Adds a new question to the list of questions.
     *
     * @param {Question} question - The question to be added.
     *
     * @return {void}
     */
    addQuestion(question: Question): void {
        if (!this.currentUser || this.currentUser.accountType !== AccountType.Admin) {
            throw new Error('Only admin users can add questions.');
        }

        const questionsInCategory = this.questions.filter(q => q.category === question.category).length;
        if (questionsInCategory < this.questionLimitPerCategory) {
            this.questions.push(question);
        } else {
            console.warn(`Question limit reached for category '${question.category}'.`);
        }
    }

    /**
     * Edits fields of a question based on the provided question ID.
     *
     * @param questionId - The ID of the question to be edited.
     * @param updates - An object containing the fields to update and their new values.
     * @returns void
     */
    editQuestion(questionId: number, updates: Partial<Question>): void {
        if (!this.currentUser || this.currentUser.accountType !== AccountType.Admin) {
            throw new Error('Only admin users can add questions.');
        }

        const questionIndex = this.questions.findIndex((question: Question) => question.id === questionId);

        if (questionIndex !== -1) {
            this.questions[questionIndex] = {...this.questions[questionIndex], ...updates};
        }
    }

    /**
     * Removes a question from the list of questions.
     *
     * @param {number} questionId - The ID of the question to be removed.
     *
     * @return {void}
     */
    removeQuestion(questionId: number): void {
        if (!this.currentUser || this.currentUser.accountType !== AccountType.Admin) {
            throw new Error('Only admin users can add questions.');
        }
        this.questions = this.questions.filter(q => q.id !== questionId);
    }

    /**
     * Searches questions based on a keyword.
     *
     * @param {string} keyword - The keyword to search for within question text or category.
     * @return {Question[]} - An array of Question objects matching the keyword search.
     */
    searchQuestions(keyword: string): Question[] {
        return this.questions.filter(q => q.text.includes(keyword) || q.category.includes(keyword));
    }

    /**
     * Starts the quiz with the given options.
     *
     * @param {Object} options - The options for starting the quiz.
     * @param {number} options.numberQuestions - The number of questions to include in the quiz.
     * @param {string} options.category - The category of questions to include in the quiz.
     * @param {string} options.username - The username of the current user.
     *
     * @throws {Error} If the current user is invalid or does not match the provided username.
     *
     * @returns {Question[]} An array of filtered questions for the quiz.
     */
    startQuiz(options: { numberQuestions: number; category: string; username: string }): Question[] {
        if (!this.currentUser || !this.currentUser.isAuthenticated()) {
            throw new Error('Invalid or unauthenticated user.');
        }

        const filteredQuestions = this.questions.filter(q => q.category === options.category).slice(0, options.numberQuestions);
        this.currentScore = 0; // Reset score for a new quiz
        return filteredQuestions;
    }

    /**
     * Submits an answer for a given question.
     *
     * @param {number} questionId - The ID of the question to answer.
     * @param {string} answer - The answer to the question.
     * @returns {void}
     */
    // Assume this is called for each question answered
    submitAnswer(questionId: number, answer: string): void {
        const question = this.questions.find(q => q.id === questionId);
        if (question && question.answer === answer) {
            this.currentScore++;
        }
    }

    /**
     * Finish the quiz and add the current user's score to the leaderboard
     *
     * @param {Leaderboard} leaderboard - The leaderboard object to add the score to
     *
     * @throws {Error} - Throws an error if the current user is not set
     *
     * @returns {void}
     */
    // Call this at the end of the quiz
    finishQuiz(leaderboard: Leaderboard): void {
        if (!this.currentUser) {
            throw new Error("User not set.");
        }
        leaderboard.addScore(this.questions[0].category, this.currentUser.username, this.currentScore);
    }

    /**
     * Validates the username based on predefined rules.
     *
     * @param {string} username - The username to validate.
     *
     * @return {boolean} - Returns true if the username is valid, otherwise false.
     */
    private validateUsername(username: string): boolean {
        const isValidLength = username.length >= 3 && username.length <= 20;
        const isValidCharacters = /^[a-zA-Z0-9_]+$/.test(username);

        return isValidLength && isValidCharacters;
    }
}
