---
name: rag-implementation
description: RAG patterns with LangGraph, LangChain, and vector stores. Includes basic RAG, HyDE retrieval, and document processing. Score 9.5.
source: https://github.com/wshobson/agents (score 9.5)
---

# RAG Implementation — Reference

## Basic RAG Pipeline (LangGraph)

```python
from langgraph.graph import StateGraph, START, END
from langchain_anthropic import ChatAnthropic
from langchain_voyageai import VoyageAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict

class RAGState(TypedDict):
    question: str
    context: list[Document]
    answer: str

# Components
llm = ChatAnthropic(model="claude-sonnet-4-5")
embeddings = VoyageAIEmbeddings(model="voyage-3-large")
vectorstore = PineconeVectorStore(index_name="docs", embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

rag_prompt = ChatPromptTemplate.from_template(
    """Answer based on the context below. If you cannot answer, say so.
    Context: {context}
    Question: {question}
    Answer:"""
)

async def retrieve(state: RAGState) -> RAGState:
    docs = await retriever.ainvoke(state["question"])
    return {"context": docs}

async def generate(state: RAGState) -> RAGState:
    context_text = "\n\n".join(doc.page_content for doc in state["context"])
    messages = rag_prompt.format_messages(context=context_text, question=state["question"])
    response = await llm.ainvoke(messages)
    return {"answer": response.content}

# Build graph
builder = StateGraph(RAGState)
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.add_edge(START, "retrieve")
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", END)

rag_chain = builder.compile()
```

## HyDE (Hypothetical Document Embeddings)

Better retrieval by generating a hypothetical answer first, then using it for semantic search.

```python
class HyDEState(TypedDict):
    question: str
    hypothetical_doc: str
    context: list[Document]
    answer: str

hyde_prompt = ChatPromptTemplate.from_template(
    """Write a detailed passage that would answer this question:
    Question: {question}
    Passage:"""
)

async def generate_hypothetical(state: HyDEState) -> HyDEState:
    messages = hyde_prompt.format_messages(question=state["question"])
    response = await llm.ainvoke(messages)
    return {"hypothetical_doc": response.content}

async def retrieve_with_hyde(state: HyDEState) -> HyDEState:
    docs = await retriever.ainvoke(state["hypothetical_doc"])
    return {"context": docs}

# Graph: question → hypothetical → retrieve → generate → answer
builder = StateGraph(HyDEState)
builder.add_node("hypothetical", generate_hypothetical)
builder.add_node("retrieve", retrieve_with_hyde)
builder.add_node("generate", generate)
builder.add_edge(START, "hypothetical")
builder.add_edge("hypothetical", "retrieve")
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", END)
```

## Document Processing

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

embeddings = OpenAIEmbeddings()

def create_vectorstore(documents: list[str]) -> Chroma:
    chunks = text_splitter.create_documents(documents)
    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./chroma_db"
    )
```

## Rules

- Always set `chunk_overlap` (10–20% of `chunk_size`) to preserve context
- Use `search_kwargs={"k": 4}` as a starting point for retrieval count
- Consider **HyDE** for complex questions where direct keyword match fails
- Never make up information — instruct LLM to say "I don't know"
- Use `voyage-3-large` for best embedding quality, OpenAI for cost efficiency
