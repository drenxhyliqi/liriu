import { Loader } from "@/components/ui/loader";

export default function ProductsLoading() {
  return (
    <main className="flex min-h-[60svh] flex-1 items-center justify-center px-6">
      <Loader />
    </main>
  );
}
