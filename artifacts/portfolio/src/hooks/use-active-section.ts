import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();
    
    // Add event listener for manual scrolling
    const handleScroll = () => {
      // Find the current section
      let current = "";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the element is near the top of the viewport (with some offset)
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = id;
          }
        }
      }
      
      // Fallback if at the very top
      if (window.scrollY < 100) {
        current = sectionIds[0];
      }
      
      // Fallback if at the very bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        current = sectionIds[sectionIds.length - 1];
      }
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, activeSection]);

  return activeSection;
}
