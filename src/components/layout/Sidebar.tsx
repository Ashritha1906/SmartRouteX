
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Map, 
  BarChart3, 
  Settings, 
  Users, 
  Database, 
  Home, 
  AlertTriangle, 
  Clock, 
  TrafficCone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: Home 
  },
  { 
    name: "Live Map", 
    href: "/live-map", 
    icon: Map 
  },
  { 
    name: "Traffic Signals", 
    href: "/traffic-signals", 
    icon: TrafficCone
  },
  { 
    name: "Incidents", 
    href: "/incidents", 
    icon: AlertTriangle 
  },
  { 
    name: "Analytics", 
    href: "/analytics", 
    icon: BarChart3 
  },
  { 
    name: "Historical Data", 
    href: "/historical-data", 
    icon: Clock 
  },
  { 
    name: "Data Sources", 
    href: "/data-sources", 
    icon: Database 
  },
  { 
    name: "User Management", 
    href: "/user-management", 
    icon: Users,
    adminOnly: true
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    divider: true
  }
];

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div
      className={cn(
        "bg-slate-50 border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "→" : "←"}
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {filteredNavItems.map((item, i) => (
              <div key={item.href}>
                {item.divider && <div className="h-px bg-slate-200 my-2"></div>}
                <Link 
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-brand-primary hover:bg-brand-primary/10",
                    location.pathname === item.href 
                      ? "bg-brand-primary/10 text-brand-primary font-medium" 
                      : "text-slate-600",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isCollapsed && "h-6 w-6")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
