import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";

// Define the interface for the useFavorite hook
interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

// Define the useFavorite hook
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  // useMemo is used to memoize the result of a function call
  // It will only recompute the result if the dependencies (currentUser, listingId) change
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    // Check if the listingId is included in the list of favoriteIds
    return list.includes(listingId);
  }, [currentUser, listingId]);

  // useCallback is used to memoize a function
  // It will only create a new function if the dependencies (currentUser, hasFavorited, listingId, loginModal, router) change
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      // If there is no currentUser, open the login modal
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        // If the listing is already favorited, send a delete request to remove it from favorites
        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          // If the listing is not favorited, send a post request to add it to favorites
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        // Execute the request
        await request();

        // Refresh the router to update the page
        router.refresh();

        // Show a success toast message
        toast.success("Listing favorited!");
      } catch (error) {
        // Show an error toast message if something went wrong
        toast.error("Something went wrong!");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  // Return the hasFavorited flag and the toggleFavorite function
  return { hasFavorited, toggleFavorite };
};

export default useFavorite;
