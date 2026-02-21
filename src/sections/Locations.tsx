'use client';

import { CountrySelector } from '@/components/CountrySelector';
import AnimatedContent from '@/components/AnimatedContent';
import { locationsStyles, palette } from '@/config/theme.config';
import { locationsConfig } from '@/config/site.config';

export function Locations() {
  return (
    <AnimatedContent distance={50} duration={0.9} ease="power3.out" threshold={0.1}>
      <div id="locations" style={{ backgroundColor: palette.sectionBg }}>
        <CountrySelector
          activeCountries={locationsConfig.activeCountries as any}
          upcomingCountries={locationsConfig.upcomingCountries as any}

          headerConfig={{
            ...locationsStyles.headerConfig,
            titleNode: (
              <>
                {locationsStyles.headingText}{' '}
                <span style={{
                  background:           locationsStyles.headingGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}>
                  {locationsStyles.headingGradientText}
                </span>
              </>
            ),
            subtitle: locationsStyles.subtitle,
          }}

          activeRowConfig={locationsStyles.activeRowConfig}
          activeCardStyle={locationsStyles.activeCardStyle}
          upcomingRowConfig={locationsStyles.upcomingRowConfig}
          upcomingCardStyle={locationsStyles.upcomingCardStyle}
          sectionConfig={locationsStyles.sectionConfig}
          footerLinkConfig={locationsStyles.footerLinkConfig}
        />
      </div>
    </AnimatedContent>
  );
}
