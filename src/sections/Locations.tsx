'use client';

import { CountrySelector, type Country } from '@/components/CountrySelector';
import AnimatedContent from '@/components/AnimatedContent';
import { locationsStyles, palette } from '@/config/theme.config';

const ACTIVE_COUNTRIES: Country[] = [
  { name: 'США',        flag: 'us', code: 'US' },
  { name: 'Германия',   flag: 'de', code: 'DE' },
  { name: 'Нидерланды', flag: 'nl', code: 'NL' },
  { name: 'Финляндия',  flag: 'fi', code: 'FI' },
  { name: 'Швеция',     flag: 'se', code: 'SE' },
];

const UPCOMING_COUNTRIES: Country[] = [
  { name: 'Франция',   flag: 'fr', code: 'FR' },
  { name: 'Канада',    flag: 'ca', code: 'CA' },
  { name: 'Польша',    flag: 'pl', code: 'PL' },
  { name: 'Австралия', flag: 'au', code: 'AU' },
  { name: 'Испания',   flag: 'es', code: 'ES' },
];

export function Locations() {
  return (
    <AnimatedContent
      distance={50}
      duration={0.9}
      ease="power3.out"
      threshold={0.1}
    >
      <div id="locations" style={{ backgroundColor: palette.sectionBg }}>
        <CountrySelector
          activeCountries={ACTIVE_COUNTRIES}
          upcomingCountries={UPCOMING_COUNTRIES}

          headerConfig={{
            ...locationsStyles.headerConfig,
            titleNode: (
              <>
                {locationsStyles.headingText}{' '}
                <span style={{
                  background: locationsStyles.headingGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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
