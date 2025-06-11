import { Button } from '@/components/ui/button';
import Link  from 'next/link';
import Image from 'next/image'
import React from 'react'
import { urlFor } from '@/sanity/lib/image';

interface Image{
  name:string;
  btn:string;
  image:string;
  _id:string
}

export default function HomeImages({imageUrl}:{imageUrl:Image[]}) {

  return (
      <section className="flex overflow-x-auto gap-8 scrollbar-hide mb-10" >
        {imageUrl.map((k:Image) => (
          <div
            key={k._id}
            style={{
              // maxWidth: "50px",
              width: "100%",
              height: "100%",
              display:"flex",
           
            }}
            className="relative shrink-0 grow-0 lg:shrink lg:grow"
          >
            <Image src={urlFor(k.image).url()} className='' width={1800} height={1800} alt=""/>
            <div className="absolute inset-0 flex flex-col gap-4 justify-center items-center w-full h-full">
              <div className="text-white font-bold text-2xl uppercase ">
                {k.name}
              </div>
              <div>
                <Link href='/collection'>
                <Button className="font-semibold cursor-pointer uppercase !text-xs px-5 sm:!px-8">
                  {k.btn}
                </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
}