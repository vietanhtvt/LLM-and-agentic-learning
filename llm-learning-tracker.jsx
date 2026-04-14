import React, { useState, useEffect } from 'react';

const CURRICULUM = {
  modules: [
    {
      id: 1,
      title: "NLP Fundamentals",
      icon: "📝",
      duration: "2-3 tuần",
      difficulty: 2,
      color: "#10b981",
      description: "Nền tảng xử lý ngôn ngữ tự nhiên",
      weeks: [
        {
          title: "Tuần 1: Lý thuyết & Khái niệm",
          lessons: [
            { 
              id: "1-1-1", 
              title: "Tổng quan NLP, các bài toán phổ biến", 
              time: "3-4h",
              resources: [
                { type: "video", title: "Stanford CS224N - Intro to NLP", url: "https://www.youtube.com/watch?v=rmVRLeJRkl4" },
                { type: "article", title: "NLP Overview - MonkeyLearn", url: "https://monkeylearn.com/natural-language-processing/" },
                { type: "video", title: "NLP Zero to Hero - TensorFlow", url: "https://www.youtube.com/watch?v=fNxaJsNG3-s" },
                { type: "docs", title: "NLP Guide - Google Developers", url: "https://developers.google.com/machine-learning/guides/text-classification" }
              ]
            },
            { 
              id: "1-1-2", 
              title: "Lịch sử NLP: Rule-based → Statistical → Neural", 
              time: "3-4h",
              resources: [
                { type: "article", title: "History of NLP - Towards Data Science", url: "https://towardsdatascience.com/history-of-natural-language-processing-nlp-a-quick-overview-ee2d92f08a8c" },
                { type: "video", title: "Evolution of NLP - Stanford", url: "https://www.youtube.com/watch?v=OQQ-W_63UgQ" },
                { type: "paper", title: "A Survey of Deep Learning for NLP", url: "https://arxiv.org/abs/1708.02709" },
                { type: "article", title: "From Rule-based to Neural NLP", url: "https://medium.com/nlplanet/history-of-nlp-from-rule-based-to-neural-models-a-quick-survey-e6fc12e05e35" }
              ]
            },
            { 
              id: "1-1-3", 
              title: "Text preprocessing: Tokenization, Stemming, Lemmatization", 
              time: "4-5h",
              resources: [
                { type: "tutorial", title: "Text Preprocessing in Python - Analytics Vidhya", url: "https://www.analyticsvidhya.com/blog/2021/06/text-preprocessing-in-nlp-with-python-codes/" },
                { type: "video", title: "Text Preprocessing - Krish Naik", url: "https://www.youtube.com/watch?v=nxhCyeRR75Q" },
                { type: "docs", title: "spaCy Tokenization Guide", url: "https://spacy.io/usage/linguistic-features#tokenization" },
                { type: "notebook", title: "Text Preprocessing Notebook - Kaggle", url: "https://www.kaggle.com/code/sudalairajkumar/getting-started-with-text-preprocessing" },
                { type: "docs", title: "NLTK Text Processing", url: "https://www.nltk.org/book/ch03.html" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Hands-on Practice",
          lessons: [
            { 
              id: "1-2-1", 
              title: "Word Representations: BoW, TF-IDF, Word2Vec", 
              time: "5-6h",
              resources: [
                { type: "video", title: "Word2Vec - Stanford CS224N", url: "https://www.youtube.com/watch?v=ERibwqs9p38" },
                { type: "article", title: "Understanding TF-IDF", url: "https://towardsdatascience.com/tf-idf-for-document-ranking-from-scratch-in-python-on-real-world-dataset-796d339a4089" },
                { type: "tutorial", title: "Word2Vec Tutorial - Gensim", url: "https://radimrehurek.com/gensim/models/word2vec.html" },
                { type: "video", title: "Word Embeddings - 3Blue1Brown Style", url: "https://www.youtube.com/watch?v=gQddtTdmG_8" },
                { type: "notebook", title: "Word2Vec from Scratch", url: "https://www.kaggle.com/code/pierremegret/gensim-word2vec-tutorial" }
              ]
            },
            { 
              id: "1-2-2", 
              title: "Thực hành với NLTK, spaCy", 
              time: "4-5h",
              resources: [
                { type: "course", title: "spaCy 101 - Official Course", url: "https://course.spacy.io/en" },
                { type: "docs", title: "NLTK Book - Free Online", url: "https://www.nltk.org/book/" },
                { type: "tutorial", title: "Complete spaCy Tutorial", url: "https://realpython.com/natural-language-processing-spacy-python/" },
                { type: "video", title: "NLTK with Python - freeCodeCamp", url: "https://www.youtube.com/watch?v=X2vAabgKiuM" },
                { type: "notebook", title: "spaCy vs NLTK Comparison", url: "https://www.kaggle.com/code/matleonard/intro-to-nlp" }
              ]
            },
            { 
              id: "1-2-3", 
              title: "🎯 Mini Project: Text Classification với sklearn", 
              time: "5-6h",
              resources: [
                { type: "tutorial", title: "Text Classification with Scikit-Learn", url: "https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html" },
                { type: "video", title: "Sentiment Analysis Project", url: "https://www.youtube.com/watch?v=QpzMWQvxXWk" },
                { type: "notebook", title: "IMDB Sentiment Classification", url: "https://www.kaggle.com/code/lakshmi25npathi/sentiment-analysis-of-imdb-movie-reviews" },
                { type: "dataset", title: "Vietnamese Sentiment Dataset (UIT-VSFC)", url: "https://nlp.uit.edu.vn/datasets" },
                { type: "article", title: "Complete Text Classification Guide", url: "https://neptune.ai/blog/text-classification-using-python" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "course", title: "Stanford CS224N (Lectures 1-4)", url: "https://web.stanford.edu/class/cs224n/" },
        { type: "tutorial", title: "spaCy Course", url: "https://course.spacy.io/en" },
        { type: "book", title: "Speech and Language Processing - Jurafsky", url: "https://web.stanford.edu/~jurafsky/slp3/" }
      ],
      checklist: [
        "Hiểu được pipeline NLP cơ bản",
        "Sử dụng thành thạo spaCy/NLTK",
        "Implement được text classification từ đầu",
        "Hiểu Word2Vec và word embeddings"
      ],
      project: {
        title: "Sentiment Analysis trên Vietnamese text",
        details: "Sử dụng dataset UIT-VSFC, Pipeline: Tokenize → TF-IDF → Logistic Regression"
      }
    },
    {
      id: 2,
      title: "Deep Learning in NLP",
      icon: "🧠",
      duration: "3-4 tuần",
      difficulty: 3,
      color: "#6366f1",
      description: "Neural networks cho xử lý ngôn ngữ",
      weeks: [
        {
          title: "Tuần 1: Neural Network Foundations",
          lessons: [
            { 
              id: "2-1-1", 
              title: "Neural Network basics, Backpropagation", 
              time: "4-5h",
              resources: [
                { type: "video", title: "Neural Networks - 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
                { type: "video", title: "Backpropagation Explained", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U" },
                { type: "article", title: "Backpropagation Step by Step", url: "https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/" },
                { type: "course", title: "Deep Learning Specialization - Andrew Ng", url: "https://www.coursera.org/specializations/deep-learning" },
                { type: "interactive", title: "Neural Network Playground", url: "https://playground.tensorflow.org/" }
              ]
            },
            { 
              id: "2-1-2", 
              title: "PyTorch fundamentals: Tensors, Autograd", 
              time: "4-5h",
              resources: [
                { type: "tutorial", title: "PyTorch 60-Minute Blitz", url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
                { type: "video", title: "PyTorch for Deep Learning - freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuA" },
                { type: "docs", title: "PyTorch Autograd Tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html" },
                { type: "course", title: "Learn PyTorch - Daniel Bourke", url: "https://www.learnpytorch.io/" },
                { type: "notebook", title: "PyTorch Basics Notebook", url: "https://www.kaggle.com/code/kanncaa1/pytorch-tutorial-for-deep-learning-lovers" }
              ]
            },
            { 
              id: "2-1-3", 
              title: "Word Embeddings trong PyTorch", 
              time: "5-6h",
              resources: [
                { type: "tutorial", title: "Word Embeddings in PyTorch", url: "https://pytorch.org/tutorials/beginner/nlp/word_embeddings_tutorial.html" },
                { type: "video", title: "Embeddings in Neural Networks", url: "https://www.youtube.com/watch?v=wgfSDrqYMJ4" },
                { type: "article", title: "Understanding Embedding Layers", url: "https://towardsdatascience.com/deep-learning-4-embedding-layers-f9a02d55ac12" },
                { type: "notebook", title: "Word2Vec PyTorch Implementation", url: "https://www.kaggle.com/code/code1110/word2vec-skipgram-pytorch-tutorial" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Sequence Models",
          lessons: [
            { 
              id: "2-2-1", 
              title: "RNN: Kiến trúc, Vanishing gradient", 
              time: "5-6h",
              resources: [
                { type: "video", title: "RNN Explained - StatQuest", url: "https://www.youtube.com/watch?v=AsNTP8Kwu80" },
                { type: "article", title: "Understanding RNNs - Colah's Blog", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/" },
                { type: "video", title: "RNN - Andrej Karpathy", url: "https://www.youtube.com/watch?v=iX5V1WpxxkY" },
                { type: "tutorial", title: "RNN from Scratch", url: "https://pytorch.org/tutorials/intermediate/char_rnn_classification_tutorial.html" },
                { type: "article", title: "Vanishing Gradient Problem", url: "https://towardsdatascience.com/the-vanishing-gradient-problem-69bf08b15484" }
              ]
            },
            { 
              id: "2-2-2", 
              title: "LSTM & GRU: Cơ chế gate", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Understanding LSTM - Colah", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/" },
                { type: "video", title: "LSTM Explained - StatQuest", url: "https://www.youtube.com/watch?v=YCzL96nL7j0" },
                { type: "video", title: "GRU vs LSTM", url: "https://www.youtube.com/watch?v=8HyCNIVRbSU" },
                { type: "tutorial", title: "LSTM in PyTorch", url: "https://pytorch.org/tutorials/beginner/nlp/sequence_models_tutorial.html" },
                { type: "interactive", title: "LSTM Visualizer", url: "https://lstm.online/" }
              ]
            },
            { 
              id: "2-2-3", 
              title: "Bidirectional RNN, Seq2Seq", 
              time: "4-5h",
              resources: [
                { type: "video", title: "Seq2Seq - Stanford CS224N", url: "https://www.youtube.com/watch?v=XXtpJxZBa2c" },
                { type: "article", title: "Seq2Seq Tutorial", url: "https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/" },
                { type: "tutorial", title: "Seq2Seq Translation PyTorch", url: "https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html" },
                { type: "paper", title: "Sequence to Sequence Learning", url: "https://arxiv.org/abs/1409.3215" }
              ]
            }
          ]
        },
        {
          title: "Tuần 3: Hands-on & Project",
          lessons: [
            { 
              id: "2-3-1", 
              title: "Implement LSTM Text Classifier từ đầu", 
              time: "6-8h",
              resources: [
                { type: "tutorial", title: "LSTM Sentiment Analysis", url: "https://pytorch.org/tutorials/beginner/text_sentiment_ngrams_tutorial.html" },
                { type: "notebook", title: "LSTM Text Classification - Kaggle", url: "https://www.kaggle.com/code/srajat27/text-classification-lstm-pytorch" },
                { type: "video", title: "Text Classification with LSTM", url: "https://www.youtube.com/watch?v=WEV61GmmPrk" },
                { type: "github", title: "LSTM Text Classification Repo", url: "https://github.com/bentrevett/pytorch-sentiment-analysis" }
              ]
            },
            { 
              id: "2-3-2", 
              title: "Attention mechanism cơ bản", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Attention Mechanism Visualized", url: "https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/" },
                { type: "video", title: "Attention - Stanford CS224N", url: "https://www.youtube.com/watch?v=rBCqOTEfxvg" },
                { type: "paper", title: "Attention Is All You Need (Original)", url: "https://arxiv.org/abs/1706.03762" },
                { type: "tutorial", title: "Attention from Scratch", url: "https://machinelearningmastery.com/the-attention-mechanism-from-scratch/" }
              ]
            },
            { 
              id: "2-3-3", 
              title: "🎯 Project: NER với BiLSTM-CRF", 
              time: "6-8h",
              resources: [
                { type: "paper", title: "Neural NER with BiLSTM-CRF", url: "https://arxiv.org/abs/1603.01360" },
                { type: "tutorial", title: "BiLSTM-CRF Tutorial", url: "https://pytorch.org/tutorials/beginner/nlp/advanced_tutorial.html" },
                { type: "github", title: "BiLSTM-CRF PyTorch", url: "https://github.com/jidasheng/bi-lstm-crf" },
                { type: "notebook", title: "NER with PyTorch", url: "https://www.kaggle.com/code/nikkisharma536/ner-using-bilstm" },
                { type: "dataset", title: "VLSP NER Dataset", url: "https://vlsp.org.vn/resources" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "course", title: "Fast.ai Practical Deep Learning", url: "https://course.fast.ai/" },
        { type: "tutorial", title: "PyTorch Official Tutorials", url: "https://pytorch.org/tutorials/" },
        { type: "video", title: "Andrej Karpathy - Intro to RNN", url: "https://www.youtube.com/watch?v=iX5V1WpxxkY" }
      ],
      checklist: [
        "Thành thạo PyTorch cơ bản",
        "Implement được RNN/LSTM từ scratch",
        "Hiểu attention mechanism",
        "Train được model NLP end-to-end"
      ],
      project: {
        title: "Vietnamese NER với BiLSTM-CRF",
        details: "Dataset VLSP NER, Entities: PER, LOC, ORG"
      }
    },
    {
      id: 3,
      title: "Transformer & LLMs",
      icon: "⚡",
      duration: "3-4 tuần",
      difficulty: 4,
      color: "#f59e0b",
      description: "Kiến trúc Transformer và Large Language Models",
      weeks: [
        {
          title: "Tuần 1: Transformer Architecture",
          lessons: [
            { 
              id: "3-1-1", 
              title: "Self-Attention mechanism chi tiết", 
              time: "4-5h",
              resources: [
                { type: "article", title: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
                { type: "video", title: "Attention in Transformers - 3Blue1Brown", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
                { type: "video", title: "Self-Attention - Stanford CS224N", url: "https://www.youtube.com/watch?v=ptuGllU5SQQ" },
                { type: "article", title: "Attention? Attention! - Lilian Weng", url: "https://lilianweng.github.io/posts/2018-06-24-attention/" },
                { type: "interactive", title: "Transformer Explainer", url: "https://poloclub.github.io/transformer-explainer/" }
              ]
            },
            { 
              id: "3-1-2", 
              title: "Multi-Head Attention, Positional Encoding", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Positional Encoding Explained", url: "https://kazemnejad.com/blog/transformer_architecture_positional_encoding/" },
                { type: "video", title: "Transformers from Scratch - Andrej Karpathy", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
                { type: "tutorial", title: "Transformers from Scratch - Peter Bloem", url: "https://peterbloem.nl/blog/transformers" },
                { type: "notebook", title: "Build Transformer from Scratch", url: "https://github.com/hyunwoongko/transformer" }
              ]
            },
            { 
              id: "3-1-3", 
              title: "Full Transformer: Encoder-Decoder", 
              time: "5-6h",
              resources: [
                { type: "tutorial", title: "The Annotated Transformer", url: "https://nlp.seas.harvard.edu/2018/04/03/attention.html" },
                { type: "video", title: "Let's build GPT - Andrej Karpathy", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
                { type: "paper", title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
                { type: "github", title: "Transformer PyTorch Implementation", url: "https://github.com/jadore801120/attention-is-all-you-need-pytorch" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Pre-trained Models & Hugging Face",
          lessons: [
            { 
              id: "3-2-1", 
              title: "BERT, GPT family: Kiến trúc & Pre-training", 
              time: "4-5h",
              resources: [
                { type: "article", title: "The Illustrated BERT", url: "https://jalammar.github.io/illustrated-bert/" },
                { type: "article", title: "The Illustrated GPT-2", url: "https://jalammar.github.io/illustrated-gpt2/" },
                { type: "video", title: "BERT Explained", url: "https://www.youtube.com/watch?v=xI0HHN5XKDo" },
                { type: "paper", title: "BERT Paper", url: "https://arxiv.org/abs/1810.04805" },
                { type: "paper", title: "GPT-3 Paper", url: "https://arxiv.org/abs/2005.14165" }
              ]
            },
            { 
              id: "3-2-2", 
              title: "Hugging Face Transformers library", 
              time: "4-5h",
              resources: [
                { type: "course", title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course" },
                { type: "docs", title: "Transformers Documentation", url: "https://huggingface.co/docs/transformers" },
                { type: "video", title: "Hugging Face Crash Course", url: "https://www.youtube.com/watch?v=QEaBAZQCtwE" },
                { type: "tutorial", title: "Getting Started with Transformers", url: "https://huggingface.co/docs/transformers/quicktour" }
              ]
            },
            { 
              id: "3-2-3", 
              title: "Fine-tuning BERT cho Text Classification", 
              time: "5-6h",
              resources: [
                { type: "tutorial", title: "Fine-tuning BERT - HuggingFace", url: "https://huggingface.co/docs/transformers/training" },
                { type: "notebook", title: "BERT Fine-tuning Notebook", url: "https://colab.research.google.com/github/huggingface/notebooks/blob/main/examples/text_classification.ipynb" },
                { type: "video", title: "Fine-tuning Tutorial", url: "https://www.youtube.com/watch?v=5ixFJfgx8K8" },
                { type: "article", title: "Fine-tuning PhoBERT for Vietnamese", url: "https://phobert.github.io/" },
                { type: "github", title: "PhoBERT - Vietnamese BERT", url: "https://github.com/VinAIResearch/PhoBERT" }
              ]
            }
          ]
        },
        {
          title: "Tuần 3: LLMs & Prompting",
          lessons: [
            { 
              id: "3-3-1", 
              title: "LLM overview: GPT-4, Claude, Llama, Gemini", 
              time: "3-4h",
              resources: [
                { type: "article", title: "LLM Landscape Overview", url: "https://www.promptingguide.ai/models" },
                { type: "video", title: "State of GPT - Andrej Karpathy", url: "https://www.youtube.com/watch?v=bZQun8Y4L2A" },
                { type: "article", title: "LLaMA Explained", url: "https://ai.meta.com/llama/" },
                { type: "docs", title: "Claude Model Card", url: "https://docs.anthropic.com/claude/docs/models-overview" },
                { type: "article", title: "Comparing LLMs 2024", url: "https://artificialanalysis.ai/" }
              ]
            },
            { 
              id: "3-3-2", 
              title: "Prompt Engineering: Zero-shot, Few-shot, CoT", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/claude/docs/prompt-engineering" },
                { type: "course", title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/" },
                { type: "article", title: "Chain of Thought Prompting", url: "https://www.promptingguide.ai/techniques/cot" },
                { type: "video", title: "Prompt Engineering - DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
                { type: "article", title: "OpenAI Prompt Engineering Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" }
              ]
            },
            { 
              id: "3-3-3", 
              title: "API integration: OpenAI, Anthropic", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "Anthropic API Docs", url: "https://docs.anthropic.com/claude/reference/getting-started-with-the-api" },
                { type: "docs", title: "OpenAI API Reference", url: "https://platform.openai.com/docs/api-reference" },
                { type: "tutorial", title: "Building with Claude API", url: "https://docs.anthropic.com/claude/docs/quickstart-guide" },
                { type: "video", title: "OpenAI API Tutorial", url: "https://www.youtube.com/watch?v=uRQH2CFvedY" },
                { type: "github", title: "Anthropic Python SDK", url: "https://github.com/anthropics/anthropic-sdk-python" }
              ]
            },
            { 
              id: "3-3-4", 
              title: "Fine-tuning vs RAG: Khi nào dùng gì", 
              time: "3-4h",
              resources: [
                { type: "article", title: "RAG vs Fine-tuning - Anthropic", url: "https://docs.anthropic.com/claude/docs/retrieval-augmented-generation" },
                { type: "video", title: "When to Fine-tune vs RAG", url: "https://www.youtube.com/watch?v=HpKV0GObqMA" },
                { type: "article", title: "Fine-tuning or RAG?", url: "https://towardsdatascience.com/rag-vs-fine-tuning-for-llms-8d1b9ad0c20b" },
                { type: "article", title: "LLM Optimization Guide", url: "https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "paper", title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
        { type: "article", title: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
        { type: "course", title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course" },
        { type: "docs", title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/claude/docs/prompt-engineering" }
      ],
      checklist: [
        "Hiểu sâu Transformer architecture",
        "Sử dụng thành thạo Hugging Face",
        "Fine-tune được pre-trained model",
        "Master Prompt Engineering techniques"
      ],
      project: {
        title: "Multi-task NLP với Hugging Face",
        details: "Fine-tune PhoBERT + So sánh Fine-tuning vs Prompting"
      }
    },
    {
      id: 4,
      title: "RAG",
      icon: "🔍",
      duration: "2-3 tuần",
      difficulty: 3,
      color: "#ec4899",
      description: "Retrieval-Augmented Generation",
      weeks: [
        {
          title: "Tuần 1: RAG Fundamentals",
          lessons: [
            { 
              id: "4-1-1", 
              title: "RAG overview: Tại sao cần RAG? Architecture", 
              time: "3-4h",
              resources: [
                { type: "article", title: "What is RAG? - Anthropic", url: "https://docs.anthropic.com/claude/docs/retrieval-augmented-generation" },
                { type: "video", title: "RAG Explained - IBM", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M" },
                { type: "paper", title: "RAG Original Paper", url: "https://arxiv.org/abs/2005.11401" },
                { type: "article", title: "Building RAG Applications", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/" }
              ]
            },
            { 
              id: "4-1-2", 
              title: "Text Chunking strategies", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Chunking Strategies for RAG", url: "https://www.pinecone.io/learn/chunking-strategies/" },
                { type: "video", title: "Advanced Chunking - LangChain", url: "https://www.youtube.com/watch?v=8OJC21T2SL4" },
                { type: "docs", title: "LangChain Text Splitters", url: "https://python.langchain.com/docs/modules/data_connection/document_transformers/" },
                { type: "article", title: "Semantic Chunking", url: "https://towardsdatascience.com/a-visual-guide-to-text-chunking-in-rag-d96acfaefa6c" }
              ]
            },
            { 
              id: "4-1-3", 
              title: "Embeddings: OpenAI, Sentence Transformers", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "OpenAI Embeddings Guide", url: "https://platform.openai.com/docs/guides/embeddings" },
                { type: "docs", title: "Sentence Transformers", url: "https://www.sbert.net/" },
                { type: "video", title: "Understanding Embeddings", url: "https://www.youtube.com/watch?v=QdDoFfkVkcw" },
                { type: "article", title: "Embedding Models Comparison", url: "https://huggingface.co/spaces/mteb/leaderboard" },
                { type: "article", title: "Cohere Embeddings", url: "https://cohere.com/embed" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Vector Stores & Retrieval",
          lessons: [
            { 
              id: "4-2-1", 
              title: "Vector DBs: Pinecone, Chroma, Qdrant", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "ChromaDB Getting Started", url: "https://docs.trychroma.com/getting-started" },
                { type: "docs", title: "Pinecone Quickstart", url: "https://docs.pinecone.io/docs/quickstart" },
                { type: "docs", title: "Qdrant Documentation", url: "https://qdrant.tech/documentation/" },
                { type: "video", title: "Vector Database Explained", url: "https://www.youtube.com/watch?v=t9IDoenf-lo" },
                { type: "article", title: "Vector DB Comparison", url: "https://benchmark.vectorview.ai/" }
              ]
            },
            { 
              id: "4-2-2", 
              title: "Retrieval strategies: MMR, Hybrid search", 
              time: "4-5h",
              resources: [
                { type: "article", title: "MMR Explained", url: "https://www.pinecone.io/learn/maximal-marginal-relevance/" },
                { type: "article", title: "Hybrid Search Guide", url: "https://weaviate.io/blog/hybrid-search-explained" },
                { type: "docs", title: "LangChain Retrievers", url: "https://python.langchain.com/docs/modules/data_connection/retrievers/" },
                { type: "video", title: "Advanced Retrieval Techniques", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8" }
              ]
            },
            { 
              id: "4-2-3", 
              title: "LangChain / LlamaIndex basics", 
              time: "5-6h",
              resources: [
                { type: "docs", title: "LangChain Documentation", url: "https://python.langchain.com/docs/" },
                { type: "docs", title: "LlamaIndex Documentation", url: "https://docs.llamaindex.ai/" },
                { type: "course", title: "LangChain for LLM Apps", url: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/" },
                { type: "video", title: "LangChain Crash Course", url: "https://www.youtube.com/watch?v=lG7Uxts9SXs" },
                { type: "github", title: "LangChain Examples", url: "https://github.com/langchain-ai/langchain/tree/master/cookbook" }
              ]
            }
          ]
        },
        {
          title: "Tuần 3: Advanced RAG & Project",
          lessons: [
            { 
              id: "4-3-1", 
              title: "Advanced RAG: Re-ranking, Query expansion, HyDE", 
              time: "5-6h",
              resources: [
                { type: "video", title: "RAG from Scratch Series", url: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x" },
                { type: "article", title: "Advanced RAG Techniques", url: "https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b" },
                { type: "paper", title: "HyDE Paper", url: "https://arxiv.org/abs/2212.10496" },
                { type: "docs", title: "Cohere Reranking", url: "https://docs.cohere.com/docs/reranking" },
                { type: "article", title: "Query Transformation", url: "https://blog.langchain.dev/query-transformations/" }
              ]
            },
            { 
              id: "4-3-2", 
              title: "🎯 Project: RAG Chatbot cho documentation", 
              time: "8-10h",
              resources: [
                { type: "tutorial", title: "Build RAG with LangChain", url: "https://python.langchain.com/docs/use_cases/question_answering/" },
                { type: "video", title: "RAG Chatbot Tutorial", url: "https://www.youtube.com/watch?v=tcqEUSNCn8I" },
                { type: "github", title: "RAG Chatbot Example", url: "https://github.com/langchain-ai/chat-langchain" },
                { type: "article", title: "Production RAG Best Practices", url: "https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "docs", title: "LangChain Documentation", url: "https://python.langchain.com/docs/" },
        { type: "video", title: "RAG from Scratch - LangChain", url: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x" },
        { type: "paper", title: "Retrieval-Augmented Generation", url: "https://arxiv.org/abs/2005.11401" }
      ],
      checklist: [
        "Hiểu RAG pipeline end-to-end",
        "Sử dụng được LangChain/LlamaIndex",
        "Setup và query Vector Database",
        "Build được production-ready RAG chatbot"
      ],
      project: {
        title: "RAG Chatbot cho Company Documentation",
        details: "Stack: LangChain + ChromaDB + Claude API"
      }
    },
    {
      id: 5,
      title: "AI Agents",
      icon: "🤖",
      duration: "3-4 tuần",
      difficulty: 4,
      color: "#8b5cf6",
      description: "Xây dựng AI Agent tự động",
      weeks: [
        {
          title: "Tuần 1: Agent Fundamentals",
          lessons: [
            { 
              id: "5-1-1", 
              title: "Agent vs Chatbot vs RAG: Sự khác biệt", 
              time: "3-4h",
              resources: [
                { type: "article", title: "What are AI Agents?", url: "https://www.anthropic.com/research/building-effective-agents" },
                { type: "video", title: "AI Agents Explained", url: "https://www.youtube.com/watch?v=F8NKVhkZZWI" },
                { type: "article", title: "LLM Agents Overview", url: "https://lilianweng.github.io/posts/2023-06-23-agent/" },
                { type: "docs", title: "LangChain Agents", url: "https://python.langchain.com/docs/modules/agents/" }
              ]
            },
            { 
              id: "5-1-2", 
              title: "Agent components: Planning, Memory, Tools", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Anatomy of AI Agent - Lilian Weng", url: "https://lilianweng.github.io/posts/2023-06-23-agent/" },
                { type: "video", title: "Building Agents - DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/" },
                { type: "docs", title: "LangGraph Concepts", url: "https://langchain-ai.github.io/langgraph/concepts/" },
                { type: "article", title: "Memory in Agents", url: "https://www.pinecone.io/learn/langchain-agents-memory/" }
              ]
            },
            { 
              id: "5-1-3", 
              title: "ReAct pattern, Chain of Thought", 
              time: "4-5h",
              resources: [
                { type: "paper", title: "ReAct Paper", url: "https://arxiv.org/abs/2210.03629" },
                { type: "article", title: "ReAct Explained", url: "https://www.promptingguide.ai/techniques/react" },
                { type: "video", title: "ReAct Agents Tutorial", url: "https://www.youtube.com/watch?v=Eug2clsLtFs" },
                { type: "paper", title: "Chain of Thought Paper", url: "https://arxiv.org/abs/2201.11903" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Tools & Function Calling",
          lessons: [
            { 
              id: "5-2-1", 
              title: "Function Calling: OpenAI, Anthropic", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "Anthropic Tool Use", url: "https://docs.anthropic.com/claude/docs/tool-use" },
                { type: "docs", title: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling" },
                { type: "video", title: "Function Calling Tutorial", url: "https://www.youtube.com/watch?v=0lOSvOoF2to" },
                { type: "tutorial", title: "Tool Use Best Practices", url: "https://docs.anthropic.com/claude/docs/tool-use-best-practices" }
              ]
            },
            { 
              id: "5-2-2", 
              title: "Custom Tools: Web search, Code execution", 
              time: "5-6h",
              resources: [
                { type: "docs", title: "LangChain Custom Tools", url: "https://python.langchain.com/docs/modules/agents/tools/custom_tools" },
                { type: "video", title: "Building Custom Tools", url: "https://www.youtube.com/watch?v=8p9mBBqCdxY" },
                { type: "article", title: "Code Execution Tools", url: "https://python.langchain.com/docs/integrations/tools/python/" },
                { type: "github", title: "LangChain Tools Examples", url: "https://github.com/langchain-ai/langchain/tree/master/libs/community/langchain_community/tools" }
              ]
            },
            { 
              id: "5-2-3", 
              title: "LangChain Agents, LangGraph basics", 
              time: "5-6h",
              resources: [
                { type: "docs", title: "LangGraph Documentation", url: "https://langchain-ai.github.io/langgraph/" },
                { type: "course", title: "AI Agents in LangGraph", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/" },
                { type: "video", title: "LangGraph Tutorial", url: "https://www.youtube.com/watch?v=R8KB-Zcynxc" },
                { type: "github", title: "LangGraph Examples", url: "https://github.com/langchain-ai/langgraph/tree/main/examples" }
              ]
            }
          ]
        },
        {
          title: "Tuần 3: Advanced Agents",
          lessons: [
            { 
              id: "5-3-1", 
              title: "Multi-Agent systems, Agent orchestration", 
              time: "5-6h",
              resources: [
                { type: "docs", title: "Multi-Agent with LangGraph", url: "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/" },
                { type: "video", title: "Multi-Agent Systems", url: "https://www.youtube.com/watch?v=hD52PQ9vQBM" },
                { type: "github", title: "AutoGen by Microsoft", url: "https://github.com/microsoft/autogen" },
                { type: "article", title: "Agent Orchestration Patterns", url: "https://www.anthropic.com/research/building-effective-agents" }
              ]
            },
            { 
              id: "5-3-2", 
              title: "Memory systems: Short-term, Long-term", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "LangChain Memory", url: "https://python.langchain.com/docs/modules/memory/" },
                { type: "article", title: "Memory in LLM Agents", url: "https://www.pinecone.io/learn/langchain-agents-memory/" },
                { type: "video", title: "Agent Memory Deep Dive", url: "https://www.youtube.com/watch?v=6gZ8YIkQJlU" },
                { type: "docs", title: "LangGraph Persistence", url: "https://langchain-ai.github.io/langgraph/concepts/persistence/" }
              ]
            },
            { 
              id: "5-3-3", 
              title: "CrewAI, AutoGen exploration", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "CrewAI Documentation", url: "https://docs.crewai.com/" },
                { type: "docs", title: "AutoGen Documentation", url: "https://microsoft.github.io/autogen/" },
                { type: "video", title: "CrewAI Tutorial", url: "https://www.youtube.com/watch?v=tnejrr-0a94" },
                { type: "video", title: "AutoGen Getting Started", url: "https://www.youtube.com/watch?v=vU2S6dVf79M" }
              ]
            }
          ]
        },
        {
          title: "Tuần 4: Project",
          lessons: [
            { 
              id: "5-4-1", 
              title: "🎯 Project: AI Research Assistant Agent", 
              time: "10-12h",
              resources: [
                { type: "github", title: "GPT Researcher", url: "https://github.com/assafelovic/gpt-researcher" },
                { type: "tutorial", title: "Building Research Agent", url: "https://www.youtube.com/watch?v=DjuXACWYkkU" },
                { type: "article", title: "Research Agent Architecture", url: "https://blog.langchain.dev/how-to-build-research-agent/" },
                { type: "github", title: "LangGraph Research Agent", url: "https://github.com/langchain-ai/langgraph/tree/main/examples/research" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "course", title: "DeepLearning.AI - Building AI Agents", url: "https://www.deeplearning.ai/short-courses/" },
        { type: "docs", title: "LangGraph Documentation", url: "https://langchain-ai.github.io/langgraph/" },
        { type: "paper", title: "ReAct: Synergizing Reasoning and Acting", url: "https://arxiv.org/abs/2210.03629" }
      ],
      checklist: [
        "Hiểu Agent architecture patterns",
        "Implement được custom tools",
        "Sử dụng thành thạo LangGraph",
        "Build được multi-step reasoning agent"
      ],
      project: {
        title: "AI Research Assistant Agent",
        details: "Web search, Document analysis, Code generation, Multi-step planning"
      }
    },
    {
      id: 6,
      title: "AI Deployment",
      icon: "🚀",
      duration: "2-3 tuần",
      difficulty: 3,
      color: "#06b6d4",
      description: "Triển khai AI trong Production",
      weeks: [
        {
          title: "Tuần 1: Backend & API Design",
          lessons: [
            { 
              id: "6-1-1", 
              title: "FastAPI cho AI applications", 
              time: "3-4h",
              resources: [
                { type: "docs", title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/" },
                { type: "video", title: "FastAPI Crash Course", url: "https://www.youtube.com/watch?v=tLKKmouUams" },
                { type: "tutorial", title: "FastAPI for ML APIs", url: "https://testdriven.io/blog/fastapi-machine-learning/" },
                { type: "github", title: "FastAPI + LangChain Template", url: "https://github.com/langchain-ai/langchain-template" }
              ]
            },
            { 
              id: "6-1-2", 
              title: "Streaming responses, WebSocket", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "FastAPI WebSockets", url: "https://fastapi.tiangolo.com/advanced/websockets/" },
                { type: "article", title: "Streaming LLM Responses", url: "https://python.langchain.com/docs/expression_language/streaming/" },
                { type: "video", title: "Real-time Streaming with FastAPI", url: "https://www.youtube.com/watch?v=C0GKYeSbfKU" },
                { type: "docs", title: "Anthropic Streaming", url: "https://docs.anthropic.com/claude/reference/streaming" }
              ]
            },
            { 
              id: "6-1-3", 
              title: "Rate limiting, Caching, Error handling", 
              time: "4-5h",
              resources: [
                { type: "article", title: "Rate Limiting Best Practices", url: "https://www.anthropic.com/research/building-effective-agents" },
                { type: "docs", title: "Redis Caching for LLMs", url: "https://python.langchain.com/docs/integrations/llm_caching/" },
                { type: "article", title: "Production LLM Error Handling", url: "https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1" },
                { type: "github", title: "LLM Rate Limiter", url: "https://github.com/langchain-ai/langchain/blob/master/libs/langchain/langchain/utils/rate_limiter.py" }
              ]
            }
          ]
        },
        {
          title: "Tuần 2: Infrastructure & Monitoring",
          lessons: [
            { 
              id: "6-2-1", 
              title: "Docker containerization", 
              time: "3-4h",
              resources: [
                { type: "docs", title: "Docker Documentation", url: "https://docs.docker.com/get-started/" },
                { type: "video", title: "Docker for ML Projects", url: "https://www.youtube.com/watch?v=0H2miBK_gAk" },
                { type: "article", title: "Dockerizing FastAPI", url: "https://fastapi.tiangolo.com/deployment/docker/" },
                { type: "github", title: "Docker ML Templates", url: "https://github.com/docker/awesome-compose" }
              ]
            },
            { 
              id: "6-2-2", 
              title: "LLM Observability: LangSmith, Langfuse", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/" },
                { type: "docs", title: "Langfuse Documentation", url: "https://langfuse.com/docs" },
                { type: "video", title: "LangSmith Tutorial", url: "https://www.youtube.com/watch?v=tFXm5ijih98" },
                { type: "article", title: "LLM Observability Guide", url: "https://www.anthropic.com/research/building-effective-agents" }
              ]
            },
            { 
              id: "6-2-3", 
              title: "Cost optimization, Token management", 
              time: "4-5h",
              resources: [
                { type: "article", title: "LLM Cost Optimization", url: "https://www.anyscale.com/blog/continuous-batching-llm-inference" },
                { type: "docs", title: "Token Counting - Anthropic", url: "https://docs.anthropic.com/claude/docs/counting-tokens" },
                { type: "article", title: "Reducing LLM Costs", url: "https://www.vellum.ai/blog/llm-cost-optimization" },
                { type: "tool", title: "LLM Token Calculator", url: "https://platform.openai.com/tokenizer" }
              ]
            }
          ]
        },
        {
          title: "Tuần 3: Production & Final Project",
          lessons: [
            { 
              id: "6-3-1", 
              title: "Guardrails, Safety, Content filtering", 
              time: "3-4h",
              resources: [
                { type: "docs", title: "Anthropic Safety Guide", url: "https://docs.anthropic.com/claude/docs/content-moderation" },
                { type: "github", title: "Guardrails AI", url: "https://github.com/guardrails-ai/guardrails" },
                { type: "article", title: "LLM Safety Best Practices", url: "https://www.anthropic.com/research/building-effective-agents" },
                { type: "docs", title: "OpenAI Moderation", url: "https://platform.openai.com/docs/guides/moderation" }
              ]
            },
            { 
              id: "6-3-2", 
              title: "Evaluation & Testing AI systems", 
              time: "4-5h",
              resources: [
                { type: "docs", title: "LangSmith Evaluations", url: "https://docs.smith.langchain.com/evaluation" },
                { type: "article", title: "LLM Evaluation Guide", url: "https://www.anthropic.com/research/evaluating-ai-systems" },
                { type: "github", title: "RAGAS - RAG Evaluation", url: "https://github.com/explodinggradients/ragas" },
                { type: "video", title: "Testing LLM Apps", url: "https://www.youtube.com/watch?v=Vw52xyyFLKI" }
              ]
            },
            { 
              id: "6-3-3", 
              title: "🎯 Final Project: Deploy full AI application", 
              time: "8-10h",
              resources: [
                { type: "tutorial", title: "Deploy LangChain to Production", url: "https://python.langchain.com/docs/guides/deployments/" },
                { type: "article", title: "Production LLM Checklist", url: "https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1" },
                { type: "github", title: "LangServe Examples", url: "https://github.com/langchain-ai/langserve" },
                { type: "video", title: "End-to-End LLM Deployment", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }
              ]
            }
          ]
        }
      ],
      resources: [
        { type: "docs", title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/" },
        { type: "docs", title: "LangSmith Docs", url: "https://docs.smith.langchain.com/" },
        { type: "docs", title: "Anthropic Production Guide", url: "https://docs.anthropic.com/claude/docs" }
      ],
      checklist: [
        "Deploy được AI app với FastAPI",
        "Implement streaming responses",
        "Setup monitoring & observability",
        "Handle production concerns (cost, safety, scale)"
      ],
      project: {
        title: "Full-Stack AI Application",
        details: "Backend FastAPI + Frontend React + Docker + LangSmith"
      }
    }
  ]
};

const getTotalLessons = () => {
  let total = 0;
  CURRICULUM.modules.forEach(m => {
    m.weeks.forEach(w => {
      total += w.lessons.length;
    });
  });
  return total;
};

const resourceIcons = {
  video: "🎬",
  article: "📄",
  tutorial: "📝",
  docs: "📚",
  paper: "📑",
  course: "🎓",
  notebook: "📓",
  github: "💻",
  dataset: "📊",
  interactive: "🎮",
  tool: "🔧"
};

export default function LLMLearningTracker() {
  const [completedLessons, setCompletedLessons] = useState({});
  const [completedChecklist, setCompletedChecklist] = useState({});
  const [activeModule, setActiveModule] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const lessonsData = await window.storage.get('llm-completed-lessons');
        const checklistData = await window.storage.get('llm-completed-checklist');
        const notesData = await window.storage.get('llm-notes');
        
        if (lessonsData) setCompletedLessons(JSON.parse(lessonsData.value));
        if (checklistData) setCompletedChecklist(JSON.parse(checklistData.value));
        if (notesData) setNotes(JSON.parse(notesData.value));
      } catch (e) {
        console.log('No saved data found');
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const saveData = async (lessons, checklist, notesData) => {
    try {
      await window.storage.set('llm-completed-lessons', JSON.stringify(lessons));
      await window.storage.set('llm-completed-checklist', JSON.stringify(checklist));
      await window.storage.set('llm-notes', JSON.stringify(notesData));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  const toggleLesson = (lessonId, e) => {
    e.stopPropagation();
    const newCompleted = { ...completedLessons, [lessonId]: !completedLessons[lessonId] };
    setCompletedLessons(newCompleted);
    saveData(newCompleted, completedChecklist, notes);
  };

  const toggleLessonExpand = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const toggleChecklistItem = (moduleId, index) => {
    const key = `${moduleId}-${index}`;
    const newChecklist = { ...completedChecklist, [key]: !completedChecklist[key] };
    setCompletedChecklist(newChecklist);
    saveData(completedLessons, newChecklist, notes);
  };

  const updateNote = (moduleId, value) => {
    const newNotes = { ...notes, [moduleId]: value };
    setNotes(newNotes);
    saveData(completedLessons, completedChecklist, newNotes);
  };

  const getModuleProgress = (module) => {
    let total = 0;
    let completed = 0;
    module.weeks.forEach(week => {
      week.lessons.forEach(lesson => {
        total++;
        if (completedLessons[lesson.id]) completed++;
      });
    });
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getOverallProgress = () => {
    let total = 0;
    let completed = 0;
    CURRICULUM.modules.forEach(module => {
      const progress = getModuleProgress(module);
      total += progress.total;
      completed += progress.completed;
    });
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const resetProgress = async () => {
    if (confirm('Bạn có chắc muốn reset toàn bộ tiến độ?')) {
      setCompletedLessons({});
      setCompletedChecklist({});
      setNotes({});
      setExpandedLessons({});
      await saveData({}, {}, {});
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const overall = getOverallProgress();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>
              <span style={styles.titleIcon}>🚀</span>
              LLM & AI Agent
            </h1>
            <p style={styles.subtitle}>Lộ trình học từ Developer đến AI Engineer</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.overallProgress}>
              <div style={styles.progressRing}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                  <circle 
                    cx="40" cy="40" r="35" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${overall.percent * 2.2} 220`}
                    transform="rotate(-90 40 40)"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div style={styles.progressText}>
                  <span style={styles.progressPercent}>{overall.percent}%</span>
                </div>
              </div>
              <div style={styles.progressDetails}>
                <span style={styles.progressLabel}>Tiến độ tổng</span>
                <span style={styles.progressCount}>{overall.completed}/{overall.total} bài</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <button 
            style={{...styles.navBtn, ...(activeTab === 'overview' ? styles.navBtnActive : {})}}
            onClick={() => { setActiveTab('overview'); setActiveModule(null); }}
          >
            📊 Tổng quan
          </button>
          <button 
            style={{...styles.navBtn, ...(activeTab === 'timeline' ? styles.navBtnActive : {})}}
            onClick={() => { setActiveTab('timeline'); setActiveModule(null); }}
          >
            📅 Timeline
          </button>
          <button 
            style={{...styles.navBtn, ...(activeTab === 'resources' ? styles.navBtnActive : {})}}
            onClick={() => { setActiveTab('resources'); setActiveModule(null); }}
          >
            📚 Tài nguyên
          </button>
          <button style={styles.resetBtn} onClick={resetProgress}>
            🔄 Reset
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === 'overview' && !activeModule && (
          <div style={styles.moduleGrid}>
            {CURRICULUM.modules.map((module, idx) => {
              const progress = getModuleProgress(module);
              return (
                <div 
                  key={module.id}
                  style={{...styles.moduleCard, animationDelay: `${idx * 0.1}s`}}
                  onClick={() => setActiveModule(module)}
                >
                  <div style={styles.moduleHeader}>
                    <span style={styles.moduleIcon}>{module.icon}</span>
                    <span style={{...styles.moduleBadge, backgroundColor: module.color}}>
                      Module {module.id}
                    </span>
                  </div>
                  <h3 style={styles.moduleTitle}>{module.title}</h3>
                  <p style={styles.moduleDesc}>{module.description}</p>
                  
                  <div style={styles.moduleStats}>
                    <div style={styles.statItem}>
                      <span style={styles.statIcon}>⏱️</span>
                      <span>{module.duration}</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statIcon}>📊</span>
                      <span>{'⭐'.repeat(module.difficulty)}</span>
                    </div>
                  </div>
                  
                  <div style={styles.moduleProgress}>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${progress.percent}%`,
                          backgroundColor: module.color
                        }}
                      />
                    </div>
                    <span style={styles.progressSmall}>{progress.completed}/{progress.total} bài</span>
                  </div>
                  
                  <div style={styles.moduleArrow}>→</div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div style={styles.timeline}>
            <div style={styles.timelineHeader}>
              <h2 style={styles.sectionTitle}>📅 Timeline học tập</h2>
              <p style={styles.sectionDesc}>Tổng thời gian: 15-21 tuần (4-5 tháng) | 2-3h/ngày</p>
            </div>
            <div style={styles.timelineLine}></div>
            {CURRICULUM.modules.map((module) => {
              const progress = getModuleProgress(module);
              const isCompleted = progress.percent === 100;
              return (
                <div key={module.id} style={styles.timelineItem}>
                  <div style={{
                    ...styles.timelineDot,
                    backgroundColor: isCompleted ? '#10b981' : module.color,
                    boxShadow: isCompleted ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
                  }}>
                    {isCompleted ? '✓' : module.id}
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineLeft}>
                      <h4 style={styles.timelineTitle}>
                        <span style={styles.timelineIcon}>{module.icon}</span>
                        {module.title}
                      </h4>
                      <p style={styles.timelineDuration}>{module.duration}</p>
                    </div>
                    <div style={styles.timelineRight}>
                      <div style={{...styles.miniProgress, backgroundColor: `${module.color}20`}}>
                        <div style={{
                          ...styles.miniProgressFill,
                          width: `${progress.percent}%`,
                          backgroundColor: module.color
                        }}/>
                      </div>
                      <span style={styles.miniPercent}>{progress.percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'resources' && (
          <div style={styles.resourcesContainer}>
            <h2 style={styles.sectionTitle}>📚 Tài nguyên học tập</h2>
            
            <div style={styles.resourceCategories}>
              <div style={styles.resourceCategory}>
                <h3 style={styles.resourceCatTitle}>🎓 Courses</h3>
                <ul style={styles.resourceList}>
                  <li><a href="https://web.stanford.edu/class/cs224n/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Stanford CS224N - NLP with Deep Learning</a></li>
                  <li><a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Hugging Face NLP Course</a></li>
                  <li><a href="https://course.fast.ai/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Fast.ai Practical Deep Learning</a></li>
                  <li><a href="https://www.deeplearning.ai/short-courses/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>DeepLearning.AI Short Courses</a></li>
                </ul>
              </div>
              
              <div style={styles.resourceCategory}>
                <h3 style={styles.resourceCatTitle}>📺 YouTube</h3>
                <ul style={styles.resourceList}>
                  <li><a href="https://www.youtube.com/@AndrejKarpathy" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Andrej Karpathy</a></li>
                  <li><a href="https://www.youtube.com/@YannicKilcher" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Yannic Kilcher</a></li>
                  <li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>3Blue1Brown</a></li>
                  <li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>StatQuest</a></li>
                </ul>
              </div>
              
              <div style={styles.resourceCategory}>
                <h3 style={styles.resourceCatTitle}>🛠️ Tools & Frameworks</h3>
                <ul style={styles.resourceList}>
                  <li><a href="https://pytorch.org/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>PyTorch</a></li>
                  <li><a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Hugging Face</a></li>
                  <li><a href="https://python.langchain.com/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>LangChain</a></li>
                  <li><a href="https://www.llamaindex.ai/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>LlamaIndex</a></li>
                </ul>
              </div>
              
              <div style={styles.resourceCategory}>
                <h3 style={styles.resourceCatTitle}>💾 Vector Databases</h3>
                <ul style={styles.resourceList}>
                  <li><a href="https://www.trychroma.com/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>ChromaDB</a></li>
                  <li><a href="https://www.pinecone.io/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Pinecone</a></li>
                  <li><a href="https://qdrant.tech/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Qdrant</a></li>
                  <li><a href="https://weaviate.io/" target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>Weaviate</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeModule && (
          <div style={styles.moduleDetail}>
            <button style={styles.backBtn} onClick={() => setActiveModule(null)}>
              ← Quay lại
            </button>
            
            <div style={styles.detailHeader}>
              <div style={styles.detailHeaderLeft}>
                <span style={styles.detailIcon}>{activeModule.icon}</span>
                <div>
                  <span style={{...styles.moduleBadge, backgroundColor: activeModule.color}}>
                    Module {activeModule.id}
                  </span>
                  <h2 style={styles.detailTitle}>{activeModule.title}</h2>
                  <p style={styles.detailDesc}>{activeModule.description}</p>
                </div>
              </div>
              <div style={styles.detailStats}>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatValue}>{activeModule.duration}</span>
                  <span style={styles.detailStatLabel}>Thời gian</span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatValue}>{getModuleProgress(activeModule).percent}%</span>
                  <span style={styles.detailStatLabel}>Hoàn thành</span>
                </div>
              </div>
            </div>

            <div style={styles.weeksContainer}>
              {activeModule.weeks.map((week, weekIdx) => (
                <div key={weekIdx} style={styles.weekCard}>
                  <h3 style={styles.weekTitle}>{week.title}</h3>
                  <div style={styles.lessonList}>
                    {week.lessons.map((lesson) => (
                      <div key={lesson.id} style={styles.lessonWrapper}>
                        <div 
                          style={{
                            ...styles.lessonItem,
                            ...(completedLessons[lesson.id] ? styles.lessonCompleted : {}),
                            ...(expandedLessons[lesson.id] ? styles.lessonExpanded : {})
                          }}
                          onClick={() => toggleLessonExpand(lesson.id)}
                        >
                          <div 
                            style={styles.lessonCheckbox}
                            onClick={(e) => toggleLesson(lesson.id, e)}
                          >
                            {completedLessons[lesson.id] ? '✓' : ''}
                          </div>
                          <div style={styles.lessonContent}>
                            <span style={styles.lessonTitle}>{lesson.title}</span>
                            <div style={styles.lessonMeta}>
                              <span style={styles.lessonTime}>⏱️ {lesson.time}</span>
                              <span style={styles.lessonResourceCount}>
                                📚 {lesson.resources?.length || 0} tài liệu
                              </span>
                            </div>
                          </div>
                          <span style={styles.lessonExpandIcon}>
                            {expandedLessons[lesson.id] ? '▼' : '▶'}
                          </span>
                        </div>
                        
                        {expandedLessons[lesson.id] && lesson.resources && (
                          <div style={styles.lessonResources}>
                            <div style={styles.resourcesHeader}>
                              <span>📖 Tài liệu học tập</span>
                            </div>
                            <div style={styles.resourcesList}>
                              {lesson.resources.map((res, idx) => (
                                <a 
                                  key={idx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={styles.resourceItem}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span style={styles.resourceIconInline}>
                                    {resourceIcons[res.type] || '📄'}
                                  </span>
                                  <div style={styles.resourceInfo}>
                                    <span style={styles.resourceTitle}>{res.title}</span>
                                    <span style={styles.resourceTypeLabel}>{res.type}</span>
                                  </div>
                                  <span style={styles.resourceArrowInline}>↗</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.projectCard}>
              <h3 style={styles.projectTitle}>🎯 Project cuối Module</h3>
              <h4 style={styles.projectName}>{activeModule.project.title}</h4>
              <p style={styles.projectDetails}>{activeModule.project.details}</p>
            </div>

            <div style={styles.checklistCard}>
              <h3 style={styles.checklistTitle}>✅ Checklist hoàn thành</h3>
              <div style={styles.checklistItems}>
                {activeModule.checklist.map((item, idx) => {
                  const key = `${activeModule.id}-${idx}`;
                  return (
                    <div 
                      key={idx}
                      style={{
                        ...styles.checklistItem,
                        ...(completedChecklist[key] ? styles.checklistItemDone : {})
                      }}
                      onClick={() => toggleChecklistItem(activeModule.id, idx)}
                    >
                      <div style={styles.checklistBox}>
                        {completedChecklist[key] ? '✓' : ''}
                      </div>
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.moduleResources}>
              <h3 style={styles.resourcesTitle}>📖 Tài nguyên chính của Module</h3>
              <div style={styles.resourceGrid}>
                {activeModule.resources.map((res, idx) => (
                  <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" style={styles.resourceCard}>
                    <span style={styles.resourceType}>{res.type}</span>
                    <span style={styles.resourceName}>{res.title}</span>
                    <span style={styles.resourceArrowCard}>↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={styles.notesCard}>
              <h3 style={styles.notesTitle}>📝 Ghi chú của bạn</h3>
              <textarea
                style={styles.notesTextarea}
                placeholder="Ghi chú, links, hoặc bất cứ điều gì bạn muốn nhớ..."
                value={notes[activeModule.id] || ''}
                onChange={(e) => updateNote(activeModule.id, e.target.value)}
              />
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>🚀 Từ Developer → AI Engineer | Tổng: {getTotalLessons()} bài học | 4-5 tháng</p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        a:hover {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#e2e8f0',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 20,
    color: '#94a3b8',
  },
  header: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '24px 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1400,
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: 20,
  },
  headerLeft: {},
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'linear-gradient(90deg, #fff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  titleIcon: { fontSize: 36 },
  subtitle: {
    margin: '8px 0 0',
    color: '#94a3b8',
    fontSize: 14,
  },
  headerRight: {},
  overallProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  progressRing: { position: 'relative' },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: 700,
    color: '#10b981',
  },
  progressDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    gap: 12,
    marginTop: 20,
    maxWidth: 1400,
    margin: '20px auto 0',
    flexWrap: 'wrap',
  },
  navBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  navBtnActive: {
    background: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    color: '#a5b4fc',
  },
  resetBtn: {
    padding: '10px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    color: '#f87171',
    cursor: 'pointer',
    fontSize: 14,
    marginLeft: 'auto',
  },
  main: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '32px',
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 24,
  },
  moduleCard: {
    background: 'rgba(30, 27, 75, 0.5)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease forwards',
    opacity: 0,
    position: 'relative',
  },
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: { fontSize: 36 },
  moduleBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#f1f5f9',
  },
  moduleDesc: {
    color: '#94a3b8',
    fontSize: 14,
    margin: '0 0 16px',
  },
  moduleStats: {
    display: 'flex',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#94a3b8',
  },
  statIcon: { fontSize: 14 },
  moduleProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressSmall: {
    fontSize: 12,
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  moduleArrow: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    fontSize: 24,
    color: '#6366f1',
    opacity: 0.5,
  },
  timeline: {
    position: 'relative',
    padding: '40px 0 40px 60px',
  },
  timelineHeader: {
    marginBottom: 40,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: '#f1f5f9',
  },
  sectionDesc: { color: '#94a3b8' },
  timelineLine: {
    position: 'absolute',
    left: 39,
    top: 140,
    bottom: 60,
    width: 2,
    background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -30,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#fff',
    fontSize: 14,
    border: '3px solid #0f172a',
  },
  timelineContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(30, 27, 75, 0.5)',
    padding: '20px 24px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    marginLeft: 20,
  },
  timelineLeft: {},
  timelineTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#f1f5f9',
  },
  timelineIcon: { fontSize: 20 },
  timelineDuration: {
    margin: '8px 0 0',
    color: '#94a3b8',
    fontSize: 14,
  },
  timelineRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  miniProgress: {
    width: 100,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  miniPercent: {
    fontSize: 14,
    fontWeight: 600,
    color: '#a5b4fc',
    minWidth: 40,
  },
  resourcesContainer: { padding: '20px 0' },
  resourceCategories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
    marginTop: 32,
  },
  resourceCategory: {
    background: 'rgba(30, 27, 75, 0.5)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  resourceCatTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#f1f5f9',
  },
  resourceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  resourceLink: {
    display: 'block',
    color: '#a5b4fc',
    textDecoration: 'none',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: 14,
    transition: 'color 0.2s',
  },
  moduleDetail: { animation: 'fadeIn 0.3s ease' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#a5b4fc',
    fontSize: 16,
    cursor: 'pointer',
    marginBottom: 24,
    padding: 0,
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 24,
  },
  detailHeaderLeft: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  detailIcon: { fontSize: 48 },
  detailTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: '8px 0',
    color: '#f1f5f9',
  },
  detailDesc: {
    color: '#94a3b8',
    margin: 0,
  },
  detailStats: {
    display: 'flex',
    gap: 32,
  },
  detailStat: { textAlign: 'center' },
  detailStatValue: {
    display: 'block',
    fontSize: 24,
    fontWeight: 700,
    color: '#a5b4fc',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weeksContainer: {
    display: 'grid',
    gap: 24,
  },
  weekCard: {
    background: 'rgba(30, 27, 75, 0.5)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#f1f5f9',
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  lessonWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  lessonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  lessonCompleted: {
    background: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  lessonExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    background: 'rgba(99, 102, 241, 0.1)',
  },
  lessonCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: '2px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
    transition: 'all 0.2s',
  },
  lessonContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  lessonTitle: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: 500,
  },
  lessonMeta: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  lessonTime: {
    fontSize: 13,
    color: '#64748b',
  },
  lessonResourceCount: {
    fontSize: 13,
    color: '#6366f1',
  },
  lessonExpandIcon: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 8,
  },
  lessonResources: {
    background: 'rgba(30, 27, 75, 0.8)',
    borderRadius: '0 0 10px 10px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderTop: 'none',
    padding: '16px',
    animation: 'slideDown 0.3s ease',
  },
  resourcesHeader: {
    fontSize: 13,
    color: '#a5b4fc',
    marginBottom: 12,
    fontWeight: 600,
  },
  resourcesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  resourceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    textDecoration: 'none',
    transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  resourceIconInline: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  resourceInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  resourceTitle: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  resourceTypeLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  resourceArrowInline: {
    color: '#6366f1',
    fontSize: 14,
  },
  projectCard: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  projectTitle: {
    fontSize: 16,
    color: '#a5b4fc',
    margin: '0 0 12px',
  },
  projectName: {
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#f1f5f9',
  },
  projectDetails: {
    color: '#94a3b8',
    margin: 0,
    fontSize: 14,
  },
  checklistCard: {
    background: 'rgba(30, 27, 75, 0.5)',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#f1f5f9',
  },
  checklistItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    color: '#94a3b8',
    transition: 'all 0.2s',
  },
  checklistItemDone: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    textDecoration: 'line-through',
  },
  checklistBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    border: '2px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  moduleResources: { marginTop: 24 },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#f1f5f9',
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  resourceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.2s',
  },
  resourceType: {
    padding: '4px 8px',
    background: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 4,
    fontSize: 11,
    textTransform: 'uppercase',
    color: '#a5b4fc',
    fontWeight: 600,
  },
  resourceName: {
    flex: 1,
    fontSize: 14,
    color: '#e2e8f0',
  },
  resourceArrowCard: {
    color: '#64748b',
    fontSize: 16,
  },
  notesCard: {
    background: 'rgba(30, 27, 75, 0.5)',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#f1f5f9',
  },
  notesTextarea: {
    width: '100%',
    minHeight: 120,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 16,
    color: '#e2e8f0',
    fontSize: 14,
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color: '#64748b',
    fontSize: 14,
  },
};
