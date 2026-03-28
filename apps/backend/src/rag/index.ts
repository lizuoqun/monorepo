import ollama from 'ollama';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-1abf771f3db842fca42e21851fd27aa5'
});

async function deepSeekChat(question: string) {
  const completion = await client.chat.completions.create({
    messages: [{ role: 'system', content: question }],
    model: 'deepseek-chat'
  });

  return completion?.choices?.[0]?.message?.content || '';
}

const __dirname = dirname(fileURLToPath(import.meta.url));
// 分割
const split = async () => {
  const readmePath = join(__dirname, 'readme.md');
  const content = readFileSync(readmePath, 'utf-8');
  const prompt = `你是一个专业的文档处理专家。请将以下文本分割成有意义的块，方便我后续将其保存为向量数据，每个块应该是一个完整的语义单元。
  文档类型：纯文本
  分割要求：
    1. 每一行【每一句话】的文档都需要处理成一项，去除掉无特殊含义的一级标题
    2. 保持逻辑连贯性
    3. 避免在句子中间分割
    4. 保证整个文档的内容都可以在分割后的数组中找到
    5. 每一级标题下的内容都需要处理，一级标题和二级标题整合到一起，有一些一级标题没有含义不要放在数组当中去
   文档内容：
   ---
   ${content}
   ---
   
   输出格式示例：["xxx", "xxxx", "xxxx"，......]`;

  return await deepSeekChat(prompt);
  // const response = await ollama.chat({
  //   model: 'modelscope.cn/Qwen/Qwen3-0.6B-GGUF',
  //   messages: [{
  //     role: 'system',
  //     content: prompt
  //   }]
  // });
  //
  // const result = response.message.content;
  // const jsonMatch = result.match(/\[[\s\S]*\]/);
  // const chunks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  //
  // return chunks;
};

// 向量化
const embeddings = async (text: string) => {
  const response = await ollama.embed({
    model: 'nomic-embed-text',
    input: text
  });
  return response.embeddings;
};

const test = async () => {
  const response = await split();
  const chunks = JSON.parse(response);
  const vectors = await Promise.all(chunks.map(embeddings));
  const result = chunks.map((chunk: string, index: number) => ({
    text: chunk,
    vector: vectors[index]
  }));
  const outputPath = join(__dirname, 'rag-data.json');
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log('已保存到:', outputPath);
};

test();
