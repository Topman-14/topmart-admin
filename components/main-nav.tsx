'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Separator } from './ui/separator';
import { Fragment } from 'react';


export default function MainNav({
    className,
    ...props
    } : React.HTMLAttributes<HTMLElement>){
      const pathname = usePathname();
      const params = useParams()

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ]
  
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden py-0 px-2 mx-2">
            <Menu className="size-5"/>
          </Button>
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle>
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-5 text-right mt-8'>
              {routes.map((route) => (
                <Fragment key={route.href}>
                    <Link 
                      href={route.href}
                      className={cn('text-sm font-medium transition-colors hover:text-primary', 
                      route.active ? 'text-primary font-bold dark:text-white' : 'text-muted-foreground')}
                      >
                        <SheetClose className='text-right w-full'>
                          {route.label}
                        </SheetClose>
                    </Link>
                  <Separator />
                </Fragment>
            ))}
          </div>
        </SheetContent>
        <SheetDescription className='hidden'>Menu</SheetDescription>
      </Sheet>
      <nav
        className={cn("hidden item-center space-x-4 lg:space-x-6 lg:flex", className)}
      >
        {routes.map((route) => (
          <Link 
            href={route.href}
            key={route.href}
            className={cn('text-sm font-medium transition-colors hover:text-primary', 
            route.active ? 'text-primary font-bold dark:text-white' : 'text-muted-foreground')}
            >
              {route.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
