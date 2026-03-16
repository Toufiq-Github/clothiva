'use client';

import Link from "next/link"
import { ChevronLeft, Trash2 } from "lucide-react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { colors, sizes } from "@/lib/data";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

export default function NewProductPage() {
    const { firestore } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 1024 * 1024) { // 1MB limit
          toast({
            variant: 'destructive',
            title: 'Image too large',
            description: 'Please upload an image smaller than 1MB.'
          });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageUrls(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    };

    const handleRemoveImage = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!firestore) return;
        if (!name || !description || !price || !category || imageUrls.length === 0) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out all product details and add at least one image.'});
            return;
        }
        setIsLoading(true);

        const newProduct = {
            name,
            slug: slugify(name),
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            sizes: sizes, 
            colors: colors,
            images: imageUrls,
        };

        const productsCollection = collection(firestore, 'products');
        await addDocumentNonBlocking(productsCollection, newProduct);
        
        toast({ title: 'Product Created', description: `${name} has been added to your store.`});
        router.push('/admin/products');
    }


  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/products">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                New Product
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                Discard
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Product'}
                </Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                    Enter the name, description, and other details for the new product.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        className="w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-32"
                    />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Stock & Price</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-3">
                        <Label htmlFor="price">Price (BDT)</Label>
                        <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger
                        id="category"
                        aria-label="Select category"
                        >
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                Upload images for your product. The first image will be the main display image.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="product-image">Upload Image</Label>
                            <Input
                                id="product-image"
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleImageUpload}
                                className="w-full"
                            />
                             <p className="text-xs text-muted-foreground">Max file size: 1MB.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={url}
                                        alt={`Product image ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="rounded-md object-cover aspect-square w-full"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
                 {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
        </div>
    </div>
  )
}
