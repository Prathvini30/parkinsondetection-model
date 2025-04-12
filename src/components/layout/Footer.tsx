
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Parkinson Insight</h3>
            <p className="text-sm text-muted-foreground">
              Early detection and monitoring of Parkinson's disease through AI-powered analysis.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/assessment" className="text-muted-foreground hover:text-foreground transition-colors">
                  Start Assessment
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Educational Resources
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Disclaimer</h3>
            <p className="text-xs text-muted-foreground">
              This application is for informational purposes only and should not be used as a
              replacement for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Parkinson Insight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
