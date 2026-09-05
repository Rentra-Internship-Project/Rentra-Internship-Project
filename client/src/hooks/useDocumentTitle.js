import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page title and meta description
 * for client-side SEO and browser tabs.
 *
 * @param {string} title - The title of the page (e.g. "Contact Us")
 * @param {string} [description] - Optional meta description for the page
 */
export const useDocumentTitle = (title, description) => {
  useEffect(() => {
    const baseTitle = 'Rentra | Heavy Equipment & Machinery Rental Marketplace';
    document.title = title ? `${title} | Rentra` : baseTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);
};

export default useDocumentTitle;
