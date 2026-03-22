import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center text-text-secondary hover:text-primary transition-colors">

            <HomeIcon className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) =>
        <li key={index} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-text-muted mx-1" />
            {item.href ?
          <Link
            to={item.href}
            className="text-text-secondary hover:text-primary transition-colors">

                {item.label}
              </Link> :

          <span className="text-text-primary font-medium">
                {item.label}
              </span>
          }
          </li>
        )}
      </ol>
    </nav>);

}