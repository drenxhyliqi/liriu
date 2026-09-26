import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Kushtet e Përdorimit | NSH LIRIU",
  description: "Kushtet për përdorimin e faqes së NSH LIRIU.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Kushtet e Përdorimit"
      intro="Duke përdorur këtë faqe, pranoni kushtet e mëposhtme."
      sections={[
        {
          heading: "Përdorimi i faqes",
          body: [
            "Faqja ofron informacion rreth shërbimeve dhe produkteve të NSH LIRIU. Ajo nuk duhet përdorur për qëllime të paligjshme ose në mënyrë që të cenojë funksionimin e saj.",
          ],
        },
        {
          heading: "Kërkesat për ofertë",
          body: [
            "Shporta dhe faqja e porosisë janë kërkesa për ofertë, jo blerje. Asnjë pagesë nuk kryhet në faqe, dhe një kërkesë nuk përbën kontratë derisa të konfirmohet nga NSH LIRIU.",
          ],
        },
        {
          heading: "Përmbajtja",
          body: [
            "Përmbajtja e faqes është informuese dhe mund të ndryshojë pa njoftim. Logot, tekstet dhe imazhet i përkasin NSH LIRIU dhe nuk lejohet ripërdorimi pa leje.",
          ],
        },
        {
          heading: "Ndryshimet",
          body: ["Mund t'i përditësojmë këto kushte herë pas here. Versioni i publikuar në këtë faqe është ai në fuqi."],
        },
      ]}
    />
  );
}
