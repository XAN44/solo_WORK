"use client";
import React from "react";
import { useState } from "react";
import { Button } from "../button"; // ปรับแต่งให้เข้ากับปุ่มของคุณ

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-lg font-bold"> Confirm sign out</h2>
          <p className="mt-4">
            Are you sure you want to sign out? If you do not complete 4 hours of
            work, the system will record your absence.
          </p>
          <div className="modal-action">
            <Button className="btn btn-primary" onClick={onConfirm}>
              confirm
            </Button>
            <Button className="btn btn-secondary" onClick={onClose}>
              cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
