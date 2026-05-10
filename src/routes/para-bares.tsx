import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Check, 
  ChevronRight, 
  MapPin, 
  Zap, 
  Users, 
  Star, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState } from "react";
import { RegisterBarDialog } from "@/components/matchmap/RegisterBarDialog";

export const Route = createFileRoute("/para-bares")({
  component: ForBarsPage,
});

function ForBarsPage() {
  const [registerOpen, setRegisterOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header Simplificado */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gradient-pitch)]">
              <Star className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Match<span className="text-primary">Map</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:inline-block">
              Acessar painel
            </Link>
            <Button onClick={() => setRegisterOpen(true)} size="sm">
              Cadastrar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(52,211,153,0.1)_0%,transparent_100%)]" />
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeIn}>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-primary">
              Para proprietários em Joinville
            </Badge>
            <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">
              Seu bar no <span className="text-primary">MatchMap</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Mais clientes nos dias de jogo. Zero esforço. Conectamos torcedores famintos por futebol aos melhores telões da cidade.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setRegisterOpen(true)} className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20">
                Cadastrar meu bar gratuitamente
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver planos
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                21+ bares parceiros
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                500+ torcedores ativos
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Joinville/SC
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Como funciona</h2>
            <p className="mt-4 text-muted-foreground">Transforme seu estabelecimento no ponto de encontro oficial dos torcedores.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="h-full border-primary/10 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle>Apareça no mapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Torcedores encontram seu bar quando buscam onde assistir jogos específicos na sua região.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="h-full border-primary/10 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle>Confirme transmissões</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Com apenas 1 clique, confirme quais jogos vai transmitir hoje e suba no ranking de busca.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="h-full border-primary/10 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Atraia público</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crie cupons, promoções e envie notificações push direto para os torcedores que estão perto de você.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Planos para todos os tamanhos</h2>
            <p className="mt-4 text-muted-foreground">Escolha o plano que melhor atende suas metas de lotação.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Grátis */}
            <motion.div {...fadeIn}>
              <Card className="flex h-full flex-col border-border bg-background">
                <CardHeader>
                  <CardTitle className="text-xl">Grátis</CardTitle>
                  <CardDescription>Para bares que estão começando</CardDescription>
                  <div className="mt-4 text-4xl font-bold">R$ 0<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Listagem básica no mapa
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> 1 cupom por semana
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Plus className="h-4 w-4 invisible" /> Sem badge verificado
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setRegisterOpen(true)}>Começar agora</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Verificado */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="relative flex h-full flex-col border-primary bg-background shadow-2xl shadow-primary/10 ring-1 ring-primary">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary">MAIS POPULAR</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">Verificado</CardTitle>
                  <CardDescription>Para quem leva as transmissões a sério</CardDescription>
                  <div className="mt-4 text-4xl font-bold">R$ 49<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Badge de Verificado
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Posição prioritária na busca
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Cupons ilimitados
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Analytics de visitantes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Confirmação de transmissão real-time
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full shadow-lg shadow-primary/20" onClick={() => setRegisterOpen(true)}>Assinar</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Destaque */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="flex h-full flex-col border-border bg-background">
                <CardHeader>
                  <CardTitle className="text-xl">Destaque</CardTitle>
                  <CardDescription>Poder total de marketing</CardDescription>
                  <div className="mt-4 text-4xl font-bold">R$ 149<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Tudo do Verificado
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Banner no topo do app
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Push para seguidores
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> CRM de clientes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> Suporte prioritário
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setRegisterOpen(true)}>Falar com time</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-12 text-2xl font-semibold opacity-50">Bares que já estão no MatchMap</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <span className="text-xl font-bold tracking-tight text-muted-foreground">BAR DO GIGANTE</span>
            <span className="text-xl font-bold tracking-tight text-muted-foreground">ARENA SPORTS</span>
            <span className="text-xl font-bold tracking-tight text-muted-foreground">OPA BIERHAUS</span>
            <span className="text-xl font-bold tracking-tight text-muted-foreground">GLÓRIA PUB</span>
          </div>
          
          <div className="mt-20 mx-auto max-w-3xl">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-xl italic text-foreground mb-6">
                  "Desde que entrei no MatchMap, lotamos todo domingo. O público que vem através do app é qualificado e fiel."
                </blockquote>
                <cite className="not-italic font-bold">— João, Proprietário do Bar do Gigante</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Preciso pagar para aparecer?</AccordionTrigger>
              <AccordionContent>
                Não, o plano gratuito já lista seu bar no mapa para que torcedores te encontrem. Os planos pagos oferecem ferramentas extras de marketing e destaque.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como confirmo os jogos?</AccordionTrigger>
              <AccordionContent>
                Você recebe um link de acesso ao seu painel de admin. Com apenas um clique no botão "Confirmar Transmissão", seu bar ganha destaque para os torcedores interessados naquela partida.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Posso cancelar quando quiser?</AccordionTrigger>
              <AccordionContent>
                Sim, os planos são mensais e podem ser cancelados a qualquer momento, sem multa ou fidelidade.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Como recebo os pagamentos dos clientes?</AccordionTrigger>
              <AccordionContent>
                O MatchMap não processa pagamentos dos consumos dos clientes. Nosso papel é apenas direcionar o público ao seu estabelecimento. O pagamento ocorre diretamente no seu bar, como de costume.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-[var(--gradient-pitch)] text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeIn}>
            <h2 className="mb-6 text-4xl font-black">Pronto para lotar seu bar?</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg opacity-90">
              Não perca mais nenhum jogo. Cadastre-se agora e apareça para milhares de torcedores em Joinville.
            </p>
            <div className="flex flex-col items-center justify-center gap-6">
              <Button size="lg" variant="secondary" onClick={() => setRegisterOpen(true)} className="h-14 px-10 text-lg font-bold">
                Cadastrar agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/admin" className="group flex items-center gap-1 text-sm font-medium opacity-80 hover:opacity-100">
                Já tem conta? <span className="underline group-hover:no-underline">Acessar painel</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MatchMap — Todos os direitos reservados. Feito com paixão pelo esporte.</p>
        </div>
      </footer>

      <RegisterBarDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}
