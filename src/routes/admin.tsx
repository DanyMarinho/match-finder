import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { 
  Check, 
  X, 
  Store, 
  AlertTriangle, 
  Users, 
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate({ to: "/" });
    });
  }, [navigate]);

  // Registrations Query
  const { data: registrations = [], isLoading: loadingRegs } = useQuery({
    queryKey: ["admin_registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Alerts Query
  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ["admin_alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*, venues(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (reg: any) => {
      // 1. Create kebab ID
      const id = reg.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
      
      // 2. Insert into venues
      const { error: vError } = await supabase.from("venues").insert({
        id,
        name: reg.name,
        address: reg.address,
        phone: reg.phone,
        amenities: reg.amenities,
        neighborhood: "Desconhecido", // Simplified for now
        coords: [-26.3, -48.84], // Joinville center fallback
        operational_status: "open",
        claimed: true,
        last_verified: new Date().toISOString().split("T")[0],
      });
      if (vError) throw vError;

      // 3. Update registration status
      const { error: rError } = await supabase
        .from("registrations")
        .update({ status: "approved" })
        .eq("id", reg.id);
      if (rError) throw rError;
    },
    onSuccess: () => {
      toast.success("Bar aprovado e publicado!");
      queryClient.invalidateQueries({ queryKey: ["admin_registrations"] });
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
    onError: (err: any) => toast.error("Falha ao aprovar: " + err.message),
  });

  // Clear Alert Mutation
  const clearAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase.from("alerts").delete().eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Alerta removido!");
      queryClient.invalidateQueries({ queryKey: ["admin_alerts"] });
    },
  });

  if (loading) return <div className="p-8">Verificando acesso...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Painel Administrativo</span>
            </div>
            <h1 className="text-3xl font-black italic">MatchMap V2 PRO</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Site
            </Button>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Novo Bar
            </Button>
            <Button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))} variant="destructive">
              Sair
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Store className="h-4 w-4" /> Bares Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">107</div>
              <p className="text-xs text-slate-500">+12 este mês</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4" /> Torcedores Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">542</div>
              <p className="text-xs text-primary">Pico em dias de jogo</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Alertas Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{alerts.length}</div>
              <p className="text-xs text-slate-500">Requerem atenção</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-6">
            <TabsTrigger value="registrations" className="data-[state=active]:bg-slate-800">
              Novos Cadastros ({registrations.filter(r => r.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-slate-800">
              Moderação de Alertas ({alerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <div className="grid gap-4">
              {loadingRegs ? (
                <div className="text-center py-12 text-slate-500 italic">Carregando registros...</div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 italic">Nenhum cadastro pendente.</div>
              ) : (
                registrations.map((reg: any) => (
                  <Card key={reg.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{reg.name}</h3>
                          <Badge variant={reg.status === 'approved' ? 'default' : 'secondary'} className={reg.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}>
                            {reg.status === 'approved' ? 'Aprovado' : 'Pendente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {reg.address}
                        </p>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <Users className="h-3 w-3" /> {reg.phone || 'Sem telefone'}
                        </p>
                        {reg.notes && (
                          <p className="text-xs text-slate-500 italic mt-2">"{reg.notes}"</p>
                        )}
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        {reg.status === 'pending' && (
                          <Button 
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => approveMutation.mutate(reg)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-2" /> Aprovar
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1 md:flex-none border-slate-700 hover:bg-slate-800">
                          <X className="h-4 w-4 mr-2" /> Ignorar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid gap-4">
              {loadingAlerts ? (
                <div className="text-center py-12 text-slate-500 italic">Carregando alertas...</div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 italic">Nenhum alerta reportado hoje.</div>
              ) : (
                alerts.map((alert: any) => (
                  <Card key={alert.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="uppercase text-[10px]">
                            {alert.type}
                          </Badge>
                          <h3 className="font-bold">{alert.venues?.name || 'Bar desconhecido'}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {alert.votes} votos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(alert.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-white"
                        onClick={() => clearAlertMutation.mutate(alert.id)}
                      >
                        Limpar Alerta
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
