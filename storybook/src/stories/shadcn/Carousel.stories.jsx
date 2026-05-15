import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@davinci/ui/components/ui/carousel';

export default {
  title: 'Components/Carousel',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {Array.from({ length: 5 }, (_, i) => (
          <CarouselItem key={i}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted p-6">
                <span className="text-4xl font-semibold">{i + 1}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const MultiplePerView = {
  render: () => (
    <Carousel
      opts={{ align: 'start' }}
      className="w-full max-w-lg"
    >
      <CarouselContent className="-ml-2">
        {Array.from({ length: 8 }, (_, i) => (
          <CarouselItem key={i} className="pl-2 basis-1/3">
            <div className="flex aspect-square items-center justify-center rounded-lg border bg-card p-4">
              <span className="text-2xl font-bold text-muted-foreground">{i + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Cards = {
  render: () => (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {[
          { title: 'Mountain Retreat', desc: 'Peaceful views in the highlands', color: 'from-blue-400 to-blue-600' },
          { title: 'Ocean Sunset', desc: 'Golden hour by the sea', color: 'from-orange-400 to-pink-500' },
          { title: 'Forest Walk', desc: 'Ancient trees and fresh air', color: 'from-green-400 to-emerald-600' },
          { title: 'City Lights', desc: 'The skyline at night', color: 'from-purple-400 to-indigo-600' },
          { title: 'Desert Dunes', desc: 'Vast landscapes of sand', color: 'from-yellow-400 to-amber-600' },
        ].map((card, i) => (
          <CarouselItem key={i}>
            <div className={`rounded-xl bg-gradient-to-br ${card.color} p-6 text-white`}>
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="text-sm opacity-90 mt-1">{card.desc}</p>
              <div className="mt-4 h-24 rounded-lg bg-white/20" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
