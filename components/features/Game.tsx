"use client";
import React, { useEffect, useState } from "react";
import DeckCard, { CardType } from "./DeckCard";
import "@/styles/chkobba-game.css";
import { Button } from "../ui/button";

const Game = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [boardCards, setBoardCards] = useState<CardType[]>([]);
  const [playersCard, setPlayersCard] = useState<PlayersCards>({
    you: [],
    computer: [],
  });
  const [selectedCards, setSelectedCards] = useState<SelectedCards>({
    you: null,
    computer: null,
    board: [],
  });
  const [stockedCards, setStockedCards] = useState<StockedCardsType>({
    you: [],
    computer: [],
  });
  const [lastEater, setLastEater] = useState<"you" | "computer">("you");
  const [score, setScore] = useState<ScoreType>({
    you: {
      score: 0,
      hayya: false,
      bermilla: false,
      dinneri: false,
      carta: false,
      chkeyib: 0,
    },
    computer: {
      score: 0,
      hayya: false,
      bermilla: false,
      dinneri: false,
      carta: false,
      chkeyib: 0,
    },
  });
  const rotaionCardsInStock = [0, 1, 3, 6, 8, 10, 12, -2, -4, -5, -7, -9, -11];

  const startGame = () => {
    const allCards = shovel(getCards(), 3);
    setPlayersCard({
      you: allCards.slice(0, 3),
      computer: allCards.slice(7, 10),
    });
    setBoardCards((prev) => [...allCards.slice(3, 7), ...prev]);
    setCards(allCards.slice(10));
    setStockedCards({
      you: [],
      computer: [],
    });
    setSelectedCards({ you: null, computer: null, board: [] });
    setLastEater("you");
  };

  // when start the game
  useEffect(() => {
    startGame();
  }, []);

  // game rules
  useEffect(() => {
    if (playersCard.you.length > 0 || playersCard.computer.length > 0) {
      if (
        selectedCards.you &&
        playersCard.you.length == playersCard.computer.length
      ) {
        if (!skipTurnTest(playersCard.you, boardCards)) {
          if (
            compare(selectedCards.you, selectedCards.board, boardCards).status
          ) {
            setStockedCards((prev) => ({
              ...prev,
              you: [
                ...stockedCards.you,
                {
                  ...(selectedCards.you as CardType),
                  chkobba:
                    boardCards.filter((c) => !selectedCards.board.includes(c))
                      .length == 0,
                  style:
                    rotaionCardsInStock[
                      randint(0, rotaionCardsInStock.length - 1)
                    ],
                },
                ...selectedCards.board.map((c) => ({
                  ...c,
                  chkobba: false,
                  style:
                    rotaionCardsInStock[
                      randint(0, rotaionCardsInStock.length - 1)
                    ],
                })),
              ],
            }));
            setLastEater("you");
            setBoardCards(
              boardCards.filter((c) => !selectedCards.board.includes(c))
            );
            setPlayersCard((prev) => ({
              ...prev,
              you: [...playersCard.you.filter((c) => c != selectedCards.you)],
            }));
            setSelectedCards({ you: null, computer: null, board: [] });
            // TODO: chkobba condition
          }
        } else {
          setBoardCards((prev) => [...prev, selectedCards.you as CardType]);
          setPlayersCard((prev) => ({
            ...prev,
            you: [...playersCard.you.filter((c) => c != selectedCards.you)],
          }));
          setSelectedCards({ you: null, computer: null, board: [] });
        }
      } else if (
        playersCard.you.length < playersCard.computer.length &&
        playersCard.computer.length != 0 &&
        selectedCards.computer == null
      ) {
        computerTurn();
      }
    } else if (cards.length > 0) {
      setSelectedCards({ you: null, computer: null, board: [] });
      const allCards = cards;
      setPlayersCard({
        computer: allCards.slice(0, 3),
        you: allCards.slice(3, 6),
      });
      setCards(allCards.slice(6));
    } else if (cards.length == 0 && boardCards.length != 0) {
      setStockedCards((prev) => ({
        ...prev,
        [lastEater]: [
          ...stockedCards[lastEater],
          ...boardCards.map((c) => ({ ...c, chkobba: false })),
        ],
      }));
      setBoardCards([]);
    } else {
      const youScore = calculateScore(stockedCards.you);
      const computerScore = calculateScore(stockedCards.computer);
      setScore((prev) => ({
        you: {
          ...youScore,
          score: prev.you.score + youScore.score,
        },
        computer: {
          ...computerScore,
          score: prev.computer.score + computerScore.score,
        },
      }));
    }
  }, [selectedCards.you, selectedCards.board, playersCard.you, boardCards]);

  const computerTurn = async () => {
    let i = 0;
    if (skipTurnTest(playersCard.computer, boardCards)) {
      setSelectedCards((prev) => ({
        ...prev,
        computer:
          playersCard.computer[randint(0, playersCard.computer.length - 1)],
      }));
      await delay(700);
      setBoardCards((prev) => [...prev, playersCard.computer[i] as CardType]);
      setPlayersCard((prev) => ({
        ...prev,
        computer: [
          ...playersCard.computer.filter((c) => c != playersCard.computer[i]),
        ],
      }));
      setSelectedCards({ you: null, computer: null, board: [] });
    } else {
      while (i < playersCard.computer.length) {
        setSelectedCards((prev) => ({
          ...prev,
          computer: playersCard.computer[i],
        }));
        await delay(1000);
        if (
          boardCards.filter((c) => c.value == playersCard.computer[i].value)
            .length > 0
        ) {
          const cardFromBoard = boardCards.filter(
            (c) => c.value == playersCard.computer[i].value
          )[0];
          setSelectedCards((prev) => ({ ...prev, board: [cardFromBoard] }));
          await delay(1000);
          setStockedCards((prev) => ({
            ...prev,
            computer: [
              ...stockedCards.computer,
              {
                ...playersCard.computer[i],
                chkobba:
                  boardCards.filter((c) => c != cardFromBoard).length == 0,
                style:
                  rotaionCardsInStock[
                    randint(0, rotaionCardsInStock.length - 1)
                  ],
              },
              {
                ...cardFromBoard,
                chkobba: false,
                style:
                  rotaionCardsInStock[
                    randint(0, rotaionCardsInStock.length - 1)
                  ],
              },
            ],
          }));
          setLastEater("computer");
          setBoardCards(boardCards.filter((c) => c != cardFromBoard));
          setPlayersCard((prev) => ({
            ...prev,
            computer: [
              ...prev.computer.filter((c) => c != playersCard.computer[i]),
            ],
          }));
          setSelectedCards({ you: null, computer: null, board: [] });
          break;
        } else if (
          calculateAllTheCombinations(
            boardCards.map(({ value }) => value)
          ).includes(playersCard.computer[i].value)
        ) {
          const combs = combinationsCards(boardCards);
          for (const comb of combs) {
            const combSome = comb.reduce(
              (sum, c: CardType) => sum + c.value,
              0
            );
            if (combSome == playersCard.computer[i].value) {
              setSelectedCards((prev) => ({ ...prev, board: comb }));
              await delay(1000);
              setStockedCards((prev) => ({
                ...prev,
                computer: [
                  ...stockedCards.computer,
                  {
                    ...playersCard.computer[i],
                    chkobba:
                      boardCards.filter((c) => !comb.includes(c)).length == 0,
                    style:
                      rotaionCardsInStock[
                        randint(0, rotaionCardsInStock.length - 1)
                      ],
                  },
                  ...comb.map((c) => ({
                    ...c,
                    chkobba: false,
                    style:
                      rotaionCardsInStock[
                        randint(0, rotaionCardsInStock.length - 1)
                      ],
                  })),
                ],
              }));
              setLastEater("computer");
              setBoardCards(boardCards.filter((c) => !comb.includes(c)));
              setPlayersCard((prev) => ({
                ...prev,
                computer: [
                  ...prev.computer.filter((c) => c != playersCard.computer[i]),
                ],
              }));
              setSelectedCards({ you: null, computer: null, board: [] });
              break;
            }
          }
          break;
        } else {
          i = i + 1;
        }
      }
    }
  };

  // test
  // useEffect(() => {
  //   console.log(
  //     "======================================================================="
  //   );
  //   console.log("cards =>", cards);
  //   console.log("stockedCards =>", stockedCards);
  //   console.log("boardCards =>", boardCards);
  //   console.log("playersCard =>", playersCard);
  //   console.log("selectedCards =>", selectedCards);
  //   console.log("Score you: ", calculateScore(stockedCards.you));
  //   console.log("Score computer: ", calculateScore(stockedCards.computer));
  //   console.log(
  //     "======================================================================="
  //   );
  // }, [cards, selectedCards.board, boardCards]);

  return (
    <>
      <>
        {/* ====================================== computer cards ====================================== */}
        {!(
          cards.length == 0 &&
          stockedCards.you.length + stockedCards.computer.length != 0 &&
          boardCards.length == 0 &&
          playersCard.you.length + playersCard.computer.length == 0
        ) && (
          <div className={"playersSection"}>
            {playersCard.computer.map((card, i) => (
              <DeckCard
                key={i}
                card={card}
                isClickable={false}
                isClicked={selectedCards.computer === card}
                flip={true}
              />
            ))}
            <div className={"stocke left-0"}>
              {stockedCards.computer.map((card, i) => (
                <div
                  key={i}
                  style={{
                    rotate: `${card.style}deg`,
                    translate: `${card.chkobba ? 20 * (Math.abs(card.style) / card.style) : 0}px 0px`,
                  }}>
                  <DeckCard
                    card={card}
                    flip={!card.chkobba}
                    isClickable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ======================================// your cards //====================================== */}
        {/* ====================================== Board ====================================== */}
        <div className={"board"}>
          {boardCards.map((card, i) => (
            <DeckCard
              key={i}
              card={card}
              handleClick={() => {
                if (playersCard.you.length == playersCard.computer.length) {
                  if (selectedCards.board.includes(card)) {
                    setSelectedCards((prev) => ({
                      ...prev,
                      board: prev.board.filter((c) => c != card),
                    }));
                  } else {
                    setSelectedCards((prev) => ({
                      ...prev,
                      board: [...prev.board, card],
                    }));
                  }
                }
              }}
              isClicked={selectedCards.board.includes(card)}
              isClickable={
                playersCard.you.length == playersCard.computer.length
              }
            />
          ))}
          {cards.length == 0 &&
            stockedCards.you.length + stockedCards.computer.length != 0 &&
            boardCards.length == 0 &&
            playersCard.you.length + playersCard.computer.length == 0 && (
              <div className={"score"}>
                <h2>Score</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Points</th>
                      <th>You</th>
                      <th>Computer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Hayya</th>
                      <td>{score.you.hayya ? 1 : 0}</td>
                      <td>{score.computer.hayya ? 1 : 0}</td>
                    </tr>
                    <tr>
                      <th>Bermilla</th>
                      <td>{score.you.bermilla ? 1 : 0}</td>
                      <td>{score.computer.bermilla ? 1 : 0}</td>
                    </tr>
                    <tr>
                      <th>Dinneri</th>
                      <td>{score.you.dinneri ? 1 : 0}</td>
                      <td>{score.computer.dinneri ? 1 : 0}</td>
                    </tr>
                    <tr>
                      <th>Carta</th>
                      <td>{score.you.carta ? 1 : 0}</td>
                      <td>{score.computer.carta ? 1 : 0}</td>
                    </tr>
                    <tr>
                      <th>Chkeyib</th>
                      <td>{score.you.chkeyib}</td>
                      <td>{score.computer.chkeyib}</td>
                    </tr>
                    <tr>
                      <th>Score in this round</th>
                      <td>{calculateScore(stockedCards.you).score}</td>
                      <td>{calculateScore(stockedCards.computer).score}</td>
                    </tr>
                    <tr>
                      <th>Total Score</th>
                      <td>{score.you.score}</td>
                      <td>{score.computer.score}</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <Button size="lg" onClick={startGame} className="bg-red-700">
                  Play Agin!
                </Button>
              </div>
            )}
        </div>
        {/* ======================================// Board //====================================== */}
        {/* ====================================== your cards ====================================== */}
        {!(
          cards.length == 0 &&
          stockedCards.you.length + stockedCards.computer.length != 0 &&
          boardCards.length == 0 &&
          playersCard.you.length + playersCard.computer.length == 0
        ) && (
          <div className={"playersSection"}>
            {playersCard.you.map((card, i) => (
              <DeckCard
                key={i}
                card={card}
                handleClick={() => {
                  if (playersCard.you.length == playersCard.computer.length) {
                    if (selectedCards.you === card) {
                      setSelectedCards((prev) => ({ ...prev, you: null }));
                    } else {
                      setSelectedCards((prev) => ({ ...prev, you: card }));
                    }
                  }
                }}
                isClicked={selectedCards.you === card}
                isClickable={
                  playersCard.you.length == playersCard.computer.length
                }
              />
            ))}
            <div className={"stocke right-0"}>
              {stockedCards.you.map((card, i) => (
                <div
                  key={i}
                  style={{
                    rotate: `${card.style}deg`,
                    translate: `${card.chkobba ? 20 * (Math.abs(card.style) / card.style) : 0}px 0px`,
                  }}>
                  <DeckCard
                    card={card}
                    flip={!card.chkobba}
                    isClickable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ======================================// your cards //====================================== */}
      </>
    </>
  );
};

interface SelectedCards {
  you: CardType | null;
  computer: CardType | null;
  board: CardType[];
}

interface PlayersCards {
  you: CardType[];
  computer: CardType[];
}

interface StockedCard extends CardType {
  chkobba: boolean;
  style: number;
}

interface StockedCardsType {
  you: StockedCard[];
  computer: StockedCard[];
}

interface ScoreType {
  you: {
    score: number;
    hayya: boolean;
    bermilla: boolean;
    dinneri: boolean;
    carta: boolean;
    chkeyib: number;
  };
  computer: {
    score: number;
    hayya: boolean;
    bermilla: boolean;
    dinneri: boolean;
    carta: boolean;
    chkeyib: number;
  };
}

const getCards = () => {
  const cards: CardType[] = [];
  const suits = [
    { symbole: "♦", key: "D" },
    { symbole: "♠", key: "S" },
    { symbole: "♣", key: "C" },
    { symbole: "♥", key: "H" },
  ];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "J", "Q", "K"];
  for (const suit of suits) {
    for (const rank of ranks) {
      const value =
        rank === "K"
          ? 10
          : rank === "Q"
          ? 8
          : rank === "J"
          ? 9
          : rank === "A"
          ? 1
          : Number(rank);
      cards.push({
        id: rank + suit.key,
        suit,
        rank,
        value,
        image: `/images/chkobba-cards/${rank + suit.key}.svg`,
      });
    }
  }
  return cards;
};

const shovel = (arr: CardType[], repetition: number = 1) => {
  const copy_of_arr = [...arr];
  const finally_arr = [];
  for (let i = 0; i < arr.length; i++) {
    const n = randint(0, copy_of_arr.length - 1);
    finally_arr.push(copy_of_arr[n]);
    copy_of_arr.splice(n, 1);
  }
  if (Math.abs(repetition) <= 1) {
    return finally_arr;
  } else {
    return shovel(finally_arr, Math.abs(repetition) - 1);
  }
};

const compare = (
  playerCard: CardType,
  theCardsTaken: CardType[],
  boardCards: CardType[]
) => {
  const theCardAlreadyExist =
    boardCards.filter((c) => c.value == playerCard.value).length >= 1;
  if (theCardAlreadyExist && theCardsTaken.length > 1) {
    return { status: false, message: "..." };
  }
  const theCardsTakenValue = theCardsTaken.reduce((a, b) => a + b.value, 0);
  if (theCardsTakenValue != playerCard.value) {
    return { status: false, message: "..." };
  }
  return { status: true, message: "..." };
};

function combinationsCards(arr: CardType[]) {
  function combinations(current: CardType[], remaining: CardType[]): void {
    if (remaining.length > 0) {
      combinations([...current, remaining[0]], remaining.slice(1));
      combinations(current, remaining.slice(1));
    } else if (current.length > 0) {
      result.push(current);
    }
  }
  const result: CardType[][] = [];
  combinations([], arr);
  return result;
}

function calculateAllTheCombinations(arr: number[]): number[] {
  function combinations(current: number[], remaining: number[]): void {
    if (remaining.length > 0) {
      combinations([...current, remaining[0]], remaining.slice(1));
      combinations(current, remaining.slice(1));
    } else if (current.length > 0) {
      bResult.push(current);
    }
  }

  const bResult: number[][] = [];
  combinations([], arr);

  const fResult: number[] = bResult.map((combination) =>
    combination.reduce((sum, num) => sum + num, 0)
  );

  return fResult;
}

const skipTurnTest = (playerCards: CardType[], boardCards: CardType[]) => {
  if (boardCards.length == 0) {
    return true;
  }
  let valide = true;
  playerCards.forEach((card) => {
    const theCardAlreadyExist = calculateAllTheCombinations(
      boardCards.map((c) => c.value)
    );
    if (theCardAlreadyExist.includes(card.value)) {
      valide = false;
    }
  });
  return valide;
};

const calculateScore = (stock: StockedCard[]) => {
  const result = {
    score: 0,
    hayya: false,
    bermilla: false,
    dinneri: false,
    carta: false,
    chkeyib: 0,
  };

  // carta
  if (stock.length > 20) {
    result.score += 1;
    result.carta = true;
  }
  // 7ayya
  if (stock.find((s) => s.id == "7D")) {
    result.score += 1;
    result.hayya = true;
  }
  // dineri
  if (stock.filter((s) => s.suit.key == "D").length > 5) {
    result.score += 1;
    result.dinneri = true;
  }
  // bermilla
  if (stock.filter((s) => s.value == 7).length >= 3) {
    result.score += 1;
    result.bermilla = true;
  } else if (
    stock.filter((s) => s.value == 7).length == 2 &&
    stock.filter((s) => s.value == 6).length >= 3
  ) {
    result.score += 1;
    result.bermilla = true;
  }
  // chkeyib
  const chkeyib = stock.filter((s) => s.chkobba).length;
  result.score += chkeyib;
  result.chkeyib = chkeyib;
  return result;
};

const randint = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export default Game;
