import { buildAnalysisPrompt, buildChatPrompt, buildMindfulnessPrompt } from '@/lib/prompts';

describe('AI companion prompt engineering tests', () => {
  test('buildAnalysisPrompt includes correct examType and requirements', () => {
    const prompt = buildAnalysisPrompt('NEET');
    expect(prompt).toContain('NEET');
    expect(prompt).toContain('valid JSON');
    expect(prompt).toContain('triggers');
  });

  test('buildChatPrompt changes based on current mood', () => {
    const lowMoodPrompt = buildChatPrompt('UPSC', 2);
    expect(lowMoodPrompt).toContain('UPSC');
    expect(lowMoodPrompt).toContain('tough time');

    const highMoodPrompt = buildChatPrompt('UPSC', 9);
    expect(highMoodPrompt).toContain('good mood');
  });

  test('buildMindfulnessPrompt includes trigger context', () => {
    const prompt = buildMindfulnessPrompt('CAT', 5, ['syllabus anxiety', 'mock tests']);
    expect(prompt).toContain('CAT');
    expect(prompt).toContain('syllabus anxiety, mock tests');
    expect(prompt).toContain('breathing|meditation|physical');
  });
});
