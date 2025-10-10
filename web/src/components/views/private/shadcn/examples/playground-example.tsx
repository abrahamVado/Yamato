"use client"

//1.- Import inputs and code blocks to build the playground split view.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const previewJson = {
  agent: "yamato-demo",
  mode: "conversational",
  tools: ["documents", "notebook", "playwright"],
}

const executionLog = [
  "Bootstrap workspace",
  "Fetch user context",
  "Draft plan",
  "Synthesize summary",
]

export function PlaygroundExample() {
  //2.- Lay out the left-hand controls and right-hand preview similar to the playground example.
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Prompt playground</CardTitle>
          <CardDescription>Experiment with guardrails and runtime instructions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">System prompt</Label>
            <Textarea
              id="prompt"
              rows={5}
              placeholder="You are Yamato Copilot helping operators triage incidents..."
              defaultValue="You are Yamato Copilot helping operators triage incidents with empathy and precision."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input id="temperature" type="number" step="0.1" min="0" max="1" defaultValue="0.2" />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Tool calling</p>
              <p className="text-xs text-muted-foreground">Allow the model to invoke Yamato tools automatically.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Reset</Button>
          <Button>Run prompt</Button>
        </CardFooter>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Execution preview</CardTitle>
          <CardDescription>Live output of the synthetic assistant run.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border bg-muted/30 p-4 font-mono text-xs">
            <pre className="whitespace-pre-wrap">{JSON.stringify(previewJson, null, 2)}</pre>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Event log</p>
            <div className="space-y-2">
              {executionLog.map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                  <span>{item}</span>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
