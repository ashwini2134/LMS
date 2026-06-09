import json
import os

base_path = r"c:\Users\priya\Downloads\LMS-main (2)\LMS-main\frontend\public\data\cs50ai"

def create_simple_lesson(lecture_num, title, overview_text, learning_outcomes, next_up):
    """Create a simplified but complete lesson structure"""
    
    lesson = {
        "id": f"cs50ai-lecture-{lecture_num}",
        "courseSlug": "cs50ai",
        "number": lecture_num,
        "title": title,
        "overview": overview_text,
        "estimatedMinutes": 50 + (lecture_num * 5),
        "sections": [
            {
                "id": "overview",
                "label": "Overview",
                "blocks": [
                    {
                        "type": "explanation",
                        "accentColor": "blue",
                        "title": "In This Lecture You Will Learn",
                        "body": f"Welcome! By the end of this lecture you'll understand the core concepts of {title}.",
                        "bullets": learning_outcomes[:5]
                    },
                    {
                        "type": "text",
                        "content": overview_text
                    }
                ]
            },
            {
                "id": "main_topic",
                "label": title.split("&")[0].strip() if "&" in title else title,
                "blocks": [
                    {
                        "type": "explanation",
                        "accentColor": "purple",
                        "title": title,
                        "body": overview_text
                    },
                    {
                        "type": "code_example",
                        "title": "Example",
                        "language": "python",
                        "code": "# Coming soon - explore this concept\nprint(f\"{title} in action\")",
                        "expectedOutput": f"Learning about {title}!"
                    },
                    {
                        "type": "reflection",
                        "question": f"How would you apply {title} in a real-world scenario?",
                        "answer": f"There are many applications of {title} in modern AI systems. Think about where you see this concept in your daily life.",
                        "followupCode": f"# {title} is fundamental to modern AI\nprint(\"Explore and discover!\")",
                        "followupOutput": "Keep learning!"
                    }
                ]
            },
            {
                "id": "summary",
                "label": "Summary",
                "blocks": [
                    {
                        "type": "text",
                        "content": f"## Key Takeaways\n\n- {title} is a fundamental AI concept\n- It helps solve real-world problems\n- Understanding this enables more advanced AI\n- You can apply this in your projects\n\n## You Now Know\n\n- Core principles of {title}\n- Why this matters in AI\n- How to think about this concept\n- Where to see it applied\n\n## Next Lecture\n\nReady for the next step? Next lecture: {next_up}!"
                    }
                ]
            }
        ],
        "summary": {
            "keyTakeaways": [
                {"emoji": "", "text": f"{title} is fundamental to AI"},
                {"emoji": "", "text": f"This concept appears in many real-world applications"},
                {"emoji": "", "text": f"Understanding {title} enables advanced AI techniques"},
                {"emoji": "", "text": "This is a building block for the rest of the course"},
                {"emoji": "", "text": "You can use these concepts in your own projects"},
                {"emoji": "", "text": "AI continues to evolve with better applications of this"}
            ],
            "whatYouLearned": learning_outcomes,
            "nextUp": next_up
        }
    }
    
    return lesson

# Lecture definitions
lectures_config = {
    2: {
        "title": "Knowledge & Logic",
        "overview": "Knowledge representation and logical reasoning form the foundation of intelligent systems. AI systems use propositional logic, knowledge bases, and inference to reason about the world and draw conclusions.",
        "learning_outcomes": [
            "What propositional logic is and how it works",
            "AND, OR, NOT operators and their combinations",
            "IF-THEN rules and implications",
            "Knowledge bases and how AI stores facts",
            "Inference: how AI derives new facts from existing ones",
            "Real-world applications like expert systems"
        ],
        "next_up": "Probability & Uncertainty"
    },
    3: {
        "title": "Probability & Uncertainty",
        "overview": "The real world is uncertain. This lecture covers probability theory, conditional probability, and Bayes' Theorem—the mathematical tools AI uses to reason about uncertainty and make predictions with incomplete information.",
        "learning_outcomes": [
            "Probability basics: 0 to 1 scale",
            "Conditional probability: P(X|Y)",
            "Bayes' Theorem and belief updating",
            "How uncertainty helps AI systems",
            "Applications in spam filters and medical diagnosis",
            "Making decisions under uncertainty"
        ],
        "next_up": "Optimization"
    },
    4: {
        "title": "Optimization",
        "overview": "Optimization is about finding the best solution among many options. From scheduling exams to solving Sudoku, this lecture covers techniques like hill climbing, simulated annealing, and constraint satisfaction problems.",
        "learning_outcomes": [
            "What optimization problems are",
            "Hill climbing and local vs global optima",
            "Simulated annealing to escape local optima",
            "Constraint Satisfaction Problems (CSPs)",
            "Practical applications like scheduling and logistics",
            "Choosing the right optimization technique"
        ],
        "next_up": "Machine Learning"
    },
    5: {
        "title": "Machine Learning",
        "overview": "Machine Learning enables AI systems to improve from experience. This lecture covers supervised learning, unsupervised learning, and reinforcement learning—the three paradigms that power modern AI.",
        "learning_outcomes": [
            "What Machine Learning is and how it differs from programming",
            "Supervised learning with labeled data",
            "Unsupervised learning and clustering",
            "Reinforcement learning and reward systems",
            "Overfitting and generalization",
            "Real-world ML applications and datasets"
        ],
        "next_up": "Neural Networks"
    },
    6: {
        "title": "Neural Networks",
        "overview": "Neural Networks are computing systems inspired by biological neural networks. This lecture covers how neurons work, network architectures, and deep learning—the breakthrough technology behind modern AI.",
        "learning_outcomes": [
            "How individual neurons work and compute",
            "Weights and biases in neural networks",
            "Network layers: input, hidden, output",
            "Activation functions and non-linearity",
            "Deep Learning and convolutional neural networks",
            "Training networks through backpropagation"
        ],
        "next_up": "Natural Language Processing"
    },
    7: {
        "title": "Natural Language Processing",
        "overview": "Natural Language Processing (NLP) enables computers to understand and generate human language. This lecture covers tokenization, embeddings, language models, and the technology behind chatbots and LLMs like GPT.",
        "learning_outcomes": [
            "What NLP is and why it's challenging",
            "Tokenization: breaking text into meaningful units",
            "Word embeddings and semantic meaning",
            "Language models and sequence prediction",
            "Transformers and attention mechanisms",
            "Applications: chatbots, translation, sentiment analysis"
        ],
        "next_up": "AI Ethics & Responsible Use"
    },
    8: {
        "title": "AI Ethics & Responsible Use",
        "overview": "As AI becomes more powerful, ethical considerations become crucial. This lecture covers AI bias, privacy, hallucinations, deepfakes, and the responsibilities of AI developers and society.",
        "learning_outcomes": [
            "AI bias: sources and consequences",
            "Privacy and data protection in AI systems",
            "Hallucinations and misinformation in language models",
            "Deepfakes and synthetic media",
            "Transparency and explainability in AI",
            "Accountability and responsible deployment"
        ],
        "next_up": "Final Project"
    },
    9: {
        "title": "Final Project",
        "overview": "Bring together everything you've learned in this course. Choose from four capstone projects: an AI Chatbot, Story Generator, Resume Builder, or Search Visualizer. Each project demonstrates mastery of multiple AI concepts.",
        "learning_outcomes": [
            "Integrating multiple AI concepts into one project",
            "Building practical applications of AI",
            "Designing user-friendly AI systems",
            "Considering ethical implications of your AI",
            "Testing and iterating on your AI application",
            "Presenting your work and reflecting on learning"
        ],
        "next_up": "Congratulations on completing CS50 AI!"
    }
}

# Create lesson files for Lectures 2-9
for lecture_num, config in lectures_config.items():
    lesson = create_simple_lesson(
        lecture_num,
        config["title"],
        config["overview"],
        config["learning_outcomes"],
        config["next_up"]
    )
    
    lesson_path = os.path.join(base_path, f"lecture_{lecture_num}", "lesson.json")
    with open(lesson_path, "w") as f:
        json.dump(lesson, f, indent=2)
    print(f"Created lesson.json for Lecture {lecture_num}: {config['title']}")

print("\nAll lesson files created successfully!")
