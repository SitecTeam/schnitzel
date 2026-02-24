import React, { useState } from "react";
import { motion } from "motion/react";
import type { PanInfo } from "motion";

interface Guest {
  id: string;
  image: string;
  nameBadge: string;
}

interface SwipeCardsProps {
  guests: Guest[];
}

export function SwipeCards({ guests }: SwipeCardsProps) {
  const [cards, setCards] = useState(guests);
  const [exitX, setExitX] = useState<number>(0);

  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(200);
      setTimeout(() => {
        setCards(prev => {
          const newCards = [...prev];
          const removed = newCards.shift();
          if (removed) newCards.push(removed);
          return newCards;
        });
        setExitX(0);
      }, 200);
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      setTimeout(() => {
        setCards(prev => {
          const newCards = [...prev];
          const removed = newCards.shift();
          if (removed) newCards.push(removed);
          return newCards;
        });
        setExitX(0);
      }, 200);
    }
  };

  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-72 sm:max-w-80 md:max-w-sm lg:max-w-md">
      {cards.map((guest, index) => {
        const isTop = index === 0;
        const isSecond = index === 1;
        const isThird = index === 2;

        // Calculate rotation and scale based on index
        const rotation = isTop ? 0 : isSecond ? 4 : isThird ? 7 : 0;
        const scale = isTop ? 1 : isSecond ? 0.97 : isThird ? 0.95 : 0.92;
        const yOffset = isTop ? 0 : isSecond ? -6 : isThird ? -12 : -16;
        const xOffset = isTop ? 0 : isSecond ? 14 : isThird ? 24 : 0;
        const zIndex = cards.length - index;

        return (
          <motion.div
            key={guest.id}
            className="absolute inset-0 overflow-visible"
            style={{
              zIndex,
              transformOrigin: "bottom center",
            }}
            initial={{
              scale,
              y: yOffset,
              rotate: rotation,
              x: xOffset,
              opacity: 1,
            }}
            animate={{
              scale,
              y: yOffset,
              rotate: rotation,
              x: isTop ? exitX : xOffset,
              opacity: isTop && exitX !== 0 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => isTop && handleDragEnd(info)}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
          >
            <img
              src={guest.image}
              alt="Guest"
              className="pointer-events-none h-full w-full object-cover"
            />
            {isTop && (
              <div className="pointer-events-none absolute -bottom-12 -left-10 z-20 sm:-bottom-16 sm:-left-14 md:-bottom-18 md:-left-16 lg:-bottom-20 lg:-left-18">
                <img
                  src={guest.nameBadge}
                  alt="Guest name"
                  className="h-auto w-36 sm:w-44 md:w-48 lg:w-52"
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
