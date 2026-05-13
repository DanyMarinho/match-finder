import { MapPin, Search, Trophy, Plus, Store, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  query: string;
  onQuery: (q: string) => void;
  onRegister: () => void;
  onSuggest: () => void;
  session: any;
  onLogin: () => void;
}

export function Header({ query, onQuery, onRegister, onSuggest, session, onLogin }: Props) {
  const handleLogout = () => {
    import("@/integrations/supabase/client").then(m => m.supabase.auth.signOut());
  };
  return (
    <header className="border-b border-border bg-sidebar/80 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gradient-pitch)] shadow-[var(--shadow-glow)]">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">
            Match<span className="text-primary">Map</span>
          </h1>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="joinville">
            <SelectTrigger className="w-full sm:w-[180px]">
              <MapPin className="mr-1 h-4 w-4 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="joinville">Joinville, SC</SelectItem>
              <SelectItem value="floripa">Florianópolis, SC</SelectItem>
              <SelectItem value="curitiba">Curitiba, PR</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar bar, time ou competição…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/para-bares"
            className="hidden items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            <Store className="h-4 w-4" />
            Para Bares
          </Link>
          <Button variant="secondary" onClick={onSuggest} className="gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Faltou seu bar? Indique</span>
          </Button>
          <Button
            onClick={onRegister}
            className="hidden gap-1.5 bg-[var(--gradient-flame)] font-semibold text-highlight-foreground hover:opacity-90 lg:flex"
          >
            <Plus className="h-4 w-4" />
            <span>Cadastrar meu Bar</span>
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold text-primary">
                {session.user.email?.[0].toUpperCase()}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onLogin} className="gap-1.5 border-primary/30 hover:border-primary">
              <User className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
