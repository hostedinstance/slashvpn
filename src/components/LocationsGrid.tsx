"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type IconType = React.ElementType;

export interface LocationItem {
  id: string;
  icon: IconType;
  flagCode: string;
  title: string;
  description: string;
}

export interface CountryItem {
  id: string;
  name: string;
  flagCode: string;
}

export interface LocationsGridProps {
  mainLocations: LocationItem[];
  upcomingCountries: CountryItem[];
  sectionTitle?: React.ReactNode;
  sectionSubtitle?: React.ReactNode;
  className?: string;
}

export const LocationsGrid: React.FC<LocationsGridProps> = ({
                                                              mainLocations,
                                                              upcomingCountries,
                                                              sectionTitle,
                                                              sectionSubtitle,
                                                              className,
                                                            }) => {
  if (!mainLocations || mainLocations.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("py-20 md:py-24 bg-black", className)}
      role="region"
      aria-label="Server Locations"
    >
      <div className="container">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter text-white mb-5">
              {sectionTitle}
            </h2>
            <p className="text-lg md:text-xl font-inter-tight text-white/70 text-center tracking-tight">
              {sectionSubtitle}
            </p>
          </div>
        )}

        {/* Main Locations - Flex Wrap Full Width */}
        <div className="flex flex-wrap gap-3 mb-16">
          {mainLocations.map((location, index) => (
            <LocationCard key={location.id} location={location} index={index} />
          ))}
        </div>

        {/* Upcoming Countries Section */}
        {upcomingCountries && upcomingCountries.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl md:text-4xl font-medium text-center tracking-tighter text-white mb-8">
              Скоро будут добавлены
            </h3>
            <div className="flex flex-wrap gap-3">
              {upcomingCountries.map((country, index) => (
                <CountryBadge key={country.id} country={country} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const LocationCard: React.FC<{ location: LocationItem; index: number }> = ({
                                                                             location,
                                                                             index,
                                                                           }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-1 min-w-[200px]"
    >
      <div className="relative w-full rounded-xl overflow-hidden border-[0.75px] border-white/20 bg-gradient-to-b from-neutral-900 to-black px-[14px] py-4 transition-all duration-300 hover:border-white/40 hover:shadow-xl group">
        <div className="flex items-center gap-3">
          {/* Flag */}
          <div className="flex-shrink-0">
            <span className={`fi fi-${location.flagCode} text-3xl`}></span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
              {location.title}
            </h3>
            <p className="text-white/70 text-xs leading-relaxed font-inter-tight md:text-sm">
              {location.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CountryBadge: React.FC<{ country: CountryItem; index: number }> = ({
                                                                           country,
                                                                           index,
                                                                         }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex-1 min-w-[120px]"
    >
      <div className="w-full rounded-lg border-[0.75px] border-white/20 bg-gradient-to-b from-neutral-900 to-black px-[14px] py-3 transition-all duration-300 hover:border-white/40 hover:scale-105">
        <div className="flex items-center gap-2 justify-center">
          <span className={`fi fi-${country.flagCode} text-2xl`}></span>
          <p className="text-white font-semibold text-sm tracking-tight whitespace-nowrap">
            {country.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};