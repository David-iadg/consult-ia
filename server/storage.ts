import { 
  User, 
  InsertUser, 
  Post, 
  InsertPost, 
  Application, 
  InsertApplication,
  ContactSubmission,
  InsertContactSubmission,
  ChatbotQa,
  InsertChatbotQa
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog posts
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Applications
  getAllApplications(): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplication(id: number, app: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Chatbot QA
  getAllChatbotQa(language?: string): Promise<ChatbotQa[]>;
  createChatbotQa(qa: InsertChatbotQa): Promise<ChatbotQa>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private applications: Map<number, Application>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private chatbotQa: Map<number, ChatbotQa>;
  private currentUserId: number;
  private currentPostId: number;
  private currentApplicationId: number;
  private currentContactId: number;
  private currentChatbotQaId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.applications = new Map();
    this.contactSubmissions = new Map();
    this.chatbotQa = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentApplicationId = 1;
    this.currentContactId = 1;
    this.currentChatbotQaId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Blog posts
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      ...insertPost, 
      id, 
      date: new Date() 
    };
    this.posts.set(id, post);
    return post;
  }
  
  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updateData };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
  
  // Applications
  async getAllApplications(): Promise<Application[]> {
    return Array.from(this.applications.values()).sort((a, b) => a.order - b.order);
  }
  
  async getApplicationById(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const app: Application = { ...insertApp, id };
    this.applications.set(id, app);
    return app;
  }
  
  async updateApplication(id: number, updateData: Partial<InsertApplication>): Promise<Application | undefined> {
    const app = this.applications.get(id);
    if (!app) return undefined;
    
    const updatedApp = { ...app, ...updateData };
    this.applications.set(id, updatedApp);
    return updatedApp;
  }
  
  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }
  
  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      date: new Date(),
      status: "new" 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  
  // Chatbot QA
  async getAllChatbotQa(language = "fr"): Promise<ChatbotQa[]> {
    return Array.from(this.chatbotQa.values()).filter(qa => qa.language === language);
  }
  
  async createChatbotQa(insertQa: InsertChatbotQa): Promise<ChatbotQa> {
    const id = this.currentChatbotQaId++;
    const qa: ChatbotQa = { ...insertQa, id };
    this.chatbotQa.set(id, qa);
    return qa;
  }
  
  // Initialize sample data
  private initializeSampleData() {
    // Sample blog posts
    const samplePosts = [
      {
        title: "L'IA au service de la transformation d'entreprise",
        slug: "ia-transformation-entreprise",
        excerpt: "Comment l'intelligence artificielle révolutionne les processus métier et accélère la transformation numérique des organisations.",
        content: "<p>L'intelligence artificielle (IA) est devenue un levier majeur de transformation pour les entreprises cherchant à moderniser leurs opérations et à gagner en efficacité...</p><p>Dans cet article, nous explorons comment l'IA peut être intégrée dans différents départements pour optimiser les processus et créer de la valeur ajoutée.</p><h2>Automatisation des tâches répétitives</h2><p>L'un des premiers bénéfices de l'IA est sa capacité à automatiser les tâches répétitives et chronophages. Grâce à l'apprentissage automatique, les systèmes peuvent désormais traiter des documents, gérer des communications basiques avec les clients, et même effectuer des analyses préliminaires de données.</p><h2>Analyse prédictive</h2><p>L'IA permet également de développer des modèles prédictifs sophistiqués qui peuvent anticiper les tendances du marché, les comportements des clients, ou même les défaillances potentielles d'équipements avant qu'elles ne surviennent.</p><h2>Personnalisation à grande échelle</h2><p>Grâce à l'IA, les entreprises peuvent offrir des expériences hautement personnalisées à leurs clients, même à grande échelle. Les algorithmes analysent les préférences et comportements pour adapter les offres et communications en temps réel.</p><p>En conclusion, l'IA n'est plus une technologie futuriste mais un outil stratégique que les entreprises doivent intégrer dans leur feuille de route de transformation numérique pour rester compétitives dans un environnement économique en constante évolution.</p>",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "Transformation Numérique",
        date: new Date("2023-05-12"),
        authorId: 1
      },
      {
        title: "5 étapes clés pour réussir votre réorganisation",
        slug: "etapes-cles-reorganisation",
        excerpt: "Guide pratique pour mener à bien un projet de réorganisation d'entreprise tout en maintenant l'engagement des équipes.",
        content: "<p>La réorganisation d'une entreprise est un processus complexe qui nécessite une planification minutieuse et une exécution stratégique...</p><p>Dans cet article, nous détaillons les cinq étapes essentielles pour assurer le succès de votre projet de réorganisation tout en préservant l'engagement et la motivation de vos équipes.</p><h2>1. Définir clairement les objectifs</h2><p>Avant d'initier tout changement, il est crucial de définir précisément les objectifs de la réorganisation. S'agit-il d'améliorer l'efficacité opérationnelle, de s'adapter à un nouveau marché, ou de réduire les coûts? Des objectifs clairs permettront de guider toutes les décisions ultérieures.</p><h2>2. Impliquer les parties prenantes</h2><p>La résistance au changement est souvent le plus grand obstacle à une réorganisation réussie. En impliquant les employés et les cadres intermédiaires dès le début du processus, vous pouvez recueillir des idées précieuses et favoriser l'adhésion au projet.</p><h2>3. Communiquer transparemment</h2><p>Une communication claire et régulière est essentielle pour dissiper les inquiétudes et les rumeurs. Expliquez le pourquoi du changement, ce qui va se passer, et comment cela affectera chaque département ou individu.</p><h2>4. Former et accompagner</h2><p>Proposez des formations pour aider les employés à acquérir les nouvelles compétences nécessaires. Un accompagnement personnalisé peut également aider les managers à s'adapter à leurs nouvelles responsabilités.</p><h2>5. Évaluer et ajuster</h2><p>La réorganisation n'est pas un événement ponctuel mais un processus continu. Mettez en place des indicateurs de performance pour mesurer l'efficacité des changements et n'hésitez pas à faire des ajustements si nécessaire.</p><p>En suivant ces cinq étapes, vous maximiserez vos chances de réussir votre projet de réorganisation tout en préservant un climat de travail positif et productif.</p>",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "Organisation d'Entreprise",
        date: new Date("2023-04-25"),
        authorId: 1
      },
      {
        title: "Automatisation intelligente : au-delà des chatbots",
        slug: "automatisation-intelligente-chatbots",
        excerpt: "Découvrez comment les solutions d'IA peuvent automatiser les tâches complexes et libérer le potentiel créatif de vos équipes.",
        content: "<p>L'automatisation intelligente représente bien plus que de simples chatbots répondant à des questions fréquentes...</p><p>Elle englobe un ensemble de technologies avancées capables d'automatiser des processus complexes, d'apprendre et de s'adapter, libérant ainsi le potentiel humain pour des tâches à plus forte valeur ajoutée.</p><h2>Au-delà des interactions simples</h2><p>Si les chatbots constituent souvent la première expérience d'automatisation pour de nombreuses entreprises, l'automatisation intelligente va bien plus loin. Elle peut analyser des contrats juridiques complexes, détecter des anomalies dans des ensembles de données massifs, ou même prendre des décisions basées sur des critères multiples.</p><h2>L'IA cognitive au service de l'entreprise</h2><p>Les systèmes d'IA cognitive peuvent comprendre le langage naturel, interpréter des images, et même apprendre de leurs interactions passées pour améliorer leurs performances futures. Ces capacités permettent d'automatiser des tâches qui nécessitaient auparavant un jugement humain.</p><h2>Libérer le potentiel humain</h2><p>L'objectif ultime de l'automatisation intelligente n'est pas de remplacer les humains, mais de les libérer des tâches répétitives et chronophages. En automatisant ces aspects de leur travail, les employés peuvent se concentrer sur la créativité, l'innovation et la résolution de problèmes complexes.</p><h2>Mise en œuvre stratégique</h2><p>Pour tirer pleinement parti de l'automatisation intelligente, les entreprises doivent adopter une approche stratégique. Cela implique d'identifier les processus qui bénéficieraient le plus de l'automatisation, de préparer les équipes au changement, et de mettre en place des mécanismes de surveillance et d'amélioration continue.</p><p>En conclusion, l'automatisation intelligente représente une opportunité majeure pour les entreprises de transformer leurs opérations et de redéfinir le rôle de leurs collaborateurs. Celles qui sauront l'exploiter de manière stratégique gagneront un avantage concurrentiel significatif dans les années à venir.</p>",
        imageUrl: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "Solutions IA",
        date: new Date("2023-03-03"),
        authorId: 1
      }
    ];
    
    // Add sample posts to storage
    samplePosts.forEach(post => {
      this.posts.set(this.currentPostId, { ...post, id: this.currentPostId });
      this.currentPostId++;
    });
    
    // Sample applications
    const sampleApps = [
      {
        title: "IA Assistant",
        description: "Assistant virtuel intelligent pour l'automatisation de tâches administratives",
        icon: "fas fa-robot",
        url: "#",
        order: 1
      },
      {
        title: "DataViz Pro",
        description: "Outil de visualisation de données avancé pour l'aide à la décision",
        icon: "fas fa-chart-line",
        url: "#",
        order: 2
      },
      {
        title: "ProcessFlow",
        description: "Plateforme de modélisation et d'optimisation des processus métier",
        icon: "fas fa-tasks",
        url: "#",
        order: 3
      },
      {
        title: "DocuGenius",
        description: "Solution d'analyse et de génération de documents assistée par IA",
        icon: "fas fa-file-contract",
        url: "#",
        order: 4
      },
      {
        title: "ChatIntegrator",
        description: "Plateforme d'intégration de chatbots intelligents personnalisables",
        icon: "fas fa-comments",
        url: "#",
        order: 5
      },
      {
        title: "IdeaLab",
        description: "Environnement collaboratif d'innovation et de brainstorming",
        icon: "fas fa-lightbulb",
        url: "#",
        order: 6
      }
    ];
    
    // Add sample applications to storage
    sampleApps.forEach(app => {
      this.applications.set(this.currentApplicationId, { ...app, id: this.currentApplicationId });
      this.currentApplicationId++;
    });
    
    // Sample chatbot QA pairs
    const sampleChatbotQA = [
      {
        language: "fr",
        keywords: ["transformation", "digitale", "numérique"],
        question: "Que proposez-vous en matière de transformation numérique?",
        answer: "La transformation numérique est au cœur de nos expertises. Nous accompagnons les entreprises dans leur transition vers le digital avec des solutions sur mesure. Nous analysons vos processus existants, identifions les opportunités d'amélioration, et implémentons les technologies adaptées à vos besoins spécifiques."
      },
      {
        language: "fr",
        keywords: ["ia", "intelligence artificielle", "automatisation"],
        question: "Quelles solutions d'IA proposez-vous?",
        answer: "Nos solutions d'IA sont conçues pour automatiser les processus et améliorer la prise de décision. Nous proposons des solutions sur mesure adaptées à votre secteur d'activité, incluant l'analyse prédictive, les chatbots intelligents, l'automatisation de processus et l'aide à la décision basée sur les données."
      },
      {
        language: "fr",
        keywords: ["tarif", "prix", "coût", "budget"],
        question: "Quels sont vos tarifs?",
        answer: "Nos tarifs varient selon vos besoins spécifiques. Nous proposons un premier rendez-vous gratuit pour évaluer votre projet et vous fournir un devis détaillé. Nous adaptons nos offres à différents budgets tout en garantissant un service de qualité et des résultats concrets."
      },
      {
        language: "en",
        keywords: ["transformation", "digital"],
        question: "What do you offer in terms of digital transformation?",
        answer: "Digital transformation is at the core of our expertise. We support companies in their transition to digital with tailored solutions. We analyze your existing processes, identify opportunities for improvement, and implement technologies adapted to your specific needs."
      },
      {
        language: "en",
        keywords: ["ai", "artificial intelligence", "automation"],
        question: "What AI solutions do you offer?",
        answer: "Our AI solutions are designed to automate processes and improve decision-making. We offer custom solutions adapted to your industry, including predictive analytics, intelligent chatbots, process automation, and data-driven decision support."
      },
      {
        language: "en",
        keywords: ["pricing", "price", "cost", "budget"],
        question: "What are your rates?",
        answer: "Our rates vary according to your specific needs. We offer a free initial consultation to assess your project and provide you with a detailed quote. We adapt our offerings to different budgets while ensuring quality service and concrete results."
      }
    ];
    
    // Add sample chatbot QA to storage
    sampleChatbotQA.forEach(qa => {
      this.chatbotQa.set(this.currentChatbotQaId, { ...qa, id: this.currentChatbotQaId });
      this.currentChatbotQaId++;
    });
    
    // Sample user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "password" // In a real app, this would be hashed
    });
  }
}

export const storage = new MemStorage();
