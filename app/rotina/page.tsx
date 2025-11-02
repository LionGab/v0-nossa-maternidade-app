"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Baby, Heart, Coffee, Moon, Sun, Utensils, Play } from "lucide-react"

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

const horarios = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
]

type Atividade = {
  id: string
  horario: string
  dia: string
  tipo: "alimentacao" | "descanso" | "brincadeira" | "autocuidado"
  titulo: string
  concluida: boolean
}

const atividadesPadrao: Atividade[] = [
  { id: "1", horario: "07:00", dia: "Segunda", tipo: "alimentacao", titulo: "Café da manhã", concluida: false },
  { id: "2", horario: "09:00", dia: "Segunda", tipo: "brincadeira", titulo: "Brincadeira sensorial", concluida: false },
  { id: "3", horario: "12:00", dia: "Segunda", tipo: "alimentacao", titulo: "Almoço", concluida: false },
  { id: "4", horario: "14:00", dia: "Segunda", tipo: "descanso", titulo: "Soneca", concluida: false },
  { id: "5", horario: "16:00", dia: "Segunda", tipo: "autocuidado", titulo: "Tempo para você", concluida: false },
  { id: "6", horario: "19:00", dia: "Segunda", tipo: "alimentacao", titulo: "Jantar", concluida: false },
  { id: "7", horario: "21:00", dia: "Segunda", tipo: "descanso", titulo: "Hora de dormir", concluida: false },
]

const categorias = [
  { tipo: "alimentacao", label: "Alimentação", icon: Utensils, color: "bg-green-100 text-green-800 border-green-300" },
  { tipo: "descanso", label: "Descanso", icon: Moon, color: "bg-blue-100 text-blue-800 border-blue-300" },
  { tipo: "brincadeira", label: "Brincadeiras", icon: Play, color: "bg-purple-100 text-purple-800 border-purple-300" },
  { tipo: "autocuidado", label: "Autocuidado", icon: Heart, color: "bg-pink-100 text-pink-800 border-pink-300" },
]

export default function RotinaPage() {
  const [atividades, setAtividades] = useState<Atividade[]>(atividadesPadrao)
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda")

  const toggleAtividade = (id: string) => {
    setAtividades(atividades.map(at => 
      at.id === id ? { ...at, concluida: !at.concluida } : at
    ))
  }

  const atividadesDoDia = atividades.filter(at => at.dia === diaSelecionado)

  const getIcon = (tipo: Atividade["tipo"]) => {
    const categoria = categorias.find(c => c.tipo === tipo)
    if (!categoria) return Sun
    return categoria.icon
  }

  const getColor = (tipo: Atividade["tipo"]) => {
    const categoria = categorias.find(c => c.tipo === tipo)
    return categoria?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Rotina Semanal</h1>
              <p className="text-lg text-warm mt-1">Organize suas atividades e as do seu bebê</p>
            </div>
          </div>
        </div>

        {/* Legendas de Categorias */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Categorias</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorias.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.tipo} className={`flex items-center gap-2 p-3 rounded-lg border ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Seletor de Dias */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {diasSemana.map((dia) => (
            <Button
              key={dia}
              variant={diaSelecionado === dia ? "default" : "outline"}
              onClick={() => setDiaSelecionado(dia)}
              className="min-w-[100px]"
            >
              {dia}
            </Button>
          ))}
        </div>

        {/* Timeline do Dia */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">{diaSelecionado}</h2>
            <Badge variant="secondary" className="text-sm">
              {atividadesDoDia.filter(a => a.concluida).length} / {atividadesDoDia.length} concluídas
            </Badge>
          </div>

          <div className="space-y-3">
            {atividadesDoDia.length === 0 ? (
              <div className="text-center py-12">
                <Coffee className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">Nenhuma atividade programada para este dia</p>
                <Button variant="outline" className="mt-4">
                  Adicionar Atividade
                </Button>
              </div>
            ) : (
              atividadesDoDia.map((atividade) => {
                const Icon = getIcon(atividade.tipo)
                return (
                  <div
                    key={atividade.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      atividade.concluida 
                        ? "bg-muted/50 opacity-70" 
                        : "bg-background hover:shadow-md"
                    }`}
                  >
                    <Checkbox
                      checked={atividade.concluida}
                      onCheckedChange={() => toggleAtividade(atividade.id)}
                      className="h-5 w-5"
                    />
                    
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{atividade.horario}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getColor(atividade.tipo)}`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">{atividade.tipo}</span>
                    </div>

                    <div className="flex-1">
                      <p className={`font-medium ${atividade.concluida ? "line-through text-muted-foreground" : ""}`}>
                        {atividade.titulo}
                      </p>
                    </div>

                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                )
              })
            )}
          </div>

          <Button className="w-full mt-6" variant="outline">
            <span className="text-lg mr-2">+</span>
            Adicionar Nova Atividade
          </Button>
        </Card>

        {/* Dicas Rápidas */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <Baby className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Dica de Rotina</h3>
              <p className="text-muted-foreground">
                Mantenha consistência nos horários de sono e alimentação. Isso ajuda o bebê a se sentir mais seguro e facilita a organização do seu dia.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
