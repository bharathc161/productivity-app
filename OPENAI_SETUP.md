# OpenAI Integration Setup

## Steps to Enable AI Coach

1. Get an OpenAI API key:
   - Visit https://platform.openai.com/api-keys
   - Create a new API key

2. Create a `.env.local` file in the project root with:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

3. The Accountability Coach will automatically use OpenAI's GPT to provide productivity coaching insights.

## API Configuration
- Model: gpt-3.5-turbo (cost-effective for productivity coaching)
- Temperature: 0.7 (balanced creativity and consistency)
- Max tokens: 150 (brief, actionable responses)

## Note
- Keep your API key secure and never commit it to version control
- Monitor API usage and costs at platform.openai.com/account/api-keys

## Alternative Models (if needed)
- gpt-4: More advanced, higher cost
- gpt-4-turbo: Better for complex tasks
