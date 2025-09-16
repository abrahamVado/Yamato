import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table" // if added

export default function UsersPage() {
  return (
    <Card>
      <CardHeader><CardTitle>Users</CardTitle></CardHeader>
      <CardContent>List your users here.</CardContent>
    </Card>
  )
}
