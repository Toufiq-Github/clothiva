'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Truck, Star } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, limit, query } from "firebase/firestore";
import type { Product } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl, getImageHint, cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const faqItems = [
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all unworn and unwashed items with tags still attached. Please visit our returns page for more information."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 5-7 business days. Expedited shipping options are available at checkout."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and times vary by destination."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order has shipped, you will receive an email with a tracking number and a link to track your package."
    }
];

const reviews = [
    {
        id: 1,
        name: "John Davis",
        initials: "JD",
        text: "Exceptional quality and service. My order arrived exactly as described and the customer support was outstanding.",
        rating: 5,
        avatar: "avatar-2"
    },
    {
        id: 2,
        name: "Sarah Miller",
        initials: "SM",
        text: "Fast shipping and authentic products. I've purchased three items from Clothiva and each experience has been perfect.",
        rating: 5,
        avatar: "avatar-1"
    },
    {
        id: 3,
        name: "Robert Wilson",
        initials: "RW",
        text: "The expertise and knowledge of the team is impressive. They helped me find the perfect outfit for my collection.",
        rating: 5,
        avatar: "avatar-2"
    },
    {
        id: 4,
        name: "Emily Brown",
        initials: "EB",
        text: "Absolutely love the new collection! The fabric is so soft and the fit is perfect. Highly recommended for any fashion lover.",
        rating: 5,
        avatar: "avatar-1"
    },
    {
        id: 5,
        name: "Michael Chen",
        initials: "MC",
        text: "Great experience shopping here. The website is easy to navigate and my order arrived faster than expected.",
        rating: 5,
        avatar: "avatar-2"
    },
    {
        id: 6,
        name: "Jessica Taylor",
        initials: "JT",
        text: "The fabric quality is far beyond my expectations. Every piece I've bought feels luxury and fits like a dream.",
        rating: 5,
        avatar: "avatar-1"
    }
];

function FeaturedProducts() {
    const { firestore } = useFirebase();
    const featuredQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'products'), limit(10)) : null, [firestore]);
    const { data: featuredProducts, isLoading } = useCollection<Product>(featuredQuery);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <Skeleton className="md:col-span-2 md:row-span-2 aspect-square md:aspect-auto rounded-2xl h-[400px]" />
                <Skeleton className="aspect-square rounded-2xl h-[250px]" />
                <Skeleton className="aspect-square rounded-2xl h-[250px]" />
            </div>
        )
    }

    const filteredProducts = featuredProducts
        ?.filter(p => {
            const nameLower = p.name.toLowerCase();
            return nameLower !== 'qewqw' && nameLower !== 'kid full set';
        })
        .sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            // Prioritize formal pants for the big picture (index 0)
            const aIsPant = aName.includes('pant') || aName.includes('trouser');
            const bIsPant = bName.includes('pant') || bName.includes('trouser');
            if (aIsPant && !bIsPant) return -1;
            if (!aIsPant && bIsPant) return 1;
            return 0;
        })
        .slice(0, 4) || [];

    if (filteredProducts.length === 0) {
        return (
             <div className="text-center col-span-full py-10">
                <h3 className="font-headline text-2xl font-semibold">Coming Soon</h3>
                <p className="mt-2 text-muted-foreground">Our featured products will be showcased here. Go to Admin to add your first items!</p>
             </div>
        )
    }

    return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => {
            const imageUrl = getImageUrl(product.images?.[0]);
            const imageHint = getImageHint(product.images?.[0]);
            
            let bentoClasses = "group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 block";
            
            if (index === 0) {
                // Big Feature (Formal Pant)
                bentoClasses += " md:col-span-2 md:row-span-2 h-[400px] md:h-[600px]";
            } else if (index === 3) {
                // Bottom wide feature
                bentoClasses += " md:col-span-3 h-[300px]";
            } else {
                // Smaller side tiles
                bentoClasses += " md:col-span-1 md:row-span-1 h-[300px] md:h-auto";
            }

            return (
              <Link href={`/products/${product.slug}`} key={product.id} className={bentoClasses}>
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold mb-3 border border-white/20">
                        Featured Collection
                    </span>
                    <h3 className={cn(
                        "font-headline font-bold text-white mb-2 leading-tight",
                        index === 0 ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"
                    )}>
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-white/90 font-bold text-xl md:text-2xl">৳{product.price.toFixed(2)}</p>
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-lg">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
              </Link>
            )
          })}
        </div>
    )
}

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-12 md:space-y-20 pb-20 overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
        {heroImage && (
          <div 
            className="absolute inset-0 z-0"
            style={{ 
              transform: `translateY(${scrollY * 0.4}px)`,
              willChange: 'transform'
            }}
          >
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Effortless Elegance
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Discover our new collection of timeless pieces.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-bold">
                <Link href="/products">
                Shop Now <ArrowRight className="ml-2" />
                </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="featured" className="container mx-auto px-4 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            Curated For You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our most sought-after pieces, handpicked for style and quality.
          </p>
        </div>
        <FeaturedProducts />
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
            Why Choose Clothiva?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
                <p className="text-muted-foreground">We stay ahead of the curve to bring you the newest styles.</p>
            </div>
             <div className="flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">Our clothes are crafted from the finest materials for a lasting fit.</p>
            </div>
             <div className="flex flex-col items-center">
                <Truck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-muted-foreground">Get your new favorite outfits delivered to your door in no time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section (No Parallax) */}
      <section className="container mx-auto px-4">
        <Link href="/products" className="block relative group overflow-hidden rounded-2xl shadow-2xl h-[400px] md:h-[500px]">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://cdn.hercampus.com/SH6M70M3/as/6fvnsb8j5r6njv6zxcwvn3v/alyssastrohmanntsunwjqeunsplashjpg_by_Alyssa_Strohmann.png?width=1280&height=854&fit=crop&auto=webp&dpr=4"
              alt="New Arrivals"
              fill
              className="object-cover transition-all duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 flex flex-col items-center justify-center z-10">
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg text-center">New Arrivals</h2>
            <div className="bg-white/90 p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-10 group-hover:translate-y-0 scale-75 group-hover:scale-100 shadow-xl">
              <ArrowRight className="h-10 w-10 text-primary" />
            </div>
          </div>
        </Link>
      </section>

      <section className="bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => {
              const categoryImage = PlaceHolderImages.find(p => p.id === category.id);
              return (
                <Link href={`/products?category=${category.slug}`} key={category.id}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        {categoryImage && (
                          <Image
                            src={categoryImage.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={categoryImage.imageHint}
                          />
                        )}
                         <div className="absolute inset-0 bg-black/20" />
                        <h3 className="absolute bottom-4 left-4 font-headline text-xl md:text-2xl font-bold text-white">
                          {category.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">Real experiences from our valued customers</p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review) => {
              const avatar = PlaceHolderImages.find(p => p.id === review.avatar);
              return (
                <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <Card className="h-full border shadow-md bg-card rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex gap-1 mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                          ))}
                        </div>
                        <p className="text-foreground text-md leading-relaxed mb-6 italic flex-grow">
                          &quot;{review.text}&quot;
                        </p>
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t">
                          <Avatar className="h-10 w-10 border-2">
                            {avatar && (
                              <AvatarImage 
                                src={avatar.imageUrl} 
                                alt={review.name} 
                                className="object-cover"
                                data-ai-hint={avatar.imageHint}
                              />
                            )}
                            <AvatarFallback className="bg-muted text-foreground font-bold">
                              {review.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <h4 className="font-bold text-foreground text-sm">{review.name}</h4>
                            <p className="text-xs text-muted-foreground">Verified Buyer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 bg-card hover:bg-accent shadow-lg border-none" />
            <CarouselNext className="-right-12 bg-card hover:bg-accent shadow-lg border-none" />
          </div>
        </Carousel>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index+1}`} key={index}>
                        <AccordionTrigger className="font-semibold text-lg" suppressHydrationWarning>{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                        {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
    </div>
  );
}
