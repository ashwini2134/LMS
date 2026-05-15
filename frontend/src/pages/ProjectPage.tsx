import { Link, useParams } from "react-router-dom";

export default function ProjectPage() {

  const { slug, number } = useParams();

  const projects: Record<string, string[]> = {

    "0": ["degrees", "tictactoe"],

    "1": ["knights", "minesweeper"],

    "2": ["pagerank", "heredity"],

    "3": ["crossword"],

    "4": ["shopping", "nim"],

    "5": ["traffic"],

    "6": ["parser", "questions"],
  };

  const lectureProjects =
    projects[number || "0"] || [];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Lecture {number} Projects
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        {lectureProjects.map((project) => (

          <Link
            key={project}

            // IMPORTANT
            to={`/course/${slug}/lecture/${number}/project/${project}`}

            className="
              rounded-2xl
              border border-slate-800
              bg-slate-900
              p-8
              hover:bg-slate-800
              transition
            "
          >

            <h2 className="text-2xl font-semibold capitalize">
              {project}
            </h2>

            <p className="mt-2 text-slate-400">
              Open coding workspace
            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}