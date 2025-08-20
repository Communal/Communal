'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'What is communal shop for ?',
    answer:
      'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
  },
  {
    question: 'What is communal shop for ?',
    answer:
      'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
  },
  {
    question: 'What is communal shop for ?',
    answer:
      'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
  },
  {
    question: 'What is communal shop for ?',
    answer:
      'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
  },
  {
    question: 'What is communal shop for ?',
    answer:
      'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
  },
];

export default function FAQPage() {
  return (
    <div className='min-h-screen bg-[#fffaf0] flex flex-col'>
      <div className='bg-foreground px-4 pt-4 pb-2'>
        <div className='flex items-center'>
          <Link
            href='/'
            className='flex items-center bg-[#fffaf0] text-foreground font-bold rounded-xl px-4 py-2 text-lg mb-4'>
            <ChevronLeft className='mr-2' /> Home
          </Link>
        </div>
      </div>
      <main className='flex-1 px-4 py-6 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2 text-center'>
          FAQs
        </h1>
        <p className='text-lg text-foreground text-center mb-6 max-w-2xl'>
          Communal Shop is committed to delivering exceptional service,
          guaranteeing a safe and successful experience for our customers. Our
          platform empowers users to boost and grow their media presence,
          supporting all types of media accounts with confidence and
          reliability.
        </p>
        <Accordion.Root
          type='single'
          collapsible
          className='w-full max-w-2xl flex flex-col gap-4'>
          {faqs.map((faq, idx) => (
            <Accordion.Item
              key={idx}
              value={String(idx)}
              className='rounded-xl overflow-hidden border-2 border-foreground bg-[#fffaf0]'>
              <Accordion.Header>
                <Accordion.Trigger className='w-full flex items-center justify-between px-4 py-4 text-lg font-semibold focus:outline-none transition-colors text-foreground bg-[#fffaf0] data-[state=open]:bg-[#fffaf0] data-[state=open]:text-foreground'>
                  <span>{faq.question}</span>
                  <span>
                    <Plus className='transition-transform text-foreground data-[state=open]:rotate-45' />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className='AccordionContent bg-[#ddd] text-foreground px-4 py-4 text-base font-medium'>
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </main>
    </div>
  );
}
