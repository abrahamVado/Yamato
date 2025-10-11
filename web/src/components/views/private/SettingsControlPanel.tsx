"use client"

//1.- Import controls, localization, icons, and the shared shell to stage messaging configuration panels.
import * as React from "react"
import { useI18n } from "@/app/providers/I18nProvider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { FaWhatsapp } from "react-icons/fa6"
import { HiMiniEnvelope } from "react-icons/hi2"
import { PrivateNeumorphicShell } from "./PrivateNeumorphicShell"

interface MessagingEntry {
  title: string
  description: string
}

export function SettingsControlPanel() {
  //2.- Stage localized state for global toggles and hydrate WhatsApp/Email channel descriptors.
  const { t, dict } = useI18n()
  const [settings, setSettings] = React.useState({
    billingAlerts: true,
    maintenanceWindow: false,
    aiAssistance: true,
    whatsappSync: true,
    emailRelay: false,
  })
  const whatsappChannels = (dict.private?.settings?.whatsapp?.channels ?? []) as MessagingEntry[]
  const emailTemplates = (dict.private?.settings?.email?.templates ?? []) as MessagingEntry[]

  //3.- Render the preference cockpit alongside messaging sections inside the neumorphic surface.
  return (
    <PrivateNeumorphicShell testId="settings-neumorphic-card">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("private.settings.title")}</CardTitle>
            <CardDescription>{t("private.settings.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
              <div>
                <p className="font-medium">{t("private.settings.toggles.billing.title")}</p>
                <p className="text-sm text-muted-foreground">{t("private.settings.toggles.billing.description")}</p>
              </div>
              <Switch
                checked={settings.billingAlerts}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, billingAlerts: Boolean(value) }))}
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
              <div>
                <p className="font-medium">{t("private.settings.toggles.maintenance.title")}</p>
                <p className="text-sm text-muted-foreground">{t("private.settings.toggles.maintenance.description")}</p>
              </div>
              <Switch
                checked={settings.maintenanceWindow}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, maintenanceWindow: Boolean(value) }))}
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
              <div>
                <p className="font-medium">{t("private.settings.toggles.ai.title")}</p>
                <p className="text-sm text-muted-foreground">{t("private.settings.toggles.ai.description")}</p>
              </div>
              <Switch
                checked={settings.aiAssistance}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, aiAssistance: Boolean(value) }))}
              />
            </label>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {t("private.settings.description")}
            </p>
            <Button type="button">{t("private.settings.actions.publish")}</Button>
          </CardFooter>
        </Card>

        <Card className="border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <FaWhatsapp className="h-6 w-6" />
            </span>
            <div>
              <CardTitle>{t("private.settings.whatsapp.title")}</CardTitle>
              <CardDescription>{t("private.settings.whatsapp.description")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-muted/50 bg-background/80 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t("private.settings.whatsapp.switch")}</p>
                <p className="text-xs text-muted-foreground">{t("private.settings.whatsapp.description")}</p>
              </div>
              <Switch
                checked={settings.whatsappSync}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, whatsappSync: Boolean(value) }))}
              />
            </div>
            {whatsappChannels.map((channel, index) => (
              <div key={channel.title} className="rounded-xl border border-muted/40 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{index + 1}</p>
                <p className="mt-2 text-base font-semibold text-foreground">{channel.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-muted/50 bg-background/80">
          <CardHeader className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HiMiniEnvelope className="h-6 w-6" />
            </span>
            <div>
              <CardTitle>{t("private.settings.email.title")}</CardTitle>
              <CardDescription>{t("private.settings.email.description")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-muted/50 bg-muted/10 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t("private.settings.email.switch")}</p>
                <p className="text-xs text-muted-foreground">{t("private.settings.email.description")}</p>
              </div>
              <Switch
                checked={settings.emailRelay}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, emailRelay: Boolean(value) }))}
              />
            </div>
            {emailTemplates.map((template, index) => (
              <div key={template.title} className="rounded-xl border border-muted/40 bg-background/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{index + 1}</p>
                <p className="mt-2 text-base font-semibold text-foreground">{template.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PrivateNeumorphicShell>
  )
}
