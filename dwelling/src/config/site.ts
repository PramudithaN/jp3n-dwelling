export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  capacity: {
    totalSlots: number;
    openSlots: number;
    month: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
  team: Array<{
    name: string;
    role: string;
    bio: string;
    githubHandle: string;
  }>;
  demos: Array<{
    id: string;
    title: string;
    subtitle: string;
    category: 'hardware-telemetry' | 'system-engine' | 'binary-tooling' | 'ethical-commerce';
    liveUrl?: string;
    repoUrl?: string;
    summary: string;
    metricsNote: string;
    techStack: string[];
  }>;
}

export const siteConfig: SiteConfig = {
  name: 'JP3N',
  tagline: 'Tech Dwelling',
  description: 'An independent engineering and craft collective. Web engineering, graphic systems, motion design, and open source tooling.',
  url: 'https://jp3n-dwelling.pages.dev',
  capacity: {
    totalSlots: 3,
    openSlots: 2,
    month: 'December 2026'
  },
  contact: {
    email: 'contact@jp3n.dev',
    github: 'https://github.com/PramudithaN',
    linkedin: 'https://linkedin.com/in/pramuditha-nadun-612b1b204'
  },
  team: [
    {
      name: 'Pramuditha Nadun',
      role: 'Software Engineer',
      bio: 'Full-stack systems, performance engineering, and open source tooling architecture.',
      githubHandle: 'PramudithaN'
    },
    {
      name: 'Pathum Sandeepa',
      role: 'Interface & Brand Architect',
      bio: 'Interface architecture, digital brand identity systems, and client software engineering.',
      githubHandle: 'pathumsandeepa'
    },
    {
      name: 'Jude Bevan',
      role: 'Visual Systems & Motion Engineer',
      bio: 'High-contrast graphic design systems, publication typography, and motion narrative.',
      githubHandle: 'judebevan'
    },
    {
      name: 'Peenaka Wedamulla',
      role: 'Media & Systems Developer',
      bio: 'Audio-visual narrative production, media engineering, and performant web deployment.',
      githubHandle: 'peenaka'
    },
    {
      name: 'Nipun Kariyawasam',
      role: 'Core Systems Developer',
      bio: 'Hardware utilities, browser Web API tooling, and open source systems engineering.',
      githubHandle: 'sanszerif'
    }
  ],
  demos: [
    {
      id: 'battery-telemetry',
      title: 'Battery Telemetry',
      subtitle: 'Hardware battery monitoring utility',
      category: 'hardware-telemetry',
      liveUrl: 'https://battery.nipun.is-a.dev/',
      summary: 'Minimal, zero-overhead browser utility for battery status, charging state telemetry, and discharge rate telemetry.',
      metricsNote: 'Live verified client-side battery API inspector',
      techStack: ['Web API', 'Lightweight Vanilla JS', 'Zero Tracker']
    },
    {
      id: 'theme-changer',
      title: 'Theme Changer',
      subtitle: 'Lightweight theme orchestration engine',
      category: 'system-engine',
      liveUrl: 'https://pramudithan.github.io/theme.changer/',
      summary: 'High-speed CSS token switcher with instant DOM paint, zero flashing (FOUT/FOUC), and zero runtime library dependencies.',
      metricsNote: 'Zero-layout-shift CSS token switcher',
      techStack: ['CSS Variables', 'Vanilla JS', 'Local Scope Engine']
    },
    {
      id: 'bytesift',
      title: 'ByteSift',
      subtitle: 'High-efficiency binary & data filter',
      category: 'binary-tooling',
      liveUrl: 'https://pramudithan.github.io/bytesift',
      summary: 'Direct in-browser binary chunk parsing and high-throughput data extraction for developer inspection.',
      metricsNote: 'In-memory client-side data stream processing',
      techStack: ['Web Workers', 'Binary Buffers', 'TypeScript']
    },
    {
      id: 'meri-clothing',
      title: 'meri.clothing',
      subtitle: 'Ethical apparel digital flagship',
      category: 'ethical-commerce',
      repoUrl: 'https://github.com/PramudithaN',
      summary: 'High-performance static commerce architecture built for mobile speed, fluid typography, and zero-clutter catalog browsing.',
      metricsNote: 'Source code in private staging; live URL pending launch',
      techStack: ['Static Output', 'Tailored CSS', 'Astro Architecture']
    }
  ]
};
