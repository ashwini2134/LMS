import { Link, useParams } from "react-router-dom";

export default function ProjectPage() {

  const { slug, number } = useParams();

  const projectMap: any = {

    0: [
      {
        title: "Degrees",
        id: "degrees",
      },

      {
        title: "Tic-Tac-Toe",
        id: "tictactoe",
      },
    ],

    1: [
      {
        title: "Knights",
        id: "knights",
      },

      {
        title: "Minesweeper",
        id: "minesweeper",
      },
    ],

    2: [
      {
        title: "PageRank",
        id: "pagerank",
      },

      {
        title: "Heredity",
        id: "heredity",
      },
    ],

    3: [
      {
        title: "Crossword",
        id: "crossword",
      },
    ],

    4: [
      {
        title: "Shopping",
        id: "shopping",
      },

      {
        title: "Nim",
        id: "nim",
      },
    ],

    5: [
      {
        title: "Traffic",
        id: "traffic",
      },
    ],

    6: [
      {
        title: "Parser",
        id: "parser",
      },

      {
        title: "Attention",
        id: "attention",
      },
    ],
  };

  const projects = projectMap[number || 0] || [];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          Project {number}
        </h1>

        <p className="text-slate-400 mb-12 text-lg">
          Lecture {number} Project
        </p>

        <div className="grid gap-6">

          {projects.map((project: any) => (

            <Link
              key={project.id}
              to={`/course/${slug}/lecture/${number}/project/${project.id}`}
              className="
                flex items-center justify-between
                rounded-2xl
                border border-slate-700
                bg-slate-900
                hover:bg-slate-800
                transition-all
                p-6
              "
            >

              <div className="flex items-center gap-4">

                <div className="
                  w-12 h-12
                  rounded-xl
                  bg-blue-500/20
                  flex items-center justify-center
                  text-2xl
                ">
                  📄
                </div>

                <div>

                  <h2 className="text-2xl font-semibold">
                    {project.title}
                  </h2>

                </div>

              </div>

              <div className="text-slate-400 text-2xl">
                →
              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}