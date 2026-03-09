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
    <section className="flex w-full justify-center px-4 lg:px-10">
      <div className="z-20 -mt-10 w-full max-w-380 bg-secondary p-6 sm:p-8 lg:p-9 2xl:-mt-20 2xl:p-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="basis-2/5 text-white xl:basis-[45%]">
            <Typography
              tag="h1"
              variant="h1"
              className="text-[72px] leading-[86px] lg:-mt-2.5"
            >
              FAQ
            </Typography>
            <Typography
              variant="body-xl"
              className="mt-6 w-full text-pretty text-primary-foreground lg:min-w-70 xl:max-w-88"
            >
              Quick answers to the questions we get the most.
            </Typography>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="faq-1"
            className="w-full flex-1 space-y-7 lg:space-y-11 lg:justify-self-end"
          >
            {faqItems.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border-0">
                <AccordionTrigger className="min-h-15.25 w-full cursor-pointer items-center rounded-none bg-primary-foreground px-4 py-2 text-secondary uppercase hover:no-underline [&>svg]:hidden [&[data-state=open]>div>svg]:rotate-180">
                  <div className="flex w-full items-center justify-between lg:gap-4">
                    <Typography variant="h5" tag="h5">
                      {item.question}
                    </Typography>
                    <ChevronDown className="size-9 shrink-0 text-secondary transition-transform duration-200 lg:mt-0.5" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0 text-primary-foreground lg:pt-4">
                  <Typography
                    variant="body-lg"
                    className="text-[16px] leading-[27px] text-pretty"
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
