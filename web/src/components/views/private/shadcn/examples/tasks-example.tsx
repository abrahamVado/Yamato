"use client"

//1.- Import the table primitives and filters that mimic the shadcn tasks example.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const tasks = [
  { id: "TASK-510", title: "Refine billing onboarding", status: "In Progress", priority: "High", assignee: "Olivia Martin" },
  { id: "TASK-511", title: "Document AI guardrails", status: "Todo", priority: "Medium", assignee: "Isabella Nguyen" },
  { id: "TASK-512", title: "Ship analytics export", status: "Blocked", priority: "High", assignee: "Jackson Lee" },
  { id: "TASK-513", title: "Update policy meshes", status: "Done", priority: "Low", assignee: "William Kim" },
  { id: "TASK-514", title: "QA autopilot", status: "In Review", priority: "Medium", assignee: "Sofia Davis" },
]

export function TasksExample() {
  //2.- Render a filter bar above the table so the layout aligns with the official tracker design.
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-2xl">Tasks</CardTitle>
          <CardDescription>Stay on top of product and operations work streams.</CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Input placeholder="Search tasks" className="w-full sm:w-60" />
          <Button variant="outline">Filter</Button>
          <Button>Create task</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your most critical work is surfaced automatically.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead className="w-[140px]">Priority</TableHead>
              <TableHead className="w-[180px]">Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{task.status}</Badge>
                </TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
