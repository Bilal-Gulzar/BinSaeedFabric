import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, X } from 'lucide-react';
import React from 'react'

export default function SearchNotFound({text}:{text:string}) {
  return (
    <section className="w-full flex  text-center flex-col items-center min-h-[50vh] px-4 pt-12 gap-6">
      <div className="font-bold text-xl uppercase">0 results found for “{text}”.</div>
      <p className="text-xs text-gray-500 mt-3">
        No results found for “{text}”. Check the spelling or use a different
        word or phrase.
      </p>
    </section>
  );
}
