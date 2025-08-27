'use client';

import { useEffect, useState } from 'react';
import { TocItem } from '@/lib/tocUtils';
import { Button } from '@/components/ui/button';
import { ChevronDown, List, X, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  headings: TocItem[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Group headings by H2 sections
  const groupedHeadings = headings.reduce((groups, heading) => {
    if (heading.level === 2) {
      groups.push({
        h2: heading,
        h3s: []
      });
    } else if (heading.level === 3 && groups.length > 0) {
      groups[groups.length - 1].h3s.push(heading);
    }
    return groups;
  }, [] as Array<{ h2: TocItem; h3s: TocItem[] }>);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc-container">
      {/* Table of Contents Dropdown for all screen sizes */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between items-center bg-background/90 backdrop-blur-md border-primary/20 shadow-sm hover:bg-background/95 transition-all duration-200 interactive"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="font-medium text-sm">Table of Contents</span>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {headings.length}
            </span>
          </div>
          {isExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Jump to section</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6 p-0 hover:bg-primary/10 interactive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <ul className="space-y-1">
                {groupedHeadings.map((group) => (
                  <li key={group.h2.id}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            scrollToHeading(group.h2.id);
                            setIsExpanded(false);
                          }}
                          className={`flex-1 text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-primary/10 cursor-pointer interactive ${
                            activeId === group.h2.id
                              ? 'text-primary bg-primary/15 font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span>{group.h2.text}</span>
                        </button>
                        {group.h3s.length > 0 && (
                          <button
                            onClick={() => toggleSection(group.h2.id)}
                            className="p-1 hover:bg-primary/10 rounded transition-all duration-200 ml-1"
                          >
                            {expandedSections.has(group.h2.id) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                      {group.h3s.length > 0 && expandedSections.has(group.h2.id) && (
                        <ul className="ml-4 space-y-1">
                          {group.h3s.map((h3) => (
                            <li key={h3.id}>
                              <button
                                onClick={() => {
                                  scrollToHeading(h3.id);
                                  setIsExpanded(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-primary/10 cursor-pointer interactive ${
                                  activeId === h3.id
                                    ? 'text-primary bg-primary/15 font-medium'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {h3.text}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { TableOfContents };
