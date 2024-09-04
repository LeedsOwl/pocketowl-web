import { FunctionComponent } from 'react';
import { Dialog } from '@headlessui/react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: FunctionComponent<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative mx-auto w-full max-w-md rounded bg-white p-6 text-left shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Terms and Conditions
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Here are the terms and conditions. Please read them carefully.
              [Insert your detailed terms and conditions here.]
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TermsModal;
