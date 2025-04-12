import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if running in Capacitor (mobile app)
    const isCapacitorApp = window.location.href.includes("capacitor://") || 
                          document.URL.startsWith('http://localhost') ||
                          document.URL.startsWith('capacitor://');
    
    const checkMobile = () => {
      // If we're in a Capacitor app, always consider it mobile
      if (isCapacitorApp) {
        setIsMobile(true);
        return;
      }
      
      // Otherwise check screen width
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkMobile)
    checkMobile();
    return () => mql.removeEventListener("change", checkMobile)
  }, [])

  return !!isMobile
}
