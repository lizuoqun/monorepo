console.log('hello backend');
import { HumanMessage } from '@langchain/core/messages';
import { ChatOllama } from '@langchain/ollama';
import http from 'node:http';

const llm = new ChatOllama({
  model: 'modelscope.cn/Qwen/Qwen3-0.6B-GGUF'
});

const app = http.createServer(async (req, res) => {
  const result = await llm.invoke([
    ['system', '你是一个专业的翻译，可以把中文转换成英文'],
    new HumanMessage({
      content: '你好，世界！我带你们打，'
    })
  ]);
  res.setHeader('Content-Type', 'text/plain;chartset=utf-8');
  res.end(result.content);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
