"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Baby, Calendar, Heart, Ruler, Weight, Edit } from "lucide-react"

export default function PerfilBebePage() {
  const [editing, setEditing] = useState(false)
  const [babyData, setBabyData] = useState({
    nome: "Maria Clara",
    dataNascimento: "2024-05-15",
    peso: "7.2",
    altura: "65",
    genero: "Feminino",
  })

  const calcularIdade = () => {
    const hoje = new Date()
    const nascimento = new Date(babyData.dataNascimento)
    const meses = Math.floor((hoje.getTime() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return meses
  }

  const handleSave = () => {
    setEditing(false)
    // TODO: Save to database
  }

  const milestones = [
    { id: 1, titulo: "Primeiro sorriso", idade: "2 meses", concluido: true },
    { id: 2, titulo: "Sentar sozinho", idade: "6 meses", concluido: false },
    { id: 3, titulo: "Primeiras palavras", idade: "12 meses", concluido: false },
    { id: 4, titulo: "Primeiros passos", idade: "12-15 meses", concluido: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Baby className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Perfil do Bebê</h1>
              <p className="text-lg text-warm mt-1">Acompanhe o crescimento e desenvolvimento</p>
            </div>
          </div>
          <Button
            variant={editing ? "default" : "outline"}
            onClick={() => editing ? handleSave() : setEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editing ? "Salvar" : "Editar"}
          </Button>
        </div>

        {/* Informações Básicas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Bebê</Label>
              <Input
                id="nome"
                value={babyData.nome}
                onChange={(e) => setBabyData({ ...babyData, nome: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data de Nascimento</Label>
              <Input
                id="data"
                type="date"
                value={babyData.dataNascimento}
                onChange={(e) => setBabyData({ ...babyData, dataNascimento: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso Atual (kg)</Label>
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={babyData.peso}
                  onChange={(e) => setBabyData({ ...babyData, peso: e.target.value })}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura">Altura Atual (cm)</Label>
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="altura"
                  type="number"
                  value={babyData.altura}
                  onChange={(e) => setBabyData({ ...babyData, altura: e.target.value })}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Idade Atual</p>
                <p className="text-2xl font-bold text-primary">{calcularIdade()} meses</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Marcos de Desenvolvimento */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Marcos de Desenvolvimento</h2>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  milestone.concluido
                    ? "bg-green-50 border-green-200"
                    : "bg-background"
                }`}
              >
                <input
                  type="checkbox"
                  checked={milestone.concluido}
                  className="h-5 w-5 rounded border-gray-300"
                  readOnly
                />
                <div className="flex-1">
                  <p className={`font-medium ${milestone.concluido ? "line-through text-muted-foreground" : ""}`}>
                    {milestone.titulo}
                  </p>
                  <p className="text-sm text-muted-foreground">Esperado: {milestone.idade}</p>
                </div>
                {milestone.concluido && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Concluído ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Próximas Consultas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Próximas Consultas</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
              <div>
                <p className="font-medium">Consulta Pediátrica</p>
                <p className="text-sm text-muted-foreground">Dr. João Silva</p>
              </div>
              <Badge>15/12/2024</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Agendar Nova Consulta
            </Button>
          </div>
        </Card>

        {/* Dica */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Dica Importante</h3>
              <p className="text-muted-foreground">
                Cada bebê se desenvolve no seu próprio ritmo. Não compare o desenvolvimento do seu bebê com outros. Se tiver dúvidas, sempre consulte o pediatra.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
