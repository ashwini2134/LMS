import json
import os

BASE = r"c:\Users\priya\Downloads\LMS-main (2)\LMS-main\frontend\public\data\cs50ai"

def exp(title, body, bullets=None, accent="blue"):
    b = {"type": "explanation", "accentColor": accent, "title": title, "body": body}
    if bullets:
        b["bullets"] = bullets
    return b

def analogy(title, text, emoji=""):
    return {"type": "analogy", "title": title, "emoji": emoji, "text": text}

def viz(title, accent, left, center_label, center_text=None, flow_steps=None, code=None, output=None):
    center = {"label": center_label, "visualType": "flow_diagram" if flow_steps else "text",
              "flowSteps": flow_steps, "textContent": center_text}
    right = {"label": "Code Example", "code": code or "# See example above", "language": "python", "output": output or ""}
    return {"type": "concept_visualization", "title": title, "accentColor": accent,
            "leftPanel": left, "centerPanel": center, "rightPanel": right}

def refl(question, answer, code=None, output=None):
    r = {"type": "reflection", "question": question, "answer": answer}
    if code:
        r["followupCode"] = code
    if output:
        r["followupOutput"] = output
    return r

def code_ex(title, c, output):
    return {"type": "code_example", "title": title, "language": "python", "code": c, "expectedOutput": output}

def practice(title, instructions, starter, solution, hint):
    return {"type": "practice", "title": title, "instructions": instructions,
            "starterCode": starter, "solution": solution, "hint": hint}

def left_panel(emoji, title, desc):
    return {"label": "Real Life Analogy", "emoji": emoji, "title": title, "description": desc}

def write_lesson(num, data):
    path = os.path.join(BASE, f"lecture_{num}", "lesson.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Wrote {path}")

def write_quiz(num, data):
    path = os.path.join(BASE, f"lecture_{num}", "quiz.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Wrote {path}")

def write_problems(num, data):
    path = os.path.join(BASE, f"lecture_{num}", "problems.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Wrote {path}")

def lesson_meta(num, title, overview, minutes, next_up):
    return {
        "id": f"cs50ai-lecture-{num}",
        "courseSlug": "cs50ai",
        "number": num,
        "title": title,
        "overview": overview,
        "estimatedMinutes": minutes,
        "nextUp": next_up,
    }

def build_quiz_question(q_str):
    # Splits "Question? — Correct ✅ / Option 2 / Option 3 / Option 4"
    parts = q_str.split(" — ")
    q = parts[0]
    options_raw = parts[1].split(" / ")
    options = []
    answer = ""
    for opt in options_raw:
        if "✅" in opt:
            clean_opt = opt.replace("✅", "").strip()
            answer = clean_opt
            options.append(clean_opt)
        else:
            options.append(opt.strip())
    
    return {
        "question": q,
        "options": options,
        "answer": answer,
        "explanation": f"The correct answer is {answer}."
    }

# ----------------- WEEK 2 -----------------
lec2 = lesson_meta(2, "Knowledge & Logic", "Logic is how AI knows things — through rules and True/False statements, not common sense", 60, "Probability & Uncertainty")
lec2["sections"] = [
    {
        "id": "propositional-logic", "label": "Propositional Logic", "blocks": [
            exp("Propositional Logic", "Logic is how AI knows things — through rules and True/False statements, not common sense", [
                "Propositional logic uses statements that are either True or False",
                "AND — both sides must be True for result to be True",
                "OR — at least one side must be True",
                "NOT — reverses the value (NOT True = False)"
            ]),
            viz("Propositional Logic in Practice", "blue", 
                left_panel("🚦", "A traffic light", "Red means Stop (True), Green means Go (False for stop)"), 
                "Programming Concept", "AND / OR / NOT operators", 
                code="if raining and outside:\n    print('Get wet')"),
            refl("Is it true that AND returns True only when both sides are True?", "Yes, AND requires both conditions to be true.")
        ]
    },
    {
        "id": "knowledge-base", "label": "Knowledge Base & Inference", "blocks": [
            exp("Knowledge Base & Inference", "AI stores facts and rules in a Knowledge Base and uses Inference to derive new facts", [
                "A Knowledge Base is a collection of facts and rules AI uses to reason",
                "Inference means deriving new facts from existing ones",
                "IF-THEN rules: If it is raining AND I am outside, THEN I get wet",
                "Real-world uses: medical diagnosis systems, FAQ chatbots, Google Knowledge Panel"
            ]),
            viz("Inference Engine", "purple", 
                left_panel("🩺", "A doctor's rulebook", "if symptom A and symptom B then diagnosis C"), 
                "Programming Concept", "Knowledge Base + IF-THEN rules → Inference engine → Conclusion", 
                code="if fever and cough:\n    print('Possible flu')"),
            refl("Can AI figure out new facts just from existing rules without being told directly?", "Yes, that's exactly what inference is—deriving new facts logically.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("How AI Uses Logic", "Follow these steps to build a logical reasoning system.", [
                "Step 1: Define your facts — what is True and what is False in your world",
                "Step 2: Write IF-THEN rules — connect facts to conclusions",
                "Step 3: Build a Knowledge Base — store all facts and rules together",
                "Step 4: Run Inference — AI combines facts and rules to reach new conclusions"
            ]),
            viz("Inference Flow", "green", 
                left_panel("💡", "Systematic reasoning", "Combining rules and facts logically"), 
                "Flow Diagram", flow_steps=["Facts + Rules", "↓", "Knowledge Base", "↓", "Inference Engine", "↓", "New Conclusion"]),
            refl("Do you need to tell AI every possible answer, or can it figure some out from rules?", "It can figure out new answers using inference."),
            practice("Practice Exercise", "Write 3 IF-THEN rules about your daily life using AND/OR/NOT", "# Write your rules here\n", "# Example:\n# if alarm_rings and is_monday:\n#     print('Go to class')", "Use logical operators.")
        ]
    }
]
lec2["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "Logic uses True/False statements called propositions"},
        {"emoji": "", "text": "AND needs both sides True; OR needs at least one True; NOT reverses"},
        {"emoji": "", "text": "IF-THEN rules connect facts to conclusions"},
        {"emoji": "", "text": "A Knowledge Base stores all facts and rules AI uses"},
        {"emoji": "", "text": "Inference derives new facts from existing ones — like solving a puzzle"},
        {"emoji": "", "text": "Real uses: medical diagnosis, chatbots, Google Knowledge Panel"}
    ],
    "whatYouLearned": [
        "What propositional logic is and how it works",
        "How AND, OR, NOT operators work in logic",
        "What IF-THEN rules are and how to write them",
        "What a Knowledge Base is",
        "What inference means",
        "How AI uses logic in real-world applications"
    ],
    "nextUp": "Probability & Uncertainty"
}
lec2_quiz = [
    build_quiz_question("What is propositional logic? — Statements that are True or False ✅ / Statements that are numbers / Statements about probability / Statements about search"),
    build_quiz_question("AND returns True when? — Both sides are True ✅ / One side is True / Neither side is True / Always"),
    build_quiz_question("NOT True equals? — False ✅ / True / Maybe / Zero"),
    build_quiz_question("What is a Knowledge Base? — A collection of facts and rules ✅ / A database of images / A list of search results / A neural network"),
    build_quiz_question("Inference means? — Deriving new facts from existing facts ✅ / Searching for a path / Training on data / Predicting a number")
]
lec2_probs = [
    {"id": "logic_puzzle", "title": "Logic Puzzle", "description": "Given these 3 clues: (1) Alice has a cat or a dog. (2) Alice does not have a cat. (3) If Alice has a dog, she also has a fish. — Figure out what pets Alice has. Solve step by step using AND/OR/NOT.", "difficulty": "easy"},
    {"id": "daily_rules", "title": "Daily Rules", "description": "Write a Python program with 3 IF-THEN rules about daily life. Example: if alarm_rings and is_monday: print('Go to class'). Create your own 3 rules and test them.", "difficulty": "easy"}
]

# ----------------- WEEK 3 -----------------
lec3 = lesson_meta(3, "Probability & Uncertainty", "The real world is rarely certain — AI uses probability to handle situations that are not clearly True or False", 60, "Optimization")
lec3["sections"] = [
    {
        "id": "prob-basics", "label": "Probability Basics", "blocks": [
            exp("Probability Basics", "The real world is rarely certain — AI uses probability to handle situations that are not clearly True or False", [
                "Probability is a number between 0 and 1 showing how likely something is",
                "0 = impossible, 1 = certain, 0.7 = 70% likely",
                "Every day examples: 70% chance of rain, 50% chance of heads on a coin flip",
                "AI uses probability to make decisions even when it is not 100% sure"
            ]),
            viz("Probability Concept", "blue", 
                left_panel("🌤️", "Weather forecast", "70% chance of rain means likely but not certain"), 
                "Programming Concept", "Probability scale 0 → 1", 
                code="import random\nflip = random.random()\nif flip > 0.5:\n    print('Heads')"),
            refl("Is a probability of 0.9 more certain than a probability of 0.5?", "Yes, 0.9 means 90% likely, which is much more certain than 50% (0.5).")
        ]
    },
    {
        "id": "bayes-theorem", "label": "Conditional Probability & Bayes Theorem", "blocks": [
            exp("Conditional Probability & Bayes Theorem", "Conditional probability asks — what is the chance of X given that Y already happened? Bayes Theorem lets AI update its belief when new evidence arrives.", [
                "Conditional probability: P(A|B) — probability of A given B is already true",
                "Example: probability of wet roads given it rained = very high",
                "Bayes Theorem updates probability when new evidence arrives",
                "Spam filter example: AI updates its confidence that an email is spam as it reads more words"
            ]),
            viz("Bayes in Action", "purple", 
                left_panel("🏥", "A doctor updating their diagnosis", "as each new test result comes in"), 
                "Programming Concept", "Prior belief + New evidence → Updated belief", 
                code="# If email has 'free money' → increase spam probability"),
            refl("Does Bayes Theorem allow AI to change its mind when it gets new information?", "Yes, it provides a mathematical way to update beliefs based on new evidence.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("Steps for Probability", "Using probability in practice involves these steps.", [
                "Step 1: Assign a starting probability to your belief (prior)",
                "Step 2: Observe new evidence",
                "Step 3: Update your probability using Bayes Theorem",
                "Step 4: Make a decision based on the updated probability"
            ]),
            viz("Probability Flow", "green", 
                left_panel("🔄", "Updating Belief", "Iteratively refining confidence"), 
                "Flow Diagram", flow_steps=["Prior Belief", "↓", "New Evidence", "↓", "Bayes Update", "↓", "Updated Belief", "↓", "Decision"]),
            practice("Practice Exercise", "Flip a coin 10 times, record results, calculate actual probability of heads", "# Write your coin flip simulation or manually calculate\n", "# Actual heads / Total flips", "Count the heads and divide by 10.")
        ]
    }
]
lec3["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "Probability is a number between 0 (impossible) and 1 (certain)"},
        {"emoji": "", "text": "Real world decisions are rarely 100% certain — AI uses probability"},
        {"emoji": "", "text": "Conditional probability: chance of X given Y already happened"},
        {"emoji": "", "text": "Bayes Theorem updates probability when new evidence arrives"},
        {"emoji": "", "text": "Spam filters use probability to decide if an email is spam"},
        {"emoji": "", "text": "Weather forecasts, medical tests, and recommendations all use probability"}
    ],
    "whatYouLearned": [
        "What probability is on a 0 to 1 scale",
        "How to understand conditional probability",
        "How Bayes Theorem updates beliefs",
        "How spam filters use probability",
        "How to model real-world uncertainty"
    ],
    "nextUp": "Optimization"
}
lec3_quiz = [
    build_quiz_question("Probability of 0 means? — Impossible ✅ / Certain / Likely / Unknown"),
    build_quiz_question("Probability of 1 means? — Certain ✅ / Impossible / 50/50 / Unknown"),
    build_quiz_question("P(A|B) means? — Probability of A given B ✅ / A plus B / A minus B / A divided by B"),
    build_quiz_question("Bayes Theorem helps with? — Updating belief with new evidence ✅ / Finding shortest path / Training neural networks / Sorting data"),
    build_quiz_question("A spam filter uses which concept? — Probability ✅ / Search / Logic / Optimization")
]
lec3_probs = [
    {"id": "flip_coin", "title": "Flip a coin 20 times", "description": "Flip a coin 20 times (use random.random() in Python or physically flip). Record your results. Calculate: How many heads? What is the probability of heads in your experiment? Is it close to 0.5?", "difficulty": "easy"},
    {"id": "coin_sim", "title": "Python Coin Simulator", "description": "Write Python using the random module to simulate 100 coin flips. Count heads and tails. Print the probability of heads. Run it 3 times — does the result change?", "difficulty": "easy"}
]

# ----------------- WEEK 4 -----------------
lec4 = lesson_meta(4, "Optimization", "Optimization means finding the best solution among many possible options.", 60, "Machine Learning")
lec4["sections"] = [
    {
        "id": "what-is-optimization", "label": "What is Optimization & Hill Climbing", "blocks": [
            exp("What is Optimization & Hill Climbing", "Optimization means finding the best solution among many possible options. Hill Climbing is the simplest approach — always move toward a better nearby option.", [
                "Optimization = finding the best solution (cheapest, fastest, most accurate)",
                "Real example: finding the cheapest flight with fewest stops",
                "Hill Climbing: start somewhere, always step toward a better neighbor",
                "Problem: Hill Climbing can get stuck at a local best that is not the global best"
            ]),
            viz("Optimization Concept", "blue", 
                left_panel("⛰️", "Climbing a hill in thick fog", "you can only see one step ahead, always step upward"), 
                "Programming Concept", "Current state → Check neighbors → Move to best neighbor → Repeat", 
                code="best = max(neighbors)\ncurrent = best"),
            refl("Can Hill Climbing always find the absolute best solution?", "No, it can get stuck at a local best.")
        ]
    },
    {
        "id": "simulated-annealing", "label": "Simulated Annealing & Constraint Satisfaction", "blocks": [
            exp("Simulated Annealing & Constraint Satisfaction", "Simulated Annealing fixes Hill Climbing by occasionally accepting a worse option to escape being stuck. Constraint Satisfaction Problems have rules the solution must follow.", [
                "Simulated Annealing: sometimes accept a worse option — like shaking a puzzle to unstick pieces",
                "As time goes on, accept worse options less often (temperature cools down)",
                "CSP: a problem where the solution must satisfy a set of constraints (rules)",
                "CSP example: exam scheduling — no student should have two exams at the same time",
                "Sudoku is a classic CSP — every row, column, box must have digits 1-9 with no repeats"
            ]),
            viz("CSP Example", "purple", 
                left_panel("📅", "Exam timetable", "must schedule all exams so no student has a clash"), 
                "Programming Concept", "Variables + Domains + Constraints → Solution", 
                code="# Sudoku: each row must contain 1-9 with no repeats"),
            refl("Is Sudoku an example of a Constraint Satisfaction Problem?", "Yes, the digits must satisfy strict row, column, and box constraints.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("Optimization Steps", "How to optimize solutions.", [
                "Step 1: Define your problem — what are you trying to optimize?",
                "Step 2: Choose a starting solution",
                "Step 3: Check neighboring solutions — is any better?",
                "Step 4: Move to the better solution (Hill Climbing) or sometimes move to worse (Simulated Annealing)",
                "Step 5: Repeat until no improvement found"
            ]),
            viz("Optimization Flow", "green", 
                left_panel("🔄", "Iterative Improvement", "Checking neighbors"), 
                "Flow Diagram", flow_steps=["Start", "↓", "Evaluate", "↓", "Check Neighbors", "↓", "Better? Yes → Move / No → Done"]),
            practice("Practice Exercise", "Solve a simple Sudoku and write which constraint (rule) you used at each step", "# Write your notes\n", "# Notes here", "Follow row, column, and block constraints.")
        ]
    }
]
lec4["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "Optimization finds the best solution from many possible options"},
        {"emoji": "", "text": "Hill Climbing always moves toward a better nearby option"},
        {"emoji": "", "text": "Hill Climbing can get stuck at a local best — not always the global best"},
        {"emoji": "", "text": "Simulated Annealing escapes by occasionally accepting worse options"},
        {"emoji": "", "text": "CSP problems have constraints (rules) the solution must satisfy"},
        {"emoji": "", "text": "Sudoku, exam scheduling, and delivery routing are all optimization problems"}
    ],
    "whatYouLearned": [
        "What Optimization is",
        "How Hill Climbing and Simulated Annealing work",
        "What CSP means and how it applies to Sudoku",
        "How to define states and neighbors"
    ],
    "nextUp": "Machine Learning"
}
lec4_quiz = [
    build_quiz_question("Optimization means? — Finding the best solution ✅ / Finding any solution / Finding the first solution / Finding a random solution"),
    build_quiz_question("Hill Climbing always moves? — Toward a better neighbor ✅ / Randomly / Downward / To the start"),
    build_quiz_question("Hill Climbing's main problem? — Gets stuck at local best ✅ / Too slow / Uses too much memory / Cannot start"),
    build_quiz_question("Simulated Annealing fixes this by? — Sometimes accepting a worse option ✅ / Always accepting worse / Never accepting worse / Restarting"),
    build_quiz_question("Sudoku is an example of? — CSP ✅ / Search / Neural Network / Probability")
]
lec4_probs = [
    {"id": "simple_sudoku", "title": "Simple Sudoku", "description": "Solve this simple Sudoku (3x3 version — 9 cells, digits 1-3, each row and column must have 1, 2, 3 once each). Write which constraint you checked at each step.", "difficulty": "easy"},
    {"id": "hill_climbing_code", "title": "Hill Climbing Code", "description": "Write Python to find the maximum value in a list by checking neighbors one step at a time — simulate Hill Climbing. List: [2, 4, 6, 5, 3, 7, 4, 2]", "difficulty": "easy"}
]

# ----------------- WEEK 5 -----------------
lec5 = lesson_meta(5, "Machine Learning", "Machine Learning is AI that learns rules from examples instead of being told the rules directly.", 60, "Neural Networks")
lec5["sections"] = [
    {
        "id": "what-is-ml", "label": "What is Machine Learning & Supervised Learning", "blocks": [
            exp("What is Machine Learning & Supervised Learning", "Machine Learning is AI that learns rules from examples instead of being told the rules directly.", [
                "Traditional programming: rules + data = answers",
                "Machine Learning: data + correct answers = rules (AI figures out the rules itself)",
                "Supervised Learning: training with labeled examples — input + correct output given",
                "Classification: predict a category (spam or not spam, pass or fail)",
                "Regression: predict a number (house price, student score)"
            ]),
            viz("ML Concept", "blue", 
                left_panel("👶", "Showing a child flashcards", "with correct answers until they learn to recognize them"), 
                "Programming Concept", "Training data (input + label) → Model learns pattern → Predict new inputs", 
                code="# Input: email text, Label: spam/not spam\n# Model learns which words predict spam"),
            refl("In supervised learning, does AI need to be given the correct answers during training?", "Yes, supervised learning requires labeled data with correct answers to learn the patterns.")
        ]
    },
    {
        "id": "unsupervised-rl", "label": "Unsupervised & Reinforcement Learning", "blocks": [
            exp("Unsupervised & Reinforcement Learning", "Not all learning needs labels. Unsupervised learning finds patterns on its own. Reinforcement learning learns by trying and getting rewards.", [
                "Unsupervised Learning: finds patterns with no labels — grouping similar customers",
                "Clustering: grouping similar data points together automatically",
                "Reinforcement Learning: AI tries an action, gets a reward or penalty, learns over time",
                "Example: chess AI learns by playing millions of games — rewarded for winning",
                "Overfitting: model memorizes training data but fails on new data"
            ]),
            viz("Reinforcement Learning", "purple", 
                left_panel("🐕", "Training a dog", "reward for correct behavior, ignore wrong behavior"), 
                "Programming Concept", "Action → Environment → Reward → Update policy → Repeat", 
                code="# Chess AI: win = +1 reward, lose = -1 reward, learn from millions of games"),
            refl("Does reinforcement learning need labeled training data?", "No, it learns through trial and error using rewards and penalties instead of explicit labels.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("ML Steps", "The Machine Learning workflow.", [
                "Step 1: Collect data — gather examples of inputs and correct outputs",
                "Step 2: Clean data — remove errors, fill missing values",
                "Step 3: Train model — feed data to algorithm, it learns the pattern",
                "Step 4: Test model — give it new unseen data, check accuracy",
                "Step 5: Predict — use trained model on real-world inputs"
            ]),
            viz("ML Pipeline", "green", 
                left_panel("🔄", "Workflow", "Data to Predictions"), 
                "Flow Diagram", flow_steps=["Collect Data", "↓", "Clean", "↓", "Train", "↓", "Test", "↓", "Predict"]),
            practice("Practice Exercise", "Classify each example — Supervised / Unsupervised / Reinforcement: spam filter, Netflix recommendations, chess AI, customer grouping", "# Write your classifications\n", "# Example: spam filter -> Supervised", "Think about whether labels or rewards are present.")
        ]
    }
]
lec5["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "ML learns rules from data instead of being told rules directly"},
        {"emoji": "", "text": "Supervised learning uses labeled data — input + correct output"},
        {"emoji": "", "text": "Classification predicts categories; Regression predicts numbers"},
        {"emoji": "", "text": "Unsupervised learning finds patterns with no labels"},
        {"emoji": "", "text": "Reinforcement learning learns through rewards and penalties"},
        {"emoji": "", "text": "Overfitting is when a model memorizes data instead of learning the pattern"}
    ],
    "whatYouLearned": [
        "What ML is and the difference from traditional programming",
        "Supervised vs Unsupervised vs Reinforcement Learning",
        "What overfitting means",
        "The standard ML pipeline"
    ],
    "nextUp": "Neural Networks"
}
lec5_quiz = [
    build_quiz_question("ML learns rules from? — Examples and data ✅ / A programmer writing rules / Random guessing / Search algorithms"),
    build_quiz_question("Supervised learning requires? — Labeled data ✅ / No data / Unlabeled data / Rewards"),
    build_quiz_question("Unsupervised learning finds? — Patterns without labels ✅ / Labeled patterns / Rewards / Shortest paths"),
    build_quiz_question("Reinforcement learning uses? — Rewards and penalties ✅ / Labels / Rules / Probability only"),
    build_quiz_question("Overfitting means? — Model memorizes training data and fails on new data ✅ / Model learns too slowly / Model has too little data / Model is too simple")
]
lec5_probs = [
    {"id": "ml_flowchart", "title": "ML Workflow Flowchart", "description": "Draw the ML workflow as a flowchart — Collect Data → Clean → Train → Test → Predict. Add a one-line note at each step explaining what happens.", "difficulty": "easy"},
    {"id": "python_classifier", "title": "Simple Classifier", "description": "Write Python to classify a number entered by the user as Positive / Negative / Zero. This simulates a simple classifier.", "difficulty": "easy"}
]

# ----------------- WEEK 6 -----------------
lec6 = lesson_meta(6, "Neural Networks", "A neural network is a system of connected nodes inspired by how the human brain works.", 60, "Natural Language Processing")
lec6["sections"] = [
    {
        "id": "what-is-nn", "label": "What is a Neural Network", "blocks": [
            exp("What is a Neural Network", "A neural network is a system of connected nodes inspired by how the human brain works.", [
                "Human neurons pass electrical signals; AI nodes pass numbers",
                "Each node takes inputs, multiplies by weights, adds them up, produces output",
                "Layers: Input Layer (receives data) → Hidden Layers (processes) → Output Layer (gives result)",
                "Training adjusts weights over thousands of examples until outputs are correct"
            ]),
            viz("NN Concept", "blue", 
                left_panel("📝", "A team passing notes", "each person processes the note and passes to the next"), 
                "Programming Concept", "Input × Weight → Sum → Activation → Output", 
                code="output = (input1 * w1) + (input2 * w2)\nif output > 0.5:\n    print('Pass')"),
            refl("Does a neural network learn by adjusting its weights during training?", "Yes, adjusting weights reduces the error and trains the model.")
        ]
    },
    {
        "id": "deep-learning-cnns", "label": "Deep Learning & CNNs", "blocks": [
            exp("Deep Learning & CNNs", "Deep Learning uses neural networks with many hidden layers. CNNs are specialized for images.", [
                "Deep Learning = neural networks with many hidden layers",
                "More layers = ability to learn more complex patterns",
                "CNNs (Convolutional Neural Networks) — specialized for recognizing patterns in images",
                "Real-world uses: face unlock on phones, voice recognition (Alexa, Siri), medical image diagnosis",
                "Why neural networks need lots of data — more examples = better and more reliable learning"
            ]),
            viz("CNN Processing", "purple", 
                left_panel("👁️", "Your eye", "processes raw light → edges → shapes → objects in layers"), 
                "Programming Concept", "Image pixels → CNN layers → Pattern detection → Classification", 
                code="# CNN detects edges first, then shapes, then full objects"),
            refl("Do self-driving cars use neural networks to recognize what they see on the road?", "Yes, they use advanced CNNs to process camera feeds and detect objects.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("NN Steps", "Building a neural network.", [
                "Step 1: Define input — what data goes into the network (numbers, image pixels, text)",
                "Step 2: Set up layers — input layer, hidden layers, output layer",
                "Step 3: Initialize weights — start with random numbers",
                "Step 4: Train — feed examples, compare output to correct answer, adjust weights",
                "Step 5: Test — give new unseen data, measure accuracy"
            ]),
            viz("Layer Flow", "green", 
                left_panel("➡️", "Forward pass", "Data moving through layers"), 
                "Flow Diagram", flow_steps=["Input Layer", "↓", "Hidden Layer 1", "↓", "Hidden Layer 2", "↓", "Output Layer", "↓", "Prediction"]),
            practice("Practice Exercise", "Draw a simple 3-layer neural network for predicting if a student passes — inputs: attendance and marks", "# Draw/describe your network\n", "# Input layer (2 nodes) -> Hidden layer -> Output layer (1 node)", "Ensure nodes are connected.")
        ]
    }
]
lec6["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "Neural networks are inspired by how the human brain processes information"},
        {"emoji": "", "text": "Each node takes inputs, multiplies by weights, and produces an output"},
        {"emoji": "", "text": "Layers: Input → Hidden → Output"},
        {"emoji": "", "text": "Training adjusts weights until the network makes correct predictions"},
        {"emoji": "", "text": "Deep Learning uses many hidden layers for complex tasks"},
        {"emoji": "", "text": "CNNs specialize in image recognition — used in face unlock, medical scans"}
    ],
    "whatYouLearned": [
        "How a neural network is structured",
        "What Deep Learning and CNNs are",
        "The components of a network: layers, weights, nodes",
        "How networks are trained"
    ],
    "nextUp": "Natural Language Processing"
}
lec6_quiz = [
    build_quiz_question("Neural networks are inspired by? — The human brain ✅ / Search algorithms / Logic rules / Probability"),
    build_quiz_question("What does the input layer do? — Receives the data ✅ / Produces the answer / Adjusts weights / Stores rules"),
    build_quiz_question("Weights control? — How much each input matters ✅ / The number of layers / The training speed / The data size"),
    build_quiz_question("Deep Learning uses? — Many hidden layers ✅ / One layer only / No layers / Search trees"),
    build_quiz_question("CNNs are best for? — Image recognition ✅ / Text generation / Route planning / Logic problems")
]
lec6_probs = [
    {"id": "nn_diagram", "title": "Draw a 3-layer neural network", "description": "Draw a 3-layer neural network for predicting if a student passes. Inputs: attendance percentage and average marks. Output: Pass or Fail. Label all nodes and draw arrows showing the flow.", "difficulty": "easy"},
    {"id": "weighted_sum", "title": "Weighted Sum", "description": "Write Python to calculate a weighted sum of two inputs — simulate one neural network node. Input1 = 0.8 (attendance), Input2 = 0.9 (marks), Weight1 = 0.6, Weight2 = 0.4. Print the output.", "difficulty": "easy"}
]

# ----------------- WEEK 7 -----------------
lec7 = lesson_meta(7, "Natural Language Processing", "NLP is AI understanding, processing, and generating human language.", 60, "AI Ethics & Responsible Use")
lec7["sections"] = [
    {
        "id": "what-is-nlp", "label": "What is NLP & Tokenization", "blocks": [
            exp("What is NLP & Tokenization", "NLP is AI understanding, processing, and generating human language.", [
                "NLP = Natural Language Processing — AI working with human language",
                "Why language is hard for AI — same word can mean very different things depending on context",
                "Tokenization — splitting text into individual words or parts AI can process",
                "Bag of Words — representing text by counting how often each word appears"
            ]),
            viz("Tokenization", "blue", 
                left_panel("🧩", "Puzzle pieces", "Breaking a sentence into puzzle pieces before solving it"), 
                "Programming Concept", "Sentence → Tokenizer → [\"I\", \"love\", \"Python\"] → Count words", 
                code="words = 'I love Python'.split()\nprint(words)"),
            refl("Is tokenization the process of splitting text into smaller pieces AI can process?", "Yes, tokenization is exactly that.")
        ]
    },
    {
        "id": "word-embeddings", "label": "Word Embeddings & Large Language Models", "blocks": [
            exp("Word Embeddings & Large Language Models", "Word embeddings represent words as numbers. LLMs are very large neural networks trained on massive text.", [
                "Word Embeddings — words represented as numbers so AI can find similarities",
                "Word math: King - Man + Woman = Queen — AI can do this kind of reasoning",
                "Language Models predict the next word given the previous words",
                "LLMs (Large Language Models) — trained on massive text data (GPT, Gemini, Claude)",
                "Transformers — the architecture behind modern LLMs — processes all words at once"
            ]),
            viz("Word Embeddings Concept", "purple", 
                left_panel("📚", "Extremely well-read person", "who has read the entire internet"), 
                "Programming Concept", "Words → Numbers (vectors) → Similar words are close together on a map", 
                code="# 'king' - 'man' + 'woman' ≈ 'queen' in vector space"),
            refl("Do LLMs like ChatGPT predict the next word based on all the words before it?", "Yes, they predict the next most likely token based on their context and training.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("NLP Steps", "How text is processed by LLMs.", [
                "Step 1: Take raw text input from user",
                "Step 2: Tokenize — split into words or subwords",
                "Step 3: Convert tokens to numbers (word embeddings)",
                "Step 4: Feed into language model",
                "Step 5: Model predicts next token → generates output text"
            ]),
            viz("LLM Generation", "green", 
                left_panel("💬", "Text generation", "Creating intelligent text"), 
                "Flow Diagram", flow_steps=["Raw Text", "↓", "Tokenize", "↓", "Embeddings", "↓", "Language Model", "↓", "Generated Output"]),
            practice("Practice Exercise", "Ask ChatGPT the same question 3 different ways — write down how the answer changes each time", "# Notes on how ChatGPT responded\n", "# Observe differences in the answers", "See how minor wording changes affect the output.")
        ]
    }
]
lec7["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "NLP lets AI understand and generate human language"},
        {"emoji": "", "text": "Tokenization splits text into pieces AI can process"},
        {"emoji": "", "text": "Bag of Words counts word frequency to represent text"},
        {"emoji": "", "text": "Word embeddings place words in number space — similar words are close together"},
        {"emoji": "", "text": "LLMs are trained on massive text and predict the next word"},
        {"emoji": "", "text": "Transformers process all words at once — powering GPT, Gemini, Claude"}
    ],
    "whatYouLearned": [
        "What NLP is and how it processes language",
        "Tokenization, Word Embeddings, and Transformers",
        "How LLMs predict text generation"
    ],
    "nextUp": "AI Ethics & Responsible Use"
}
lec7_quiz = [
    build_quiz_question("NLP stands for? — Natural Language Processing ✅ / Neural Layer Processing / Network Language Program / None"),
    build_quiz_question("Tokenization means? — Splitting text into smaller units ✅ / Translating text / Encrypting text / Summarizing text"),
    build_quiz_question("Word embeddings represent words as? — Numbers/Vectors ✅ / Images / Rules / Probabilities only"),
    build_quiz_question("LLM stands for? — Large Language Model ✅ / Logical Learning Machine / Linear Layer Model / None"),
    build_quiz_question("Transformers process words? — All at once in parallel ✅ / One at a time / Randomly / Backwards only")
]
lec7_probs = [
    {"id": "chatgpt_questions", "title": "Ask ChatGPT", "description": "Ask ChatGPT the same question in 3 different ways. Write the question, all 3 versions, and note how the answer changed. What made the best answer — being specific, giving context, or asking differently?", "difficulty": "easy"},
    {"id": "tokenizer_code", "title": "Tokenize sentence", "description": "Write Python to tokenize a sentence (split into words) and count how many times each word appears. Input: 'the cat sat on the mat the cat'", "difficulty": "easy"}
]

# ----------------- WEEK 8 -----------------
lec8 = lesson_meta(8, "AI Ethics & Responsible Use", "AI can be unfair and invasive if not built carefully. Bias and privacy are two of the biggest ethical challenges.", 60, "Final Project")
lec8["sections"] = [
    {
        "id": "ai-bias", "label": "AI Bias & Privacy", "blocks": [
            exp("AI Bias & Privacy", "AI can be unfair and invasive if not built carefully. Bias and privacy are two of the biggest ethical challenges.", [
                "AI Bias — when training data reflects unfairness, AI inherits and amplifies it",
                "Example: a hiring AI trained on historical male-dominated data may reject female applicants unfairly",
                "Privacy — AI systems collect and process massive amounts of personal data",
                "Your data (searches, clicks, location) is used to train and improve AI systems"
            ]),
            viz("Bias Concept", "blue", 
                left_panel("⚖️", "Learning from one group", "If you only learn from one group of people, your opinions will be skewed"), 
                "Programming Concept", "Biased data → Biased model → Unfair predictions", 
                code="# If training data has 90% male engineers, model may rate males higher"),
            refl("Can AI be unfair even if no one intentionally programmed it to be unfair?", "Yes, because it learns biases inherently present in the training data.")
        ]
    },
    {
        "id": "hallucinations-deepfakes", "label": "Hallucinations, Deepfakes & Accountability", "blocks": [
            exp("Hallucinations, Deepfakes & Accountability", "AI can generate false information confidently and create fake media. Accountability asks who is responsible when AI causes harm.", [
                "AI Hallucinations — AI confidently stating things that are factually wrong",
                "Why hallucinations happen — model predicts plausible-sounding text, not verified facts",
                "Deepfakes — AI-generated fake videos or audio that can spread misinformation",
                "Transparency — people should always know when they are interacting with AI",
                "Accountability — who is responsible when AI makes a harmful decision?",
                "Fairness — AI should perform equally well for all groups of people"
            ]),
            viz("Hallucination Concept", "purple", 
                left_panel("🙋", "Confident student", "who makes up answers they do not know"), 
                "Programming Concept", "LLM predicts next word → sounds correct → may be factually wrong", 
                code="# Always verify AI outputs — especially for medical, legal, financial topics"),
            refl("Should you always verify important facts that an AI gives you?", "Absolutely, because AI can confidently hallucinate incorrect information.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("Ethical Steps", "How to use AI ethically.", [
                "Step 1: Always verify AI outputs before using them — especially for important decisions",
                "Step 2: Check if training data is diverse and representative",
                "Step 3: Be transparent — tell users when AI is involved",
                "Step 4: Assign accountability — define who is responsible for AI decisions",
                "Step 5: Report harmful AI uses — do not misuse AI tools"
            ]),
            viz("Responsible Use Flow", "green", 
                left_panel("🛡️", "Ethical workflow", "Ensuring AI is safe"), 
                "Flow Diagram", flow_steps=["Use AI", "↓", "Verify Output", "↓", "Check for Bias", "↓", "Be Transparent", "↓", "Assign Accountability"]),
            practice("Practice Exercise", "Find a real news story about AI causing harm — identify which ethical issue it relates to and write 3 sentences", "# Write your summary\n", "# Discuss bias, privacy, or hallucination", "Look up recent AI news.")
        ]
    }
]
lec8["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "AI bias comes from unfair or unrepresentative training data"},
        {"emoji": "", "text": "Privacy is at risk when AI collects and processes personal data"},
        {"emoji": "", "text": "AI hallucinations are confident but factually wrong statements"},
        {"emoji": "", "text": "Deepfakes use AI to generate convincing fake videos and audio"},
        {"emoji": "", "text": "Transparency means people should know when AI is involved"},
        {"emoji": "", "text": "Accountability asks who is responsible when AI causes harm"}
    ],
    "whatYouLearned": [
        "What AI Bias and Hallucinations are",
        "The danger of Deepfakes and Misinformation",
        "Why Transparency and Accountability are important",
        "How to use AI safely and responsibly"
    ],
    "nextUp": "Final Project"
}
lec8_quiz = [
    build_quiz_question("AI bias comes from? — Unfair or unrepresentative training data ✅ / Too much data / Fast computers / Large models"),
    build_quiz_question("AI hallucination means? — AI states wrong facts confidently ✅ / AI crashes / AI slows down / AI forgets data"),
    build_quiz_question("Deepfakes use AI to? — Generate fake videos and audio ✅ / Speed up videos / Translate videos / Store videos"),
    build_quiz_question("Transparency in AI means? — People should know when interacting with AI ✅ / AI should be invisible / AI should be free / AI should be fast"),
    build_quiz_question("Who is responsible when AI causes harm? — Developers, companies, and users share responsibility ✅ / Only the user / Only the company / No one")
]
lec8_probs = [
    {"id": "ai_harm_news", "title": "News story about AI", "description": "Find one real news story about AI causing harm (bias, hallucination, deepfake, or privacy issue). Write: What happened? Which ethical issue does it relate to? What could have been done differently?", "difficulty": "easy"},
    {"id": "medical_ai_debate", "title": "Medical decisions debate", "description": "Discussion — Should AI be allowed to make medical decisions without a doctor confirming them? Write your reasoning in 5 sentences. Consider: accuracy, accountability, patient safety, and trust.", "difficulty": "easy"}
]

# ----------------- WEEK 9 -----------------
lec9 = lesson_meta(9, "Final Project", "You have completed the full CS50 AI journey. This week you will apply everything to build a real project.", 60, None)
lec9["sections"] = [
    {
        "id": "what-learned", "label": "What You Have Learned", "blocks": [
            exp("What You Have Learned", "You have completed the full CS50 AI journey — from Search to Language. This week you will apply everything to build a real project.", [
                "Week 0: Search — BFS, DFS, A* — AI finding paths and solutions",
                "Week 1: Knowledge & Logic — IF-THEN rules, inference, knowledge base",
                "Week 2: Uncertainty — probability, Bayes Theorem, spam filters",
                "Week 3: Optimization — Hill Climbing, Simulated Annealing, CSP",
                "Week 4: Machine Learning — supervised, unsupervised, reinforcement",
                "Week 5: Neural Networks — layers, weights, deep learning, CNNs",
                "Week 6: NLP — tokenization, embeddings, LLMs, transformers",
                "Week 7: Ethics — bias, privacy, hallucinations, accountability"
            ]),
            viz("CS50 AI Journey", "blue", 
                left_panel("👨‍🍳", "Cooking a meal", "You have learned all the ingredients — now it is time to cook a full meal"), 
                "Programming Concept", "All 8 weeks of AI concepts → Applied in one real project", 
                code="# Your project will use at least one AI concept from this course"),
            refl("Is the final project a chance to apply what you have learned to a real problem?", "Yes, it combines the theories into an actual application.")
        ]
    },
    {
        "id": "choose-project", "label": "Choose Your Project", "blocks": [
            exp("Choose Your Project", "Choose one of the 4 project options. Each uses a different AI concept from the course.", [
                "Option 1: AI Chatbot — uses NLP and prompt engineering to answer questions on a topic",
                "Option 2: AI Story Generator — user gives characters and setting; AI generates a short story",
                "Option 3: AI Resume Builder — user inputs details; AI formats and generates a professional resume",
                "Option 4: Search Visualizer — a diagram or slide showing how BFS and DFS solve the same maze differently"
            ]),
            viz("Project Options", "purple", 
                left_panel("🎓", "Final exam project", "pick the one that interests you most"), 
                "Programming Concept", "Choose concept → Define input/output → Build → Reflect → Present", 
                code="# Chatbot: input = user question, output = AI answer"),
            refl("Should your project clearly show which AI concept from the course it uses?", "Yes, clearly identifying the AI mechanism is a key requirement.")
        ]
    },
    {
        "id": "getting-started", "label": "Getting Started", "blocks": [
            exp("Project Steps", "Follow these steps to complete the project.", [
                "Step 1: Choose your project from the 4 options",
                "Step 2: Identify which AI concept it uses (search, ML, NLP, etc.)",
                "Step 3: Define input — what does the user provide?",
                "Step 4: Define output — what does the AI produce?",
                "Step 5: Identify one ethical consideration relevant to your project",
                "Step 6: Write a short reflection — what surprised you about how AI actually works?"
            ]),
            viz("Project Workflow", "green", 
                left_panel("🚀", "Building phase", "Executing your plan"), 
                "Flow Diagram", flow_steps=["Choose Project", "↓", "Define Input/Output", "↓", "Build", "↓", "Add Ethical Consideration", "↓", "Reflect", "↓", "Submit"]),
            practice("Practice Exercise", "Write a project plan: project name, AI concept used, input, output, ethical consideration", "# Outline your plan here\n", "# E.g. Name: Chatbot, Concept: NLP", "Fill in all the required project elements.")
        ]
    }
]
lec9["summary"] = {
    "keyTakeaways": [
        {"emoji": "", "text": "You have completed 8 weeks of AI concepts — Search, Logic, Probability, Optimization, ML, Neural Networks, NLP, Ethics"},
        {"emoji": "", "text": "The final project applies your learning to a real AI-powered application"},
        {"emoji": "", "text": "Every project must show which AI concept it uses"},
        {"emoji": "", "text": "Define clear input and output for your project"},
        {"emoji": "", "text": "Every project must include one ethical consideration"},
        {"emoji": "", "text": "Reflection is as important as the code — think about what surprised you"}
    ],
    "whatYouLearned": [
        "What AI, ML, and Deep Learning are and how they differ",
        "How AI searches for solutions using BFS, DFS, and A*",
        "How AI uses logic, probability, and optimization",
        "How Machine Learning and Neural Networks work",
        "How NLP and LLMs understand and generate language",
        "How to identify and address ethical issues in AI"
    ],
    "nextUp": None
}
lec9_quiz = [
    build_quiz_question("Which AI concept does a chatbot use? — NLP ✅ / Search / Optimization / Logic only"),
    build_quiz_question("A story generator uses which technique? — Language Models ✅ / BFS / CSP / Probability only"),
    build_quiz_question("Search Visualizer demonstrates? — Search Algorithms ✅ / Neural Networks / NLP / Ethics"),
    build_quiz_question("Every project must include? — An ethical consideration ✅ / A neural network / Supervised learning / A database"),
    build_quiz_question("The final reflection should cover? — What surprised you about how AI actually works ✅ / Your grade / Your code length / Your time spent")
]
lec9_probs = [
    {"id": "project_plan", "title": "Write project plan", "description": "Write your full project plan — Project name, which AI concept it uses, what input the user gives, what output the AI produces, one ethical consideration, and one thing you expect to learn by building it", "difficulty": "easy"},
    {"id": "ethics_plan", "title": "Ethical consideration", "description": "Write one ethical consideration for your chosen project and explain in 3 sentences how you would address it responsibly", "difficulty": "easy"}
]

if __name__ == "__main__":
    weeks_data = [
        (2, lec2, lec2_quiz, lec2_probs),
        (3, lec3, lec3_quiz, lec3_probs),
        (4, lec4, lec4_quiz, lec4_probs),
        (5, lec5, lec5_quiz, lec5_probs),
        (6, lec6, lec6_quiz, lec6_probs),
        (7, lec7, lec7_quiz, lec7_probs),
        (8, lec8, lec8_quiz, lec8_probs),
        (9, lec9, lec9_quiz, lec9_probs)
    ]
    for w in weeks_data:
        num, lesson, quiz, probs = w
        write_lesson(num, lesson)
        write_quiz(num, quiz)
        write_problems(num, probs)
    print("Done generating weeks 2-9!")
