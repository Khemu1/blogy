import {
  Globe,
  Monitor,
  Users,
  BarChart,
  DollarSign,
  Smartphone,
  PenSquare,
  BookOpen,
  MessageSquare,
  Share2,
  Zap,
  Clock,
} from "lucide-react";

export const BlogFilter = [
  { name: "Latest Create Date", value: "create-d-desc" },
  { name: "Oldest Create Date ", value: "create-d-asc" },
  { name: "Latest Update Date ", value: "update-d-desc" },
  { name: "Oldest Update Date ", value: "update-d-asc" },
];

export const aboutContent = {
  title: "About Blogy",
  description: `Blogy is an innovative blogging platform designed to connect passionate writers and curious readers in a dynamic, engaging environment. At its core, Blogy is a space where stories come to life, ideas are shared, and meaningful conversations are sparked.`,
  highlights: [
    "Platform for writers of all experience levels",
    "Global community of readers and creators",
    "Diverse range of topics and perspectives",
    "Tools to help content reach its full potential",
  ],
  cta: {
    text: "Join our growing community today",
    link: "/signup",
  },
};

export const features = [
  {
    title: "Diverse Topics",
    description:
      "From technology and science to travel, lifestyle, and personal development, Blogy covers a wide range of subjects.",
    icon: <Globe className="w-8 h-8 text-primary" />,
    benefits: [
      "100+ categories to explore",
      "Niche communities for specialized topics",
      "Trending topics updated daily",
    ],
  },
  {
    title: "User-Friendly Interface",
    description:
      "An intuitive design that makes reading and writing blogs seamless.",
    icon: <Monitor className="w-8 h-8 text-primary" />,
    benefits: [
      "WYSIWYG editor with markdown support",
      "Reading time estimates",
      "Dark/light mode options",
    ],
  },
  {
    title: "Engaging Community",
    description: "Connect with like-minded individuals and build a following.",
    icon: <Users className="w-8 h-8 text-primary" />,
    benefits: [
      "Commenting and discussion threads",
      "Reader feedback system",
      "Collaboration opportunities",
    ],
  },
  {
    title: "SEO & Analytics",
    description: "Built-in tools to optimize content for search engines.",
    icon: <BarChart className="w-8 h-8 text-primary" />,
    benefits: [
      "Real-time traffic analytics",
      "Keyword optimization suggestions",
      "Social sharing insights",
    ],
  },
  {
    title: "Monetization",
    description: "Earn from your content through various channels.",
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    benefits: [
      "Premium content options",
      "Affiliate marketing integration",
      "Sponsorship opportunities",
    ],
  },
  {
    title: "Mobile Optimized",
    description: "Fully responsive design that works on all devices.",
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    benefits: [
      "Dedicated mobile app",
      "Offline reading capabilities",
      "Push notifications",
    ],
  },
  {
    title: "Easy Publishing",
    description: "Intuitive tools to create and publish content effortlessly.",
    icon: <PenSquare className="w-8 h-8 text-primary" />,
    benefits: [
      "Draft autosave functionality",
      "Scheduled publishing",
      "Multi-format support",
    ],
  },
  {
    title: "Reading Experience",
    description: "Enjoy a distraction-free reading environment.",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    benefits: [
      "Customizable reading modes",
      "Text-to-speech functionality",
      "Bookmarking system",
    ],
  },
];

export const engagementFeatures = [
  {
    title: "Interactive Comments",
    description: "Real-time conversations with readers",
    icon: <MessageSquare className="w-6 h-6 text-secondary" />,
  },
  {
    title: "Social Sharing",
    description: "Easy content distribution across platforms",
    icon: <Share2 className="w-6 h-6 text-secondary" />,
  },
  {
    title: "Instant Notifications",
    description: "Stay updated on new interactions",
    icon: <Zap className="w-6 h-6 text-secondary" />,
  },
  {
    title: "Reading Time",
    description: "Know how long articles will take to read",
    icon: <Clock className="w-6 h-6 text-secondary" />,
  },
];

export const testimonials = [
  {
    quote: "Blogy helped me grow my audience by 300% in just six months!",
    author: "Sarah J., Travel Blogger",
    stats: "50k+ monthly readers",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    quote: "The easiest platform I've used to publish my technical articles.",
    author: "Mark T., Software Engineer",
    stats: "200+ published articles",
    icon: <Monitor className="w-5 h-5" />,
  },
];

export const callToAction = {
  primary: {
    text: "Start Writing Now",
    link: "/signup",
    icon: <PenSquare className="w-5 h-5" />,
  },
  secondary: {
    text: "Browse Articles",
    link: "/blogs",
    icon: <BookOpen className="w-5 h-5" />,
  },
};
