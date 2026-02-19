import type { IconType } from 'react-icons'
import {
  SiDotnet,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiGit,
  SiRedis,
  SiPostgresql,
  SiMongodb,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiRust,
  SiGo,
  SiNginx,
  SiElasticsearch,
  SiApachekafka,
  SiRabbitmq,
  SiGrafana,
  SiJenkins,
  SiKubernetes,
  SiTerraform,
  SiAnsible,
  SiApache,
  SiGnubash,
  SiLinux,
  SiMacos,
  SiIntellijidea,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiDigitalocean,
  SiCloudflare,
  SiFirebase,
  SiSupabase,
  SiGraphql,
  SiSwagger,
  SiInsomnia,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiWebpack,
  SiVite,
  SiEsbuild,
  SiTailwindcss,
  SiSass,
  SiBootstrap,
  SiMysql,
  SiSqlite,
  SiMariadb,
  SiApachecassandra,
  SiNeo4J,
  SiPrometheus,
  SiDatadog,
  SiCplusplus,
  SiRuby,
  SiLua,
  SiOpenai,
  SiHuggingface,
  SiSelenium,
  SiCucumber,
  SiJunit5,
  SiJest,
  SiN8N,
  SiGooglechrome,
  SiPostman
} from 'react-icons/si'
import {
  VscTerminalPowershell,
  VscDatabase,
  VscServer,
  VscTools,
  VscGlobe,
  VscCode,
  VscDebugAlt,
  VscFile,
  VscPackage,
  VscTerminalBash,
  VscTerminalCmd,
  VscCloud,
  VscLock,
  VscMail,
  VscRocket,
  VscBeaker,
  VscGear,
  VscHeart,
  VscLightbulb,
  VscSearch,
  VscPlay,
  VscNotebook,
  VscJson,
  VscFileCode,
  VscFilePdf,
  VscFileMedia,
  VscFolder,
  VscExtensions,
  VscSymbolNamespace,
  VscWand,
  VscRobot,
  VscAzure
} from 'react-icons/vsc'
import {
  FaJava,
  FaAws,
  FaPhp,
  FaSwift,
  FaAngular,
  FaVuejs,
  FaWordpress,
  FaSlack,
  FaDiscord,
  FaTrello,
  FaJira,
  FaFigma,
  FaWindows
} from 'react-icons/fa'
import {
  FaGolang
} from 'react-icons/fa6'

// ============================================================
// Icon Registry — single source of truth for all icon data
// ============================================================

export interface IconEntry {
  /** Unique key stored in config.icon */
  key: string
  /** Display label in the picker */
  label: string
  /** Category for tab filtering */
  category: IconCategory
  /** Search keywords (lowercase) */
  keywords: string[]
  /** The React icon component */
  component: IconType
}

export type IconCategory =
  | 'Languages'
  | 'Frameworks'
  | 'Infrastructure'
  | 'Databases'
  | 'Tools'
  | 'Services'
  | 'General'

export const ICON_CATEGORIES: IconCategory[] = [
  'Languages',
  'Frameworks',
  'Infrastructure',
  'Databases',
  'Tools',
  'Services',
  'General'
]

export const ICON_REGISTRY: IconEntry[] = [
  // === Languages / Runtimes ===
  { key: 'SiDotnet', label: '.NET / C#', category: 'Languages', keywords: ['dotnet', '.net', 'csharp', 'c#', 'aspnet', 'blazor', 'fsharp', 'core'], component: SiDotnet },
  { key: 'SiNodedotjs', label: 'Node.js', category: 'Languages', keywords: ['node', 'nodejs', 'express', 'nestjs'], component: SiNodedotjs },
  { key: 'SiPython', label: 'Python', category: 'Languages', keywords: ['python', 'pip', 'django', 'flask', 'fastapi', 'uvicorn'], component: SiPython },
  { key: 'FaJava', label: 'Java', category: 'Languages', keywords: ['java', 'spring', 'maven', 'gradle', 'tomcat', 'jvm'], component: FaJava },
  { key: 'SiTypescript', label: 'TypeScript', category: 'Languages', keywords: ['typescript', 'tsc', 'ts'], component: SiTypescript },
  { key: 'SiJavascript', label: 'JavaScript', category: 'Languages', keywords: ['javascript', 'js', 'ecmascript'], component: SiJavascript },
  { key: 'SiRust', label: 'Rust', category: 'Languages', keywords: ['rust', 'cargo', 'rustc'], component: SiRust },
  { key: 'SiGo', label: 'Go', category: 'Languages', keywords: ['go', 'golang'], component: SiGo },
  { key: 'FaGolang', label: 'Golang', category: 'Languages', keywords: ['golang', 'go'], component: FaGolang },
  { key: 'FaPhp', label: 'PHP', category: 'Languages', keywords: ['php', 'laravel', 'symfony', 'composer'], component: FaPhp },
  { key: 'FaSwift', label: 'Swift', category: 'Languages', keywords: ['swift', 'ios', 'xcode'], component: FaSwift },
  { key: 'SiGnubash', label: 'Bash', category: 'Languages', keywords: ['bash', 'shell', 'sh', 'zsh'], component: SiGnubash },
  { key: 'VscTerminalPowershell', label: 'PowerShell', category: 'Languages', keywords: ['powershell', 'pwsh', 'ps', 'ps1'], component: VscTerminalPowershell },
  { key: 'SiCplusplus', label: 'C++', category: 'Languages', keywords: ['c++', 'cpp', 'cplusplus'], component: SiCplusplus },
  { key: 'SiRuby', label: 'Ruby', category: 'Languages', keywords: ['ruby', 'rails', 'gem'], component: SiRuby },
  { key: 'SiLua', label: 'Lua', category: 'Languages', keywords: ['lua', 'script'], component: SiLua },

  // === Frameworks ===
  { key: 'SiReact', label: 'React', category: 'Frameworks', keywords: ['react', 'jsx', 'tsx', 'next', 'nextjs'], component: SiReact },
  { key: 'FaAngular', label: 'Angular', category: 'Frameworks', keywords: ['angular', 'ng'], component: FaAngular },
  { key: 'FaVuejs', label: 'Vue.js', category: 'Frameworks', keywords: ['vue', 'vuejs', 'nuxt', 'nuxtjs'], component: FaVuejs },
  { key: 'SiTailwindcss', label: 'Tailwind CSS', category: 'Frameworks', keywords: ['tailwind', 'tailwindcss', 'css'], component: SiTailwindcss },
  { key: 'SiSass', label: 'Sass', category: 'Frameworks', keywords: ['sass', 'scss', 'less'], component: SiSass },
  { key: 'SiBootstrap', label: 'Bootstrap', category: 'Frameworks', keywords: ['bootstrap'], component: SiBootstrap },
  { key: 'SiGraphql', label: 'GraphQL', category: 'Frameworks', keywords: ['graphql', 'gql', 'apollo'], component: SiGraphql },
  { key: 'FaWordpress', label: 'WordPress', category: 'Frameworks', keywords: ['wordpress', 'wp'], component: FaWordpress },

  // === Infrastructure / DevOps ===
  { key: 'SiDocker', label: 'Docker', category: 'Infrastructure', keywords: ['docker', 'container', 'compose', 'dockerfile'], component: SiDocker },
  { key: 'SiKubernetes', label: 'Kubernetes', category: 'Infrastructure', keywords: ['kubernetes', 'k8s', 'kubectl', 'helm'], component: SiKubernetes },
  { key: 'SiTerraform', label: 'Terraform', category: 'Infrastructure', keywords: ['terraform', 'tf', 'iac'], component: SiTerraform },
  { key: 'SiAnsible', label: 'Ansible', category: 'Infrastructure', keywords: ['ansible', 'playbook'], component: SiAnsible },
  { key: 'SiJenkins', label: 'Jenkins', category: 'Infrastructure', keywords: ['jenkins', 'ci', 'pipeline', 'cicd'], component: SiJenkins },
  { key: 'SiNginx', label: 'Nginx', category: 'Infrastructure', keywords: ['nginx', 'proxy', 'reverse-proxy', 'load-balancer'], component: SiNginx },
  { key: 'SiApache', label: 'Apache', category: 'Infrastructure', keywords: ['apache', 'httpd'], component: SiApache },
  { key: 'FaWindows', label: 'Windows', category: 'Infrastructure', keywords: ['windows', 'win', 'win32'], component: FaWindows },
  { key: 'SiLinux', label: 'Linux', category: 'Infrastructure', keywords: ['linux', 'ubuntu', 'debian', 'centos', 'fedora'], component: SiLinux },
  { key: 'SiMacos', label: 'macOS', category: 'Infrastructure', keywords: ['macos', 'mac', 'apple', 'darwin'], component: SiMacos },
  { key: 'VscAzure', label: 'Azure', category: 'Infrastructure', keywords: ['azure', 'microsoft', 'cloud', 'functions'], component: VscAzure },
  { key: 'VscAzure', label: 'Azure (DevOps)', category: 'Infrastructure', keywords: ['azure', 'devops', 'pipelines'], component: VscAzure },

  // === Databases ===
  { key: 'SiPostgresql', label: 'PostgreSQL', category: 'Databases', keywords: ['postgres', 'postgresql', 'pg', 'psql'], component: SiPostgresql },
  { key: 'SiMongodb', label: 'MongoDB', category: 'Databases', keywords: ['mongo', 'mongodb', 'mongosh', 'nosql'], component: SiMongodb },
  { key: 'SiRedis', label: 'Redis', category: 'Databases', keywords: ['redis', 'cache', 'memcached'], component: SiRedis },
  { key: 'SiMysql', label: 'MySQL', category: 'Databases', keywords: ['mysql', 'mariadb'], component: SiMysql },
  { key: 'SiMariadb', label: 'MariaDB', category: 'Databases', keywords: ['mariadb'], component: SiMariadb },
  { key: 'SiSqlite', label: 'SQLite', category: 'Databases', keywords: ['sqlite', 'sqlite3'], component: SiSqlite },
  { key: 'SiElasticsearch', label: 'Elasticsearch', category: 'Databases', keywords: ['elastic', 'elasticsearch', 'kibana', 'elk'], component: SiElasticsearch },
  { key: 'SiApachekafka', label: 'Kafka', category: 'Databases', keywords: ['kafka', 'streaming', 'event'], component: SiApachekafka },
  { key: 'SiRabbitmq', label: 'RabbitMQ', category: 'Databases', keywords: ['rabbitmq', 'amqp', 'queue', 'mq', 'message'], component: SiRabbitmq },
  { key: 'SiApachecassandra', label: 'Cassandra', category: 'Databases', keywords: ['cassandra', 'cql'], component: SiApachecassandra },
  { key: 'SiNeo4J', label: 'Neo4j', category: 'Databases', keywords: ['neo4j', 'graph', 'cypher'], component: SiNeo4J },
  { key: 'VscDatabase', label: 'SQL Server', category: 'Databases', keywords: ['sql', 'mssql', 'server', 'tsql'], component: VscDatabase },
  { key: 'VscDatabase', label: 'Database', category: 'Databases', keywords: ['database', 'db', 'sql', 'data'], component: VscDatabase },

  // === Tools ===
  { key: 'SiGit', label: 'Git', category: 'Tools', keywords: ['git', 'version-control', 'vcs'], component: SiGit },
  { key: 'SiGithub', label: 'GitHub', category: 'Tools', keywords: ['github', 'gh'], component: SiGithub },
  { key: 'SiGitlab', label: 'GitLab', category: 'Tools', keywords: ['gitlab'], component: SiGitlab },
  { key: 'SiBitbucket', label: 'Bitbucket', category: 'Tools', keywords: ['bitbucket'], component: SiBitbucket },
  { key: 'VscCode', label: 'VS Code', category: 'Tools', keywords: ['vscode', 'code', 'editor', 'ide'], component: VscCode },
  { key: 'SiIntellijidea', label: 'IntelliJ IDEA', category: 'Tools', keywords: ['intellij', 'idea', 'jetbrains', 'rider', 'webstorm'], component: SiIntellijidea },
  { key: 'SiSwagger', label: 'Swagger', category: 'Tools', keywords: ['swagger', 'openapi', 'api-doc'], component: SiSwagger },
  { key: 'SiSwagger', label: 'Swagger', category: 'Tools', keywords: ['swagger', 'openapi', 'api-doc'], component: SiSwagger },
  { key: 'SiPostman', label: 'Postman', category: 'Tools', keywords: ['postman', 'api-test'], component: SiPostman },
  { key: 'VscCode', label: 'Visual Studio', category: 'Tools', keywords: ['visual', 'studio', 'ide', 'vs'], component: VscCode },
  { key: 'SiGooglechrome', label: 'Chrome', category: 'Tools', keywords: ['chrome', 'browser', 'google', 'web'], component: SiGooglechrome },
  { key: 'SiN8N', label: 'n8n', category: 'Tools', keywords: ['n8n', 'workflow', 'automation', 'low-code'], component: SiN8N },
  { key: 'SiSelenium', label: 'Selenium', category: 'Tools', keywords: ['selenium', 'test', 'automation', 'browser'], component: SiSelenium },
  { key: 'SiCucumber', label: 'Cucumber', category: 'Tools', keywords: ['cucumber', 'bdd', 'test', 'gherkin'], component: SiCucumber },
  { key: 'SiJunit5', label: 'JUnit', category: 'Tools', keywords: ['junit', 'test', 'java'], component: SiJunit5 },
  { key: 'SiJest', label: 'Jest', category: 'Tools', keywords: ['jest', 'test', 'js', 'react'], component: SiJest },
  { key: 'VscRobot', label: 'Robot / AI', category: 'Tools', keywords: ['robot', 'bot', 'agent', 'automation', 'rpa'], component: VscRobot },
  { key: 'SiOpenai', label: 'OpenAI', category: 'Tools', keywords: ['openai', 'chatgpt', 'gpt', 'ai', 'llm', 'ml'], component: SiOpenai },
  { key: 'SiHuggingface', label: 'Hugging Face', category: 'Tools', keywords: ['hugging', 'face', 'ai', 'model', 'ml'], component: SiHuggingface },
  { key: 'SiInsomnia', label: 'Insomnia', category: 'Tools', keywords: ['insomnia', 'rest-client'], component: SiInsomnia },
  { key: 'SiNpm', label: 'npm', category: 'Tools', keywords: ['npm', 'package-manager'], component: SiNpm },
  { key: 'SiYarn', label: 'Yarn', category: 'Tools', keywords: ['yarn'], component: SiYarn },
  { key: 'SiPnpm', label: 'pnpm', category: 'Tools', keywords: ['pnpm'], component: SiPnpm },
  { key: 'SiWebpack', label: 'Webpack', category: 'Tools', keywords: ['webpack', 'bundler'], component: SiWebpack },
  { key: 'SiVite', label: 'Vite', category: 'Tools', keywords: ['vite', 'vitest'], component: SiVite },
  { key: 'SiEsbuild', label: 'esbuild', category: 'Tools', keywords: ['esbuild'], component: SiEsbuild },
  { key: 'SiGrafana', label: 'Grafana', category: 'Tools', keywords: ['grafana', 'dashboard', 'monitoring'], component: SiGrafana },
  { key: 'SiPrometheus', label: 'Prometheus', category: 'Tools', keywords: ['prometheus', 'metrics', 'alerting'], component: SiPrometheus },
  { key: 'SiDatadog', label: 'Datadog', category: 'Tools', keywords: ['datadog', 'apm', 'observability'], component: SiDatadog },
  { key: 'FaFigma', label: 'Figma', category: 'Tools', keywords: ['figma', 'design', 'ui', 'ux'], component: FaFigma },
  { key: 'FaTrello', label: 'Trello', category: 'Tools', keywords: ['trello', 'kanban', 'board'], component: FaTrello },
  { key: 'FaJira', label: 'Jira', category: 'Tools', keywords: ['jira', 'issue', 'ticket', 'agile'], component: FaJira },

  // === Services / Cloud ===
  { key: 'FaAws', label: 'AWS', category: 'Services', keywords: ['aws', 'amazon', 'lambda', 's3', 'ec2', 'cloud'], component: FaAws },
  { key: 'SiVercel', label: 'Vercel', category: 'Services', keywords: ['vercel', 'next', 'deploy'], component: SiVercel },
  { key: 'SiNetlify', label: 'Netlify', category: 'Services', keywords: ['netlify'], component: SiNetlify },
  { key: 'SiHeroku', label: 'Heroku', category: 'Services', keywords: ['heroku'], component: SiHeroku },
  { key: 'SiDigitalocean', label: 'DigitalOcean', category: 'Services', keywords: ['digitalocean', 'droplet'], component: SiDigitalocean },
  { key: 'SiCloudflare', label: 'Cloudflare', category: 'Services', keywords: ['cloudflare', 'cdn', 'dns'], component: SiCloudflare },
  { key: 'SiFirebase', label: 'Firebase', category: 'Services', keywords: ['firebase', 'firestore', 'fcm'], component: SiFirebase },
  { key: 'SiSupabase', label: 'Supabase', category: 'Services', keywords: ['supabase'], component: SiSupabase },
  { key: 'FaSlack', label: 'Slack', category: 'Services', keywords: ['slack', 'chat', 'messaging'], component: FaSlack },
  { key: 'FaDiscord', label: 'Discord', category: 'Services', keywords: ['discord', 'bot'], component: FaDiscord },

  // === General / Generic ===
  { key: 'VscServer', label: 'Server', category: 'General', keywords: ['server', 'api', 'backend', 'service', 'mcp', 'http'], component: VscServer },
  { key: 'VscGlobe', label: 'Web', category: 'General', keywords: ['web', 'http', 'frontend', 'browser', 'html', 'url'], component: VscGlobe },
  { key: 'VscTerminalPowershell', label: 'Terminal (PS)', category: 'General', keywords: ['terminal', 'powershell', 'console', 'cli'], component: VscTerminalPowershell },
  { key: 'VscTerminalBash', label: 'Terminal (Bash)', category: 'General', keywords: ['terminal', 'bash', 'console', 'shell'], component: VscTerminalBash },
  { key: 'VscTerminalCmd', label: 'Terminal (Cmd)', category: 'General', keywords: ['terminal', 'cmd', 'command', 'prompt'], component: VscTerminalCmd },
  { key: 'VscCode', label: 'Code', category: 'General', keywords: ['code', 'source', 'programming'], component: VscCode },
  { key: 'VscDebugAlt', label: 'Debug', category: 'General', keywords: ['debug', 'debugger', 'inspect', 'breakpoint'], component: VscDebugAlt },
  { key: 'VscPackage', label: 'Package', category: 'General', keywords: ['package', 'build', 'compile', 'bundle', 'artifact'], component: VscPackage },
  { key: 'VscFile', label: 'File', category: 'General', keywords: ['file', 'script', 'bat', 'cmd', 'exe', 'document'], component: VscFile },
  { key: 'VscFileCode', label: 'Source File', category: 'General', keywords: ['source', 'code', 'file'], component: VscFileCode },
  { key: 'VscJson', label: 'JSON', category: 'General', keywords: ['json', 'config', 'settings', 'yaml', 'toml'], component: VscJson },
  { key: 'VscFilePdf', label: 'PDF', category: 'General', keywords: ['pdf', 'document', 'report'], component: VscFilePdf },
  { key: 'VscFileMedia', label: 'Media', category: 'General', keywords: ['media', 'image', 'video', 'audio'], component: VscFileMedia },
  { key: 'VscFolder', label: 'Folder', category: 'General', keywords: ['folder', 'directory', 'project'], component: VscFolder },
  { key: 'VscCloud', label: 'Cloud', category: 'General', keywords: ['cloud', 'saas', 'remote', 'hosting'], component: VscCloud },
  { key: 'VscLock', label: 'Security', category: 'General', keywords: ['security', 'lock', 'auth', 'authentication', 'ssl', 'tls'], component: VscLock },
  { key: 'VscMail', label: 'Mail', category: 'General', keywords: ['mail', 'email', 'smtp', 'notification'], component: VscMail },
  { key: 'VscRocket', label: 'Rocket', category: 'General', keywords: ['deploy', 'launch', 'release', 'rocket', 'startup'], component: VscRocket },
  { key: 'VscBeaker', label: 'Test', category: 'General', keywords: ['test', 'testing', 'lab', 'experiment', 'qa'], component: VscBeaker },
  { key: 'VscGear', label: 'Settings', category: 'General', keywords: ['settings', 'config', 'gear', 'preferences', 'options'], component: VscGear },
  { key: 'VscHeart', label: 'Health', category: 'General', keywords: ['health', 'heartbeat', 'status', 'uptime'], component: VscHeart },
  { key: 'VscLightbulb', label: 'Lightning', category: 'General', keywords: ['fast', 'lightning', 'performance', 'speed', 'zap'], component: VscLightbulb },
  { key: 'VscSearch', label: 'Search', category: 'General', keywords: ['search', 'find', 'lookup', 'query'], component: VscSearch },
  { key: 'VscPlay', label: 'Play', category: 'General', keywords: ['play', 'run', 'start', 'execute'], component: VscPlay },
  { key: 'VscNotebook', label: 'Notebook', category: 'General', keywords: ['notebook', 'notes', 'docs', 'documentation', 'wiki'], component: VscNotebook },
  { key: 'VscExtensions', label: 'Extensions', category: 'General', keywords: ['extension', 'plugin', 'addon', 'module'], component: VscExtensions },
  { key: 'VscSymbolNamespace', label: 'Namespace', category: 'General', keywords: ['namespace', 'module', 'scope', 'library'], component: VscSymbolNamespace },
  { key: 'VscWand', label: 'Magic', category: 'General', keywords: ['magic', 'wizard', 'auto', 'generate', 'ai'], component: VscWand },
  { key: 'VscTools', label: 'Tools', category: 'General', keywords: ['tool', 'utility', 'toolbox', 'wrench'], component: VscTools },
]

// Fast lookup by key
const ICON_BY_KEY = new Map<string, IconEntry>()
for (const entry of ICON_REGISTRY) {
  ICON_BY_KEY.set(entry.key, entry)
}

/** Get IconEntry by key. Returns undefined if not found. */
export function getIconByKey(key: string): IconEntry | undefined {
  return ICON_BY_KEY.get(key)
}

/** Get the icon component by key, with fallback to VscTools. */
export function getIconComponent(key: string): IconType {
  return ICON_BY_KEY.get(key)?.component ?? VscTools
}

/** Default icon key */
export const DEFAULT_ICON_KEY = 'VscTools'

/** Auto-resolve icon key from tool name/command/tags (for backward compat) */
export function autoResolveIconKey(name: string, command: string, tags?: string[]): string {
  const haystack = [name, command, ...(tags ?? [])].join(' ').toLowerCase()

  for (const entry of ICON_REGISTRY) {
    for (const kw of entry.keywords) {
      if (haystack.includes(kw)) {
        return entry.key
      }
    }
  }

  return DEFAULT_ICON_KEY
}
