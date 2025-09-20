"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Settings, Upload, Database, Play, RefreshCw, ArrowRight, ArrowLeft, LineChart as LineChartIcon } from "lucide-react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid } from "recharts";

/** tiny dropzone (no deps) */
function Dropzone({ onFile }: { onFile: (f: File) => void }) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      className={`flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed bg-white text-sm transition ${
        over ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="text-center">
        <div className="font-medium">Drop CSV/XLSX here or click to browse</div>
        <div className="text-xs text-muted-foreground mt-1">.csv or .xlsx</div>
      </div>
    </label>
  );
}

export default function SimpleWizard() {
  // step
  const [step, setStep] = useState<1 | 2>(1);

  // service config
  const [baseUrl, setBaseUrl] = useState("http://localhost:8088");
  const [token, setToken] = useState("devtoken");
  const [importId, setImportId] = useState("00000000-0000-0000-0000-000000000001");

  // choose one path
  const [mode, setMode] = useState<"laravel" | "fileurl">("laravel");

  // laravel upload
  const [laravelUploadUrl, setLaravelUploadUrl] = useState("http://localhost/api/comets/upload");
  const [pickedFile, setPickedFile] = useState<File | null>(null);

  // direct file://
  const [fileUrl, setFileUrl] = useState("file:///ABS/PATH/comet.csv");
  const [sheet, setSheet] = useState("data_1"); // used only for xlsx

  // ingest status
  const [status, setStatus] = useState<"idle" | "queued" | "ingesting" | "ready" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [rowsOk, setRowsOk] = useState(0);
  const [rowsBad, setRowsBad] = useState(0);
  const [progress, setProgress] = useState(0);

  // processor
  const [model, setModel] = useState<"parabola" | "ellipse">("parabola");
  const [params, setParams] = useState({ q_au: 1.5, a_au: 2.0, e: 0.24 });

  // plot
  const [ephemerisUrl, setEphemerisUrl] = useState("");
  const [ephem, setEphem] = useState<{ x_au: number; y_au: number }[]>([]);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  function inferFormatFromName(name: string) {
    const ext = name.toLowerCase().split(".").pop() || "";
    return ext === "xlsx" ? "xlsx" : "csv";
  }

  async function uploadViaLaravel() {
    if (!pickedFile) return;
    setStatus("queued"); setMessage(""); setRowsOk(0); setRowsBad(0); setProgress(0);
    try {
      const fd = new FormData();
      fd.append("data", pickedFile);
      fd.append("import_id", importId);
      const res = await fetch(laravelUploadUrl, { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.message || `${res.status} ${res.statusText}`);
      if (j.import_id) setImportId(j.import_id); // if server returns one
      setStatus("ingesting");
    } catch (e: any) {
      setStatus("error"); setMessage(e.message || String(e));
    }
  }

  async function startIngestDirect() {
    setStatus("queued"); setMessage(""); setRowsOk(0); setRowsBad(0); setProgress(0);
    try {
      const fmt = inferFormatFromName(fileUrl);
      const body: any = { import_id: importId, file_url: fileUrl, format: fmt };
      if (fmt === "xlsx") body.sheet = sheet;
      const res = await fetch(`${baseUrl}/ingest`, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setStatus("ingesting");
    } catch (e: any) {
      setStatus("error"); setMessage(e.message || String(e));
    }
  }

  async function refreshStatus() {
    try {
      const res = await fetch(`${baseUrl}/imports/${importId}`, { headers });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const j = await res.json();
      setStatus(j.status || "idle");
      setRowsOk(j.rows_ok ?? 0);
      setRowsBad(j.rows_bad ?? 0);
      const total = Math.max(1, j.rows_total || j.rows_ok || 0);
      const p = j.status === "ingesting" ? Math.min(99, Math.round((j.rows_ok / total) * 100))
              : j.status === "ready" ? 100
              : j.status === "processing" ? 50
              : j.status === "done" ? 100
              : 0;
      setProgress(p);
      setMessage(j.message || "");
    } catch (e: any) {
      setMessage(e.message || String(e));
    }
  }

  async function runProcess() {
    setStatus("processing"); setMessage("");
    try {
      const res = await fetch(`${baseUrl}/process`, { method: "POST", headers, body: JSON.stringify({ import_id: importId, model, params }) });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    } catch (e: any) {
      setStatus("error"); setMessage(e.message || String(e));
    }
  }

  async function loadEphemeris() {
    if (!ephemerisUrl) {
      // simple ellipse/parabola sample points
      const pts: { x_au: number; y_au: number }[] = [];
      const a = params.a_au, e = params.e;
      for (let deg = -180; deg <= 180; deg += 3) {
        const th = (deg * Math.PI) / 180;
        const r = model === "ellipse" ? (a * (1 - e * e)) / (1 + e * Math.cos(th)) : params.q_au * (1 + (th * th) / 4); // toy parabola-ish
        pts.push({ x_au: r * Math.cos(th), y_au: r * Math.sin(th) });
      }
      setEphem(pts);
      return;
    }
    try {
      const res = await fetch(ephemerisUrl);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const j = await res.json();
      setEphem(j.map((row: any) => ({ x_au: row.x_au, y_au: row.y_au })));
    } catch (e: any) { setMessage(e.message || String(e)); }
  }

  const statusTone: Record<string, string> = {
    idle: "bg-muted text-muted-foreground",
    queued: "bg-yellow-100 text-yellow-900",
    ingesting: "bg-blue-100 text-blue-900",
    ready: "bg-emerald-100 text-emerald-900",
    processing: "bg-purple-100 text-purple-900",
    done: "bg-emerald-100 text-emerald-900",
    error: "bg-red-100 text-red-900",
  };

  const canGoNext = status === "ready" || status === "processing" || status === "done";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Stepper (super minimal) */}
        <div className="grid grid-cols-2 gap-3">
          {[{ id: 1, label: "Setup & Data", icon: Settings }, { id: 2, label: "Process & Plot", icon: LineChartIcon }].map((s) => {
            const active = step === (s.id as 1 | 2);
            const Icon = s.icon;
            return (
              <div key={s.id} className={`rounded-xl border px-3 py-3 bg-white ${active ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{s.id}. {s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <Card>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> 1) Setup & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Base URL</Label><Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="http://localhost:8088" /></div>
                <div className="space-y-2"><Label>Bearer Token</Label><Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="devtoken" /></div>
                <div className="space-y-2"><Label>Import ID</Label><Input value={importId} onChange={(e) => setImportId(e.target.value)} /></div>
              </div>

              <div className="flex gap-4">
                <Button variant={mode === "laravel" ? "default" : "secondary"} onClick={() => setMode("laravel")} className="gap-2">
                  <Upload className="h-4 w-4" /> Laravel Upload
                </Button>
                <Button variant={mode === "fileurl" ? "default" : "secondary"} onClick={() => setMode("fileurl")} className="gap-2">
                  <Database className="h-4 w-4" /> file:// Path
                </Button>
              </div>

              {mode === "laravel" ? (
                <div className="space-y-3">
                  <div className="space-y-2"><Label>Laravel Upload URL</Label><Input value={laravelUploadUrl} onChange={(e) => setLaravelUploadUrl(e.target.value)} /></div>
                  <Dropzone onFile={(f) => setPickedFile(f)} />
                  {pickedFile && <div className="text-xs text-muted-foreground">Selected: <b>{pickedFile.name}</b></div>}
                  <div className="flex gap-2">
                    <Button disabled={!pickedFile || !laravelUploadUrl} onClick={uploadViaLaravel} className="gap-2">
                      Start Ingest <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" onClick={refreshStatus} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2"><Label>file:// URL</Label><Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} /></div>
                  {fileUrl.toLowerCase().endsWith(".xlsx") && (
                    <div className="space-y-2"><Label>Sheet (xlsx)</Label><Input value={sheet} onChange={(e) => setSheet(e.target.value)} /></div>
                  )}
                  <div className="flex gap-2">
                    <Button disabled={!fileUrl.startsWith("file://")} onClick={startIngestDirect} className="gap-2">
                      Start Ingest <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" onClick={refreshStatus} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`px-3 py-1 rounded-xl ${statusTone[status]}`}>{status.toUpperCase()}</Badge>
                  <div className="text-sm text-muted-foreground">OK: {rowsOk.toLocaleString()} · Bad: {rowsBad.toLocaleString()}</div>
                </div>
                <Progress value={progress} className="h-2" />
                {message && (
                  <Alert variant={status === "error" ? "destructive" : "default"}>
                    <AlertTitle>{status === "error" ? "Error" : "Info"}</AlertTitle>
                    <AlertDescription className="break-words">{message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-6">
              <span />
              <Button disabled={!canGoNext} onClick={() => setStep(2)} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-5 w-5" /> 2) Process & Plot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <select
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                    value={model}
                    onChange={(e) => setModel(e.target.value as "parabola" | "ellipse")}
                  >
                    <option value="parabola">Parabola</option>
                    <option value="ellipse">Ellipse</option>
                  </select>
                </div>
                {model === "parabola" ? (
                  <div className="space-y-2">
                    <Label>q (AU)</Label>
                    <Input type="number" step="0.01" value={params.q_au} onChange={(e) => setParams((p) => ({ ...p, q_au: parseFloat(e.target.value) }))} />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>a (AU)</Label>
                      <Input type="number" step="0.01" value={params.a_au} onChange={(e) => setParams((p) => ({ ...p, a_au: parseFloat(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>e</Label>
                      <Input type="number" step="0.001" value={params.e} onChange={(e) => setParams((p) => ({ ...p, e: parseFloat(e.target.value) }))} />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>Ephemeris URL (optional)</Label>
                  <Input value={ephemerisUrl} onChange={(e) => setEphemerisUrl(e.target.value)} placeholder="http://.../ephemeris?import_id=..." />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={runProcess} className="gap-2"><Play className="h-4 w-4" /> Run Processor</Button>
                <Button variant="secondary" onClick={refreshStatus} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
                <Button variant="secondary" onClick={loadEphemeris} className="gap-2"><LineChartIcon className="h-4 w-4" /> Load / Simulate Plot</Button>
              </div>

              <div className="h-72 w-full rounded-xl border bg-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x_au" name="X (AU)" />
                    <YAxis type="number" dataKey="y_au" name="Y (AU)" />
                    <ReTooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={ephem} fill="currentColor" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {message && (
                <Alert variant={status === "error" ? "destructive" : "default"}>
                  <AlertTitle>{status === "error" ? "Error" : "Info"}</AlertTitle>
                  <AlertDescription className="break-words">{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between p-6">
              <Button variant="secondary" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
              <span />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
