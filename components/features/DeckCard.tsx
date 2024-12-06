"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const DeckCard = ({
  card,
  isClickable = true,
  isClicked = false,
  handleClick = () => {},
  flip = false,
}: {
  card: CardType;
  isClickable?: boolean;
  isClicked?: boolean;
  handleClick?: () => void;
  flip?: boolean;
}) => {
  const [clicked, setClicked] = useState(isClicked);

  useEffect(() => {
    setClicked(isClicked);
  }, [isClicked]);

  return (
    <Card
      onClick={() => {
        if (isClickable) {
          setClicked((prev) => !prev);
        }
        handleClick();
      }}
      className={`relative h-fit cursor-pointer transition-all duration-300 bg-transparent overflow-hidden rounded-md flex items-center justify-center ${
        clicked
          ? "brightness-75 scale-105 -translate-y-5"
          : isClickable
          ? "hover:brightness-75"
          : ""
      } select-none`}
    >
      <CardContent
        className={`relative w-20 h-32 sm:w-28 sm:h-40 transition-transform duration-500 transform ${
          flip ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}  
        <div
          className={`absolute inset-0 backface-hidden ${
            flip ? "hidden" : "block"
          }`}
        >
          <Image
            key={card.rank + card.suit.key}
            src={card.image}
            width={250}
            height={350}
            alt={card.rank + card.suit.key}
            priority
            draggable={false}
            className="w-20 h-32 sm:w-28 sm:h-40"
          />
        </div>
        {/* Back Side */}
        <div
          className={`absolute inset-0 backface-hidden ${
            flip ? "block" : "hidden"
          }`}
        >
          <Image
            src="/images/chkobba-cards/back.svg"
            width={250}
            height={350}
            alt="Card Back"
            priority
            draggable={false}
            className="w-20 h-32 sm:w-28 sm:h-40"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export type CardType = {
  id: string;
  suit: {
    symbole: string;
    key: string;
  };
  rank: string;
  value: number;
  image: string;
};

export default DeckCard;
