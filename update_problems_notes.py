import json
import os

base_path = r"c:\Users\priya\Downloads\LMS-main (2)\LMS-main\frontend\public\data\cs50ai"

# Problems for each lecture
problems_data = {
    1: [
        {"id": "maze_bfs_trace", "title": "Trace BFS Through a Maze", "description": "Given a printed grid maze, trace the path that BFS would take:\n\nMaze (S = start, G = goal, # = wall, . = open path):\nS . . # .\n# . # . .\n. . . . G\n\nYour task: Mark each cell in the order BFS would visit it.\nHint: BFS uses a queue (FIFO). Process nodes in discovery order.", "difficulty": "Easy", "type": "activity"},
        {"id": "graph_neighbors", "title": "Graph Representation", "description": "Write Python code to represent a simple graph as a dictionary and print all neighbors of a given node.\n\nExample graph:\ngraph = {'A': ['B', 'C'], 'B': ['A', 'D']...}\n\nYour program should:\n1. Define a graph\n2. Ask for a node name\n3. Print all neighbors\n4. Handle non-existent nodes\n\nSample Input: B\nSample Output: Neighbors of B: A, D", "difficulty": "Easy", "type": "coding"}
    ],
    2: [
        {"id": "logic_puzzle", "title": "Logic Puzzle Solver", "description": "Given 3 logical clues, figure out who owns the pet:\n\nClue 1: Alice OR Bob owns the dog\nClue 2: Bob owns the dog AND has a cat\nClue 3: NOT Alice owns a cat\n\nUsing AND, OR, NOT logic, determine: Who owns what pet?\n\nNo code needed—write your reasoning using logical operators.", "difficulty": "Easy", "type": "activity"},
        {"id": "if_then_rules", "title": "IF-THEN Rules", "description": "Write Python if/else statements that simulate 3 IF-THEN rules:\n\nRule 1: If it is raining AND I am outside, THEN I get wet\nRule 2: If I have an umbrella, THEN I don't get wet\nRule 3: If I get wet, THEN I go inside\n\nCreate a program that:\n1. Asks the user for conditions (raining, outside, umbrella)\n2. Applies the IF-THEN rules\n3. Prints the consequences\n\nSample: \"It's raining and I'm outside without umbrella\" → \"You get wet!\"", "difficulty": "Easy", "type": "coding"}
    ],
    3: [
        {"id": "coin_flip_probability", "title": "Coin Flip Probability", "description": "Flip a coin 10 times (or use a random number generator):\n\n1. Record the results (Heads or Tails)\n2. Count how many Heads and Tails\n3. Calculate the actual probability: (# Heads) / (# Flips)\n4. Compare to theoretical probability (0.5)\n\nNo code required—do this manually or with a simple calculator.\n\nQuestion: Is your result close to 0.5? Why might it differ?", "difficulty": "Easy", "type": "activity"},
        {"id": "coin_flip_simulator", "title": "Probability Simulator", "description": "Write Python to simulate 100 coin flips and calculate the probability of heads:\n\n1. Use the random module (random.choice() or random.random())\n2. Simulate 100 coin flips\n3. Count heads and tails\n4. Calculate probability = heads / 100\n5. Print the result and compare to 0.5\n\nSample Output:\nHeads: 48, Tails: 52\nProbability of heads: 0.48\n\nRun it multiple times—notice probability varies!", "difficulty": "Easy", "type": "coding"}
    ],
    4: [
        {"id": "sudoku_solver", "title": "Solve a Simple Sudoku", "description": "Solve a simple 4x4 Sudoku puzzle and identify which constraint you used at each step:\n\n1 . | . 2\n. . | 3 .\n----+----\n2 . | . 1\n. 4 | . .\n\nConstraints:\n- Each row must have 1, 2, 3, 4\n- Each column must have 1, 2, 3, 4\n- Each 2x2 box must have 1, 2, 3, 4\n\nFor each number you fill in, write which constraint led you to that decision.", "difficulty": "Easy", "type": "activity"},
        {"id": "hill_climbing", "title": "Hill Climbing Algorithm", "description": "Write Python to find the maximum value in a list using hill climbing:\n\n1. Start at a random position in the list\n2. Look at neighbors (left and right)\n3. If a neighbor is higher, move to it\n4. Repeat until no neighbor is higher\n5. Print the maximum found\n\nExample list: [2, 5, 1, 8, 3, 7, 4]\n\nNote: This might not find the global maximum! Try different starting positions.", "difficulty": "Easy", "type": "coding"}
    ],
    5: [
        {"id": "ml_classification", "title": "Classify Learning Types", "description": "Classify each example as Supervised, Unsupervised, or Reinforcement Learning:\n\n1. Email spam filter - learns from labeled spam/not spam examples\n2. Netflix movie recommendations - groups similar movies together\n3. Chess AI - improves by playing games and getting scores\n4. Facial recognition - trained on labeled faces\n5. Customer segmentation - groups customers by similar behavior\n\nWrite your answers with brief explanations for each.", "difficulty": "Easy", "type": "activity"},
        {"id": "simple_classifier", "title": "Number Classifier", "description": "Write Python to classify numbers as positive, negative, or zero:\n\n1. Create a simple classifier function\n2. Ask the user for a number\n3. Classify it using if/elif/else\n4. Test with 5 different numbers\n\nSample:\nInput: -5\nOutput: This is a negative number!\n\nExtension: Can you 'train' a classifier to improve over time by learning from examples?", "difficulty": "Easy", "type": "coding"}
    ],
    6: [
        {"id": "neural_net_diagram", "title": "Draw a Neural Network", "description": "Draw a 3-layer neural network for predicting if a student passes:\n\nInputs: attendance (0-100), marks (0-100)\nOutput: Pass (1) or Fail (0)\n\nYour diagram should show:\n1. Input layer (2 neurons)\n2. Hidden layer (3-5 neurons)\n3. Output layer (1 neuron)\n4. Connections between layers (edges)\n5. Weights on some edges (example: w=0.5)\n\nThen describe: How would training adjust these weights?", "difficulty": "Easy", "type": "activity"},
        {"id": "weighted_sum", "title": "Neural Network Node", "description": "Write Python to calculate a weighted sum of two inputs (simulate one neural network node):\n\n1. Take two input values: input1, input2\n2. Take two weights: weight1, weight2\n3. Calculate: output = (input1 * weight1) + (input2 * weight2)\n4. Add a bias: output = output + bias\n5. Apply activation (just print if positive)\n\nExample:\ninput1=0.5, input2=0.8\nweight1=0.3, weight2=0.6\nbias=0.1\noutput = (0.5*0.3) + (0.8*0.6) + 0.1 = ?", "difficulty": "Easy", "type": "coding"}
    ],
    7: [
        {"id": "chatgpt_variations", "title": "ChatGPT Question Variations", "description": "Ask ChatGPT (or Claude) the same question 3 different ways:\n\nQuestion topic: \"What is machine learning?\"\n\nVersion 1: \"What is machine learning?\"\nVersion 2: \"Explain machine learning like I'm 5 years old\"\nVersion 3: \"Machine learning is...?\" (incomplete prompt)\n\nWrite down:\n- How each answer differs\n- Which version was most helpful\n- Why the AI might respond differently\n\nThis shows how NLP systems understand context and phrasing!", "difficulty": "Easy", "type": "activity"},
        {"id": "tokenization", "title": "Text Tokenization", "description": "Write Python to tokenize a sentence and count word frequencies:\n\n1. Ask user for a sentence\n2. Split into words (tokens)\n3. Count how many times each word appears\n4. Print word frequencies\n\nExample:\nInput: \"The cat sat on the mat\"\nTokens: ['The', 'cat', 'sat', 'on', 'the', 'mat']\nFrequencies: {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}\n\nExtension: Remove common words (the, is, a) before counting!", "difficulty": "Easy", "type": "coding"}
    ],
    8: [
        {"id": "ai_ethics_analysis", "title": "AI Ethics Case Study", "description": "Find a real news story about AI causing harm or controversy:\n\n1. Summarize the story (3-4 sentences)\n2. Identify the ethical issue(s):\n   - Bias? Privacy? Accountability? Transparency? Misinformation?\n3. Who was harmed and why?\n4. How could developers have prevented this?\n\nExample topics: facial recognition bias, data privacy breaches, autonomous vehicle accidents.", "difficulty": "Easy", "type": "activity"},
        {"id": "medical_ai_ethics", "title": "Medical AI Ethics Discussion", "description": "Debate: Should AI be allowed to make medical decisions without a doctor confirming them?\n\nWrite 5 sentences exploring:\n1. Arguments FOR AI making autonomous medical decisions\n2. Arguments AGAINST\n3. What safeguards would you require?\n\nConsider:\n- Accuracy vs. human oversight\n- Speed vs. reliability\n- Cost vs. safety\n- Fairness and bias\n- Patient autonomy\n\nWhat's your conclusion?", "difficulty": "Easy", "type": "activity"}
    ],
    9: [
        {"id": "choose_project", "title": "Choose Your Capstone Project", "description": "Choose one AI project and write a plan:\n\nOptions:\n1. AI Chatbot - converses on a topic\n2. AI Story Generator - creates short stories\n3. AI Resume Builder - suggests improvements\n4. Search Visualizer - visualizes search algorithms\n\nFor your choice, describe:\n- What AI concept(s) it uses\n- What input the user gives\n- What output the AI produces\n- Example: \"Chatbot uses NLP. User: 'Tell me a joke'. AI: jokes!\"", "difficulty": "Easy", "type": "activity"},
        {"id": "ethics_consideration", "title": "Project Ethics", "description": "Write an ethical consideration for your chosen project:\n\nConsider:\n1. Bias: Could your AI system be biased? Against whom?\n2. Privacy: What data does it need? How is it protected?\n3. Fairness: Is your AI fair to all users?\n4. Transparency: Do users know they're interacting with AI?\n5. Misuse: How could your system be misused?\n\nExample for Chatbot:\n\"My chatbot could spread misinformation if trained on biased sources. I'll verify facts before deployment.\"", "difficulty": "Easy", "type": "activity"}
    ]
}

# Notes for each lecture
notes_data = {
    0: "# Lecture 0: Introduction to AI\n\nWelcome to CS50's Introduction to Artificial Intelligence! In this first lecture, we explore what AI is, how it relates to Machine Learning and Deep Learning, and where you encounter AI in your daily life. We'll also look at real-world examples and set the stage for the exciting AI concepts you'll learn throughout this course.\n\nLearn the foundational concepts that will support everything else you study about AI!",
    1: "# Lecture 1: Search Algorithms\n\nSearch is how AI systems solve problems: finding a sequence of actions from a starting point to a goal. From GPS navigation to maze solving to game playing, search algorithms are fundamental to AI. This lecture covers BFS, DFS, and advanced search techniques like A*.\n\nMaster the art of intelligent problem-solving!",
    2: "# Lecture 2: Knowledge & Logic\n\nKnowledge representation and logical reasoning form the foundation of intelligent systems. This lecture explores propositional logic, knowledge bases, and how AI systems draw inferences from known facts.\n\nLearn how AI thinks logically about the world.",
    3: "# Lecture 3: Probability & Uncertainty\n\nThe real world is full of uncertainty. This lecture covers probability theory, conditional probability, and Bayes' Theorem—the mathematical tools AI uses to reason about uncertainty and make predictions with incomplete information.\n\nUnderstand how AI handles what it doesn't know.",
    4: "# Lecture 4: Optimization\n\nOptimization is about finding the best solution among many options. From scheduling exams to solving Sudoku, this lecture covers techniques like hill climbing, simulated annealing, and constraint satisfaction.\n\nLearn how AI finds the best way to solve problems.",
    5: "# Lecture 5: Machine Learning\n\nMachine Learning enables AI systems to improve from experience. This lecture covers supervised learning, unsupervised learning, and reinforcement learning—the three paradigms that power modern AI.\n\nDiscover how AI learns from data.",
    6: "# Lecture 6: Neural Networks\n\nNeural Networks are computing systems inspired by biological neural networks. This lecture covers how neurons work, network architectures, and deep learning—the breakthrough technology behind modern AI.\n\nExplore the brain-inspired models powering today's AI.",
    7: "# Lecture 7: Natural Language Processing\n\nNatural Language Processing (NLP) enables computers to understand and generate human language. This lecture covers tokenization, embeddings, language models, and the technology behind chatbots and LLMs like GPT.\n\nLearn how AI understands human language.",
    8: "# Lecture 8: AI Ethics & Responsible Use\n\nAs AI becomes more powerful, ethical considerations become crucial. This lecture covers AI bias, privacy, hallucinations, deepfakes, and the responsibilities of AI developers.\n\nExplore the responsible development of AI systems.",
    9: "# Lecture 9: Final Project\n\nBring together everything you've learned in this course. Choose from four capstone projects: an AI Chatbot, Story Generator, Resume Builder, or Search Visualizer. Each project demonstrates mastery of multiple AI concepts.\n\nCreate your own AI application!"
}

# Create problem files
for lecture_num, problems in problems_data.items():
    problems_path = os.path.join(base_path, f"lecture_{lecture_num}", "problems.json")
    with open(problems_path, "w") as f:
        json.dump(problems, f, indent=2)
    print(f"Created problems for Lecture {lecture_num}")

# Create notes files
for lecture_num, notes_content in notes_data.items():
    notes_path = os.path.join(base_path, f"lecture_{lecture_num}", "notes.md")
    with open(notes_path, "w") as f:
        f.write(notes_content)
    print(f"Created notes for Lecture {lecture_num}")

print("\nAll problems and notes files created successfully!")
