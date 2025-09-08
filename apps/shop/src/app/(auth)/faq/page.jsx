'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronLeft, Plus } from 'lucide-react';
import BackHome from '@/components/Home';

// const faqs = [
//   {
//     question: 'What is communal shop for ?',
//     answer:
//       'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
//   },
//   {
//     question: 'What is communal shop for ?',
//     answer:
//       'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
//   },
//   {
//     question: 'What is communal shop for ?',
//     answer:
//       'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
//   },
//   {
//     question: 'What is communal shop for ?',
//     answer:
//       'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
//   },
//   {
//     question: 'What is communal shop for ?',
//     answer:
//       'Among the listed accounts for sale, the buyer can make an offer price for the elected account. The offer will be negotiated with the seller by an agency and it gets accepted, the buyer will get access over the account once the payment is done.',
//   },
// ];

const faqs = [
  {
    question: 'What is Communal One?',
    answer: 'Communal One is an online store where you can find practical and easy-to-read eBooks on a variety of topics.',
  },
  {
    question: 'What kind of eBooks do you sell?',
    answer: 'We provide digital eBooks covering useful guides, tutorials, and knowledge-packed resources to help you learn and grow in different areas.',
  },
  {
    question: 'How do I get my eBook after purchase?',
    answer: 'As soon as your payment is complete, you’ll receive an instant download link on the website and a copy will also be sent to your email.',
  },
  {
    question: 'Are your eBooks beginner-friendly?',
    answer: 'Yes, our eBooks are written in simple, clear language that makes it easy for anyone to understand, no matter their experience level.',
  },
  {
    question: 'What devices can I read the eBooks on?',
    answer: 'Our eBooks are in PDF format, which means you can open and read them on your phone, tablet, or computer.',
  },
  {
    question: 'Do you keep your eBooks updated?',
    answer: 'Yes, we review and update our guides regularly to make sure the information stays relevant and accurate.',
  },
  {
    question: 'What if I have issues with my purchase?',
    answer: 'You can reach out to our support team through email or our help section. We’ll get back to you as quickly as possible.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Since our products are digital and instantly delivered, all sales are final. But we make sure every eBook is packed with value.',
  },
  {
    question: 'Can I buy more than one eBook?',
    answer: 'Of course! You can add as many as you like to your cart, and if bundles are available you’ll save more by purchasing together.',
  },
  {
    question: 'Why should I choose Communal One?',
    answer: 'We make learning simple and practical. Our eBooks are affordable, beginner-friendly, and focused on giving you real value you can use right away.',
  },
];


export default function FAQPage() {
  return (
    <div className='min-h-screen bg-[#fffaf0] flex flex-col'>
      <div className=' px-4 pt-2 pb-2'>
        <BackHome />
      </div>
      <main className='flex-1 px-4 py-6 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2 text-center'>
          FAQs
        </h1>
        {/* <p className='text-lg text-foreground text-jus mb-6 max-w-2xl'>
          Communal Shop is committed to delivering exceptional service,
          guaranteeing a safe and successful experience for our customers. Our
          platform empowers users to boost and grow their media presence,
          supporting all types of media accounts with confidence and
          reliability.
        </p> */}
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
