import { projects } from "@/lib/data/projects";

export default function ProjectsPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-10">
      <h1 className="text-2xl">
        Projektet - vetëm struktura, përmbajtja vjen më pas ({projects.length} të ngarkuara).
      </h1>
    </main>
  );
}
