'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';
import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

type AccordionRootProps = Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, 'value' | 'onValueChange'>;

export const GridAccordions = forwardRef<HTMLDivElement, AccordionRootProps>(
  function GridAccordions(props, ref) {
    const {
      className,
      children,
      defaultValue,
      type = 'single',
      ...restProps
    } = props;

    const [internalValue, setInternalValue] = useState<string | string[] | undefined>(defaultValue);

    useEffect(() => {
      const id = window.location.hash.substring(1);
      if (id.length > 0) {
        if (type === 'single') {
          setInternalValue(id);
        } else {
          setInternalValue((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [id, ...prevArray];
          });
        }
      }
    }, [type]);

    if (type === 'single') {
      return (
        <motion.div
          className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden border-[0.75px] border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={cn(
            "size-full bg-repeat bg-[length:50px_50px]",
            "bg-square-pattern-light dark:bg-square-pattern"
          )}>
            <div className="size-full bg-gradient-to-b from-neutral-900 to-black">
              <AccordionPrimitive.Root
                ref={ref}
                type="single"
                collapsible
                value={typeof internalValue === 'string' ? internalValue : undefined}
                onValueChange={(val: string) => setInternalValue(val)}
                className={cn(
                  'divide-y divide-white/10 bg-transparent',
                  className
                )}
                {...restProps}
              >
                {children}
              </AccordionPrimitive.Root>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden border-[0.75px] border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={cn(
          "size-full bg-repeat bg-[length:50px_50px]",
          "bg-square-pattern-light dark:bg-square-pattern"
        )}>
          <div className="size-full bg-gradient-to-b from-neutral-900 to-black">
            <AccordionPrimitive.Root
              ref={ref}
              type="multiple"
              value={Array.isArray(internalValue) ? internalValue : []}
              onValueChange={(val: string[]) => setInternalValue(val)}
              className={cn(
                'divide-y divide-white/10 bg-transparent',
                className
              )}
              {...restProps}
            >
              {children}
            </AccordionPrimitive.Root>
          </div>
        </div>
      </motion.div>
    );
  }
);

type AccordionItemProps = Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, 'value'> & {
  title: string;
};

export const GridAccordion = forwardRef<HTMLDivElement, AccordionItemProps>(
  function GridAccordion(props, ref) {
    const { title, className, id, children, ...restProps } = props;

    return (
      <AccordionPrimitive.Item
        ref={ref}
        value={id ?? title}
        className={cn('group/accordion relative', className)}
        {...restProps}
      >
        <AccordionPrimitive.Header
          id={id}
          className="not-prose flex flex-row items-center font-medium text-white"
        >
          <AccordionPrimitive.Trigger
            className="flex flex-1 items-center gap-2 p-4 md:p-6 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-colors hover:bg-white/5"
          >
            <ChevronRight
              className="-ms-1 h-4 w-4 shrink-0 text-white/70 transition-transform duration-300 ease-out group-data-[state=open]/accordion:rotate-90"
            />
            <span className="font-semibold text-xl md:text-2xl tracking-tight">{title}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content
          className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        >
          <div className="text-white/70 p-4 md:p-6 pt-0 prose-no-margin text-sm md:text-base leading-relaxed">
            {children}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);