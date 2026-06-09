import json
import os

base_path = r"c:\Users\priya\Downloads\LMS-main (2)\LMS-main\frontend\public\data\cs50ai"

# Quiz questions for each lecture
quizzes = {
    1: [
        {"question": "What does BFS stand for?", "options": ["Breadth-First Search", "Best-First Search", "Bidirectional Search", "Bottom-First Search"], "answer": "Breadth-First Search", "explanation": "BFS stands for Breadth-First Search. It explores all nodes at the present depth level before moving to nodes at the next depth level."},
        {"question": "Which search explores the deepest path first?", "options": ["Breadth-First Search", "Depth-First Search", "A* Search", "Greedy Search"], "answer": "Depth-First Search", "explanation": "Depth-First Search (DFS) goes deep into one path before backtracking and trying other paths."},
        {"question": "Which search guarantees finding the shortest path?", "options": ["DFS", "Greedy Best-First", "BFS", "A*"], "answer": "BFS", "explanation": "BFS explores level by level, so the first path it finds to the goal is guaranteed to be the shortest path."},
        {"question": "What does A* search use that Greedy Best-First does not?", "options": ["Only estimated cost to goal", "Both cost so far AND estimated cost to goal", "Only actual cost from start", "Random exploration"], "answer": "Both cost so far AND estimated cost to goal", "explanation": "A* evaluates f(n) = g(n) + h(n), where g(n) is the cost to reach the current node and h(n) is the estimated cost to the goal."},
        {"question": "In a search problem, the destination is called?", "options": ["Initial state", "Action", "Goal state", "Path cost"], "answer": "Goal state", "explanation": "In search terminology, the destination or objective is called the goal state."}
    ],
    2: [
        {"question": "What is propositional logic?", "options": ["Statements that are True or False", "Logic about proposing ideas", "Logic in programming", "Mathematical proofs"], "answer": "Statements that are True or False", "explanation": "Propositional logic deals with statements that have a truth value of either True or False."},
        {"question": "When does AND return True?", "options": ["When at least one side is True", "When both sides are True", "When one side is False", "Never"], "answer": "When both sides are True", "explanation": "AND (∧) returns True only when both operands are True."},
        {"question": "NOT True equals?", "options": ["True", "False", "Maybe", "Undefined"], "answer": "False", "explanation": "NOT flips the truth value. NOT True = False."},
        {"question": "What is a Knowledge Base?", "options": ["A database of files", "A collection of facts and rules", "A computer system", "A backup system"], "answer": "A collection of facts and rules", "explanation": "A Knowledge Base stores facts and rules that an AI system uses for reasoning."},
        {"question": "Inference means?", "options": ["Guessing randomly", "Deriving new facts from existing facts", "Making assumptions", "Storing information"], "answer": "Deriving new facts from existing facts", "explanation": "Inference is the process of deriving new conclusions from known facts and rules."}
    ],
    3: [
        {"question": "Probability of 0 means?", "options": ["Likely", "Impossible", "Certain", "Uncertain"], "answer": "Impossible", "explanation": "A probability of 0 means an event is impossible (will never happen)."},
        {"question": "Probability of 1 means?", "options": ["Unlikely", "Impossible", "Certain", "Uncertain"], "answer": "Certain", "explanation": "A probability of 1 means an event is certain (will definitely happen)."},
        {"question": "What is conditional probability?", "options": ["Probability under certain conditions", "Probability of X given Y", "Both of the above", "Neither"], "answer": "Both of the above", "explanation": "Conditional probability P(X|Y) is the probability of X occurring given that Y has already occurred."},
        {"question": "Bayes Theorem helps with?", "options": ["Calculating averages", "Updating belief with new evidence", "Predicting weather", "None"], "answer": "Updating belief with new evidence", "explanation": "Bayes' Theorem allows us to update our beliefs about events based on new evidence."},
        {"question": "Spam filters use which concept?", "options": ["Logic", "Probability", "Search", "Optimization"], "answer": "Probability", "explanation": "Spam filters use probability to estimate the likelihood that an email is spam based on characteristics it has learned."}
    ],
    4: [
        {"question": "Optimization means?", "options": ["Making things work", "Finding the best solution", "Fixing errors", "Planning"], "answer": "Finding the best solution", "explanation": "Optimization is the process of finding the best solution among many possible options."},
        {"question": "What's a problem with Hill Climbing?", "options": ["It's too slow", "Can get stuck at local best", "Uses too much memory", "Doesn't work"], "answer": "Can get stuck at local best", "explanation": "Hill Climbing can get stuck at a local optimum and miss the global optimum."},
        {"question": "Simulated Annealing fixes Hill Climbing by?", "options": ["Going faster", "Sometimes accepting worse options", "Using more memory", "Random search"], "answer": "Sometimes accepting worse options", "explanation": "Simulated Annealing occasionally accepts worse solutions to escape local optima."},
        {"question": "CSP stands for?", "options": ["Computer Search Process", "Constraint Satisfaction Problem", "Code Search Protocol", "None"], "answer": "Constraint Satisfaction Problem", "explanation": "CSP refers to Constraint Satisfaction Problem—finding solutions that satisfy given constraints."},
        {"question": "Sudoku is an example of?", "options": ["Search", "Learning", "CSP", "Uncertainty"], "answer": "CSP", "explanation": "Sudoku is a Constraint Satisfaction Problem where you must place numbers satisfying certain constraints."}
    ],
    5: [
        {"question": "ML learns rules from?", "options": ["Programmers", "Examples/Data", "Random guesses", "Nothing"], "answer": "Examples/Data", "explanation": "Machine Learning learns rules and patterns from data rather than being explicitly programmed."},
        {"question": "Supervised learning requires?", "options": ["Unlabeled data", "Labeled data", "No data", "Computer"], "answer": "Labeled data", "explanation": "Supervised learning requires labeled training data (input-output pairs)."},
        {"question": "Unsupervised learning finds?", "options": ["Rules", "Patterns without labels", "Errors", "Nothing"], "answer": "Patterns without labels", "explanation": "Unsupervised learning finds patterns and structure in data without labels."},
        {"question": "Reinforcement learning uses?", "options": ["Data only", "Rewards and penalties", "Rules only", "Magic"], "answer": "Rewards and penalties", "explanation": "Reinforcement learning works through trial and error, using rewards for good actions and penalties for bad ones."},
        {"question": "Overfitting means?", "options": ["Too many features", "Model memorizes training data", "Not enough data", "Wrong algorithm"], "answer": "Model memorizes training data", "explanation": "Overfitting occurs when a model learns the training data too well and fails to generalize to new data."}
    ],
    6: [
        {"question": "Neural networks are inspired by?", "options": ["Computers", "The human brain", "Math", "Algorithms"], "answer": "The human brain", "explanation": "Neural networks are computing systems inspired by biological neural networks in the human brain."},
        {"question": "What does the input layer do?", "options": ["Processes data", "Outputs results", "Receives the data", "Learns"], "answer": "Receives the data", "explanation": "The input layer receives and initially processes the input data before passing it to hidden layers."},
        {"question": "What are weights?", "options": ["Measurements", "Numbers controlling importance of inputs", "Errors", "Outputs"], "answer": "Numbers controlling importance of inputs", "explanation": "Weights are numerical values that determine how much each input contributes to a neuron's output."},
        {"question": "Deep Learning uses?", "options": ["One layer", "Few layers", "Many hidden layers", "No layers"], "answer": "Many hidden layers", "explanation": "Deep Learning uses neural networks with many hidden layers (hence 'deep')."},
        {"question": "CNNs are best for?", "options": ["Text", "Image recognition", "Numbers", "Music"], "answer": "Image recognition", "explanation": "Convolutional Neural Networks (CNNs) are specifically designed for and excel at image recognition tasks."}
    ],
    7: [
        {"question": "NLP stands for?", "options": ["Network Language Protocol", "Natural Language Processing", "Neural Logic Program", "None"], "answer": "Natural Language Processing", "explanation": "NLP stands for Natural Language Processing, the field of AI focused on human language."},
        {"question": "Tokenization means?", "options": ["Creating tokens", "Splitting text into smaller units", "Encoding text", "Translating"], "answer": "Splitting text into smaller units", "explanation": "Tokenization is breaking text into words or other meaningful units for processing."},
        {"question": "Word embeddings represent words as?", "options": ["Symbols", "Numbers/Vectors", "Letters", "Sounds"], "answer": "Numbers/Vectors", "explanation": "Word embeddings represent words as numerical vectors where similar words are close together in space."},
        {"question": "LLM stands for?", "options": ["Language Learning Model", "Large Language Model", "Logical Language Model", "None"], "answer": "Large Language Model", "explanation": "LLM stands for Large Language Model—neural networks trained on vast amounts of text."},
        {"question": "Transformers process words?", "options": ["One at a time", "All at once (in parallel)", "Randomly", "In reverse"], "answer": "All at once (in parallel)", "explanation": "Transformers can process all words simultaneously in parallel, unlike earlier sequential models."}
    ],
    8: [
        {"question": "AI bias comes from?", "options": ["Bad programming", "Unfair or unrepresentative training data", "Users", "Nature"], "answer": "Unfair or unrepresentative training data", "explanation": "AI systems learn biases from biased training data, reflecting and amplifying existing inequalities."},
        {"question": "AI hallucination means?", "options": ["Random errors", "AI states wrong facts confidently", "Crashes", "Gives up"], "answer": "AI states wrong facts confidently", "explanation": "Hallucination is when an AI confidently generates false or fabricated information."},
        {"question": "Deepfakes use?", "options": ["Editing", "AI to generate fake videos/audio", "Actors", "None"], "answer": "AI to generate fake videos/audio", "explanation": "Deepfakes use AI (especially neural networks) to create realistic but false videos and audio."},
        {"question": "Transparency in AI means?", "options": ["Invisible code", "People should know when interacting with AI", "Making AI weak", "Hiding systems"], "answer": "People should know when interacting with AI", "explanation": "Transparency means users and stakeholders should be aware of and understand AI systems they encounter."},
        {"question": "Who is responsible when AI causes harm?", "options": ["Only developers", "Only companies", "Shared: developers, companies, and users", "Nobody"], "answer": "Shared: developers, companies, and users", "explanation": "Responsibility for AI harm is shared among developers, companies deploying AI, and users interacting with it."}
    ],
    9: [
        {"question": "Which concept does a chatbot use?", "options": ["Search", "NLP", "Uncertainty", "Optimization"], "answer": "NLP", "explanation": "Chatbots primarily use Natural Language Processing to understand and generate text."},
        {"question": "A story generator uses?", "options": ["Search", "Images", "Language Models", "Probability"], "answer": "Language Models", "explanation": "Story generators use language models trained on text to predict and generate sequences of words."},
        {"question": "Search Visualizer demonstrates?", "options": ["Databases", "Search Algorithms", "Graphics", "Networks"], "answer": "Search Algorithms", "explanation": "A search visualizer shows how different search algorithms explore and find solutions."},
        {"question": "What must every project include?", "options": ["Comments", "An ethical consideration", "Graphics", "Users"], "answer": "An ethical consideration", "explanation": "Every AI project should include thoughtful consideration of its ethical implications."},
        {"question": "Final reflection should cover?", "options": ["Code quality", "What surprised you about how AI works", "Performance", "Project size"], "answer": "What surprised you about how AI works", "explanation": "The final reflection should explore key insights and surprising discoveries about AI and its capabilities."}
    ]
}

# Create or update quiz files
for lecture_num, quiz_data in quizzes.items():
    quiz_path = os.path.join(base_path, f"lecture_{lecture_num}", "quiz.json")
    with open(quiz_path, "w") as f:
        json.dump(quiz_data, f, indent=2)
    print(f"Updated quiz for Lecture {lecture_num}")

print("Quiz files updated successfully!")
