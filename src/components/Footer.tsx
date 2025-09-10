import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sun, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube,
  Linkedin,
  ArrowUp,
  Leaf,
  Shield,
  Award
} from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-white relative">
      {/* Back to Top Button */}
      <div className="absolute -top-6 right-8">
        <Button 
          onClick={scrollToTop}
          className="bg-primary hover:bg-primary-hover rounded-full p-3 shadow-solar"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Fique por Dentro das Novidades
              </h3>
              <p className="text-white/80">
                Receba dicas sobre energia solar, promoções especiais e novidades do setor.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Input 
                placeholder="Seu melhor email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="solar">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sun className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Isollar E.E</span>
            </div>
            
            <p className="text-white/80 mb-6">
              Especialistas em energia solar com mais de 4 anos de experiência. 
              Transformamos a energia do sol em economia para sua casa ou empresa.
            </p>

            {/* Certifications */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>ANEEL</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span>INMETRO</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4 text-primary" />
                <span>ISO 14001</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              Nossos Serviços
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Energia Solar Residencial
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Energia Solar Comercial
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Sistemas Industriais
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Manutenção e Monitoramento
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Consultoria Energética
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Financiamento Solar
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              Links Úteis
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-white/80 hover:text-primary transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-primary transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-white/80 hover:text-primary transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#projects" className="text-white/80 hover:text-primary transition-colors">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors">
                  Calculadora Solar
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              Contatos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div className="text-white/80">
                  <div>Rua Principal, 12</div>
                  <div>São luís - MA</div>
                  <div>CEP: 65095-000</div>
                </div>
              </li>
              
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="text-white/80">
                  <div>(98) 99161-6381</div>
                  <div className="text-sm">WhatsApp</div>
                </div>
              </li>
              
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div className="text-white/80">
                  <div>isollarenergyengenharia@gmail.com</div>
                  <div className="text-sm">E-mail Comercial</div>
                </div>
              </li>
            </ul>

           { /* CTA Button */}
           {/* <div className="mt-6">
              <Button variant="solar" className="w-full">
                Solicitar Orçamento
              </Button>
            </div>*/}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2022 Isollar. Todos os direitos reservados.
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
            
            <div className="text-white/60 text-sm">
              Desenvolvido com 💛 para um futuro sustentável
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};