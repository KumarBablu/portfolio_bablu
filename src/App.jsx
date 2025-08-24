import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  ExternalLink,
  Filter,
  Moon,
  Sun,
  MapPin,
  BarChart3,
  Database,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// ──────────────────────────────────────────────────────────────────────────────
// Lightweight UI primitives (replace shadcn to avoid missing imports)
// ──────────────────────────────────────────────────────────────────────────────
const cx = (...c) => c.filter(Boolean).join(" ");

const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70",
      "bg-white/70 dark:bg-zinc-900/60 backdrop-blur",
      "shadow-sm",
      className
    )}
  >
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={cx("p-4", className)}>{children}</div>
);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
    icon: "p-2",
  };
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:translate-y-px",
    secondary:
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300",
    outline:
      "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50/40 dark:hover:bg-white/5",
    ghost: "hover:bg-zinc-100/60 dark:hover:bg-white/5",
  };
  return (
    <button
      className={cx(
        "rounded-2xl transition-colors disabled:opacity-60 disabled:pointer-events-none",
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", variant = "secondary" }) => (
  <span
    className={cx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs",
      variant === "secondary"
        ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        : "bg-indigo-600/10 text-indigo-700 dark:text-indigo-300",
      className
    )}
  >
    {children}
  </span>
);

const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
    {children}
  </span>
);

const Section = ({ id, title, children, icon: Icon }) => (
  <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex items-center gap-3 mb-6">
      {Icon && <Icon className="w-6 h-6" />}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

// ──────────────────────────────────────────────────────────────────────────────
// Dynamic content – fetched from backend with graceful fallbacks
// ──────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"; // e.g. http://localhost:5000

// Local safe defaults (used if API not reachable)
const DEFAULT = {
  PROFILE: {
    name: "BABLU KUMAR",
    title: "Data Analyst | BI Developer",
    location: "Bangalore, India",
    email: "contact.bablusoni@gmail.com",
    phone: "+91 9771039201",
    links: {
      github: "#",
      linkedin: "https://www.linkedin.com/in/aku-bablu-kumar",
      resume: "#",
    },
    summary:
      "I transform raw data into clear, actionable insights. Experienced with end-to-end analytics workflows: sourcing with SQL, modeling, and delivering interactive dashboards.",
    skills: [
      { name: "Power BI", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Excel", level: 80 },
      { name: "Python (Pandas)", level: 75 },
      { name: "DAX", level: 70 },
      { name: "Data Modeling", level: 85 },
      { name: "Storytelling", level: 80 },
    ],
  },
  PROJECTS: [
    {
      title: "Sales Analytics Dashboard",
      tags: ["Power BI", "DAX", "Sales", "Dashboard"],
      period: "2024",
      hero:
        "https://images.unsplash.com/photo-1551281044-8b89cbf8b9c5?q=80&w=1200&auto=format&fit=crop",
      summary:
        "Interactive KPI view with day-by-day trends, category mix, and store performance.",
      highlights: [
        "+29.8% MoM across Sales/Orders/Qty",
        "Top categories: Coffee, Tea, Bakery",
        "Store-level opportunity flags",
      ],
      links: { live: "#", code: "#" },
    },
    {
      title: "Retail SQL – Cohorts & RFM",
      tags: ["SQL", "PostgreSQL", "Analytics"],
      period: "2024",
      hero:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      summary:
        "Reusable SQL views for cohorts, RFM scoring, LTV; feeds dashboards and CRM.",
      highlights: ["20+ SQL views", "Cohort retention", "Churn flags"],
      links: { live: "#", code: "#" },
    },
    {
      title: "Churn Prediction – Python",
      tags: ["Python", "ML", "Classification"],
      period: "2024",
      hero:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
      summary:
        "Feature engineering, baseline models, and explainability with permutation importance.",
      highlights: ["Pandas + scikit-learn", "Explainability", "ROC-AUC 0.84"],
      links: { live: "#", code: "#" },
    },
  ],
  EXPERIENCE: [
    {
    role: "Junior Analyst",
    org: "Nobroker Technology Solutions Pvt. Ltd.",
    time: "Jan 2024 – Present",
    bullets: [
      "Transformed raw datasets into actionable insights and executive-ready reports to support strategic decision-making.",
      "Designed, developed, and maintained interactive Power BI dashboards to track business performance metrics.",
      "Automated weekly KPI reporting, reducing manual effort and improving reporting accuracy and timeliness.",
      "Published and optimized Power BI data models, ensuring scalability and efficient query performance.",
      "Partnered with cross-functional stakeholders to identify trends, highlight risks, and recommend data-driven actions.",
    ],
  },
  {
    role: "MIS Specialist",
    org: "Udaan E-Commerce",
    time: "Jun 2023 – Dec 2023",
    bullets: [
      "Developed and automated weekly KPI reports, improving visibility into operational and sales performance.",
      "Built and deployed secure Power BI models with Row-Level Security (RLS) to ensure controlled access to sensitive data.",
      "Collaborated with business teams to translate requirements into dashboards and analytics solutions that supported key decisions.",
    ],
  },

  ],
  CERTS: [
    { name: "Google Fundamentals of Digital Marketing", by: "Google" },
  { name: "Cyber Crime Intervention Officer", by: "ISAC (Information Sharing and Analysis Center)" },
  { name: "Introduction to Data Analytics", by: "LearnTube.ai" },
  { name: "Oracle Database 11G: SQL Fundamentals", by: "JSpiders" },
  { name: "Python", by: "ICT Academy, IIT Kanpur" },
  { name: "Soft Skills", by: "NPTEL" },
  ],
};

// Small runtime \"tests\" to help catch bad API payloads in dev
function validateProjects(projects) {
  console.groupCollapsed("[validate] projects");
  const ok = Array.isArray(projects) && projects.every((p) => typeof p.hero === "string" && p.hero.length > 5);
  console.assert(ok, "Each project must include a non-empty 'hero' image URL.");
  console.groupEnd();
  return ok;
}

function useDynamicData() {
  const [profile, setProfile] = useState(DEFAULT.PROFILE);
  const [projects, setProjects] = useState(DEFAULT.PROJECTS);
  const [experience, setExperience] = useState(DEFAULT.EXPERIENCE);
  const [certs, setCerts] = useState(DEFAULT.CERTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/site`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProfile(data.profile || DEFAULT.PROFILE);
          setProjects(validateProjects(data.projects) ? data.projects : DEFAULT.PROJECTS);
          setExperience(data.experience || DEFAULT.EXPERIENCE);
          setCerts(data.certs || DEFAULT.CERTS);
        }
      } catch (e) {
        console.warn("Using fallback data:", e?.message);
        if (!cancelled) setError("Welcome");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => (cancelled = true);
  }, []);

  return { profile, projects, experience, certs, loading, error };
}

// ──────────────────────────────────────────────────────────────────────────────
// Decorative background – soft gradients + blobs
// ──────────────────────────────────────────────────────────────────────────────
const Background = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black" />
    <svg className="absolute -top-24 -left-24 h-[40rem] opacity-40 blur-3xl" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g transform="translate(300,300)">
        <path fill="url(#g1)" d="M120,-155.6C158.7,-132.7,193.8,-106.6,209.3,-70.7C224.7,-34.9,220.5,10.8,202.3,49.1C184,87.4,151.6,118.3,115.4,145.7C79.2,173.1,39.6,197.1,-0.8,198.3C-41.2,199.4,-82.4,177.8,-127.9,154.2C-173.5,130.7,-223.4,105.1,-237.8,68.5C-252.2,31.8,-231,-15.8,-206.1,-52.8C-181.1,-89.7,-152.4,-116.3,-120.5,-140.3C-88.6,-164.3,-44.3,-185.1,-7.9,-175.7C28.6,-166.3,57.2,-126.6,120,-155.6Z" />
      </g>
    </svg>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// App – dynamic portfolio
// ──────────────────────────────────────────────────────────────────────────────
export default function PortfolioSite() {
  const [dark, setDark] = useState(true);
  const { profile: PROFILE, projects: PROJECTS, experience: EXPERIENCE, certs: CERTS, loading, error } =
    useDynamicData();

  return (
    <div className={dark ? "dark" : ""}>
      <Background />
      <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors">
        <Nav dark={dark} setDark={setDark} PROFILE={PROFILE} />
        <main>
          <Hero PROFILE={PROFILE} firstHero={PROJECTS?.[0]?.hero} />
          {error && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-xl border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-3 text-sm">
                {error}
              </div>
            </div>
          )}
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <About PROFILE={PROFILE} />
              <Skills PROFILE={PROFILE} />
              <Projects PROJECTS={PROJECTS} />
              <Experience EXPERIENCE={EXPERIENCE} CERTS={CERTS} />
              <Contact PROFILE={PROFILE} />
            </>
          )}
        </main>
        <Footer PROFILE={PROFILE} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Top nav
// ──────────────────────────────────────────────────────────────────────────────
const Nav = ({ dark, setDark, PROFILE }) => {
  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <a href="#" className="font-semibold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> <span>Analytics Portfolio</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="text-sm hover:underline">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="toggle theme"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <a href={PROFILE.links?.resume || "#"} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <Download className="w-4 h-4" /> Resume
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────────────────────
const Hero = ({ PROFILE, firstHero }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-12 gap-8 items-center"
    >
      <div className="md:col-span-7">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
          {PROFILE.name}
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 mb-4">{PROFILE.title}</p>
        <p className="max-w-2xl mb-6">{PROFILE.summary}</p>
        <div className="flex flex-wrap gap-3">
          <a href={PROFILE.links?.linkedin} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </Button>
          </a>
          <a href={PROFILE.links?.github} target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              <Github className="w-4 h-4" /> GitHub
            </Button>
          </a>
        </div>
      </div>
      <div className="md:col-span-5">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video">
              <img
                alt="dashboard preview"
                className="w-full h-full object-cover"
                src={firstHero || "https://images.unsplash.com/photo-1551281044-8b89cbf8b9c5?q=80&w=1200&auto=format&fit=crop"}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1551281044-8b89cbf8b9c5?q=80&w=1200&auto=format&fit=crop";
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// About
// ──────────────────────────────────────────────────────────────────────────────
const About = ({ PROFILE }) => (
  <Section id="about" title="About" icon={BarChart3}>
    <div className="grid md:grid-cols-12 gap-6">
      <div className="md:col-span-8">
        <p className="leading-relaxed">{PROFILE.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Power BI", "SQL", "Excel", "Python", "DAX", "ETL", "Data Viz"].map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
      <div className="md:col-span-4">
        <Card>
          <CardContent className="p-5">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {PROFILE.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {PROFILE.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {PROFILE.location}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

// ──────────────────────────────────────────────────────────────────────────────
// Skills (with dynamic chart)
// ──────────────────────────────────────────────────────────────────────────────
const Skills = ({ PROFILE }) => (
  <Section id="skills" title="Skills" icon={Sparkles}>
    <div className="grid md:grid-cols-12 gap-6">
      <div className="md:col-span-7">
        <div className="grid sm:grid-cols-2 gap-3">
          {PROFILE.skills.map((s) => (
            <Card key={s.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{s.level}%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="md:col-span-5">
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 font-medium">Tool Proficiency (Dynamic)</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROFILE.skills.map(({ name, level }) => ({ name, level }))}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="level" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

// ──────────────────────────────────────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────────────────────────────────────
const ProjectCard = ({ p }) => (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video">
        <img
          src={p.hero}
          alt={p.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop";
          }}
        />
      </div>
      <CardContent className="p-4 flex flex-col gap-3 grow">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
          <span className="text-xs text-zinc-500 whitespace-nowrap">{p.period}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{p.summary}</p>
        <ul className="list-disc pl-5 text-sm">
          {p.highlights?.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-auto">
          {p.tags?.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          {p.links?.live && p.links.live !== "#" && (
            <a href={p.links.live} target="_blank" rel="noreferrer">
              <Button size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Live
              </Button>
            </a>
          )}
          {p.links?.code && (
            <a href={p.links.code} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="w-4 h-4" /> Code
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Projects = ({ PROJECTS }) => {
  const [active, setActive] = useState("All");
  const allTags = useMemo(
    () => ["All", ...Array.from(new Set((PROJECTS || []).flatMap((p) => p.tags || [])))],
    [PROJECTS]
  );
  const shown = useMemo(
    () => (PROJECTS || []).filter((p) => (active === "All" ? true : (p.tags || []).includes(active))),
    [active, PROJECTS]
  );
  return (
    <Section id="projects" title="Projects" icon={LayoutDashboard}>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4" />
        {allTags.map((t) => (
          <Button key={t} onClick={() => setActive(t)} variant={active === t ? "primary" : "outline"} size="sm">
            {t}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shown.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </Section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Experience + Certs
// ──────────────────────────────────────────────────────────────────────────────
const Experience = ({ EXPERIENCE, CERTS }) => (
  <Section id="experience" title="Experience" icon={Database}>
    <div className="grid md:grid-cols-2 gap-6">
      {EXPERIENCE.map((e) => (
        <Card key={e.role}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{e.org}</p>
                <h3 className="text-lg font-semibold">{e.role}</h3>
              </div>
              <span className="text-xs text-zinc-500">{e.time}</span>
            </div>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
              {e.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-2">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((c) => (
              <Pill key={c.name}>
                {c.name} · {c.by}
              </Pill>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </Section>
);

// ──────────────────────────────────────────────────────────────────────────────
// Contact
// ──────────────────────────────────────────────────────────────────────────────
const Contact = ({ PROFILE }) => (
  <Section id="contact" title="Contact" icon={Mail}>
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">Let’s work together</h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              Open to roles in data analytics, BI, and insights. Reach out for opportunities or service , case studies, or a quick call.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a className="hover:underline" href={`mailto:${PROFILE.email}`}>
                  {PROFILE.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {PROFILE.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {PROFILE.location}
              </div>
            </div>
          </div>

          <form
             className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();

                const form = e.target;
                const name = form.name.value || "Anonymous";
                const email = form.email.value || "No email";
                const message = form.message.value || "";

                const whatsappNumber = "919771039201"; // your WhatsApp number in international format
                const text = `Hello Bablu Kumar 👋,

            My name is ${name}.
            Email: ${email}

            ${message ? `Message: ${message}` : "I wanted to reach out to discuss potential opportunities in Data Analytics, BI, or related projects."}
            
            I wanted to reach out to discuss For Data Analytics, BI, or related projects.
            Looking forward to connecting with you!

            Thank you.`;

                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                window.open(url, "_blank");
              }}
            >
              <div>
                <label className="text-sm">Name</label>
                <input
                  name="name"
                  className="w-full mt-1 px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-900/60"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-900/60"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="text-sm">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full mt-1 px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-900/60"
                  placeholder="Say hello…/ Message "
                />
              </div>
              <Button type="submit"> Sent </Button>
          </form>

        </div>
      </CardContent>
    </Card>
  </Section>
);

// ──────────────────────────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────────────────────────
const Footer = ({ PROFILE }) => (
  <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
      <span>
        © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
      </span>
      <div className="flex items-center gap-3">
        <a className="hover:underline flex items-center gap-1" href={PROFILE.links?.github} target="_blank" rel="noreferrer">
          <Github className="w-4 h-4" /> GitHub
        </a>
        <a className="hover:underline flex items-center gap-1" href={PROFILE.links?.linkedin} target="_blank" rel="noreferrer">
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </div>
  </footer>
);

// ──────────────────────────────────────────────────────────────────────────────
// Loading skeleton (simple)
// ──────────────────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={cx("animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70", className)} />
);
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video" />
          <CardContent>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

