import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Politika e Cookies | NSH LIRIU",
  description: "Çfarë ruan faqja e NSH LIRIU në pajisjen tuaj dhe si mund ta kontrolloni.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politika e Cookies"
      intro="Cookies dhe ruajtja lokale janë skedarë të vegjël që faqja ruan në shfletuesin tuaj."
      sections={[
        {
          heading: "Çfarë përdorim",
          body: [
            "Të domosdoshme: ruajmë shportën e kërkesës për ofertë dhe zgjedhjen tuaj për cookies në ruajtjen lokale të shfletuesit. Pa to faqja nuk funksionon siç duhet dhe nuk kërkojnë pëlqim.",
            "Analitika: nëse e pranoni, përdorim Vercel Web Analytics për të numëruar vizitat e faqeve në mënyrë të përmbledhur. Nuk vendos cookies, nuk ju identifikon personalisht dhe nuk aktivizohet pa pëlqimin tuaj. Nuk përdorim asnjë shërbim reklamues.",
          ],
        },
        {
          heading: "Si t'i kontrolloni",
          body: [
            "Mund ta ndryshoni zgjedhjen në çdo kohë me lidhjen \"Preferencat e cookies\" në fund të faqes. Mund t'i fshini të dhënat edhe nga cilësimet e shfletuesit.",
          ],
        },
      ]}
    />
  );
}
