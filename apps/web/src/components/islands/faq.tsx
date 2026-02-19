import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    id: "faq-1",
    question: "How often do new episodes come out?",
    answer:
      "We release a new episode every week, usually on Mondays — perfect for your warm-up drive to the crag.",
  },
  {
    id: "faq-2",
    question: "Where can I listen to the Schnitzel Show?",
    answer:
      "You can listen on the Podbean platform and watch full episodes on YouTube. New episodes are published on both every week.",
  },
  {
    id: "faq-3",
    question: "Can I recommend a guest for the show?",
    answer:
      "Absolutely. If you know someone with a great story to share, send us your recommendation through the contact page. We’re always excited to discover new voices.",
  },
  {
    id: "faq-4",
    question: "Do you accept sponsors or collaborations?",
    answer:
      "Yes. We’re open to partnerships that align with our values and community. If you’re interested in sponsoring or collaborating, reach out via the contact form and we’ll be in touch.",
  },
];

const Faq = () => {
  return (
    <section className="w-full max-w-376.5 bg-secondary p-4 sm:p-8 lg:p-12 xl:p-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1">
          <h2 className="text-center text-5xl leading-none font-bold text-white uppercase sm:text-start">
            FAQ
          </h2>
          <p className="mt-6 text-2xl leading-8 text-balance text-primary-foreground lg:min-w-70 xl:max-w-88 xl:min-w-88">
            Quick answers to the questions we get the most.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-1"
          className="w-full space-y-4 lg:max-w-178.5 lg:space-y-9 lg:justify-self-end"
        >
          {faqItems.map(item => (
            <AccordionItem key={item.id} value={item.id} className="border-0">
              <AccordionTrigger className="h-auto min-h-17.5 w-full items-center rounded-none bg-primary-foreground px-4 py-4 text-left text-lg leading-none font-bold text-secondary uppercase hover:no-underline lg:text-2xl [&>svg]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex w-full items-start justify-between gap-4">
                  <span className="leading-tight lg:mt-0.5">
                    {item.question}
                  </span>
                  <ChevronDown className="size-6 shrink-0 text-secondary transition-transform duration-200 lg:size-9" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 pb-0 text-primary-foreground lg:text-xl">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
