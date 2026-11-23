export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  maintenance: {
    enabled: boolean;
    kicker: string;
    headline: string;
    message: string;
    code: string;
  };
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
    afk: string;
    afkNote: string;
    music: {
      track: string;
      artist: string;
      genre: string;
      elapsed: string;
      remaining: string;
      progress: number;
      cover: string;
      motif: 'cinema' | 'synth' | 'orbit' | 'floppy' | 'flora';
    };
    githubHandle: string;
    portrait: string;
    stack: string[];
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
  /**
   * MAINTENANCE / REPAIR MODE:
   * Set `enabled: true` (or set env `PUBLIC_MAINTENANCE_MODE=true`) and deploy
   * to display the red-signal repair screen across all routes.
   * When `false` (default), the maintenance screen is never rendered.
   */
  maintenance: {
    enabled: false,
    kicker: 'UNDER REPAIR / SYSTEM BUILD',
    headline: 'In Repair.',
    message: 'We are currently tuning and deploying updates to the dwelling.\nEverything will be back online shortly.',
    code: 'STATUS 503'
  },
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
      name: 'Jude Maria Bevan',
      role: 'Full-Stack & DevOps Engineer',
      bio: 'Bridges Java/Spring Boot backends, Flutter mobile apps, and containerized CI/CD pipelines with Docker, Minikube, and Jenkins.',
      afk: 'Lights, Camera, Relax',
      afkNote: 'Trading code for credits, with one more movie before bed.',
      music: {
        track: 'Time',
        artist: 'Hans Zimmer',
        genre: 'Film Score',
        elapsed: '1:46',
        remaining: '-2:49',
        progress: 38,
        cover: '/images/music/jude-time.jpg',
        motif: 'cinema'
      },
      githubHandle: 'judebevan',
      portrait: '/images/team/member-3-f1.jpg',
      stack: ['Java', 'C++', 'Flutter', 'Docker']
    },
    {
      name: 'Peenaka Wedamulla',
      role: 'AI Tooling & QA Automation Engineer',
      bio: 'Develops AI-powered coding-agent CLIs, enterprise Espresso/BrowserStack mobile test frameworks, and real-time Java/Angular systems (ContexaForge).',
      afk: 'Leading with Heart',
      afkNote: 'Turning good intentions into action, one service project at a time.',
      music: {
        track: 'Resonance',
        artist: 'HOME',
        genre: 'Synthwave',
        elapsed: '1:18',
        remaining: '-2:14',
        progress: 37,
        cover: '/images/music/peenaka-resonance.jpg',
        motif: 'synth'
      },
      githubHandle: 'peenaka',
      portrait: '/images/team/member-4-f1.jpg',
      stack: ['JavaScript', 'Java', 'Angular', 'C#']
    },
    {
      name: 'Pathum Sandeepa',
      role: 'Platform & Cloud Engineer',
      bio: 'Architects Go control planes, Kubernetes operators, multi-tenant TypeScript platforms, and interactive 3D web experiences (iconfigly, Three-JS-3D-Earth).',
      afk: 'Live from the Dev World',
      afkNote: 'Following live coding sessions, tech talks, and builds as they happen.',
      music: {
        track: 'Midnight City',
        artist: 'M83',
        genre: 'Electronic',
        elapsed: '2:05',
        remaining: '-1:58',
        progress: 51,
        cover: '/images/music/pathum-midnight-city.jpg',
        motif: 'orbit'
      },
      githubHandle: 'pathumsandeepa',
      portrait: '/images/team/member-2-f1.jpg',
      stack: ['Go', 'TypeScript', 'Kubernetes', 'PHP']
    },
    {
      name: 'Pramuditha Nadun',
      role: 'Systems & Tooling Architect',
      bio: 'Builds offline-first utilities, GPU-accelerated web engines, and procedural developer tools across TypeScript, Rust, C#, and Python (Filee, git-tulkun, bytesift).',
      afk: 'Recharging the Dev Battery',
      afkNote: 'Logged off and recharging for the next big commit.',
      music: {
        track: 'Notion',
        artist: 'The Rare Occasions',
        genre: 'Indie Rock',
        elapsed: '0:54',
        remaining: '-2:21',
        progress: 28,
        cover: '/images/music/pramuditha-notion.jpg',
        motif: 'floppy'
      },
      githubHandle: 'PramudithaN',
      portrait: '/images/team/member-1-f1.jpg',
      stack: ['TypeScript', 'Rust', 'C#', 'Python']
    },
    {
      name: 'Nipun Kariyawasam',
      role: 'Frontend, Astro & AI Researcher',
      bio: 'Crafts zero-bloat Astro interfaces and TypeScript hardware utilities alongside CNN 3D gaze estimation and Unity AI research (pregnantbattery, synth-gaze-fyp).',
      afk: 'On a Leo Mission',
      afkNote: 'Giving back through volunteering, community drives, and Leo teamwork.',
      music: {
        track: 'Sunflower',
        artist: 'Post Malone, Swae Lee',
        genre: 'Alt Hip-Hop',
        elapsed: '1:12',
        remaining: '-1:26',
        progress: 45,
        cover: '/images/music/nipun-sunflower.jpg',
        motif: 'flora'
      },
      githubHandle: 'sanszerif',
      portrait: '/images/team/member-5-f1.jpg',
      stack: ['Astro', 'TypeScript', 'Python', 'Dart']
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
