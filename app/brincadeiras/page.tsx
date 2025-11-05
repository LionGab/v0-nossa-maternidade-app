"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Play, Clock, Sparkles, Baby } from "lucide-react"

const brincadeiras = [
  {
    id: 1,
    titulo: "Caixa de Texturas",
    idade: "6-12 meses",
    duracao: "10-15 min",
    dificuldade: "Fácil",
    materiais: ["Caixa de papelão", "Tecidos variados", "Papel alumínio", "Esponja"],
    passos: [
      "Forre o fundo da caixa com tecidos de diferentes texturas",
      "Adicione pedaços de papel alumínio amassado",
      "Coloque esponjas macias",
      "Deixe o bebê explorar cada textura com as mãos",
      "Descreva cada sensação: 'macio', 'áspero', 'liso'",
    ],
    beneficios: "Estimula o tato e a coordenação motora fina",
  },
  {
    id: 2,
    titulo: "Garrafas Sensoriais",
    idade: "3-12 meses",
    duracao: "5-10 min",
    dificuldade: "Fácil",
    materiais: ["Garrafa PET transparente", "Água", "Corante alimentício", "Glitter", "Arroz colorido"],
    passos: [
      "Encha 2/3 da garrafa com água",
      "Adicione algumas gotas de corante",
      "Coloque glitter e arroz colorido",
      "Feche bem a tampa (cole com cola quente para segurança)",
      "Deixe o bebê chacoalhar e observar o movimento",
    ],
    beneficios: "Desenvolve atenção visual e causa-efeito",
  },
  {
    id: 3,
    titulo: "Pintura com Dedos",
    idade: "12-24 meses",
    duracao: "15-20 min",
    dificuldade: "Médio",
    materiais: ["Papel grande", "Tinta atóxica", "Avental", "Toalhas"],
    passos: [
      "Vista o bebê com roupas velhas ou avental",
      "Coloque papel no chão ou mesa",
      "Despeje pequenas quantidades de tinta",
      "Deixe o bebê explorar livremente com os dedos",
      "Converse sobre as cores que ele está usando",
    ],
    beneficios: "Estimula criatividade e expressão artística",
  },
  {
    id: 4,
    titulo: "Música com Panelas",
    idade: "9-18 meses",
    duracao: "10 min",
    dificuldade: "Fácil",
    materiais: ["Panelas e tampas", "Colheres de pau", "Potes plásticos"],
    passos: [
      "Separe panelas, tampas e utensílios seguros",
      "Mostre como fazer sons diferentes",
      "Bata ritmos simples para o bebê imitar",
      "Cante músicas enquanto ele toca",
      "Deixe ele explorar os sons livremente",
    ],
    beneficios: "Desenvolve ritmo e coordenação auditiva",
  },
  {
    id: 5,
    titulo: "Caça ao Tesouro Sensorial",
    idade: "18-24 meses",
    duracao: "15 min",
    dificuldade: "Médio",
    materiais: ["Arroz cru", "Bacia grande", "Pequenos brinquedos", "Colheres"],
    passos: [
      "Encha a bacia com arroz cru",
      "Esconda pequenos brinquedos no arroz",
      "Mostre ao bebê como procurar os tesouros",
      "Deixe ele usar as mãos e colheres para explorar",
      "Nomeie cada objeto encontrado",
    ],
    beneficios: "Estimula exploração tátil e linguagem",
  },
  {
    id: 6,
    titulo: "Bolhas de Sabão",
    idade: "6-24 meses",
    duracao: "10 min",
    dificuldade: "Fácil",
    materiais: ["Água", "Detergente", "Glicerina", "Arame ou canudo"],
    passos: [
      "Misture água, detergente e glicerina",
      "Faça bolhas grandes e pequenas",
      "Deixe o bebê tentar pegar as bolhas",
      "Para maiores, ensine a soprar bolhas",
      "Brinque ao ar livre ou em local fácil de limpar",
    ],
    beneficios: "Desenvolve coordenação visual-motora",
  },
]

export default function BrincadeirasPage() {
  return (
    <div className="min-h-screen gradient-warm pb-20 md:pb-6">
      <PageHeader
        title="Brincadeiras Sensoriais"
        description="Atividades para estimular o desenvolvimento do bebê"
        icon={<Play className="h-5 w-5" />}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Mensagem Informativa */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Sobre Brincadeiras Sensoriais</h3>
              <p className="text-muted-foreground">
                Brincadeiras sensoriais são fundamentais para o desenvolvimento cognitivo, motor e emocional do bebê.
                Elas estimulam os cinco sentidos e ajudam na conexão neural. Sempre supervisione as atividades!
              </p>
            </div>
          </div>
        </Card>

        {/* Grid de Brincadeiras */}
        <div className="grid md:grid-cols-2 gap-6">
          {brincadeiras.map((brincadeira) => (
            <Card key={brincadeira.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{brincadeira.titulo}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <Baby className="h-3 w-3 mr-1" />
                        {brincadeira.idade}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {brincadeira.duracao}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={
                    brincadeira.dificuldade === "Fácil"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-orange-100 text-orange-800 border-orange-300"
                  }>
                    {brincadeira.dificuldade}
                  </Badge>
                </div>

                {/* Materiais */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Materiais Necessários:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {brincadeira.materiais.map((material, idx) => (
                      <li key={idx}>{material}</li>
                    ))}
                  </ul>
                </div>

                {/* Passo a Passo */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Passo a Passo:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {brincadeira.passos.map((passo, idx) => (
                      <li key={idx} className="pl-2">{passo}</li>
                    ))}
                  </ol>
                </div>

                {/* Benefícios */}
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Benefícios:</strong> {brincadeira.beneficios}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Salvar
                  </Button>
                  <Button className="flex-1">
                    Marcar como Feito
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dica de Segurança */}
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-4">
            <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-orange-900">Dicas de Segurança</h3>
              <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                <li>Sempre supervisione o bebê durante as brincadeiras</li>
                <li>Use materiais atóxicos e seguros para a idade</li>
                <li>Evite objetos pequenos que possam ser engolidos</li>
                <li>Mantenha o ambiente limpo e organizado</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  )
}
