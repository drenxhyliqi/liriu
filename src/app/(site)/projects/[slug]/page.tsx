import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="flex flex-1 items-center justify-center p-10">
      <h1 className="text-2xl">{project.name} - vetëm struktura, përmbajtja vjen më pas.</h1>
    </main>
  );
}
