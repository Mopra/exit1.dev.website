// Web Worker for markdown processing
const ctx: Worker = self as any;

ctx.addEventListener('message', async (event) => {
  const { type, data } = event.data;
  
  try {
    switch (type) {
      case 'process-markdown':
        // Import remark modules dynamically in worker
        const { remark } = await import('remark');
        const { default: remarkHtml } = await import('remark-html');
        const { default: remarkGfm } = await import('remark-gfm');
        
        const result = await remark()
          .use(remarkGfm)
          .use(remarkHtml)
          .process(data.content);
        
        ctx.postMessage({
          type: 'markdown-processed',
          data: { content: String(result), id: data.id }
        });
        break;
        
      case 'process-multiple':
        const { remark: remarkMulti } = await import('remark');
        const { default: remarkHtmlMulti } = await import('remark-html');
        const { default: remarkGfmMulti } = await import('remark-gfm');
        
        const processed = await Promise.all(
          data.files.map(async (file: any) => {
            const result = await remarkMulti()
              .use(remarkGfmMulti)
              .use(remarkHtmlMulti)
              .process(file.content);
            return {
              ...file,
              processedContent: String(result)
            };
          })
        );
        
        ctx.postMessage({
          type: 'multiple-processed',
          data: { files: processed }
        });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}); 