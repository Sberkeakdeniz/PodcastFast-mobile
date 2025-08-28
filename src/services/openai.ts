import OpenAI from 'openai';
import Constants from 'expo-constants';

export interface PodcastContent {
    popularTopics: string[];
    relatedTopics: string[];
    contentAnalysis: {
        introduction?: string;
        mainPoints: string[];
        conclusion?: string;
    };
    podcastingTips: string[];
}

class OpenAIService {
    private openai: OpenAI | null = null;
    private systemMessage: string;

    constructor() {
        this.systemMessage = `You are a podcast content advisor. You must respond ONLY with a JSON object in exactly this format, no additional text or explanation:
{
    "popularTopics": [
        // 5-7 popular topics in the given subject
    ],
    "relatedTopics": [
        // 5-7 related impressive topic ideas
    ],
    "contentAnalysis": {
        "introduction": "2-3 sentences introducing the topic",
        "mainPoints": [
            // 4-6 main discussion points
        ],
        "conclusion": "1-2 sentences concluding the topic"
    },
    "podcastingTips": [
        // 4-6 specific tips for beginner podcasters that are relevant to the given subject
        // 1-2 tips for advertising, how to make the podcast more engaging
    ]
}
        
Ensure the response is valid JSON and includes all required fields. Do not include any markdown formatting or additional text outside the JSON structure.`;
    }

    async generateContent(prompt: string): Promise<PodcastContent> {
        try {
            // Lazy initialize OpenAI client and read API key with fallback
            if (!this.openai) {
                const apiKey = Constants.expoConfig?.extra?.openaiApiKey ?? (process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined);
                if (!apiKey) {
                    throw new Error('OpenAI API key is not configured');
                }
                this.openai = new OpenAI({ apiKey });
            }
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: this.systemMessage },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 0.9,
                frequency_penalty: 0.2,
                presence_penalty: 0.2
            });

            const content = completion.choices[0]?.message?.content || '{}';
            try {
                return JSON.parse(content) as PodcastContent;
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                throw new Error('Invalid response format from OpenAI');
            }
        } catch (error) {
            console.error('Error generating content:', error);
            throw new Error('Failed to generate content from OpenAI');
        }
    }
}

// Create a singleton instance
const openAIService = new OpenAIService();
export default openAIService; 