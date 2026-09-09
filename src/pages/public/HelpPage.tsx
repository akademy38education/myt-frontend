import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FAQS, type Faq } from "@/constants/faqs";
import { delay } from "@/utils/delay";

const CATEGORIES: Array<Faq["category"] | "All"> = ["All", "Students", "Parents", "Tutors", "Payments", "Bookings", "Technical"];

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Please add a few more details"),
});
type ContactInput = z.infer<typeof contactSchema>;

export function HelpPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = category === "All" || faq.category === category;
      const matchesQuery =
        faq.question.toLowerCase().includes(query.toLowerCase()) || faq.answer.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async () => {
    // No backend `support` endpoint exists yet — this simulates the round
    // trip so the workflow is fully wired end-to-end and easy to swap for a
    // real `supportService.submit(...)` call once one exists.
    await delay(600);
    toast.success("Thanks — we've received your message and will reply by email.");
    reset();
  });

  return (
    <div>
      <Hero eyebrow="Help centre" title="How can we help?" description="Search common questions or get in touch with our team." size="compact" />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <SearchInput value={query} onChange={setQuery} placeholder="Search for help..." className="mb-6" />
        <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <TabsList className="mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <EmptyState title="No results found" description="Try a different search term, or contact support below." />
        ) : (
          <Accordion type="single" collapsible>
            {filtered.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-lg px-4">
          <SectionHeading title="Still need help?" description="Send us a message and we'll get back to you by email." />
          <Card>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={4} {...register("message")} aria-invalid={Boolean(errors.message)} />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
