"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Baby, Calendar, Heart, Ruler, Weight, Edit, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { clientLogger } from "@/lib/logger-client"

interface BabyProfile {
  id?: string
  name: string
  birth_date: string
  current_weight: string
  current_height: string
  gender: string
  milestones?: Array<{ id: number; titulo: string; idade: string; concluido: boolean }>
}

export default function PerfilBebePage() {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [babyData, setBabyData] = useState<BabyProfile>({
    name: "",
    birth_date: "",
    current_weight: "",
    current_height: "",
    gender: "feminino",
  })

  const supabase = createClient()

  useEffect(() => {
    loadBabyProfile()
  }, [])

  const loadBabyProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUserId(user.id)

      const { data, error: fetchError } = await supabase
        .from("baby_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError
      }

      if (data) {
        setBabyData({
          id: data.id,
          name: data.name,
          birth_date: data.birth_date,
          current_weight: data.current_weight?.toString() || "",
          current_height: data.current_height?.toString() || "",
          gender: data.gender || "feminino",
          milestones: data.milestones || defaultMilestones,
        })
      } else {
        setBabyData({
          ...babyData,
          milestones: defaultMilestones,
        })
        setEditing(true)
      }
    } catch (err) {
      clientLogger.error("Perfil Bebê: Erro ao carregar perfil", err, {
        userId: userId || "unknown",
      })
      setError("Erro ao carregar perfil do bebê. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const calcularIdade = () => {
    if (!babyData.birth_date) return 0
    const hoje = new Date()
    const nascimento = new Date(babyData.birth_date)
    const meses = Math.floor((hoje.getTime() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return meses
  }

  const handleSave = async () => {
    if (!userId) return

    try {
      setSaving(true)
      setError(null)

      const profileData = {
        user_id: userId,
        name: babyData.name,
        birth_date: babyData.birth_date,
        current_weight: parseFloat(babyData.current_weight) || null,
        current_height: parseFloat(babyData.current_height) || null,
        gender: babyData.gender,
        milestones: babyData.milestones || defaultMilestones,
        is_active: true,
      }

      if (babyData.id) {
        const { error: updateError } = await supabase
          .from("baby_profiles")
          .update(profileData)
          .eq("id", babyData.id)

        if (updateError) throw updateError
      } else {
        const { data, error: insertError } = await supabase
          .from("baby_profiles")
          .insert(profileData)
          .select()
          .single()

        if (insertError) throw insertError

        setBabyData({ ...babyData, id: data.id })
      }

      setEditing(false)
    } catch (err) {
      clientLogger.error("Perfil Bebê: Erro ao salvar perfil", err, {
        userId,
        hasId: !!babyData.id,
      })
      setError("Erro ao salvar perfil. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const defaultMilestones = [
    { id: 1, titulo: "Primeiro sorriso", idade: "2 meses", concluido: false },
    { id: 2, titulo: "Sentar sozinho", idade: "6 meses", concluido: false },
    { id: 3, titulo: "Primeiras palavras", idade: "12 meses", concluido: false },
    { id: 4, titulo: "Primeiros passos", idade: "12-15 meses", concluido: false },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const milestones = babyData.milestones || defaultMilestones

  const toggleMilestone = (milestoneId: number) => {
    if (!editing) return

    const updatedMilestones = milestones.map(m =>
      m.id === milestoneId ? { ...m, concluido: !m.concluido } : m
    )

    setBabyData({ ...babyData, milestones: updatedMilestones })
  }

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
            disabled={saving || !babyData.name || !babyData.birth_date}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {saving ? "Salvando..." : editing ? "Salvar" : "Editar"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Informações Básicas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Bebê</Label>
              <Input
                id="nome"
                value={babyData.name}
                onChange={(e) => setBabyData({ ...babyData, name: e.target.value })}
                disabled={!editing}
                placeholder="Ex: Maria Clara"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data de Nascimento</Label>
              <Input
                id="data"
                type="date"
                value={babyData.birth_date}
                onChange={(e) => setBabyData({ ...babyData, birth_date: e.target.value })}
                disabled={!editing}
                required
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
                  value={babyData.current_weight}
                  onChange={(e) => setBabyData({ ...babyData, current_weight: e.target.value })}
                  disabled={!editing}
                  placeholder="7.2"
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
                  value={babyData.current_height}
                  onChange={(e) => setBabyData({ ...babyData, current_height: e.target.value })}
                  disabled={!editing}
                  placeholder="65"
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
                  onChange={() => toggleMilestone(milestone.id)}
                  className="h-5 w-5 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                  disabled={!editing}
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
