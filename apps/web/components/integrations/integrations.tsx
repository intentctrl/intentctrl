"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FullWidthDivider } from "@/components/common/full-width-divider";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";

type LogoType = {
  src: string;
  alt: string;
};

type TileData = {
  row: number;
  col: number;
  logo?: LogoType;
};

export function IntegrationsSection() {
  return (
    <section
      className="relative mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center scroll-mt-20"
      id="integrations"
    >
      <FullWidthDivider className="-top-px" />

      {/* Left Content */}
      <motion.div
        className="p-4 md:p-6"
        initial={{ opacity: 0, translateY: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, translateY: 0, filter: "blur(0px)" }}
      >
        <div className="space-y-4">
          <TextAnimate
            animation="slideUp"
            as="h2"
            by="word"
            className="font-medium text-2xl text-foreground tracking-tight md:text-3xl lg:text-4xl"
            duration={0.6}
            once
            startOnView
          >
            No integrations yet.
          </TextAnimate>
          <TextAnimate
            animation="slideUp"
            as="p"
            by="word"
            className="text-muted-foreground text-sm md:text-base"
            delay={0.3}
            duration={0.6}
            once
            startOnView
          >
            We're focused on getting the core runtime right before bolting on connectors.
          </TextAnimate>
          <TextAnimate
            animation="slideUp"
            as="p"
            by="word"
            className="text-muted-foreground text-sm md:text-base"
            delay={0.6}
            duration={0.6}
            once
            startOnView
          >
            Third-party integrations are on the roadmap.
          </TextAnimate>
        </div>
      </motion.div>

      {/* Right Content - Visual */}
      <motion.div
        className="place-items-end"
        initial="hidden"
        whileInView="show"
        variants={{
          hidden: { opacity: 1 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        <div className="relative size-60 sm:size-80 [--cell:48px] sm:[--cell:64px] perspective-midrange">
          {/* Grid Background */}
          <div
            className={cn(
              "absolute inset-0 size-full",
              "bg-[linear-gradient(to_right,theme(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,theme(--color-border)_1px,transparent_1px)]",
              "bg-size-[48px_48px] sm:bg-size-[64px_64px]",
              "mask-[radial-gradient(ellipse_at_center,black,black,transparent)]",
            )}
          />

          {tiles.map((tile) => (
            <IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
          ))}
        </div>
      </motion.div>

      <FullWidthDivider position="bottom" />
    </section>
  );
}

function IntegrationCard({ row, col, logo }: TileData) {
  return (
    <motion.div
      className={cn("absolute flex size-12 sm:size-16 items-center justify-center", logo ? "bg-secondary/40" : "")}
      style={{
        left: `calc(var(--cell, 64px) * ${col})`,
        top: `calc(var(--cell, 64px) * ${row})`,
      }}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 },
      }}
      whileHover={{ scale: 1, rotateY: 180, transition: { type: "spring", stiffness: 200, damping: 15 } }}
      transition={{ duration: 0.5 }}
    >
      {logo && (
        <Image
          alt={logo.alt}
          className="pointer-events-none size-8 select-none object-contain p-1"
          height={32}
          src={logo.src}
          width={32}
        />
      )}
    </motion.div>
  );
}

const tiles: TileData[] = [];
