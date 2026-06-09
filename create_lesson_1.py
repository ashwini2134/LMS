import json
import os

base_path = r"c:\Users\priya\Downloads\LMS-main (2)\LMS-main\frontend\public\data\cs50ai"

def create_lesson_structure(lecture_num, title, topics_data):
    """Generate lesson.json structure for a lecture"""
    
    # Build sections
    sections = [
        {
            "id": "overview",
            "label": "Overview",
            "blocks": [
                {
                    "type": "explanation",
                    "accentColor": "blue",
                    "title": "In This Lecture You Will Learn",
                    "body": f"Welcome! By the end of this lecture you'll understand the core concepts of {title}.",
                    "bullets": topics_data["learning_outcomes"]
                },
                {
                    "type": "text",
                    "content": topics_data["overview_text"]
                }
            ]
        }
    ]
    
    # Add topic sections
    for i, topic in enumerate(topics_data["topics"]):
        section = {
            "id": f"topic_{i}",
            "label": topic["title"],
            "blocks": [
                {
                    "type": "explanation",
                    "accentColor": "blue" if i % 2 == 0 else "purple",
                    "title": topic["title"],
                    "body": topic["explanation"]
                },
                {
                    "type": "analogy",
                    "title": f"Think of it as: {topic['analogy_title']}",
                    "emoji": "",
                    "text": topic["analogy_text"]
                },
                {
                    "type": "concept_visualization",
                    "title": f"{topic['title']} Explained",
                    "accentColor": "blue" if i % 2 == 0 else "purple",
                    "leftPanel": {
                        "label": "Real Life Analogy",
                        "emoji": "",
                        "title": topic["analogy_title"],
                        "description": topic["analogy_description"]
                    },
                    "centerPanel": {
                        "label": "AI Concept",
                        "visualType": "text_box",
                        "content": topic["concept_content"]
                    },
                    "rightPanel": {
                        "label": "Real Examples",
                        "code": topic["examples_code"],
                        "language": "python",
                        "output": topic["examples_output"]
                    }
                },
                {
                    "type": "reflection",
                    "question": topic["reflection_question"],
                    "answer": topic["reflection_answer"],
                    "followupCode": topic["followup_code"],
                    "followupOutput": topic["followup_output"]
                }
            ]
        }
        sections.append(section)
    
    # Add summary section
    sections.append({
        "id": "summary",
        "label": "Summary",
        "blocks": [
            {
                "type": "text",
                "content": topics_data["summary_text"]
            }
        ]
    })
    
    # Create full lesson object
    lesson = {
        "id": f"cs50ai-lecture-{lecture_num}",
        "courseSlug": "cs50ai",
        "number": lecture_num,
        "title": title,
        "overview": topics_data["overview"],
        "estimatedMinutes": topics_data["estimated_minutes"],
        "sections": sections,
        "summary": {
            "keyTakeaways": topics_data["key_takeaways"],
            "whatYouLearned": topics_data["what_you_learned"],
            "nextUp": topics_data["next_up"]
        }
    }
    
    return lesson

# Lecture data definitions
lectures_definitions = {
    1: {
        "title": "Search Algorithms",
        "overview": "Search is one of the foundational problems in AI. You'll learn how agents navigate from a start state to a goal state using algorithms like BFS, DFS, and A*.",
        "estimated_minutes": 55,
        "overview_text": "Search problems involve an agent moving from an initial state to reach a goal state. From maze-solving to GPS navigation to game-playing, search is everywhere in AI.",
        "learning_outcomes": [
            "What a search problem is and how to model it",
            "Uninformed search: BFS (Breadth-First Search) and DFS (Depth-First Search)",
            "Informed search: Greedy Best-First and A* Search",
            "How heuristics improve search efficiency",
            "When to use which search algorithm"
        ],
        "topics": [
            {
                "title": "Search Problems & State Space",
                "explanation": "A **search problem** consists of an initial state, possible actions, a goal state, and path costs. An **agent** moves through a **state space** (all possible configurations) to find a path from start to goal.",
                "analogy_title": "Navigating a Maze",
                "analogy_text": "Imagine in a maze. Your current position is your state. The walls define which actions (movements) are valid. You want to find a path from entrance to exit.",
                "analogy_description": "Each position is a state, walls limit actions, finding a path is the solution",
                "concept_content": "State Space = All possible configurations\nInitial State = Starting point\nGoal State = Destination\nActions = What you can do in each state\nPath Cost = How expensive a solution is",
                "examples_code": "# GPS Navigation\n# Start: Current location\n# Goal: Destination\n# Actions: Follow roads\n# Path Cost: Distance/time",
                "examples_output": "Search algorithms find: Shortest route!",
                "reflection_question": "If you want the fastest route (not shortest distance), what would be different?",
                "reflection_answer": "The path cost would change. Instead of measuring distance, you'd measure time accounting for traffic.",
                "followup_code": "# Distance-based search:\n# Path cost = total distance\n\n# Time-based search:\n# Path cost = total travel time",
                "followup_output": "Different costs = Different solutions"
            },
            {
                "title": "BFS & DFS: Uninformed Search",
                "explanation": "**BFS (Breadth-First Search)** explores all neighbors at the current distance before moving further. **DFS (Depth-First Search)** explores one branch fully before backtracking. These are 'uninformed' because they don't use knowledge about the goal location.",
                "analogy_title": "Shopping in Stores vs. Exploring Rooms",
                "analogy_text": "BFS is like checking every store on Floor 1 before going to Floor 2. DFS is like going deep into one hallway, exploring all side rooms before backtracking.",
                "analogy_description": "BFS: systematic level-by-level exploration. DFS: deep exploration before backtracking.",
                "concept_content": "BFS:\n• Uses a queue (FIFO)\n• Finds shortest path\n• More memory\n\nDFS:\n• Uses a stack (LIFO)\n• Less memory\n• Doesn't guarantee shortest",
                "examples_code": "from collections import deque\n\n# BFS\nqueue = deque([start])\nwhile queue:\n    node = queue.popleft()\n\n# DFS  \nstack = [start]\nwhile stack:\n    node = stack.pop()",
                "examples_output": "BFS: 1-2-3-4 (level by level)\nDFS: 1-2-4-3 (deep then back)",
                "reflection_question": "Which is better: BFS or DFS?",
                "reflection_answer": "It depends! BFS finds shortest paths but uses more memory. DFS uses less memory but might not find the shortest. Choose based on your problem.",
                "followup_code": "# Maze with BFS: Finds shortest path\n# Tree exploration with DFS: Less memory\n# Choose based on needs!",
                "followup_output": "No single 'best' search!"
            },
            {
                "title": "A* Search: Informed Search",
                "explanation": "**A* Search** combines actual cost `g(n)` (how far you've traveled) with estimated cost `h(n)` (how far to the goal). It's 'informed' because it uses a heuristic—knowledge about the goal. A* is optimal when using an admissible heuristic.",
                "analogy_title": "A Good GPS",
                "analogy_text": "GPS doesn't just explore blindly. It considers how far you've already driven AND estimates distance to destination. That's why it finds good routes quickly.",
                "analogy_description": "Real GPS uses both: distance traveled + estimated distance remaining",
                "concept_content": "A* Formula: f(n) = g(n) + h(n)\n\ng(n) = Actual cost from start to n\nh(n) = Estimated cost from n to goal\n\nChoose node with LOWEST f(n) value",
                "examples_code": "# A* for GPS:\ng_n = miles_driven_so_far\nh_n = straight_line_to_destination\nf_n = g_n + h_n\n\n# Always pick lowest f(n)",
                "examples_output": "A*: Optimal + Fast!",
                "reflection_question": "What makes a good heuristic for A*?",
                "reflection_answer": "A good heuristic never overestimates. It's tight (close to reality) but never too high. For GPS, straight-line distance is a good heuristic because you can't go in a straight line through buildings.",
                "followup_code": "# Good heuristic: Never overestimates\n# Example for pathfinding:\n# Manhattan distance (moves on grid)\n# Straight-line distance (Euclidean)",
                "followup_output": "Good heuristics = Better A*"
            }
        ],
        "summary_text": "## Key Takeaways\n\n- **Search Problems**: Move from start to goal through a state space\n- **BFS**: Level-by-level, guarantees shortest path, uses more memory\n- **DFS**: Deep exploration, less memory, doesn't guarantee shortest\n- **A* Search**: Uses heuristic to find optimal path efficiently\n- **When to use which**: Depends on your problem constraints\n\n## You Now Know\n\n- How to model a problem as a search problem\n- The difference between BFS and DFS\n- Why heuristics are valuable in search\n- How A* combines cost and heuristic for optimal solutions\n- Real-world applications like GPS navigation\n\n## Next Steps\n\nNow that you understand how AI finds solutions, let's explore how AI **represents knowledge** and **reasons about the world** using logic. Next lecture: Knowledge & Logic!",
        "key_takeaways": [
            {"emoji": "", "text": "Search problems move from initial state to goal state"},
            {"emoji": "", "text": "BFS explores level-by-level and finds shortest paths"},
            {"emoji": "", "text": "DFS goes deep first and uses less memory"},
            {"emoji": "", "text": "A* combines cost and heuristic for optimal solutions"},
            {"emoji": "", "text": "Choice of algorithm depends on problem constraints"},
            {"emoji": "", "text": "Search powers GPS, game AI, and many AI applications"}
        ],
        "what_you_learned": [
            "How to model problems as search problems",
            "The difference between BFS and DFS",
            "How heuristics improve search efficiency",
            "How A* achieves optimal solutions",
            "When to choose which search algorithm",
            "Real-world applications of search in AI"
        ],
        "next_up": "Knowledge & Logic"
    }
}

# Create lecture 1 first as example
lesson_1 = create_lesson_structure(1, lectures_definitions[1]["title"], lectures_definitions[1])
lesson_1_path = os.path.join(base_path, "lecture_1", "lesson.json")
with open(lesson_1_path, "w") as f:
    json.dump(lesson_1, f, indent=2)
print("Created lesson.json for Lecture 1")
