"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Heart, Lightbulb, CheckCircle } from "lucide-react"

const situacoes = [
  {
    id: 1,
    situacao: "Birra no supermercado",
    idade: "2-4 anos",
    tipo: "Público",
    descricao: "Seu filho quer um brinquedo ou doce e começa a chorar e gritar no meio do supermercado.",
    oqueFazer: [
      "Mantenha a calma - sua reação influencia a criança",
      "Abaixe-se na altura do olho da criança",
      "Valide o sentimento: 'Eu sei que você quer isso'",
      "Ofereça escolhas limitadas: 'Podemos comprar frutas, qual você prefere?'",
      "Mantenha-se firme na decisão com empatia",
      "Se necessário, saia do local calmamente",
    ],
    oqueNaoFazer: [
      "Gritar ou fazer ameaças",
      "Ceder à birra para ela parar rapidamente",
      "Envergonhar a criança na frente de outros",
      "Ignorar completamente os sentimentos dela",
    ],
    porqueAcontece: "Frustrração por não poder ter algo desejado imediatamente. A criança está aprendendo sobre limites e ainda não sabe expressar emoções de forma adequada.",
  },
  {
    id: 2,
    situacao: "Não quer dormir",
    idade: "1-4 anos",
    tipo: "Rotina",
    descricao: "É hora de dormir mas a criança chora, grita e recusa deitar.",
    oqueFazer: [
      "Mantenha a rotina consistente todos os dias",
      "Crie um ritual calmante antes de dormir",
      "Ofereça segurança: 'Mamãe está aqui'",
      "Use tom de voz suave e luzes baixas",
      "Seja paciente mas firme com o horário",
      "Ofereça um objeto de conforto (pelúcia, paninho)",
    ],
    oqueNaoFazer: [
      "Ceder e deixar ficar acordado 'só mais um pouco'",
      "Usar eletrônicos antes de dormir",
      "Demonstrar irritação ou impaciência",
      "Ameaçar ou assustar a criança",
    ],
    porqueAcontece: "Medo de separação, excesso de energia, ou simplesmente não querer perder as atividades divertidas. É uma fase normal do desenvolvimento.",
  },
  {
    id: 3,
    situacao: "Recusa alimentar",
    idade: "1-5 anos",
    tipo: "Alimentação",
    descricao: "A criança se recusa a comer, joga comida ou só quer comer um tipo de alimento.",
    oqueFazer: [
      "Ofereça variedade sem forçar",
      "Deixe a criança participar da preparação",
      "Faça refeições em família sem distrações",
      "Respeite sinais de saciedade",
      "Seja modelo comendo alimentos saudáveis",
      "Mantenha horários regulares de refeições",
    ],
    oqueNaoFazer: [
      "Forçar a criança a comer",
      "Usar comida como recompensa ou castigo",
      "Fazer 'aviãozinho' ou distrações excessivas",
      "Oferecer alternativas se recusar o prato",
    ],
    porqueAcontece: "Fase de autonomia onde a criança testa limites. Pode ser seletividade natural ou busca de atenção.",
  },
  {
    id: 4,
    situacao: "Bate ou morde",
    idade: "1-3 anos",
    tipo: "Comportamento",
    descricao: "A criança bate, morde ou empurra outras crianças ou adultos.",
    oqueFazer: [
      "Interrompa imediatamente o comportamento",
      "Diga firme e calmamente: 'Não pode bater. Isso machuca'",
      "Ajude a criança a identificar o sentimento: 'Você está com raiva?'",
      "Ensine alternativas: 'Use palavras'",
      "Ofereça conforto para a criança machucada",
      "Se repetir, remova a criança da situação calmamente",
    ],
    oqueNaoFazer: [
      "Bater ou morder de volta 'para ela sentir'",
      "Rir ou minimizar o comportamento",
      "Dar atenção excessiva ao comportamento negativo",
      "Rotular a criança como 'agressiva' ou 'má'",
    ],
    porqueAcontece: "Frustração, falta de vocabulário para expressar emoções, busca de atenção, ou imitação. É comum e parte do desenvolvimento.",
  },
  {
    id: 5,
    situacao: "Choro constante",
    idade: "0-3 anos",
    tipo: "Emocional",
    descricao: "A criança chora muito, mesmo quando suas necessidades básicas estão atendidas.",
    oqueFazer: [
      "Verifique necessidades básicas: fome, fralda, temperatura",
      "Ofereça colo e aconchego",
      "Tente diferentes técnicas de acalmar: balanço, som branco",
      "Mantenha-se calma mesmo que seja desafiador",
      "Peça ajuda se precisar de um descanso",
      "Se persistir, consulte o pediatra",
    ],
    oqueNaoFazer: [
      "Ignorar completamente o choro prolongado",
      "Ficar nervosa ou gritar com o bebê",
      "Chacoalhar o bebê",
      "Achar que você está fazendo algo errado",
    ],
    porqueAcontece: "Pode ser cólica, desconforto, necessidade de contato, ou simplesmente a única forma que o bebê tem de comunicar. Não significa que você é uma mãe ruim.",
  },
]

export default function BirrasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Lidando com Birras</h1>
              <p className="text-lg text-warm mt-1">Respostas empáticas e ações práticas</p>
            </div>
          </div>
        </div>

        {/* Mensagem de Apoio */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Você não está sozinha</h3>
              <p className="text-muted-foreground mb-3">
                Birras são uma parte normal e saudável do desenvolvimento infantil. Elas acontecem porque a criança 
                está aprendendo a lidar com emoções intensas, mas ainda não tem as ferramentas linguísticas ou 
                emocionais para expressá-las adequadamente.
              </p>
              <p className="text-muted-foreground font-medium">
                Lembre-se: você é uma mãe maravilhosa. Ter dificuldades com birras não significa que você está falhando.
              </p>
            </div>
          </div>
        </Card>

        {/* Situações e Soluções */}
        <div className="space-y-6">
          {situacoes.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{item.situacao}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {item.idade}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {item.tipo}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-muted-foreground">{item.descricao}</p>

                {/* Por que acontece */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Lightbulb className="h-5 w-5" />
                    Por que acontece?
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{item.porqueAcontece}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* O que fazer */}
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-900 dark:text-green-100">
                      <CheckCircle className="h-5 w-5" />
                      O que fazer:
                    </h4>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      {item.oqueFazer.map((acao, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* O que NÃO fazer */}
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-900 dark:text-red-100">
                      <AlertCircle className="h-5 w-5" />
                      O que NÃO fazer:
                    </h4>
                    <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                      {item.oqueNaoFazer.map((acao, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">✗</span>
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Salvar para Consulta Rápida
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Recursos Adicionais */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Precisa de mais ajuda?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col items-start bg-transparent">
              <span className="font-semibold mb-1">Converse com a NathAI</span>
              <span className="text-sm text-muted-foreground">
                Nossa assistente com IA pode te ajudar com situações específicas
              </span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col items-start bg-transparent">
              <span className="font-semibold mb-1">Comunidade de Mães</span>
              <span className="text-sm text-muted-foreground">
                Compartilhe experiências com outras mães que entendem
              </span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
