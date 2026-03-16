'use client';
import { File, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>
            Manage and view customer orders.
            </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1" disabled>
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
            <h3 className="font-semibold text-xl">No Orders to Display</h3>
            <p className="text-muted-foreground max-w-md">
             This panel is for administrators. Viewing all customer orders requires special admin permissions which are not enabled by default for security reasons. Individual user orders can be seen on their account page.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}
