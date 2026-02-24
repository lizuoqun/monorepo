import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';

const embeddings = new OllamaEmbeddings({
  model: 'modelscope.cn/LLM-Research/mxbai-embed-large-v1-gguf',
  baseUrl: 'http://127.0.0.1:11434'
});

const text1 = '我叫张三，今年18岁，来自广东';

const text2 = '我叫李四，今年19岁，来自广西';

const run = async () => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    [
      {
        pageContent: text1,
        metadata: {
          source: '张三'
        }
      },
      {
        pageContent: text2,
        metadata: {
          source: '李四'
        }
      }
    ],
    embeddings
  );
  const vector = await embeddings.embedQuery('王五今年几岁？');
  const result = await vectorStore.similaritySearchVectorWithScore(vector, 1);
  console.log(result);
};

run();
