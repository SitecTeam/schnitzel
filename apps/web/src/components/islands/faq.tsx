import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import Typography from "../typography";

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
    <section className="flex w-full justify-center">
      <div className="z-20 mt-1 bg-secondary p-4 sm:p-8 lg:-mt-10 lg:w-[93%] lg:p-9 xl:-mt-10 2xl:-mt-20 2xl:w-[85%] 2xl:p-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="basis-2/5 text-center text-white sm:text-start xl:basis-[45%]">
            <Typography tag="h1" variant="h1" className="lg:-mt-2.5">
              FAQ
            </Typography>
            <Typography
              variant="body-xl"
              className="mt-6 w-full text-balance text-primary-foreground lg:min-w-70 xl:max-w-88"
            >
              Quick answers to the questions we get the most.
            </Typography>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="faq-1"
            className="w-full flex-1 space-y-4 lg:space-y-11 lg:justify-self-end"
          >
            {faqItems.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border-0">
                <AccordionTrigger className="min-h-15.25 w-full cursor-pointer items-center rounded-none bg-primary-foreground px-4 py-2 text-secondary uppercase hover:no-underline [&>svg]:hidden [&[data-state=open]>div>svg]:rotate-180">
                  <div className="flex w-full items-start justify-between gap-4">
                    <Typography variant="h5" tag="h5">
                      {item.question}
                    </Typography>
                    <ChevronDown className="size-8 shrink-0 text-secondary transition-transform duration-200 lg:mt-0.5 lg:size-9" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0 text-primary-foreground">
                  <Typography
                    variant="body-lg"
                    className="leading-tight text-pretty"
                  >
                    {item.answer}
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
