interface Question {
    id: number;
    text: string;
    options: string[];
    answer: string;
    category: string;
}

interface QuestionUpdate {
    text?: string;
    options?: string[];
    answer?: string;
    category?: string;
}

interface User {
    username: string;
}

interface LeaderboardEntry {
    username: string;
    score: number;
    category?: string;
}
//const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(); expect(consoleWarnSpy).not.toHaveBeenCalled();