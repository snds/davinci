import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@davinci/ui/components/ui/collapsible';
import { Button } from '@davinci/ui/components/ui/button';

export default {
  title: 'Components/Collapsible',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? '↑' : '↓'}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const FAQ = {
  render: () => {
    const [openItem, setOpenItem] = useState(null);

    const faqs = [
      {
        id: 'q1',
        question: 'What is a design system?',
        answer: 'A design system is a collection of reusable components, guidelines, and standards that teams use to build products consistently.',
      },
      {
        id: 'q2',
        question: 'How do I get started?',
        answer: 'Install the package, import the components you need, and follow the documentation for each component.',
      },
      {
        id: 'q3',
        question: 'Can I customize the components?',
        answer: 'Yes! All components are built with Tailwind CSS and support className overrides. You can also use CSS variables to change the theme.',
      },
    ];

    return (
      <div className="w-[450px] flex flex-col gap-2">
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItem === faq.id}
            onOpenChange={(open) => setOpenItem(open ? faq.id : null)}
            className="rounded-lg border"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium hover:bg-muted/50 transition-colors">
              {faq.question}
              <span className="text-muted-foreground">{openItem === faq.id ? '−' : '+'}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
};
