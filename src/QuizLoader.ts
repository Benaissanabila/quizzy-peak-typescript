import axios from 'axios';

const DEFAULT_URL = 'https://danny-public.s3.amazonaws.com/quiz_questions.json';

export default class QuizLoader {
    private url: string;

    constructor(url: string = DEFAULT_URL) {
        this.url = url;
    }

    /**
     * Load questions from the specified URL.
     * @returns {Promise<Question[]>} - A promise that resolves to an array of Question objects.
     * If the request fails, an error is thrown.
     */
    async loadQuestions(): Promise<Question[]> {
        try {
            const response = await axios.get<Question[]>(this.url);
            return response.data;
        } catch (error) {
            console.error('Error loading questions:', error);
            throw new Error('Failed to load questions from the URL.');
        }
    }
}
