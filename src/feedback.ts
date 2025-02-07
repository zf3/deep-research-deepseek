import { generateObject, LanguageModelV1 } from 'ai';
import { z } from 'zod';

// import { o3MiniModel } from './ai/providers';
import { model } from './ai/providers';
import { systemPrompt } from './prompt';

export async function generateFeedback({
  query,
  numQuestions = 3,
}: {
  query: string;
  numQuestions?: number;
}) {
  const userFeedback = await generateObject({
    model: model,
    output: 'no-schema',
    system: systemPrompt(),
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>
    Example JSON output:
    {
      "questions": [
        "A follow-up question",
      ]
    }
    `,
  });
  var obj = userFeedback.object as { questions: string[] };
  
  console.log("Feedback questions: ", obj.questions);

  return obj.questions.slice(0, numQuestions);
}
