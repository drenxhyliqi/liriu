import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Politika e Privatësisë | NSH LIRIU",
  description: "Si i trajton NSH LIRIU të dhënat personale që merr përmes kësaj faqeje.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politika e Privatësisë"
      intro="Kjo politikë shpjegon çfarë të dhënash mbledhim kur përdorni këtë faqe dhe si i përdorim ato."
      sections={[
        {
          heading: "Të dhënat që mbledhim",
          body: [
            "Kur dërgoni formularin e kontaktit ose një kërkesë për ofertë nga shporta, mbledhim të dhënat që na jepni vetë, si emri, të dhënat e kontaktit dhe përmbajtja e mesazhit ose e kërkesës.",
          ],
        },
        {
          heading: "Si i përdorim",
          body: [
            "I përdorim këto të dhëna vetëm për t'iu përgjigjur mesazhit ose kërkesës suaj dhe për t'ju ofruar shërbimet e kërkuara. Nuk i shesim të dhënat tuaja.",
          ],
        },
        {
          heading: "Ruajtja dhe të drejtat tuaja",
          body: [
            "I ruajmë të dhënat për aq kohë sa është e nevojshme për qëllimin e mësipërm ose sa kërkon ligji. Keni të drejtë të kërkoni qasje, korrigjim ose fshirje të të dhënave tuaja, sipas legjislacionit në fuqi.",
          ],
        },
        {
          heading: "Cookies",
          body: ["Për cookies shihni Politikën e Cookies."],
        },
        {
          heading: "Kontakti",
          body: ["Për çdo pyetje rreth të dhënave tuaja, na kontaktoni përmes faqes Kontakt."],
        },
      ]}
    />
  );
}
