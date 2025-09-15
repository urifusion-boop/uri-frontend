import { useState, useEffect } from "react";
import { useRouter } from "next/router";


export const useToggle = () => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return { show, toggleShow };
};

export const useModal = () => {
  const [open, setOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState(true);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const closeDetailsModal = () => setDetailsModal(false);

  return { open, setOpen, openModal, closeModal, detailsModal, closeDetailsModal, setDetailsModal };
};


