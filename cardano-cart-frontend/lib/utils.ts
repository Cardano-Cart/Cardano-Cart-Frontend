
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Get the discount from an option of a  product */
export const discountPrice = (price: number, discount: number): number => {
  let final_price: number = 0;
  final_price = (price * (100 * discount)) / 100;

  return parseInt(final_price.toFixed(2));
};

/** Get the best low price from a list of number of option for a product with considering its discount */


/** Get the best low price from a list of number of option for a product without considering its discount */


export const getDiscountRate = (
  price: number,
  discountPrice: number
): number => {
  const d = (price - discountPrice) * (100 / price);
  return parseFloat(d.toFixed(2));
};



export const getDate = (date: Date) => {
  const newDate = new Date(date).toDateString();

  return newDate;
};