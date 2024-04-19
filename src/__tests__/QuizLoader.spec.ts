

import axios from 'axios';
import QuizLoader from '../QuizLoader';


jest.mock('axios');

describe('QuizLoader', () => {
    const mockQuestions = [
        { id: 1, text: 'What is the capital of France?', category: 'Geography', answer: 'Paris' },
        { id: 2, text: 'Who is the author of Hamlet?', category: 'Literature', answer: 'Shakespeare' }
    ];

    beforeEach(() => {

        jest.clearAllMocks();
    });

    it('devrait charger les questions avec succès à partir de lURL par défaut', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: mockQuestions });
        const quizLoader = new QuizLoader();
        const questions = await quizLoader.loadQuestions();
        expect(questions).toEqual(mockQuestions);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('https://danny-public.s3.amazonaws.com/quiz_questions.json');
    });

    it('devrait générer une erreur lorsque le chargement des questions échoue', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(new Error('Failed to fetch'));
        const quizLoader = new QuizLoader();
        await expect(quizLoader.loadQuestions()).rejects.toThrowError('Failed to load questions from the URL.');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('devrait charger les questions avec succès à partir dune URL personnalisée', async () => {
        const customUrl = 'https://example.com/questions.json';
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: mockQuestions });
        const quizLoader = new QuizLoader(customUrl);
        const questions = await quizLoader.loadQuestions();
        expect(questions).toEqual(mockQuestions);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(customUrl);
    });
});
