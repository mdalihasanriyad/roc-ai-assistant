import { Logo } from "@/components/ui/Logo";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Use Cases", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "API Reference", "Support", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="sm" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered design intelligence platform for architects, designers,
              and creative professionals.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Roc AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for designers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
