// AI Service for Text-to-Diagram generation
// Supports Gemini API (free tier) — user provides their own API key

import { MERMAID_SYNTAX } from './aiSyntax';

const SYSTEM_PROMPT = `
${MERMAID_SYNTAX}

# SYSTEM INSTRUCTIONS
1. **ANALYZE** the user's request. Identify the core intent (e.g., "process flow" -> Flowchart, "timeline" -> Timeline, "sales data" -> XYChart).
2. **SELECT** the most appropriate diagram type from the list above.
3. **APPLY** the specific syntax rules for that selected type.
4. **GENERATE** the valid Mermaid code.

# CRITICAL OUTPUT RULES
- Output **ONLY** the raw Mermaid code.
- **NO** markdown fences (e.g., \`\`\`mermaid).
- **NO** introductory text ("Here is your diagram...").
- **NO** explanations.
- If the user asks to modify existing code, return the **FULL** updated code.
`;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface AIServiceConfig {
    apiKey: string;
    provider: 'gemini' | 'openai' | 'groq';
    model?: string;
}

function getConfig(): AIServiceConfig | null {
    const stored = localStorage.getItem('graphi-ai-config');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

function saveConfig(config: AIServiceConfig): void {
    localStorage.setItem('graphi-ai-config', JSON.stringify(config));
}

function clearConfig(): void {
    localStorage.removeItem('graphi-ai-config');
}

async function generateDiagram(
    userMessage: string,
    existingCode: string,
    history: ChatMessage[]
): Promise<string> {
    const config = getConfig();
    if (!config || !config.apiKey) {
        throw new Error('API key not configured. Please set your API key in the AI settings.');
    }

    const contextMessage = existingCode
        ? `Current diagram code:\n${existingCode}\n\nUser request: ${userMessage}`
        : userMessage;

    if (config.provider === 'gemini') {
        return callGemini(config.apiKey, contextMessage, history, config.model);
    } else if (config.provider === 'groq') {
        return callGroq(config.apiKey, contextMessage, history, config.model);
    } else {
        return callOpenAI(config.apiKey, contextMessage, history, config.model);
    }
}

async function callGemini(
    apiKey: string,
    message: string,
    history: ChatMessage[],
    model?: string
): Promise<string> {
    const modelName = model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        {
            role: 'model',
            parts: [{ text: 'Understood. I will generate only valid Mermaid syntax.' }]
        }
    ];

    // Add conversation history
    for (const msg of history.slice(-6)) {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        });
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 4096
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `Gemini API error: ${response.status} - ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`
        );
    }

    const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown code fences if present
    return text.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
}

async function callOpenAI(
    apiKey: string,
    message: string,
    history: ChatMessage[],
    model?: string
): Promise<string> {
    const modelName = model || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    for (const msg of history.slice(-6)) {
        messages.push({
            role: msg.role,
            content: msg.content
        });
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelName,
            messages,
            temperature: 0.3,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `OpenAI API error: ${response.status} - ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`
        );
    }

    const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data?.choices?.[0]?.message?.content || '';
    return text.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
}

async function callGroq(
    apiKey: string,
    message: string,
    history: ChatMessage[],
    model?: string
): Promise<string> {
    const modelName = model || 'llama-3.3-70b-versatile';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    for (const msg of history.slice(-6)) {
        messages.push({
            role: msg.role,
            content: msg.content
        });
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelName,
            messages,
            temperature: 0.3,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `Groq API error: ${response.status} - ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`
        );
    }

    const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data?.choices?.[0]?.message?.content || '';
    return text.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
}

export { clearConfig, generateDiagram, getConfig, saveConfig };
export type { AIServiceConfig, ChatMessage };

