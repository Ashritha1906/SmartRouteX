
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  isAdmin?: boolean;
}

const PageLayout = ({ children, title, isAdmin = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 pb-8 pt-6 px-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
