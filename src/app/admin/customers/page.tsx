'use client';
import { UserX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function AdminCustomersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Customers</CardTitle>
            <CardDescription>
                View and manage all registered users.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <UserX className="h-20 w-20 text-muted-foreground/50" />
            <h3 className="font-semibold text-xl">Customer Management Not Available</h3>
            <p className="text-muted-foreground max-w-md">
                Managing users (viewing, deleting, or editing) requires admin privileges on the backend, which are not enabled by default for security reasons. This functionality would typically be handled through a secure admin SDK on a server.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}
