import { Github, Mail, Twitter } from "lucide-react"
import { Button } from "./ui/button"

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Librova</h3>
            <p className="text-sm text-muted-foreground">
              Your digital library solution for publishers and readers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">API Reference</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">About Us</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Blog</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Careers</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Librova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
