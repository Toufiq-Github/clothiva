'use client';
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, PlusCircle, Trash2, Package } from "lucide-react"
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import type { Product } from "@/lib/types";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getImageUrl, getImageHint } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminProductsPage() {
    const { firestore } = useFirebase();
    const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsCollection);

    const handleDelete = (productId: string) => {
        if (!firestore) return;
        const productDoc = doc(firestore, 'products', productId);
        deleteDocumentNonBlocking(productDoc);
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your products and view their sales performance.</CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link href="/admin/products/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        ) : products && products.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                    Stock
                </TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => {
                    const imageUrl = getImageUrl(product.images?.[0]);
                    const imageHint = getImageHint(product.images?.[0]);
                    return (
                        <TableRow key={product.id}>
                            <TableCell className="hidden sm:table-cell">
                            {imageUrl ? <Image
                                alt={product.name}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={imageUrl}
                                width="64"
                                data-ai-hint={imageHint}
                            /> : <div className="aspect-square w-16 bg-muted rounded-md flex items-center justify-center"><Package className="text-muted-foreground" /></div>}
                            </TableCell>
                            <TableCell className="font-medium">
                            {product.name}
                            </TableCell>
                            <TableCell>
                            <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                            </TableCell>
                            <TableCell>৳{product.price.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                            {product.stock}
                            </TableCell>
                            <TableCell>
                            <AlertDialog>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild><Link href={`/admin/products/${product.id}/edit`}>Edit</Link></DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-500 hover:text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                </DropdownMenuContent>
                                </DropdownMenu>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot;.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        ) : (
             <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Package className="h-20 w-20 text-muted-foreground/50" />
                <h3 className="font-semibold text-xl">No Products Found</h3>
                <p className="text-muted-foreground">
                You haven&apos;t added any products yet.
                </p>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Product
                    </Link>
                </Button>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{products?.length ?? 0}</strong> of <strong>{products?.length ?? 0}</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}
