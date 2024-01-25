"use client";

// Importing necessary hooks, types and libraries
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";

// Define the props for the ListingCard component
interface ListingCardProps {
  data: Listing; // Main data for the listing
  reservation?: Reservation; // Optional reservation made on the listing
  onAction?: (id: string) => void; // Optional callback for an action on the card
  disabled?: boolean; // Optional prop to disable interactions
  actionLabel?: string; // Optional prop to customize the action button label
  actionId?: string; // Optional prop to pass an ID to the onAction callback
  currentUser?: SafeUser | null; // Current user, can be a SafeUser object or null
}

// Define the ListingCard component
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter(); // Hook for routing
  const { getbyValue } = useCountries(); // Hook to fetch country data

  // Get the location data by value
  const location = getbyValue(data.locationValue);

  // Define the callback for the cancel action
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Stop event propagation

      // If the card is disabled, return early
      if (disabled) {
        return;
      }

      // Call the onAction callback with the actionId
      onAction?.(actionId);
    },
    [disabled, onAction, actionId] // Include actionId in the dependency array
  );

  // Use the useMemo hook to optimize performance by memoizing the price calculation.
  // If a reservation exists, use the totalPrice of the reservation.
  // If there's no reservation, use the price from the data object.
  // The useMemo hook will only re-run the calculation if the reservation or data changes.
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  // Return the component markup
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc}
            alt="Listing"
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
