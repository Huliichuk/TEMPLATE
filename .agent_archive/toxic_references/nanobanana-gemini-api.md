---
name: nanobanana-gemini-api
description: NanoBanana image generation prompting (score 10) and Gemini API integration patterns. Covers Python uv scripts and TypeScript SDK for image generation, text generation, and multimodal AI.
source: |
  https://github.com/nikiforovall/claude-code-rules (NanoBanana, score 10)
  https://github.com/jezweb/claude-skills (image-gen, score 9.7)
  https://github.com/google-gemini/gemini-skills (official Google, score 8.0)
---

# NanoBanana & Gemini API — Reference

## Current Gemini Models

| Model | Tokens | Use Case |
|---|---|---|
| `gemini-3-pro-preview` | 1M | Complex reasoning, coding, research |
| `gemini-3-flash-preview` | 1M | Fast, balanced, multimodal |
| `gemini-3-pro-image-preview` | 65k/32k | Image generation and editing |

> **Legacy models** (`gemini-2.5-*`, `gemini-2.0-*`, `gemini-1.5-*`) are **deprecated**. Migrate to newer models.

## NanoBanana — Image Generation (Python)

### Quick Generate

```bash
uv run - <<'EOF'
# /// script
# dependencies = ["google-genai", "pillow"]
# ///
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=["A cute banana character with sunglasses"],
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE']
    )
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        image.save("tmp/generated.png")
        print("Image saved to tmp/generated.png")
EOF
```

### Prompting Workflow

1. Understand what image the user needs
2. Define style, composition, lighting, mood
3. Craft detailed prompt with specific visual descriptors
4. Review prompt with user
5. Generate image using `nano-banana` skill
6. Iterate if needed

## Gemini Image Generation (TypeScript SDK)

### Setup

```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

### Generate Image

```typescript
// ⚠️ CRITICAL: responseModalities MUST include BOTH "TEXT" and "IMAGE"
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: "A professional photo of a modern office space",
  config: {
    responseModalities: ["TEXT", "IMAGE"],  // BOTH required!
    imageGenerationConfig: {
      aspectRatio: "16:9",
    },
  },
});

// Extract image
for (const part of response.candidates[0].content.parts) {
  if (part.inlineData) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync("output.png", buffer);
  }
}
```

### Advanced: Model Selection by Quality

```typescript
async function generateImage(prompt: string, options: {
  aspectRatio?: string;
  imageSize?: "1K" | "2K" | "4K";
} = {}) {
  const { aspectRatio = "16:9", imageSize } = options;

  const config: any = {
    responseModalities: ["TEXT", "IMAGE"],
    imageGenerationConfig: { aspectRatio },
  };

  // imageSize only works with Pro model
  if (imageSize) {
    config.imageGenerationConfig.imageSize = imageSize;
  }

  const response = await ai.models.generateContent({
    model: imageSize
      ? "gemini-3-pro-image-generation"   // Pro: supports 2K/4K
      : "gemini-3-flash-image-generation", // Flash: faster
    contents: prompt,
    config,
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }
}
```

## Gemini Text Generation

### TypeScript

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Explain quantum computing"
});
console.log(response.text);
```

### Python

```python
from google import genai

client = genai.Client()  # Uses GOOGLE_API_KEY env var
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain quantum computing"
)
print(response.text)
```

## API Reference

```
POST /models/:modelName:generateContent

Request:
{
  "contents": [{"parts": [{"text": "prompt"}]}],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageGenerationConfig": {
      "aspectRatio": "16:9",
      "imageSize": "2K"  // Pro only
    }
  }
}

Response:
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": {
          "data": "BASE64_ENCODED_IMAGE_DATA",
          "mimeType": "image/png"
        }
      }]
    }
  }]
}
```

## Rules

- **Always** include `["TEXT", "IMAGE"]` in `responseModalities`
- **Use** `gemini-3-flash-*` for speed, `gemini-3-pro-*` for quality/2K/4K
- **Never** use deprecated `gemini-2.5-*` or `gemini-2.0-*` models
- **Set** `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `.env`
- **Python**: Use `uv run` with inline dependencies for quick scripts
