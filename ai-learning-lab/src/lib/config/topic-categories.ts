export type TopicCategory =
  | "devops"
  | "cloud"
  | "frontend"
  | "backend"
  | "programming"
  | "databases"
  | "data"
  | "ml"
  | "mobile"
  | "security"
  | "sysadmin"
  | "vcs"
  | "testing"
  | "api"
  | "general";

export interface CategoryOptions {
  roles: Array<{ value: string; label: string }>;
  skills: Array<{ value: string; label: string }>;
  priorExperience: Array<{ value: string; label: string }>;
  outcomes: Array<{ value: string; label: string }>;
  depthOptions: Array<{ value: string; label: string }>;
}

export interface CategoryConfig extends CategoryOptions {
  name: string;
  keywords: string[];
}

export const TOPIC_CATEGORIES: Record<TopicCategory, CategoryConfig> = {
  // 1. DevOps & Infrastructure
  devops: {
    name: "DevOps & Infrastructure",
    keywords: [
      "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
      "ci/cd", "gitlab ci", "github actions", "argocd", "helm", "prometheus",
      "grafana", "nginx", "apache", "load balancer", "infrastructure",
      "container", "orchestration", "vault", "consul"
    ],
    roles: [
      { value: "DevOps Engineer", label: "DevOps Engineer" },
      { value: "Site Reliability Engineer", label: "Site Reliability Engineer (SRE)" },
      { value: "Platform Engineer", label: "Platform Engineer" },
      { value: "Infrastructure Engineer", label: "Infrastructure Engineer" },
      { value: "Cloud Engineer", label: "Cloud Engineer" },
      { value: "Support Engineer", label: "Support Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Linux CLI", label: "Linux command line (CLI)" },
      { value: "Bash scripting", label: "Bash/Shell scripting" },
      { value: "Python", label: "Python scripting" },
      { value: "Git", label: "Git version control" },
      { value: "YAML/JSON", label: "YAML/JSON configuration" },
      { value: "Networking", label: "Basic networking (TCP/IP, DNS)" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Used the basics" },
      { value: "Built small things", label: "Built small things with it" },
      { value: "Used in CI-CD", label: "Used it in CI/CD pipelines" },
      { value: "Used professionally", label: "Used it in production" }
    ],
    outcomes: [
      { value: "Deploy production systems", label: "Deploy and manage production systems" },
      { value: "Build CI-CD pipelines", label: "Build CI/CD pipelines" },
      { value: "Understand internals", label: "Understand how it works internally" },
      { value: "Troubleshoot", label: "Troubleshoot production issues" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "production-grade mastery", label: "Production-grade mastery" }
    ]
  },

  // 2. Cloud Platforms
  cloud: {
    name: "Cloud Platforms",
    keywords: [
      "aws", "amazon web services", "gcp", "google cloud", "azure",
      "ec2", "s3", "lambda", "cloudformation", "cdk", "cloudwatch",
      "iam", "vpc", "eks", "ecs", "fargate", "cloud run", "app engine"
    ],
    roles: [
      { value: "Cloud Engineer", label: "Cloud Engineer" },
      { value: "Cloud Architect", label: "Cloud Architect" },
      { value: "DevOps Engineer", label: "DevOps Engineer" },
      { value: "Solutions Architect", label: "Solutions Architect" },
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "Infrastructure Engineer", label: "Infrastructure Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Linux CLI", label: "Linux command line (CLI)" },
      { value: "Networking", label: "Basic networking (TCP/IP, DNS, VPC)" },
      { value: "Python", label: "Python or another scripting language" },
      { value: "IaC concepts", label: "Infrastructure as Code concepts" },
      { value: "Git", label: "Git version control" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Used the basics (console)" },
      { value: "Built small things", label: "Deployed small projects" },
      { value: "Used professionally", label: "Used in production workloads" },
      { value: "Certified", label: "Certified practitioner" }
    ],
    outcomes: [
      { value: "Design cloud architectures", label: "Design cloud architectures" },
      { value: "Deploy scalable apps", label: "Deploy scalable applications" },
      { value: "Optimize costs", label: "Optimize cloud costs" },
      { value: "Pass certifications", label: "Pass cloud certification exams" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "architect-level mastery", label: "Architect-level mastery" }
    ]
  },

  // 3. Frontend Development
  frontend: {
    name: "Frontend Development",
    keywords: [
      "react", "vue", "angular", "next.js", "nextjs", "svelte", "nuxt",
      "frontend", "front-end", "javascript", "typescript", "css",
      "tailwind", "html", "webpack", "vite", "redux", "state management",
      "sass", "less", "styled-components", "emotion"
    ],
    roles: [
      { value: "Frontend Developer", label: "Frontend Developer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "UI Engineer", label: "UI Engineer" },
      { value: "Web Developer", label: "Web Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "HTML/CSS", label: "HTML & CSS basics" },
      { value: "JavaScript", label: "JavaScript fundamentals" },
      { value: "Git", label: "Git version control" },
      { value: "npm/yarn", label: "npm/yarn package management" },
      { value: "React/Vue/Angular", label: "Basic React/Vue/Angular" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Completed tutorials" },
      { value: "Built small things", label: "Built small projects" },
      { value: "Used professionally", label: "Used in production apps" },
      { value: "Led projects", label: "Led frontend projects" }
    ],
    outcomes: [
      { value: "Build production apps", label: "Build production web applications" },
      { value: "Create accessible UIs", label: "Create responsive, accessible UIs" },
      { value: "Understand internals", label: "Understand framework internals" },
      { value: "Write maintainable code", label: "Write maintainable component code" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior frontend engineer level" }
    ]
  },

  // 4. Backend Development
  backend: {
    name: "Backend Development",
    keywords: [
      "node.js", "nodejs", "express", "fastify", "django", "flask",
      "spring", "spring boot", "rails", "ruby on rails", "laravel",
      "backend", "back-end", "api", "rest", "graphql", "microservices",
      "nestjs", "fastapi", "gin", "echo", "fiber"
    ],
    roles: [
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "API Developer", label: "API Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Platform Engineer", label: "Platform Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Programming language", label: "At least one programming language" },
      { value: "SQL", label: "SQL and database basics" },
      { value: "REST APIs", label: "REST API concepts" },
      { value: "Git", label: "Git version control" },
      { value: "Command line", label: "Command line basics" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Completed tutorials" },
      { value: "Built small things", label: "Built small APIs/services" },
      { value: "Used professionally", label: "Used in production" },
      { value: "Architected systems", label: "Architected backend systems" }
    ],
    outcomes: [
      { value: "Build production APIs", label: "Build production APIs and services" },
      { value: "Design architectures", label: "Design scalable architectures" },
      { value: "Performance optimization", label: "Understand performance optimization" },
      { value: "Troubleshoot", label: "Troubleshoot production issues" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior backend engineer level" }
    ]
  },

  // 5. Programming Languages
  programming: {
    name: "Programming Languages",
    keywords: [
      "python", "java", "go", "golang", "rust", "c++", "c#", "ruby",
      "kotlin", "swift", "programming", "coding", "language", "scala",
      "elixir", "clojure", "haskell", "ocaml"
    ],
    roles: [
      { value: "Software Developer", label: "Software Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Data Engineer", label: "Data Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Programming concepts", label: "Basic programming concepts" },
      { value: "Another language", label: "Another programming language" },
      { value: "Git", label: "Git version control" },
      { value: "Command line", label: "Command line basics" },
      { value: "Problem-solving", label: "Problem-solving fundamentals" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Learning the syntax" },
      { value: "Built small things", label: "Built small programs" },
      { value: "Used professionally", label: "Used professionally" },
      { value: "Expert", label: "Expert-level proficiency" }
    ],
    outcomes: [
      { value: "Write production code", label: "Write production-quality code" },
      { value: "Build projects", label: "Build real-world projects" },
      { value: "Understand idioms", label: "Understand language idioms and patterns" },
      { value: "Open source", label: "Contribute to open source" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "expert-level mastery", label: "Expert-level proficiency" }
    ]
  },

  // 6. Databases
  databases: {
    name: "Databases",
    keywords: [
      "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite",
      "elasticsearch", "dynamodb", "cassandra", "sql", "nosql",
      "database", "db", "data modeling", "mariadb", "oracle", "mssql",
      "neo4j", "couchdb", "firestore"
    ],
    roles: [
      { value: "Database Administrator", label: "Database Administrator (DBA)" },
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "Data Engineer", label: "Data Engineer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Basic SQL", label: "Basic SQL queries" },
      { value: "Programming", label: "Programming fundamentals" },
      { value: "Command line", label: "Command line basics" },
      { value: "Data structures", label: "Data structures concepts" },
      { value: "Git", label: "Git version control" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Basic queries only" },
      { value: "Built small things", label: "Designed simple schemas" },
      { value: "Used professionally", label: "Used in production" },
      { value: "DBA experience", label: "DBA-level experience" }
    ],
    outcomes: [
      { value: "Design schemas", label: "Design efficient database schemas" },
      { value: "Write optimized queries", label: "Write optimized queries" },
      { value: "Understand performance", label: "Understand indexing and performance" },
      { value: "Handle migrations", label: "Handle data migrations" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "dba-level mastery", label: "DBA-level mastery" }
    ]
  },

  // 7. Data & Analytics
  data: {
    name: "Data & Analytics",
    keywords: [
      "pandas", "numpy", "data analysis", "data science", "spark",
      "airflow", "etl", "data pipeline", "data warehouse", "bigquery",
      "snowflake", "dbt", "analytics", "tableau", "power bi", "looker",
      "redshift", "databricks", "kafka"
    ],
    roles: [
      { value: "Data Analyst", label: "Data Analyst" },
      { value: "Data Engineer", label: "Data Engineer" },
      { value: "Data Scientist", label: "Data Scientist" },
      { value: "Analytics Engineer", label: "Analytics Engineer" },
      { value: "BI Developer", label: "Business Intelligence Developer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "SQL", label: "SQL queries" },
      { value: "Python", label: "Python basics" },
      { value: "Excel", label: "Excel/spreadsheets" },
      { value: "Statistics", label: "Statistics fundamentals" },
      { value: "Git", label: "Git version control" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Basic usage" },
      { value: "Built small things", label: "Built simple pipelines/reports" },
      { value: "Used professionally", label: "Used in production" },
      { value: "Led projects", label: "Led data projects" }
    ],
    outcomes: [
      { value: "Build pipelines", label: "Build data pipelines" },
      { value: "Create dashboards", label: "Create insightful dashboards" },
      { value: "Advanced analysis", label: "Perform advanced analysis" },
      { value: "Large datasets", label: "Work with large datasets" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior data professional level" }
    ]
  },

  // 8. Machine Learning & AI
  ml: {
    name: "Machine Learning & AI",
    keywords: [
      "machine learning", "ml", "deep learning", "tensorflow", "pytorch",
      "scikit-learn", "sklearn", "neural network", "nlp", "llm",
      "gpt", "transformer", "computer vision", "ai", "artificial intelligence",
      "keras", "huggingface", "langchain", "rag", "fine-tuning"
    ],
    roles: [
      { value: "ML Engineer", label: "Machine Learning Engineer" },
      { value: "Data Scientist", label: "Data Scientist" },
      { value: "AI Researcher", label: "AI/ML Researcher" },
      { value: "MLOps Engineer", label: "MLOps Engineer" },
      { value: "Software Engineer ML", label: "Software Engineer (ML)" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Python", label: "Python programming" },
      { value: "Math", label: "Mathematics (linear algebra, calculus)" },
      { value: "Statistics", label: "Statistics and probability" },
      { value: "NumPy/Pandas", label: "NumPy/Pandas basics" },
      { value: "Git", label: "Git version control" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Completed tutorials" },
      { value: "Built small things", label: "Built toy models" },
      { value: "Used professionally", label: "Deployed models to production" },
      { value: "Research", label: "Published research" }
    ],
    outcomes: [
      { value: "Build models", label: "Build and train ML models" },
      { value: "Deploy models", label: "Deploy models to production" },
      { value: "Understand algorithms", label: "Understand algorithm internals" },
      { value: "Conduct research", label: "Conduct ML research" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "research-level mastery", label: "Research-grade understanding" }
    ]
  },

  // 9. Mobile Development
  mobile: {
    name: "Mobile Development",
    keywords: [
      "react native", "flutter", "swift", "ios", "android", "kotlin",
      "mobile", "app development", "expo", "swiftui", "jetpack compose",
      "xamarin", "ionic", "capacitor", "cordova"
    ],
    roles: [
      { value: "Mobile Developer", label: "Mobile Developer" },
      { value: "iOS Developer", label: "iOS Developer" },
      { value: "Android Developer", label: "Android Developer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "JavaScript/Dart/Swift/Kotlin", label: "JavaScript or Dart or Swift/Kotlin" },
      { value: "Git", label: "Git version control" },
      { value: "REST APIs", label: "REST API consumption" },
      { value: "UI/UX", label: "UI/UX basics" },
      { value: "App stores", label: "App Store/Play Store basics" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Completed tutorials" },
      { value: "Built small things", label: "Built demo apps" },
      { value: "Published apps", label: "Published apps to stores" },
      { value: "Led projects", label: "Led mobile projects" }
    ],
    outcomes: [
      { value: "Build production apps", label: "Build production mobile apps" },
      { value: "Publish to stores", label: "Publish to app stores" },
      { value: "Platform patterns", label: "Understand platform-specific patterns" },
      { value: "Optimize performance", label: "Optimize app performance" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior mobile engineer level" }
    ]
  },

  // 10. Security & Networking
  security: {
    name: "Security & Networking",
    keywords: [
      "security", "cybersecurity", "penetration testing", "pentest",
      "networking", "firewall", "vpn", "encryption", "oauth", "authentication",
      "authorization", "owasp", "vulnerability", "tcp/ip", "dns",
      "ssl", "tls", "https", "siem", "soc"
    ],
    roles: [
      { value: "Security Engineer", label: "Security Engineer" },
      { value: "Penetration Tester", label: "Penetration Tester" },
      { value: "Network Engineer", label: "Network Engineer" },
      { value: "DevSecOps Engineer", label: "DevSecOps Engineer" },
      { value: "Security Analyst", label: "Security Analyst" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Linux CLI", label: "Linux command line" },
      { value: "Networking", label: "Networking fundamentals (TCP/IP)" },
      { value: "Programming", label: "Programming/scripting basics" },
      { value: "OS concepts", label: "Operating system concepts" },
      { value: "Git", label: "Git version control" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Basic understanding" },
      { value: "Built small things", label: "Completed CTFs/labs" },
      { value: "Used professionally", label: "Used professionally" },
      { value: "Certified", label: "Certified professional" }
    ],
    outcomes: [
      { value: "Identify vulnerabilities", label: "Identify security vulnerabilities" },
      { value: "Secure architectures", label: "Implement secure architectures" },
      { value: "Attack vectors", label: "Understand attack vectors" },
      { value: "Certifications", label: "Pass security certifications" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "expert-level mastery", label: "Expert security professional level" }
    ]
  },

  // 11. System Administration
  sysadmin: {
    name: "System Administration",
    keywords: [
      "linux", "ubuntu", "centos", "rhel", "debian", "fedora",
      "windows server", "sysadmin", "system administration",
      "shell", "bash", "powershell", "active directory", "systemd",
      "cron", "ssh", "ldap"
    ],
    roles: [
      { value: "System Administrator", label: "System Administrator" },
      { value: "Linux Administrator", label: "Linux Administrator" },
      { value: "IT Support Engineer", label: "IT Support Engineer" },
      { value: "DevOps Engineer", label: "DevOps Engineer" },
      { value: "Infrastructure Engineer", label: "Infrastructure Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Command line", label: "Basic command line usage" },
      { value: "OS concepts", label: "Operating system concepts" },
      { value: "Networking", label: "Networking basics" },
      { value: "Text editors", label: "Text editors (vim/nano)" },
      { value: "Troubleshooting", label: "Troubleshooting methodology" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Home/personal use" },
      { value: "Built small things", label: "Set up personal servers" },
      { value: "Used professionally", label: "Managed production systems" },
      { value: "Senior admin", label: "Senior sysadmin experience" }
    ],
    outcomes: [
      { value: "Manage servers", label: "Manage production servers" },
      { value: "Automate tasks", label: "Automate system tasks" },
      { value: "Troubleshoot", label: "Troubleshoot system issues" },
      { value: "Monitoring", label: "Implement monitoring and alerting" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior sysadmin level" }
    ]
  },

  // 12. Version Control & Collaboration
  vcs: {
    name: "Version Control & Collaboration",
    keywords: [
      "git", "github", "gitlab", "bitbucket", "version control",
      "branching", "merge", "pull request", "code review", "gitflow",
      "trunk-based", "monorepo"
    ],
    roles: [
      { value: "Software Developer", label: "Software Developer" },
      { value: "DevOps Engineer", label: "DevOps Engineer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Team Lead", label: "Team Lead" },
      { value: "Engineering Manager", label: "Engineering Manager" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Command line", label: "Basic command line" },
      { value: "Text editor", label: "Text editor usage" },
      { value: "Collaboration", label: "Collaboration concepts" },
      { value: "Programming", label: "Basic programming" },
      { value: "File navigation", label: "File system navigation" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Basic add/commit/push" },
      { value: "Built small things", label: "Worked with branches" },
      { value: "Used professionally", label: "Used in team workflows" },
      { value: "Led teams", label: "Defined team workflows" }
    ],
    outcomes: [
      { value: "Team workflows", label: "Manage code effectively in teams" },
      { value: "Branching strategies", label: "Implement branching strategies" },
      { value: "Merge conflicts", label: "Handle merge conflicts confidently" },
      { value: "CI/CD workflows", label: "Set up CI/CD workflows" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "expert-level mastery", label: "Expert-level Git workflows" }
    ]
  },

  // 13. Testing & QA
  testing: {
    name: "Testing & QA",
    keywords: [
      "testing", "jest", "pytest", "selenium", "cypress", "playwright",
      "unit test", "integration test", "e2e", "qa", "quality assurance",
      "test automation", "mocha", "chai", "vitest", "testing library"
    ],
    roles: [
      { value: "QA Engineer", label: "QA Engineer" },
      { value: "Test Automation Engineer", label: "Test Automation Engineer" },
      { value: "SDET", label: "Software Developer in Test (SDET)" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Programming", label: "Programming basics" },
      { value: "Web/app fundamentals", label: "Web/app fundamentals" },
      { value: "Git", label: "Git version control" },
      { value: "Debugging", label: "Debugging skills" },
      { value: "Analytical thinking", label: "Analytical thinking" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Written basic tests" },
      { value: "Built small things", label: "Built test suites" },
      { value: "Used professionally", label: "Used in production projects" },
      { value: "Led QA", label: "Led QA initiatives" }
    ],
    outcomes: [
      { value: "Write test suites", label: "Write comprehensive test suites" },
      { value: "Test automation", label: "Set up test automation frameworks" },
      { value: "Testing strategies", label: "Understand testing strategies" },
      { value: "Code quality", label: "Improve code quality" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "senior-level mastery", label: "Senior QA engineer level" }
    ]
  },

  // 14. API & Integration
  api: {
    name: "API & Integration",
    keywords: [
      "rest api", "graphql", "grpc", "api design", "swagger", "openapi",
      "postman", "api gateway", "webhook", "integration", "soap",
      "json api", "hateoas", "api security"
    ],
    roles: [
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "API Developer", label: "API Developer" },
      { value: "Integration Engineer", label: "Integration Engineer" },
      { value: "Full-stack Developer", label: "Full-stack Developer" },
      { value: "Solutions Architect", label: "Solutions Architect" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "HTTP", label: "HTTP fundamentals" },
      { value: "JSON", label: "JSON data format" },
      { value: "Programming", label: "Programming basics" },
      { value: "Git", label: "Git version control" },
      { value: "Postman", label: "Postman or similar tools" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Consumed APIs" },
      { value: "Built small things", label: "Built simple APIs" },
      { value: "Used professionally", label: "Designed production APIs" },
      { value: "Architected", label: "Architected API platforms" }
    ],
    outcomes: [
      { value: "Design APIs", label: "Design robust APIs" },
      { value: "Build integrations", label: "Build integrations between systems" },
      { value: "API security", label: "Understand API security" },
      { value: "Document APIs", label: "Document APIs effectively" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "architect-level mastery", label: "API architect level" }
    ]
  },

  // 15. General (Fallback)
  general: {
    name: "General Technology",
    keywords: [], // Catch-all for unmatched topics
    roles: [
      { value: "Software Developer", label: "Software Developer" },
      { value: "Engineer", label: "Engineer" },
      { value: "Technical Professional", label: "Technical Professional" },
      { value: "IT Professional", label: "IT Professional" },
      { value: "Consultant", label: "Consultant" },
      { value: "Student", label: "Student" },
      { value: "Other", label: "Other" }
    ],
    skills: [
      { value: "Programming", label: "Programming basics" },
      { value: "Command line", label: "Command line basics" },
      { value: "Git", label: "Git version control" },
      { value: "Problem-solving", label: "Problem-solving" },
      { value: "Documentation", label: "Technical documentation" },
      { value: "None", label: "None of the above" }
    ],
    priorExperience: [
      { value: "Never", label: "Never used it" },
      { value: "Used basics", label: "Basic familiarity" },
      { value: "Built small things", label: "Some hands-on experience" },
      { value: "Used professionally", label: "Used professionally" },
      { value: "Expert", label: "Expert-level experience" }
    ],
    outcomes: [
      { value: "Build projects", label: "Build real-world projects" },
      { value: "Understand deeply", label: "Understand core concepts deeply" },
      { value: "Apply at work", label: "Apply knowledge at work" },
      { value: "Troubleshoot", label: "Troubleshoot effectively" },
      { value: "Interview-ready", label: "Be interview-ready" }
    ],
    depthOptions: [
      { value: "use confidently", label: "Use it confidently in my work" },
      { value: "expert-level mastery", label: "Expert-level mastery" }
    ]
  }
};

// Helper function to get category options
export function getCategoryOptions(category: TopicCategory): CategoryOptions {
  const config = TOPIC_CATEGORIES[category];
  return {
    roles: config.roles,
    skills: config.skills,
    priorExperience: config.priorExperience,
    outcomes: config.outcomes,
    depthOptions: config.depthOptions
  };
}

// Get all category names for classification prompt
export function getAllCategoryNames(): string[] {
  return Object.keys(TOPIC_CATEGORIES) as TopicCategory[];
}

// Get category display name
export function getCategoryDisplayName(category: TopicCategory): string {
  return TOPIC_CATEGORIES[category].name;
}
